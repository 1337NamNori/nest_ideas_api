import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { IdeaModule } from './idea/idea.module';

import { HttpExceptionFilter } from './shared/http-exception.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import {ValidationPipe} from './shared/validation.pipe';

@Module({
    imports: [TypeOrmModule.forRoot(), IdeaModule],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor},
        { provide: APP_PIPE, useClass: ValidationPipe},
    ],
})
export class AppModule {}
