
import { MessageQueueDto, ResponseDto, UserRole, UsersDto, UserStatus } from '@dto';
import { MessageQueueServiceAbstract } from '@message-queue-lib';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { CreateUserCommand } from './create.user.command';
import { CreateUserHandler } from './create.user.handler';

describe('CreateUserHandler', () => {
    let handler: CreateUserHandler;
    let userDatabaseService: jest.Mocked<UserDatabaseServiceAbstract>;
    let messageQueueService: jest.Mocked<MessageQueueServiceAbstract>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserHandler,
                {
                    provide: 'UserDatabaseService',
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

        handler = module.get<CreateUserHandler>(CreateUserHandler);
        userDatabaseService = module.get('UserDatabaseService');
        messageQueueService = module.get('MessageQueueAwsLibService');
    });

    it('should create a user and send a message to SNS', async () => {
        const command = new CreateUserCommand(UserRole.USER, { country: 'USA' }, 'test@example.com', 'Test', 'User', 'sessionId');
        const userRecord = { userId: '123', email: 'test@example.com' };
        const usersDto: UsersDto = { userId: '123', userStatus: UserStatus.PENDING, email: 'test@example.com', firstName: 'Test', lastName: 'User', userRole: UserRole.USER, data: { country: 'USA' } };

        userDatabaseService.createInitialRecord.mockResolvedValue(userRecord);
        userDatabaseService.convertToDto.mockResolvedValue(usersDto);

        const result = await handler.execute(command);

        expect(userDatabaseService.createInitialRecord).toHaveBeenCalled();
        expect(userDatabaseService.convertToDto).toHaveBeenCalledWith(userRecord);
        expect(messageQueueService.sendMessageToSNS).toHaveBeenCalledWith('mock-sns-topic', '123', '123', expect.any(String));
        expect(result).toEqual(new ResponseDto<MessageQueueDto<UsersDto>>(expect.any(MessageQueueDto), 201));
    });

    it('should throw BadRequestException if an error occurs', async () => {
        const command = new CreateUserCommand(UserRole.USER, { country: 'USA' }, 'test@example.com', 'Test', 'User', 'sessionId');
        const error = new Error('Database error');

        userDatabaseService.createInitialRecord.mockRejectedValue(error);

        await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    });
});