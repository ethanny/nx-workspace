import { ErrorResponseDto, ResponseDto, UsersDto } from '@dto';
import { BadRequestException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { SoftDeleteUserCommand } from './soft.delete.user.command';



@CommandHandler(SoftDeleteUserCommand)
export class SoftDeleteUserHandler implements ICommandHandler<SoftDeleteUserCommand> {

  protected readonly logger = new Logger(SoftDeleteUserHandler.name);
  private readonly USER_ENTITY = 'USER';

  constructor(


    @Inject('UserDatabaseService')
    private readonly userDatabaseService: UserDatabaseServiceAbstract,



  ) { }


  async execute(command: SoftDeleteUserCommand): Promise<ResponseDto<UsersDto | ErrorResponseDto>> {


    this.logger.log(`Soft Deleting user record ${JSON.stringify(command)}`);

    // find the user record first 

    try {
      const userRecord = await this.userDatabaseService.findUserRecordById(command.userId);
      if (!userRecord) {
        throw new NotFoundException(`User record not found for id ${command.userId}`);
      }

      const userData = await this.userDatabaseService.softDeleteUserRecord(userRecord);



      return new ResponseDto<UsersDto>(userData, 200);
    } catch (error) {

      this.logger.error(`Error soft deleting user record ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));


    }

  }


}