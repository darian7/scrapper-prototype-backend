import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './@common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScrapingModule } from './modules/scraping/scraping.module';
import { LanguageModule } from './modules/language/language.module';
import appConfig from './@common/config/app.config';
import sendgridConfig from './@common/config/sendgrid.config';
import typeormConfig from './@common/config/typeorm.config';
import gcsConfig from './@common/config/gcs.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, sendgridConfig, typeormConfig, gcsConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm.users'),
      name: 'users' 
    }),
    CommonModule,
    AuthModule,
    ScrapingModule,
    LanguageModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})

export class AppModule { }
