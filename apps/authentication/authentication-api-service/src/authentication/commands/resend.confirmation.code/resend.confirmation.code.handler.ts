import { AwsCognitoLibService } from '@aws-cognito-lib';
import { ResendConfirmationCodeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoEmailDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendConfirmationCodeCommand } from './resend.confirmation.code.command';



@CommandHandler(ResendConfirmationCodeCommand)
export class ResendConfirmationCodeHandler implements ICommandHandler<ResendConfirmationCodeCommand> {

  protected readonly logger = new Logger(ResendConfirmationCodeHandler.name);


  constructor(

    private readonly cognitoService: AwsCognitoLibService


  ) { }


  async execute(command: ResendConfirmationCodeCommand): Promise<ResponseDto<ResendConfirmationCodeCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Resending confirmation code for user : ${command.email}`);

    try {

      const cognitoDto: CognitoEmailDto = {
        email: command.email,
      }


      const cognitoResponse = await this.cognitoService.resendConfirmationCode(cognitoDto);


      return new ResponseDto<ResendConfirmationCodeCommandOutput>(cognitoResponse, 201);

    } catch (error) {

      this.logger.error(`Error Resending Confirmation Code ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}