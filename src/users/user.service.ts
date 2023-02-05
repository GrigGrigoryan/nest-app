import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createProfileDto: CreateUserDto) {
    return await this.userRepository.save(
      await this.userRepository.create(createProfileDto),
    );
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(where: EntityCondition<User>) {
    return await this.userRepository.findOne({
      where,
      relations: ['role', 'status'],
    });
  }

  async update(id: number, updateProfileDto: UpdateUserDto) {
    const existingUser: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    Object.assign(existingUser, updateProfileDto);
    return await this.userRepository.save(existingUser);
  }

  async softDelete(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
