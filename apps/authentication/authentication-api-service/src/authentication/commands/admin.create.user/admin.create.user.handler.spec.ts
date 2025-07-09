

import { AuthenticationDatabaseServiceAbstract } from '@authentication-database-service';
import { AuthenticationAction, AuthenticationRecordStatus, AuthRequestDto, MessageQueueDto, ResponseDto } from '@dto';
import { MessageQueueServiceAbstract } from '@message-queue-lib';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminCreateUserCommand } from './admin.create.user.command';
import { AdminCreateUserHandler } from './admin.create.user.handler';

describe('AdminCreateUserHandler', () => {
    let handler: AdminCreateUserHandler;
    let authenticationDatabaseService: jest.Mocked<AuthenticationDatabaseServiceAbstract>;
    let messageQueueService: jest.Mocked<MessageQueueServiceAbstract>;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminCreateUserHandler,
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

        handler = module.get<AdminCreateUserHandler>(AdminCreateUserHandler);
        authenticationDatabaseService = module.get('AuthenticationDatabaseService');
        messageQueueService = module.get('MessageQueueAwsLibService');

    });

    it('should create a user and send a message to SNS if processSNSqueue is true', async () => {
        const command = new AdminCreateUserCommand('test@example.com', true);
        const authRequestRecord = { authRequestId: '123', email: 'test@example.com' };
        const authRequestDto: AuthRequestDto = { authRequestId: '123', recordStatus: AuthenticationRecordStatus.PENDING, email: 'test@example.com' };

        authenticationDatabaseService.createInitialRecord.mockResolvedValue(authRequestRecord);
        authenticationDatabaseService.convertToDto.mockResolvedValue(authRequestDto);

        const result = await handler.execute(command);

        expect(authenticationDatabaseService.createInitialRecord).toHaveBeenCalledWith('test@example.com', AuthenticationAction.ADMIN_CREATE_USER);
        expect(authenticationDatabaseService.convertToDto).toHaveBeenCalledWith(authRequestRecord);
        expect(messageQueueService.sendMessageToSNS).toHaveBeenCalledWith('mock-sns-topic', '123', '123', expect.any(String));
        expect(result).toEqual(new ResponseDto<MessageQueueDto<AuthRequestDto>>(expect.any(MessageQueueDto), 201));
    });

    it('should throw BadRequestException if an error occurs', async () => {
        const command = new AdminCreateUserCommand('test@example.com', false);
        const error = new Error('Database error');

        authenticationDatabaseService.createInitialRecord.mockRejectedValue(error);

        await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    });
});