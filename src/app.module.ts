import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DestinationsModule } from './destinations/destinations.module';
import { BucketListsModule } from './bucket-lists/bucket-lists.module';
import { BucketListItemsModule } from './bucket-list-items/bucket-list-items.module';
import { AuthModule } from './auth/auth.module';
import typeorm from 'src/config/typeorm';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          ...configService.get('typeorm'),
          autoLoadEntities: true,
        }) as TypeOrmModuleOptions,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UsersModule,
    DestinationsModule,
    BucketListsModule,
    BucketListItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
