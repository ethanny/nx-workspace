import { 
  Body, 
  Controller, 
  Get, 
  MaxFileSizeValidator, 
  ParseFilePipe, 
  Post, 
  UploadedFiles, 
  UseInterceptors 
} from '@nestjs/common';
import { AppService } from './app.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EmailNotificationDto } from '@dto';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailCommand } from './commands/send.email/send.email.command';

@ApiTags('Email') // Optional: Tag your controller for better Swagger organization
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commandBus: CommandBus
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('email')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Send an email with optional file attachments',
    required: true,
    schema: {
      type: 'object',
      properties: {
        toAddress: { type: 'string', example: 'example@domain.com' },
        subjectData: { type: 'string', example: 'Subject of the Email' },
        messageBodyHtmlData: { type: 'string', example: '<p>Hello World</p>' },
        messageBodyTextData: { type: 'string', example: 'Hello World' },
        source: { type: 'string', example: 'recipient@domain.com'  },
        replyToAddress: { type: 'string', example: 'reply@domain.com' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['toAddress', 'subjectData', 'messageBodyHtmlData', 'messageBodyTextData', 'source'],
    },
  })
  sendEmail(
    @Body() emailDto: EmailNotificationDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB
        ],
        fileIsRequired: false
      })
    )
    files: Array<any>
  ) {
    return this.commandBus.execute(
      new SendEmailCommand(
        emailDto.toAddress,
        emailDto.source,
        emailDto.messageBodyHtmlData,
        emailDto.messageBodyTextData,
        emailDto.subjectData,
        files,
        emailDto.replyToAddress
      )
    );
  }
}