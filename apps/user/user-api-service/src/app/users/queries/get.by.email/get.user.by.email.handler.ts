import { ResponseDto, UsersDto } from '@dto';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { GetUserByEmailQuery } from './get.user.by.email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {

  private readonly logger = new Logger(GetUserByEmailHandler.name);

  constructor(
    @Inject('UserDatabaseService')
    private readonly userDatabaseService: UserDatabaseServiceAbstract,
  ) {

  }

  async execute(query: GetUserByEmailQuery): Promise<ResponseDto<UsersDto>> {

    const { email } = query;

    this.logger.log(`Executing GetUserByEmailHandler with email: ${email}`);

    try {
      const userRecord = await this.userDatabaseService.findUserRecordByEmail(email);
      if (!userRecord) {
        throw new Error(`User not found for email: ${email}`);
      }
      return new ResponseDto<UsersDto>(userRecord, 200);
    } catch (error) {
      this.logger.error(`Error fetching user by email: ${error.message}`);
      throw new NotFoundException(`User not found for email: ${email}`);
    }

  }
}