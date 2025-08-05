import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDestinationDto } from 'src/destinations/dto/create-destination.dto';
import { Destination } from 'src/destinations/entities/destination.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationsRepository: Repository<Destination>,
  ) {}

  async create(model: CreateDestinationDto): Promise<Destination> {
    const destination = this.destinationsRepository.create({
      ...model,
    });

    const createdDestination =
      await this.destinationsRepository.save(destination);

    return createdDestination;
  }

  async findAll(): Promise<Destination[]> {
    return this.destinationsRepository.find();
  }

  async search(q: string): Promise<Destination[]> {
    return this.destinationsRepository.find({
      where: {
        name: Like(`%${q}%`),
      },
    });
  }

  async findById(id: number): Promise<Destination> {
    const destination = await this.destinationsRepository.findOneBy({ id });

    if (!destination) {
      throw new BadRequestException(
        `해당 id ${id}에 해당하는 destination을 찾을 수 없어요.`,
      );
    }

    return destination;
  }

  async remove(id: number): Promise<void> {
    const destination = await this.destinationsRepository.findOneBy({ id });

    if (!destination) {
      throw new BadRequestException(
        `해당 id ${id}에 해당하는 destination을 찾을 수 없어요.`,
      );
    }

    await this.destinationsRepository.delete(id);
  }
}
