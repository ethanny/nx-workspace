import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDownloadUrlQuery  } from './get.download.url.query';
import { ResponseDto, UsersDto } from '@dto';
import { Logger } from '@nestjs/common';

import { AwsS3LibService } from '@aws-s3-lib';

@QueryHandler(GetDownloadUrlQuery)
export class GetDownloadUrlHandler implements IQueryHandler<GetDownloadUrlQuery> {

  private readonly logger = new Logger(GetDownloadUrlHandler.name);
  
  constructor(
    private readonly awsS3LibService: AwsS3LibService
  ) {

  }

  async execute(query: GetDownloadUrlQuery): Promise<ResponseDto<string>> {

    const { bucketName, key, mimeType, expiration } = query;

    this.logger.log(`Executing GetDownloadUrlHandler with bucketName: ${bucketName}, key: ${key}, mimeType: ${mimeType}, expiration: ${expiration}`);

    const url = await this.awsS3LibService.getDownloadSignedUrl(bucketName, key, mimeType, expiration);

    return new ResponseDto<string>(url, 200);

  }
}