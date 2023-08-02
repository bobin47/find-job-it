import { UpdateUserDto } from './dto/update-user.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'status',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const userExit = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExit) {
      throw new BadRequestException('email da ton tai');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number) {
    return this.userRepository.delete(id);
  }
}
