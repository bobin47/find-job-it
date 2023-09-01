import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { CreatePostDto } from './dto/ create-post.dto';
import { FilterPostDto } from './dto/filter-post';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}

  async create(idUser: number, createPostDto: CreatePostDto) {
    const user = await this.userRepository.findOneBy({ id: idUser });

    try {
      const res = await this.postRepository.save({
        ...createPostDto,
        user,
      });
      const post = await this.postRepository.findOneBy({ id: res.id });
      return {
        status: 200,
        message: 'OK',
        post,
      };
    } catch (error) {
      throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(filterPostDto: FilterPostDto) {
    const limit = Number(filterPostDto.limit) || 10;
    const page = Number(filterPostDto.page) || 1;
    const search = filterPostDto.search || '';
    const category = Number(filterPostDto.category) || null;
    const skip = (page - 1) * limit;
    const [res, total] = await this.postRepository.findAndCount({
      relations: {
        user: true,
        category: true,
      },
      select: {
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          email: true,
          last_name: true,
          first_name: true,
          avatar: true,
        },
      },
      order: {
        created_at: 'ASC',
      },
      where: [
        {
          title: Like('%' + search + '%'),
          category: {
            id: category,
          },
        },
        {
          description: Like('%' + search + '%'),
          category: {
            id: category,
          },
        },
      ],
      skip,
      take: limit,
    });

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      currentPage: page,
      total,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findOne(id: number) {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const res = await this.postRepository.update(id, updatePostDto);
    if (res.affected > 0) {
      return {
        status: 200,
        message: 'OK!',
      };
    }
  }

  async delete(id: number) {
    const res = await this.postRepository.delete(id);
    if (res.affected > 0) {
      return {
        status: 200,
        message: 'OK!',
      };
    }
  }

  async getPostWithIdUser(email: any) {
    const posts = await this.postRepository.find({
      relations: {
        user: true,
        category: true,
      },
      where: {
        user: {
          email: email.email,
        },
      },
    });
    return posts;
  }
}
