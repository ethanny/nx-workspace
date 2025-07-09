import { CreateUserDto, PageDto, UserRole, UserStatus, UsersDto } from '@dto';
import { DynamoDbLibService, UserDataType, UserSchema, createDynamoDbOptionWithPKSKIndex, pageRecordHandler } from '@dynamo-db-lib';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'dynamodb-onetable';
import { UserDatabaseServiceAbstract } from './user-database-service-abstract-class';

@Injectable()
export class UserDatabaseService implements UserDatabaseServiceAbstract {

    protected readonly logger = new Logger(UserDatabaseService.name);

    private readonly userTable: Model<UserDataType>;

    constructor(private readonly configService: ConfigService) {
        const DYNAMO_DB_USER_TABLE = configService.get<string>('DYNAMO_DB_USER_TABLE');
        if (!DYNAMO_DB_USER_TABLE) {
            throw new Error('DYNAMO_DB_USER_TABLE is not defined in the configuration');
        }
        const dynamoDbService = new DynamoDbLibService(configService);
        this.userTable = dynamoDbService.dynamoDbMainTable(DYNAMO_DB_USER_TABLE, UserSchema).getModel('User');
    }

    async createRecord(userDto: CreateUserDto): Promise<UsersDto> {
        const userData: UserDataType = {
            userStatus: UserStatus.ACTIVE,
            userRole: userDto.userRole,
            data: userDto.data,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            email: userDto.email,
            GSI1PK: `USER#${userDto.userRole}#${UserStatus.ACTIVE}`,
            GSI1SK: userDto.email,
            GSI2PK: `USER#${userDto.email}#${UserStatus.ACTIVE}`,
            GSI3PK: `USER#${UserStatus.ACTIVE}`,
            GSI3SK: userDto.userRole,
            GSI4PK: `USER#${userDto.email}`,
            GSI5PK: `USER#${UserStatus.ACTIVE}`,
            GSI5SK: userDto.email,
        };

        const userRecord: UserDataType = await this.userTable.create(userData);

        return await this.convertToDto(userRecord);
    };

    async updateUserRecord(userData: UsersDto): Promise<UsersDto> {


        this.logger.log(`Updating user record with userData: ${JSON.stringify(userData)}`);

        const userRecord: UserDataType = await this.convertToDataType(userData);


        userRecord.userId = userData.userId;
        userRecord.userRole = userData.userRole;
        userRecord.data = userData.data;
        userRecord.firstName = userData.firstName;
        userRecord.lastName = userData.lastName;
        userRecord.userStatus = userData.userStatus;
        userRecord.email = userData.email.toLocaleLowerCase();
        userRecord.GSI1PK = `USER#${userData.userRole}#${userData.userStatus}`;
        userRecord.GSI1SK = userData.email;
        userRecord.GSI2PK = `USER#${userData.email}#${userData.userStatus}`;
        userRecord.GSI3PK = `USER#${userData.userStatus}`;
        userRecord.GSI3SK = userData.userRole;
        userRecord.GSI4PK = `USER#${userData.email}`;
        userRecord.GSI5PK = `USER#${UserStatus.ACTIVE}`;
        userRecord.GSI5SK = userData.email;

        const updatedUserRecord: UserDataType = await this.userTable.update(userRecord);

        this.logger.log(`User Record updated: ${JSON.stringify(updatedUserRecord)}`);

        return await this.convertToDto(updatedUserRecord);


    }

    async softDeleteUserRecord(userDto: UsersDto): Promise<UsersDto> {
        this.logger.log(`Soft deleting user record with userId: ${userDto.userId}`);

        const userRecord: UserDataType = await this.convertToDataType(userDto);


        userRecord.userStatus = UserStatus.DELETED;
        userRecord.GSI1PK = `USER#${userRecord.userRole}#${UserStatus.DELETED}`;
        userRecord.GSI1SK = userRecord.email;
        userRecord.GSI2PK = `USER#${userRecord.email}#${UserStatus.DELETED}`;
        userRecord.GSI3PK = `USER#${UserStatus.DELETED}`;
        userRecord.GSI3SK = userRecord.userRole;
        userRecord.GSI4PK = `USER#${userRecord.email}`;
        userRecord.GSI5PK = `USER#${UserStatus.DELETED}`;
        userRecord.GSI5SK = userRecord.email;
        const updatedUserRecord: UserDataType = await this.userTable.update(userRecord);
        this.logger.log(`User Record soft deleted: ${JSON.stringify(updatedUserRecord)}`);
        return await this.convertToDto(updatedUserRecord);
    }

