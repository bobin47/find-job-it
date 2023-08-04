import { Category } from 'src/category/entities/category.entity';
export class FilterPostDto {
  page: string;
  limit: string;
  search: string;
  category: string;
}
