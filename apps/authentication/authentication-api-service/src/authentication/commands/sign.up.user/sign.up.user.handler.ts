import { AwsCognitoLibService } from '@aws-cognito-lib';
import { AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpUserCommand } from './sign.up.user.command';

@CommandHandler(SignUpUserCommand)
export class SignUpUserHandler implements ICommandHandler<SignUpUserCommand> {

  protected readonly logger = new Logger(SignUpUserHandler.name);


  constructor(
    private readonly cognitoService: AwsCognitoLibService
  ) { }


  async execute(command: SignUpUserCommand): Promise<ResponseDto<AdminCreateUserCommandOutput | ErrorResponseDto>> {


    this.logger.log(`Signing Up User : ${command.email}`);

    try {
      const cognitoDto: CognitoDto = {
        email: command.email,
        password: command.password
      }

      const cognitoResponse = await this.cognitoService.signupUser(cognitoDto);


      return new ResponseDto<AdminCreateUserCommandOutput>(cognitoResponse, 201);

    } catch (error) {

      this.logger.error(`Error Signing Up User ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}