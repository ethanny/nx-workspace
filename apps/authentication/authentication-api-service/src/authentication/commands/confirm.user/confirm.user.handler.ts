import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminRespondToAuthChallengeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoConfirmUserDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmUserCommand } from './confirm.user.command';



@CommandHandler(ConfirmUserCommand)
export class ConfirmUserHandler implements ICommandHandler<ConfirmUserCommand> {

  protected readonly logger = new Logger(ConfirmUserHandler.name);


  constructor(
    private readonly cognitoService: AwsCognitoLibService

  ) { }


  async execute(command: ConfirmUserCommand): Promise<ResponseDto<AdminRespondToAuthChallengeCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Confirming cognito user : ${command.email}`);


    try {
      const cognitoDto: CognitoConfirmUserDto = {
        email: command.email,
        code: command.code,
      }

      const cognitoResponse = await this.cognitoService.confirmUser(cognitoDto);

      return new ResponseDto<AdminRespondToAuthChallengeCommandOutput>(cognitoResponse, 200);

    } catch (error) {

      this.logger.error(`Error Confirming Cognito User ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}