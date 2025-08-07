import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // create() : 객체 생성만, DTO 데이터를 User 엔티티 객체로 변환! DB에 저장하지 않음(메모리에만 존재), 비동기 작업 아님(Promise 반환 안함)
    const createUser = this.userRepository.create(createUserDto);
    // save() : 엔티티 객체를 실제 DB에 저장, 저장 후 생성된ID 등, 최신 정보를 반환
    const result = await this.userRepository.save(createUser);
    return result;
  }

  async findAll(): Promise<User[] | null> {
    const result = await this.userRepository.find();
    return result;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.userRepository.findOne({ where: { id } });
    return result;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.userRepository.findOne({ where: { username } });
    return result;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null | undefined> {
    await this.userRepository.update({ id: id }, updateUserDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete({ id: id });
  }

  async countAll(): Promise<number> {
    return this.userRepository.count();
  }
}
