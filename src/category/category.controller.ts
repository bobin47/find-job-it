import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { EditCategoryDto } from './dto/editCategory.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { Role } from 'src/auth/decorator/role.decorator';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // @Role("User","Admin")
  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Post('create')
  create(@Body() categoryDto: CreateCategoryDto) {
    return this.categoryService.create(categoryDto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() editCategoryDto: EditCategoryDto) {
    return this.categoryService.update(+id, editCategoryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(+id);
  }
}
