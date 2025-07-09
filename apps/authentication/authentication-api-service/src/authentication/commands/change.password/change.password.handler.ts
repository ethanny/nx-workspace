import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminSetUserPasswordCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from './change.password.command';



@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {

  protected readonly logger = new Logger(ChangePasswordHandler.name);


  constructor(
    private readonly cognitoService: AwsCognitoLibService

  ) { }


  async execute(command: ChangePasswordCommand): Promise<ResponseDto<AdminSetUserPasswordCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Changing password for user : ${command.email}`);

    try {

      const cognitoDto: CognitoDto = {
        email: command.email,
        password: command.password
      }

      const cognitoResponse = await this.cognitoService.changePassword(cognitoDto);

      return new ResponseDto<AdminSetUserPasswordCommandOutput>(cognitoResponse, 200);


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