import { Module } from '@nestjs/common';
import { AuthorDatabaseServiceService } from './author-database-service.service';
import { ConfigurationLibModule } from '@configuration-lib';

@Module({
  imports: [ConfigurationLibModule],

  providers: [AuthorDatabaseServiceService],
  exports: [AuthorDatabaseServiceService],
})
export class AuthorDatabaseServiceModule {}
