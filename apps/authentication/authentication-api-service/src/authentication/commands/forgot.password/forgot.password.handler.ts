import { AwsCognitoLibService } from '@aws-cognito-lib';
import { ForgotPasswordCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoEmailDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from './forgot.password.command';


@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {

  protected readonly logger = new Logger(ForgotPasswordHandler.name);

  constructor(

    private readonly cognitoService: AwsCognitoLibService

  ) { }


  async execute(command: ForgotPasswordCommand): Promise<ResponseDto<ForgotPasswordCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Triggering forgot password for user : ${command.email}`);

    try {
      const cognitoDto: CognitoEmailDto = {
        email: command.email
      }

      const cognitoResponse = await this.cognitoService.triggerForgotPassword(cognitoDto);


      return new ResponseDto<ForgotPasswordCommandOutput>(cognitoResponse, 200);

    } catch (error) {

      this.logger.error(`Error Triggering Forgot Password ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}