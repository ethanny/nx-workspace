import { ErrorResponseDto, ResponseDto, UsersDto } from '@dto';
import { BadRequestException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { UpdateUserCommand } from './update.user.command';


@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {

  protected readonly logger = new Logger(UpdateUserHandler.name);

  constructor(


    @Inject('UserDatabaseService')
    private readonly userDatabaseService: UserDatabaseServiceAbstract,

  ) { }


  async execute(command: UpdateUserCommand): Promise<ResponseDto<UsersDto | ErrorResponseDto>> {


    this.logger.log(`Updating user record ${JSON.stringify(command)}`);



    try {
      let existingUserRecord = await this.userDatabaseService.findUserRecordById(command.userDto.userId);

      if (!existingUserRecord) {
        throw new NotFoundException(`User record not found for id ${command.userDto.userId}`);
      }

      existingUserRecord = {
        ...command.userDto
      }

      const userRecord = await this.userDatabaseService.updateUserRecord(existingUserRecord);


      return new ResponseDto<UsersDto>(userRecord, 200);

    } catch (error) {
      this.logger.error(`Error updating user record ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }


  }


}