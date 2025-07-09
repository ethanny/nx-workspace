import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminRespondToAuthChallengeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoCompleteNewPasswordDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CompleteNewPasswordCommand } from './complete.new.password.command';




@CommandHandler(CompleteNewPasswordCommand)
export class CompleteNewPasswordHandler implements ICommandHandler<CompleteNewPasswordCommand> {

  protected readonly logger = new Logger(CompleteNewPasswordHandler.name);

  constructor(

    private readonly cognitoService: AwsCognitoLibService,

  ) { }


  async execute(command: CompleteNewPasswordCommand): Promise<ResponseDto<AdminRespondToAuthChallengeCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Completing new password for user : ${command.email}`);

    try {

      const cognitoDto: CognitoCompleteNewPasswordDto = {
        email: command.email,
        password: command.password,
        session: command.session
      }


      const cognitoResponse = await this.cognitoService.completeNewPassword(cognitoDto);

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