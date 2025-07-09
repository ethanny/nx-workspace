import { CommandResponseDto, ResponseDto, UserRole, UserStatus } from '@dto';
import { MessageQueueServiceAbstract } from '@message-queue-lib';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { UpdateUserCommand } from './update.user.command';
import { UpdateUserHandler } from './update.user.handler';

describe('UpdateUserHandler', () => {
    let handler: UpdateUserHandler;
    let userDatabaseService: jest.Mocked<UserDatabaseServiceAbstract>;
    let messageQueueService: jest.Mocked<MessageQueueServiceAbstract>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateUserHandler,
                {
                    provide: 'UserDatabaseService',
                    useValue: {
                        findUserRecordById: jest.fn(),
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

        handler = module.get<UpdateUserHandler>(UpdateUserHandler);
        userDatabaseService = module.get('UserDatabaseService');
        messageQueueService = module.get('MessageQueueAwsLibService');
    });

    it('should update a user and send a message to SNS', async () => {
        const command = new UpdateUserCommand('123', UserRole.USER, UserStatus.PENDING, { country: 'USA' }, 'Test', 'User', 'test@example.com', 'sessionId');
        const userRecord = { userId: '123', email: 'test@example.com' };
        //const usersDto: UsersDto = { userId: '123', userStatus: UserStatus.PENDING, email: 'test@example.com', firstName: 'Test', lastName: 'User', userRole: UserRole.USER, data: { country: 'USA' } };

        userDatabaseService.findUserRecordById.mockResolvedValue(userRecord);

        const result = await handler.execute(command);

        expect(userDatabaseService.findUserRecordById).toHaveBeenCalledWith('123');
        expect(messageQueueService.sendMessageToSNS).toHaveBeenCalledWith('mock-sns-topic', '123', '123', expect.any(String));
        expect(result).toEqual(new ResponseDto<CommandResponseDto>(expect.any(CommandResponseDto), 200));
    });

    it('should throw NotFoundException if user record is not found', async () => {
        const command = new UpdateUserCommand('123', UserRole.USER, UserStatus.PENDING, { country: 'USA' }, 'Test', 'User', 'test@example.com', 'sessionId');

        userDatabaseService.findUserRecordById.mockResolvedValue(null);

        await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    });
});