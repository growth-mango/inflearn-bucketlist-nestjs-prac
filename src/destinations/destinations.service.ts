import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDestinationDto } from 'src/destinations/dto/create-destination.dto';
import { Destination } from 'src/destinations/entities/destination.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationsRepository: Repository<Destination>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
    // const cachedResult: any = await this.cacheManager.get(`search-${q}`);

    // if (cachedResult) {
    //   return cachedResult;
    // }

    const result = await this.destinationsRepository.find({
      where: [
        {
          name: Like(`%${q}%`),
        },
        {
          description: Like(`%${q}%`),
        },
      ],
    });

    // await this.cacheManager.set(`search-${q}`, result, 1000 * 10);

    return result;
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
