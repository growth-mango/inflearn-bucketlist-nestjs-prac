import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BucketListsService } from 'src/bucket-lists/bucket-lists.service';
import { CreateBucketListDto } from 'src/bucket-lists/dto/create-bucket-list.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@Controller('bucket-lists')
export class BucketListsController {
  constructor(private readonly bucketListService: BucketListsService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  async createBucketList(
    @Body() body: CreateBucketListDto,
    @Req() req: Request,
  ) {
    const userId = req.user!['id'];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.bucketListService.create(userId, body);
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getBucketLists(@Req() req: Request) {
    const userId = req.user!['id'];

    return this.bucketListService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getBucketListById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user!['id'];

    return this.bucketListService.findById(userId, id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteBucketList(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user!['id'];

    return this.bucketListService.remove(userId, id);
  }
}
