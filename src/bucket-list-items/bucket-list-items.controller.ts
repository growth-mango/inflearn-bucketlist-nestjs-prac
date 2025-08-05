import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BucketListItemsService } from 'src/bucket-list-items/bucket-list-items.service';
import { CreateBucketListItemDto } from 'src/bucket-list-items/dto/create-bucket-list-items.dto';
import { UpdateBucketListItemDto } from 'src/bucket-list-items/dto/update-bucket-list-items.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@Controller('bucket-list-items')
export class BucketListItemsController {
  constructor(
    private readonly bucketListItemsService: BucketListItemsService,
  ) {}

  @Post(':bucketListId/items')
  @UseGuards(AccessTokenGuard)
  async createBucketListItem(
    @Req() req: Request,
    @Body() createBucketListItemDto: CreateBucketListItemDto,
    @Param('bucketListId', ParseIntPipe) bucketListId: number,
  ) {
    const userId = req.user!['id'];
    return this.bucketListItemsService.create(
      userId,
      bucketListId,
      createBucketListItemDto,
    );
  }

  @Get(':bucketListId/items')
  @UseGuards(AccessTokenGuard)
  async findAllBucketListItems(
    @Req() req: Request,
    @Param('bucketListId', ParseIntPipe) bucketListId: number,
  ) {
    const userId = req.user!['id'];
    return await this.bucketListItemsService.findAll(userId, bucketListId);
  }

  @Get(':bucketListId/items/:itemId')
  @UseGuards(AccessTokenGuard)
  async getBucketListById(
    @Req() req: Request,
    @Param('bucketListId', ParseIntPipe) bucketListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const userId = req.user!['id'];
    return await this.bucketListItemsService.findById(
      userId,
      bucketListId,
      itemId,
    );
  }

  @Patch(':bucketListId/items/:itemId')
  @UseGuards(AccessTokenGuard)
  async updateBucketListItem(
    @Req() req: Request,
    @Param('bucketListId', ParseIntPipe) bucketListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateBucketListItemDto: UpdateBucketListItemDto,
  ) {
    const userId = req.user!['id'];
    return this.bucketListItemsService.update(
      userId,
      bucketListId,
      itemId,
      updateBucketListItemDto,
    );
  }

  @Delete(':bucketListId/items/:itemId')
  @UseGuards(AccessTokenGuard)
  async deleteBucketListItem(
    @Req() req: Request,
    @Param('bucketListId', ParseIntPipe) bucketListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const userId = req.user!['id'];
    return this.bucketListItemsService.remove(userId, bucketListId, itemId);
  }
}
