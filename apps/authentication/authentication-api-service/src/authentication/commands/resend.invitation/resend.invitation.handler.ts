import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoEmailDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendInvitationCommand } from './resend.invitation.command';



@CommandHandler(ResendInvitationCommand)
export class ResendInvitationHandler implements ICommandHandler<ResendInvitationCommand> {

  protected readonly logger = new Logger(ResendInvitationHandler.name);

  constructor(

    private readonly cognitoService: AwsCognitoLibService

  ) { }


  async execute(command: ResendInvitationCommand): Promise<ResponseDto<AdminCreateUserCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Resending invitation for user : ${command.email}`);

    try {

      const cognitoDto: CognitoEmailDto = {
        email: command.email

      }

      const cognitoResponse = await this.cognitoService.resendInvitation(cognitoDto);

      return new ResponseDto<AdminCreateUserCommandOutput>(cognitoResponse, 201);


    } catch (error) {

      this.logger.error(`Error Resending Invitation ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));


    }
  }


}