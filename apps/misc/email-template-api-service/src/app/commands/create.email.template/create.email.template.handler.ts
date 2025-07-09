import { EmailTemplateDto, ErrorResponseDto, ResponseDto } from '@dto';
import { EmailTemplateDatabaseService } from '@email-template-database-service';
import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEmailTemplateCommand } from './create.email.template.command';



@CommandHandler(CreateEmailTemplateCommand)
export class CreateEmailTemplateHandler implements ICommandHandler<CreateEmailTemplateCommand> {

  protected readonly logger = new Logger(CreateEmailTemplateHandler.name);
  private readonly EMAIL_TEMPLATE_ENTITY = 'EMAIL_TEMPLATE';

  constructor(private readonly configService: ConfigService,


    private readonly emailTemplateDatabaseService: EmailTemplateDatabaseService,



  ) { }


  async execute(command: CreateEmailTemplateCommand): Promise<ResponseDto<EmailTemplateDto | ErrorResponseDto>> {


    this.logger.log(`Creating user record ${JSON.stringify(command)}`);

    try {


      const emailTemplateData = {
        subject: command.subject,
        data: {
          htmlData: command.htmlData,
          textData: command.textData,
        },
        emailTemplateType: command.emailTemplateType,
        language: command.language,
      }

      const emailTemplateRecord = await this.emailTemplateDatabaseService.createRecord(emailTemplateData)

      this.logger.log(`Email template record created ${JSON.stringify(emailTemplateRecord)}`);

      const dto: EmailTemplateDto = await this.emailTemplateDatabaseService.convertToDto(emailTemplateRecord);



      return new ResponseDto<EmailTemplateDto>(dto, 201);

    } catch (error) {
      this.logger.error(`Error creating user record ${JSON.stringify(error)}`);


      const errorMessage = error.response?.body?.errorMessage || error.message;

      const errorResponseDto: ErrorResponseDto = {
        errorMessage,
      };

      throw new BadRequestException(new ResponseDto<ErrorResponseDto>(errorResponseDto, 400));



    }


  }


}