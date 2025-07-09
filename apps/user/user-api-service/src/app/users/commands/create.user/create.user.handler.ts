import { ErrorResponseDto, ResponseDto, UsersDto } from '@dto';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDatabaseServiceAbstract } from '@user-database-service';
import { CreateUserCommand } from './create.user.command';


@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {

  protected readonly logger = new Logger(CreateUserHandler.name);

  constructor(


    @Inject('UserDatabaseService')
    private readonly userDatabaseService: UserDatabaseServiceAbstract,



  ) { }


  async execute(command: CreateUserCommand): Promise<ResponseDto<UsersDto | ErrorResponseDto>> {


    this.logger.log(`Creating user record ${JSON.stringify(command)}`);
    try {

      //check for duplicate email

      const existingUserRecord = await this.userDatabaseService.findUserRecordByEmail(command.userDto.email);

      if (existingUserRecord) {
        throw new BadRequestException(new ResponseDto<ErrorResponseDto>({ errorMessage: 'Email already exists' }, 400));
      }



      const userRecord = await this.userDatabaseService.createRecord(command.userDto);


      return new ResponseDto<UsersDto>(userRecord, 201);

    } catch (error) {
      this.logger.error(`Error creating user record ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));


    }


  }


}