import { Module } from '@nestjs/common';
import { ApiServiceLibService } from './api-service-lib.service';

@Module({
  controllers: [],
  providers: [ApiServiceLibService],
  exports: [ApiServiceLibService],
})
export class ApiServiceLibModule {}
