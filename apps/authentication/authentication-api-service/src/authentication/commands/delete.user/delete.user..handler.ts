import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminDeleteUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoEmailDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete.user.command';



@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {

  protected readonly logger = new Logger(DeleteUserHandler.name);


  constructor(

    private readonly cognitoService: AwsCognitoLibService
  ) { }


  async execute(command: DeleteUserCommand): Promise<ResponseDto<AdminDeleteUserCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Deleting cognito user : ${command.email}`);

    try {
      const cognitoDto: CognitoEmailDto = {
        email: command.email,
      }

      const cognitoResponse = await this.cognitoService.deleteUser(cognitoDto);


      return new ResponseDto<AdminDeleteUserCommandOutput>(cognitoResponse, 200);

    } catch (error) {

      this.logger.error(`Error Deleting User ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}