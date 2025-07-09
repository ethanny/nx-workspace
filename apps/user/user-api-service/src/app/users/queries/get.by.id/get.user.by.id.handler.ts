import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ResponseDto, UsersDto } from '@dto';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { GetUserByIdQuery } from './get.user.by.id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {

  private readonly logger = new Logger(GetUserByIdHandler.name);


  constructor(
    @Inject('UserDatabaseService')
    private readonly userDatabaseService: UserDatabaseServiceAbstract,
  ) { }

  async execute(query: GetUserByIdQuery): Promise<ResponseDto<UsersDto>> {

    this.logger.log(`Executing GetUserByIdHandler with userId: ${query.userId}`);

    const { userId } = query;

    try {

      const userRecord = await this.userDatabaseService.findUserRecordById(userId);

      return new ResponseDto<UsersDto>(userRecord, 200);

    } catch (error) {
      this.logger.error(`Error fetching user by ID: ${error.message}`);
      throw new NotFoundException(`User not found for ID: ${userId}`);
    }

  }
}