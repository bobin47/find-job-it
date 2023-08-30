import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(query: FilterUserDto) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;
    const keyword = query.search || '';
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { email: Like('%' + keyword + '%') },
        { first_name: Like('%' + keyword + '%') },
        { last_name: Like('%' + keyword + '%') },
      ],
      order: { created_at: 'DESC' },
      take: limit,
      skip,
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'status',
        'created_at',
        'updated_at',
        'roles',
      ],
    });

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      lastPage,
      nextPage,
      prevPage,
    };
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
    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
    return {
      status: 200,
      message: 'Create OK',
      user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const res = await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOneBy({ id });
    if (res.affected > 0) {
      return {
        status: 200,
        message: 'Cap nhat thanh cong',
        user,
      };
    }
  }

  async delete(id: number) {
    const res = await this.userRepository.delete(id);
    if (res.affected > 0) {
      return {
        status: 200,
        message: 'Cap nhat thanh cong',
      };
    }
  }

  async updateAvatar(id: number, avatar: string) {
    return await this.userRepository.update(id, { avatar });
  }
}
