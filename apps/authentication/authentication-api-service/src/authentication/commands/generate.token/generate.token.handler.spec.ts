
import { AuthenticationDatabaseServiceAbstract } from '@authentication-database-service';
import { AuthenticationAction, AuthenticationRecordStatus, AuthRequestDto, MessageQueueDto, ResponseDto } from '@dto';
import { MessageQueueServiceAbstract } from '@message-queue-lib';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GenerateTokenCommand } from './generate.token.command';
import { GenerateTokenHandler } from './generate.token.handler';

describe('GenerateTokenHandler', () => {
    let handler: GenerateTokenHandler;
    let authenticationDatabaseService: jest.Mocked<AuthenticationDatabaseServiceAbstract>;
    let messageQueueService: jest.Mocked<MessageQueueServiceAbstract>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GenerateTokenHandler,
                {
                    provide: 'AuthenticationDatabaseService',
                    useValue: {
                        createInitialRecord: jest.fn(),
                        convertToDto: jest.fn(),
                    },
                },
                {
                    provide: 'MessageQueueAwsLibService',
                    useValue: {
                        sendMessageToSNS: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('mock-sns-topic'),
                    },
                },
            ],
        }).compile();

        handler = module.get<GenerateTokenHandler>(GenerateTokenHandler);
        authenticationDatabaseService = module.get('AuthenticationDatabaseService');
        messageQueueService = module.get('MessageQueueAwsLibService');
    });

    it('should generate token and send a message to SNS if processSNSqueue is true', async () => {
        const command = new GenerateTokenCommand('testCode', true);
        const authRequestRecord = { authRequestId: '123', code: 'testCode' };
        const authRequestDto: AuthRequestDto = { authRequestId: '123', recordStatus: AuthenticationRecordStatus.PENDING, code: 'testCode' };

        authenticationDatabaseService.createInitialRecord.mockResolvedValue(authRequestRecord);
        authenticationDatabaseService.convertToDto.mockResolvedValue(authRequestDto);

        const result = await handler.execute(command);

        expect(authenticationDatabaseService.createInitialRecord).toHaveBeenCalledWith('testCode', AuthenticationAction.GENERATE_TOKEN);
        expect(authenticationDatabaseService.convertToDto).toHaveBeenCalledWith(authRequestRecord);
        expect(messageQueueService.sendMessageToSNS).toHaveBeenCalledWith('mock-sns-topic', '123', '123', expect.any(String));
        expect(result).toEqual(new ResponseDto<MessageQueueDto<AuthRequestDto>>(expect.any(MessageQueueDto), 201));
    });

    it('should throw BadRequestException if an error occurs', async () => {
        const command = new GenerateTokenCommand('testCode', false);
        const error = new Error('Database error');

        authenticationDatabaseService.createInitialRecord.mockRejectedValue(error);

        await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    });
});