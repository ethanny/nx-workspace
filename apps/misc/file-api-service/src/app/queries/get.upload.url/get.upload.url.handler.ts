import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUploadUrlQuery  } from './get.upload.url.query';
import { ResponseDto,  } from '@dto';
import { Logger } from '@nestjs/common';

import { AwsS3LibService } from '@aws-s3-lib';

@QueryHandler(GetUploadUrlQuery)
export class GetUploadUrlHandler implements IQueryHandler<GetUploadUrlQuery> {

  private readonly logger = new Logger(GetUploadUrlHandler.name);
  
  constructor(
    private readonly awsS3LibService: AwsS3LibService
  ) {

  }

  async execute(query: GetUploadUrlQuery): Promise<ResponseDto<string>> {

    const { bucketName, key, mimeType, expiration } = query;

    this.logger.log(`Executing GetUploadUrlHandler with bucketName: ${bucketName}, key: ${key}, mimeType: ${mimeType}, expiration: ${expiration}`);

    const url = await this.awsS3LibService.getUploadSignedUrl(bucketName, key, mimeType, expiration);

    return new ResponseDto<string>(url, 200);

  }
}