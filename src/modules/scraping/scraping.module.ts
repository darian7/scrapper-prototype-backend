import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ScrapingController } from './scraping.controller';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [ScrapingController],
  providers: [
  ],
  exports: []
})
export class ScrapingModule {
}
