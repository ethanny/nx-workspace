import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetEmailTemplateByTypeAndLanguageQuery } from './queries/get.email.template.by.typeand.language/get.email.template.by.typeand.language.query';
import { EmailTemplateDto, EmailTemplateType } from '@dto';
import { CreateEmailTemplateCommand } from './commands/create.email.template/create.email.template.command';
import { ApiTags } from '@nestjs/swagger';

@Controller('email-template')
@ApiTags('email-template')  
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('email-template')
  async getEmailTemplate(@Query('emailTemplateType')  emailTemplateType :string, @Query('language') language: string) {
    return this.queryBus.execute(new GetEmailTemplateByTypeAndLanguageQuery(emailTemplateType , language));
  }

  @Post()
  async createEmailTemplate(@Body() emailTemplateDto: EmailTemplateDto) {
    return this.commandBus.execute(new CreateEmailTemplateCommand(emailTemplateDto.language,
      emailTemplateDto.emailTemplateType, emailTemplateDto.data.htmlData,
      emailTemplateDto.data.textData, emailTemplateDto.subject)
    );
  }
}