    async hardDeleteUserRecord(userDto: UsersDto): Promise<UsersDto> {
        this.logger.log(`Hard deleting user record with userId: ${userDto.userId}`);

        const userRecord: UserDataType = await this.convertToDataType(userDto);

        await this.userTable.remove(userRecord);

        this.logger.log(`User Record hard deleted: ${JSON.stringify(userRecord)}`);

        return await this.convertToDto(userRecord);
    }

    async findUserRecordById(userId: string): Promise<UsersDto | null> {




        const userRecord = await this.getDatabaseRecordById(userId);

        this.logger.log(`User Record returned: ${JSON.stringify(userRecord)}`);



        if (!userRecord) {
            return null;
        }

        return await this.convertToDto(userRecord);
    }


    async getDatabaseRecordById(userId: string): Promise<UserDataType | undefined> {

        const dbStats = {};

        const userRecord: UserDataType | undefined = await this.userTable.get({
            PK: 'USER',
            SK: `${userId}`
        }, {
            stats: dbStats,
        });


        this.logger.log(`User Record returned: ${JSON.stringify(userRecord)}`);

        this.logger.log(`User Table Find By Id Query stats: ${JSON.stringify(dbStats)}`);

        return userRecord;
    }

    async findUserRecordByEmail(email: string): Promise<UsersDto | null> {
        const dbStats = {};


        const userRecord: UserDataType[] | undefined = await this.userTable.find(
            {
                GSI4PK: `USER#${email}`
            }, {
            index: 'GSI4',
            stats: dbStats,
        });



        this.logger.log(`User Record returned: ${JSON.stringify(userRecord)}`);

        this.logger.log(`User Table Find By Email Query stats: ${JSON.stringify(dbStats)}`);

        //check if there is no user record found 
        if (userRecord.length === 0) {
            return null
        }

        return await this.convertToDto(userRecord[0]);
    }




    async findUserRecordsPagination(limit: number, direction: string, cursorPointer: string): Promise<PageDto<UsersDto>> {

        limit = Number(limit);
        const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
            limit,
            'GSI5',
            direction,
            cursorPointer
        );
        const dbStats = {};


        dynamoDbOption['stats'] = dbStats;
        const userRecords = await this.userTable.find(
            {
                GSI5PK: 'USER#ACTIVE',
            } as UserDataType,
            dynamoDbOption,
        );

        this.logger.log(`User Table Find By Page Query stats: ${JSON.stringify(dbStats)}`);

        this.logger.log(`User Record Returned userRecords.length: ${userRecords.length}`);


        const pageRecordCursorPointers = pageRecordHandler(userRecords, limit, direction, 'GSI5PK', 'GSI5SK', 'PK', 'SK', JSON.stringify(userRecords.next), JSON.stringify(userRecords.prev));

        return new PageDto(
            await this.convertToDtoList(userRecords),
            pageRecordCursorPointers.nextCursorPointer,
            pageRecordCursorPointers.prevCursorPointer
        );


    }

    async convertToDtoList(records: UserDataType[]): Promise<UsersDto[]> {
        const dtoList: UsersDto[] = [];

        for (const record of records) {
            const dto: UsersDto = await this.convertToDto(record);

            dtoList.push(dto);
        }

        return dtoList;
    }

    async convertToDto(record: UserDataType): Promise<UsersDto> {
        const dto = new UsersDto();
        dto.userId = record.userId ? record.userId : '';
        dto.email = record.email ? record.email : '';
        dto.firstName = record.firstName ? record.firstName : '';
        dto.lastName = record.lastName ? record.lastName : '';
        dto.userRole = record.userRole as UserRole;
        dto.userStatus = record.userStatus as UserStatus;
        dto.data = {
            country: record.data?.country ? record.data?.country : '',
        };

        return dto;
    }


    async convertToDataType(dto: UsersDto): Promise<UserDataType> {

        const userData: UserDataType = {
            userStatus: dto.userStatus,
            userRole: dto.userRole,
            data: dto.data,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            GSI1PK: `USER#${dto.userRole}#${UserStatus.ACTIVE}`,
            GSI1SK: dto.email,
            GSI2PK: `USER#${dto.email}#${dto.userStatus}`,
            GSI3PK: `USER#${dto.userStatus}`,
            GSI3SK: dto.userRole,
            GSI4PK: `USER#${dto.email}`,
            GSI5PK: `USER#${dto.userStatus}`,
            GSI5SK: dto.email,
        };
        return userData;
    }

}
