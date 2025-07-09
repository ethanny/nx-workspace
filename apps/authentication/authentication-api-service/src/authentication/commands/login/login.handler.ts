import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminInitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';


@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {

  protected readonly logger = new Logger(LoginHandler.name);

  constructor(
    private readonly cognitoService: AwsCognitoLibService

  ) { }


  async execute(command: LoginCommand): Promise<ResponseDto<AdminInitiateAuthCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Logging in user : ${command.email}`);

    try {

      const cognitoDto: CognitoDto = {
        email: command.email,
        password: command.password
      }

      const cognitoResponse = await this.cognitoService.loginUser(cognitoDto);



      return new ResponseDto<AdminInitiateAuthCommandOutput>(cognitoResponse, 200);

    } catch (error) {

      this.logger.error(`Error Logging User ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}