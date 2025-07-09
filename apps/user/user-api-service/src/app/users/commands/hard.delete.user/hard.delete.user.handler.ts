import { ErrorResponseDto, ResponseDto, UsersDto } from '@dto';
import { BadRequestException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { HardDeleteUserCommand } from './hard.delete.user.command';



@CommandHandler(HardDeleteUserCommand)
export class HardDeleteUserHandler implements ICommandHandler<HardDeleteUserCommand> {

  protected readonly logger = new Logger(HardDeleteUserHandler.name);

  constructor(


    @Inject('UserDatabaseService')
    private readonly userDatabaseService: UserDatabaseServiceAbstract,

  ) { }


  async execute(command: HardDeleteUserCommand): Promise<ResponseDto<UsersDto>> {


    this.logger.log(`Hard Deleting user record ${JSON.stringify(command)}`);
    // find the user record first 

    try {

      const userRecord = await this.userDatabaseService.findUserRecordById(command.userId);

      if (!userRecord) {
        throw new NotFoundException(`User record not found for id ${command.userId}`);
      }

      const userData = await this.userDatabaseService.hardDeleteUserRecord(userRecord);



      return new ResponseDto<UsersDto>(userData, 200);

    } catch (error) {

      this.logger.error(`Error during hard delete user: ${error.message}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));


    }

  }


}