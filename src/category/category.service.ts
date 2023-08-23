import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { EditCategoryDto } from './dto/editCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async findAll() {
    const data = await this.categoryRepository.find();
    return { data };
  }

  async create(categoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          name: categoryDto.name,
        },
      });

      if (category) {
        throw new BadRequestException();
      }

      const res = await this.categoryRepository.save(categoryDto);
      return { res, status: 200, message: 'Create OK' };
    } catch (error) {
      throw new BadRequestException('Category da ton tai');
    }
  }

  async update(id: number, editCategory: EditCategoryDto) {
    const res = await this.categoryRepository.update({ id }, editCategory);
    if (res.affected > 0) {
      return {
        status: 200,
        message: 'Cap nhat thanh cong',
      };
    }
  }

  async delete(id:number){
    const res = await this.categoryRepository.delete(id);
    if (res.affected > 0) {
      return {
        status: 200,
        message: 'xoa thanh cong',
      };
    }
  }
}
