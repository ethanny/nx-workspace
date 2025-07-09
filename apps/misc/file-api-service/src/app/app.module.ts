import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsS3LibModule } from '@aws-s3-lib';
import { ConfigModule } from '@nestjs/config';
import { GetDownloadUrlHandler } from './queries/get.download.url/get.download.url.handler';
import { GetUploadUrlHandler } from './queries/get.upload.url/get.upload.url.handler';

@Module({
  imports: [AwsS3LibModule,ConfigModule],
  controllers: [AppController],
  providers: [AppService, GetUploadUrlHandler, GetDownloadUrlHandler  ],
})
export class AppModule {}
