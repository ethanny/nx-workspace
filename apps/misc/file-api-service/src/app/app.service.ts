import { AwsS3LibService } from '@aws-s3-lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly awsS3LibService: AwsS3LibService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async uploadFile(bucketName: string, key: string, mimeType: string, expiration: number) {
    this.logger.log(`Uploading file to bucket ${bucketName} with key ${key}`);
    return await this.awsS3LibService.getUploadSignedUrl(bucketName, key, mimeType, expiration);
  }

  async downloadFile(bucketName: string, key: string, mimeType: string, expiration: number) {
    this.logger.log(`Downloading file from bucket ${bucketName} with key ${key}`);
    return await this.awsS3LibService.getDownloadSignedUrl(bucketName, key, mimeType, expiration);
  }
}
