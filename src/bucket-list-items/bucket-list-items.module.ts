import { Module } from '@nestjs/common';
import { BucketListItemsService } from './bucket-list-items.service';
import { BucketListItemsController } from './bucket-list-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketListItem } from 'src/bucket-list-items/entities/bucket-list-item.entity';
import { BucketList } from 'src/bucket-lists/entities/bucket-list.entity';
import { User } from 'src/users/entities/user.entity';
import { BucketListsModule } from 'src/bucket-lists/bucket-lists.module';
import { Destination } from 'src/destinations/entities/destination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BucketListItem, BucketList, User, Destination]),
    BucketListsModule,
  ],
  providers: [BucketListItemsService],
  controllers: [BucketListItemsController],
})
export class BucketListItemsModule {}
