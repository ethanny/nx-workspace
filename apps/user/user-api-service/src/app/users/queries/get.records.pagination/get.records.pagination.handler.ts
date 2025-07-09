import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PageDto, ResponseDto, UsersDto } from '@dto';
import { Inject, Logger } from '@nestjs/common';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { GetRecordsPaginationQuery } from './get.records.pagination.query';

@QueryHandler(GetRecordsPaginationQuery)
export class GetRecordsPaginationHandler implements IQueryHandler<GetRecordsPaginationQuery> {

  private readonly logger = new Logger(GetRecordsPaginationHandler.name);


  constructor(
    @Inject('UserDatabaseService')
    private readonly userDatabaseService: UserDatabaseServiceAbstract
  ) { }

  async execute(query: GetRecordsPaginationQuery): Promise<ResponseDto<PageDto<UsersDto>>> {

    this.logger.log(`Executing GetRecordsPaginationHandler with ${JSON.stringify(query)}`);

    const { limit, direction, cursorPointer } = query;

    const userRecords = await this.userDatabaseService.findUserRecordsPagination(limit, direction, cursorPointer);


    return new ResponseDto<PageDto<UsersDto>>(userRecords, 200);



  }
}