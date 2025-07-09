import { AwsSesLibService } from '@aws-ses-lib';
import { EmailNotificationDto, ErrorResponseDto, ResponseDto } from '@dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from './send.email.command';



@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {

  protected readonly logger = new Logger(SendEmailHandler.name);
  private readonly EMAIL_ENTITY = 'EMAIL';

  constructor(private readonly configService: ConfigService,

    private readonly emailService: AwsSesLibService



  ) { }


  async execute(command: SendEmailCommand): Promise<ResponseDto<string>> {


    this.logger.log(`Sending email to ${command.toAddress} with subject ${command.subjectData}`);

    try {

      const emailDto = new EmailNotificationDto();
      emailDto.toAddress = command.toAddress;
      emailDto.subjectData = command.subjectData;
      emailDto.replyToAddress = command.replyToAddress;
      emailDto.source = command.source;
      emailDto.messageBodyHtmlData = command.messageBodyHtmlData;
      emailDto.messageBodyTextData = command.messageBodyTextData;
      emailDto.files = command.files;


      const response = await this.emailService.sendEmail(emailDto);

      this.logger.log(`Email sent ${JSON.stringify(response)}`);




      return new ResponseDto<string>('Email sent successfully', 201);

    } catch (error) {
      this.logger.error(`Error sending email to ${command.toAddress} ${JSON.stringify(error)}`);

      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));


    }


  }


}