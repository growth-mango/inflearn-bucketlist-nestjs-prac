import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBucketListDto } from 'src/bucket-lists/dto/create-bucket-list.dto';
import { BucketList } from 'src/bucket-lists/entities/bucket-list.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BucketListsService {
  constructor(
    @InjectRepository(BucketList)
    private readonly bucketListRepository: Repository<BucketList>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    model: CreateBucketListDto,
  ): Promise<BucketList> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('유저를 찾지 못했어요.');
    }

    const existingBucketList = await this.bucketListRepository.findOne({
      where: {
        name: model.name,
        user: {
          id: userId,
        },
      },
    });

    if (existingBucketList) {
      throw new BadRequestException('이미 존재하는 버킷리스트 입니다.');
    }

    const newBucketList = await this.bucketListRepository.create({
      ...model,
      user,
    });

    await this.bucketListRepository.save(newBucketList);

    return { ...newBucketList, user: undefined };
  }

  async findById(userId: string, id: number): Promise<BucketList> {
    const bucketList = await this.bucketListRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!bucketList) {
      throw new BadRequestException(
        `${id}에 해당하는 버킷리스트를 찾지 못했습니다.`,
      );
    }

    return bucketList;
  }

  async findAll(userId: string): Promise<BucketList[]> {
    return this.bucketListRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async remove(userId: string, id: number): Promise<void> {
    const bucketList = await this.bucketListRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!bucketList) {
      throw new BadRequestException('삭제할 버킷리스트를 찾지 못했습니다.');
    }

    await this.bucketListRepository.remove(bucketList);
    // await this.bucketListRepository.delete(id);
  }
}
