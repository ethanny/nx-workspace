import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoEmailDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminCreateUserCommand } from './admin.create.user.command';



@CommandHandler(AdminCreateUserCommand)
export class AdminCreateUserHandler implements ICommandHandler<AdminCreateUserCommand> {

  protected readonly logger = new Logger(AdminCreateUserHandler.name);

  constructor(

    private readonly cognitoService: AwsCognitoLibService

  ) { }


  async execute(command: AdminCreateUserCommand): Promise<ResponseDto<AdminCreateUserCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Admin Creating User : ${command.email} `);

    try {

      const cognitoDto: CognitoEmailDto = {
        email: command.email,
      }

      const cognitoResponse = await this.cognitoService.adminCreateUser(cognitoDto);


      return new ResponseDto<AdminCreateUserCommandOutput>(cognitoResponse, 200);

    } catch (error) {
      this.logger.error(`Error Admin Creating User ${JSON.stringify(error)}`);


      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}