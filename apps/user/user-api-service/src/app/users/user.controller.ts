import { ApiKeyHeaderGuard } from '@auth-guard-lib';
import { CreateUserDto, UsersDto } from '@dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserCommand } from './commands/create.user/create.user.command';
import { HardDeleteUserCommand } from './commands/hard.delete.user/hard.delete.user.command';
import { SoftDeleteUserCommand } from './commands/soft.delete.user/soft.delete.user.command';
import { UpdateUserCommand } from './commands/update.user/update.user.command';
import { GetEmailByApiKeyQuery } from './queries/get.by.email.by.api.key/get.email.by.api.key.query';
import { GetUserByEmailQuery } from './queries/get.by.email/get.user.by.email.query';
import { GetUserByIdQuery } from './queries/get.by.id/get.user.by.id.query';
import { GetRecordsPaginationQuery } from './queries/get.records.pagination/get.records.pagination.query';




@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }



  @Post()

  createRecord(@Body() createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(createUserDto);
    return this.commandBus.execute(command);
  }

  @Put(':id')
  updateRecord(@Param('id') id: string, @Body() updateUserDto: UsersDto) {
    const command = new UpdateUserCommand(id, updateUserDto);
    return this.commandBus.execute(command);
  }
  @Delete('soft/:id')

  softDeleteRecord(@Param('id') id: string) {
    const command = new SoftDeleteUserCommand(id);
    return this.commandBus.execute(command);
  }

  @Delete(':id')

  hardDeleteRecord(@Param('id') id: string) {
    const command = new HardDeleteUserCommand(id);
    return this.commandBus.execute(command);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }


  @Get('email/:email')
  getByEmail(@Param('email') email: string) {
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  @Get('email-by-api-key/:email')
  @ApiHeader({
    name: 'X-API-KEY',
  })
  @UseGuards(ApiKeyHeaderGuard)
  getByEmailByApiKey(@Param('email') email: string) {
    return this.queryBus.execute(new GetEmailByApiKeyQuery(email));
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: true,
    description: 'No of Records to fetch',
  })
  @ApiQuery({
    name: 'direction',
    type: String,
    required: false,
    description: 'Page Direction (nullable) : Possible values "next / prev',
  })
  @ApiQuery({
    name: 'cursorPointer',
    type: String,
    required: false,
    description: 'DB Cursor Pointer - null for first Page',
  })
  getRecordsPagination(@Query('limit') limit: number, @Query('direction') direction: string, @Query('cursorPointer') cursorPointer: string) {
    return this.queryBus.execute(new GetRecordsPaginationQuery(limit, direction, cursorPointer));
  }


  @Post('test')
  @ApiBody({ type: Object })
  test(@Body() data: any) {
    console.log(JSON.stringify(data));
  }


}
