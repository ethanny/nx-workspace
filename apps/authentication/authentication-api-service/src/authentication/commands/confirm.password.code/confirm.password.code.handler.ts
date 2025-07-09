import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminRespondToAuthChallengeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoConfirmCodeDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmPasswordCodeCommand } from './confirm.password.code.command';


@CommandHandler(ConfirmPasswordCodeCommand)
export class ConfirmPasswordCodeHandler implements ICommandHandler<ConfirmPasswordCodeCommand> {

  protected readonly logger = new Logger(ConfirmPasswordCodeHandler.name);


  constructor(
    private readonly cognitoService: AwsCognitoLibService

  ) { }


  async execute(command: ConfirmPasswordCodeCommand): Promise<ResponseDto<AdminRespondToAuthChallengeCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Completing new password for user : ${command.email}`);


    try {

      const cognitoDto: CognitoConfirmCodeDto = {
        email: command.email,
        code: command.code,
        password: command.password
      }

      const cognitoResponse = await this.cognitoService.confirmPasswordCode(cognitoDto);

      return new ResponseDto<AdminRespondToAuthChallengeCommandOutput>(cognitoResponse, 200);

    } catch (error) {

      this.logger.error(`Error Completing New Password ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}