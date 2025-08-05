import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { DestinationsService } from 'src/destinations/destinations.service';
import { CreateDestinationDto } from 'src/destinations/dto/create-destination.dto';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationService: DestinationsService) {}

  @Post('')
  async createDestination(@Body() body: CreateDestinationDto) {
    return this.destinationService.create(body);
  }

  @Get('')
  async findAllDestinations() {
    return this.destinationService.findAll();
  }

  @Get('search') // search?q=keyword
  async searchDestinations(@Query('q') q: string) {
    return this.destinationService.search(q);
  }

  @Get(':id')
  async findDestinationById(@Param('id', ParseIntPipe) id: number) {
    return this.destinationService.findById(id);
  }

  @Delete(':id')
  async deleteDestination(@Param('id', ParseIntPipe) id: number) {
    return this.destinationService.remove(id);
  }
}
