import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmailTemplateDto, EmailTemplateType, ResponseDto } from  '@dto';
import { Logger } from '@nestjs/common';
import { GetEmailTemplateByTypeAndLanguageQuery } from './get.email.template.by.typeand.language.query';
import { EmailTemplateDatabaseService } from '@email-template-database-service';

@QueryHandler(GetEmailTemplateByTypeAndLanguageQuery)
export class GetEmailTemplateByTypeAndLanguageHandler implements IQueryHandler<GetEmailTemplateByTypeAndLanguageQuery> {

  private readonly logger = new Logger(GetEmailTemplateByTypeAndLanguageHandler.name);
    
  constructor(
    private readonly emailTemplateDatabaseService: EmailTemplateDatabaseService
  ) {

  }

  async execute(query: GetEmailTemplateByTypeAndLanguageQuery): Promise<ResponseDto<EmailTemplateDto>> {

    const { emailTemplateType, language } = query;

    this.logger.log(`Executing GetEmailTemplateByTypeAndLanguageHandler with emailTemplateType: ${emailTemplateType} and language: ${language}`);

    const emailTemplateRecord = await this.emailTemplateDatabaseService.findByTemplateTypeAndLanguage(emailTemplateType as EmailTemplateType, language);

    const dto: EmailTemplateDto = await this.emailTemplateDatabaseService.convertToDto(emailTemplateRecord);

    return new ResponseDto<EmailTemplateDto>(dto, 200);

  }
}