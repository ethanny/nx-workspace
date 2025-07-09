import { Controller, Get, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { GetDownloadUrlQuery } from './queries/get.download.url/get.download.url.query';
import { GetUploadUrlQuery } from './queries/get.upload.url/get.upload.url.query';
import { QueryBus } from '@nestjs/cqrs';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly queryBus: QueryBus
    ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('upload-url')
  async uploadFile(
      @Query('bucketName') bucketName: string,
      @Query('key') key: string,
      @Query('mimeType') mimeType: string,
      @Query('expiration') expiration: number
  ) {
     return this.queryBus.execute(new GetUploadUrlQuery(bucketName, key, mimeType, expiration));
  }

  @Get('download-url')
  async downloadFile(
      @Query('bucketName') bucketName: string,
      @Query('key') key: string,
      @Query('mimeType') mimeType: string,
      @Query('expiration') expiration: number
  ) {
      return this.queryBus.execute(new GetDownloadUrlQuery(bucketName, key, mimeType, expiration));
  }
}
