import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBucketListItemDto } from 'src/bucket-list-items/dto/create-bucket-list-items.dto';
import { UpdateBucketListItemDto } from 'src/bucket-list-items/dto/update-bucket-list-items.dto';
import { BucketListItem } from 'src/bucket-list-items/entities/bucket-list-item.entity';
import { BucketListsService } from 'src/bucket-lists/bucket-lists.service';
import { BucketList } from 'src/bucket-lists/entities/bucket-list.entity';
import { Destination } from 'src/destinations/entities/destination.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BucketListItemsService {
  constructor(
    @InjectRepository(BucketList)
    private readonly bucketListRepository: Repository<BucketList>,
    @InjectRepository(BucketListItem)
    private readonly bucketListItemRepository: Repository<BucketListItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    private readonly bucketListService: BucketListsService,
  ) {}

  async create(
    userId: string,
    bucketListId: number,
    model: CreateBucketListItemDto,
  ): Promise<BucketListItem> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('유저를 찾지 못했어요.');
    }

    const bucketList = await this.bucketListService.findById(
      userId,
      bucketListId,
    );

    if (!bucketList) {
      throw new BadRequestException('버킷리스트를 찾지 못했어요.');
    }

    const destination = await this.destinationRepository.findOne({
      where: { id: model.destinationId },
    });

    if (!destination) {
      throw new BadRequestException(`목적지를 찾지 못했어요.`);
    }

    const newBucketListItem = this.bucketListItemRepository.create({
      ...model,
      bucketList,
      destination,
    });

    await this.bucketListItemRepository.save(newBucketListItem);

    return { ...newBucketListItem, bucketList: undefined };
  }

  async findAll(
    userId: string,
    bucketListId: number,
  ): Promise<BucketListItem[]> {
    return this.bucketListItemRepository.find({
      where: {
        bucketList: { id: bucketListId, user: { id: userId } },
      },
    });
  }

  async findById(
    userId: string,
    bucketListId: number,
    id: number,
  ): Promise<BucketListItem> {
    const bucketListItem = await this.bucketListItemRepository.findOne({
      where: {
        id: id,
        bucketList: {
          id: bucketListId,
          user: { id: userId },
        },
      },
    });

    if (!bucketListItem) {
      throw new BadRequestException(
        `${id}에 해당하는 버킷 리스트 목록을 찾을 수가 없어요.`,
      );
    }

    return bucketListItem;
  }

  async update(
    userId: string,
    bucketListId: number,
    id: number,
    model: UpdateBucketListItemDto,
  ): Promise<BucketListItem> {
    const bucketListItem = await this.bucketListItemRepository.findOne({
      where: {
        id: id,
        bucketList: { id: bucketListId, user: { id: userId } },
      },
    });

    if (!bucketListItem) {
      throw new BadRequestException(`${id}에 속하는 아이템을 찾지 못했습니다.`);
    }

    bucketListItem.achieved = model.achieved;

    await this.bucketListItemRepository.save(bucketListItem);

    return { ...bucketListItem, bucketList: undefined };
  }

  async remove(
    userId: string,
    bucketListId: number,
    id: number,
  ): Promise<void> {
    const bucketListItem = await this.bucketListItemRepository.findOne({
      where: {
        id: id,
        bucketList: { id: bucketListId, user: { id: userId } },
      },
    });

    if (!bucketListItem) {
      throw new BadRequestException(`${id}에 속하는 아이템을 찾지 못했습니다.`);
    }

    await this.bucketListItemRepository.delete(id);
  }
}
