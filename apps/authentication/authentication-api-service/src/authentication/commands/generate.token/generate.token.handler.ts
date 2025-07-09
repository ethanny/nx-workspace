import { AwsCognitoLibService } from '@aws-cognito-lib';
import { ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokenCommand } from './generate.token.command';




@CommandHandler(GenerateTokenCommand)
export class GenerateTokenHandler implements ICommandHandler<GenerateTokenCommand> {

  protected readonly logger = new Logger(GenerateTokenHandler.name);

  constructor(

    private readonly cognitoService: AwsCognitoLibService

  ) { }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(command: GenerateTokenCommand): Promise<ResponseDto<any | ErrorResponseDto>> {


    this.logger.log(`Generating Token `);

    try {
      const cognitoResponse = await this.cognitoService.generateToken(command.code);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new ResponseDto<any>(cognitoResponse, 200);

    } catch (error) {

      this.logger.error(`Error Generating Token ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));

    }
  }


}