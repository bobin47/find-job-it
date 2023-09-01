import { IsNotEmpty } from 'class-validator';
import { Company } from 'src/company/entities/company.entity';

export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  skill: string;

  @IsNotEmpty()
  salary: string;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  company: Company;
}
