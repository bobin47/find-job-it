import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { CreatePostDto } from './dto/ create-post.dto';

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
      return await this.postRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
    }
  }
}
