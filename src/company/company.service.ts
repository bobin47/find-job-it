import { Injectable, Param } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { UpdateCompany } from './dto/udpate-company.dto';
import { FilterCompanyDto } from './dto/filter-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async findAll(query: FilterCompanyDto) {
    try {
      const limit = Number(query.limit) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * 10;
      const keyword = query.search || '';

      const [res, total] = await this.companyRepository.findAndCount({
        where: [
          {
            name: Like('%' + keyword + '%'),
          },
        ],
        order: { created_at: 'DESC' },
        take: limit,
        skip,
        select: [
          'id',
          'name',
          'address',
          'logo',
          'description',
          'created_at',
          'updated_at',
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
    } catch (error) {}
  }

  async findOne(id: number) {
    try {
      const company = await this.companyRepository.findOneBy({ id });
      return {
        company,
      };
    } catch (error) {}
  }

  async create(createCompany: CreateCompanyDto) {
    try {
      const company = await this.companyRepository.findOneBy({
        name: createCompany.name,
      });

      if (company) {
        return {
          message: 'Company exist',
        };
      }

      const newCompany = await this.companyRepository.save(createCompany);
      return {
        message: 'OK',
        status: 200,
        newCompany,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateCompany: UpdateCompany) {
    try {
      const company = await this.companyRepository.findOneBy({ id });
      if (!company) {
        return {
          message: 'ko tim thay company',
          status: 400,
        };
      }

      const res = await this.companyRepository.update(id, updateCompany);
      if (res.affected > 0) {
        return {
          message: 'update OK',
          status: 200,
        };
      }
    } catch (error) {}
  }

  async delete(id: number) {
    try {
      const company = this.companyRepository.findOneBy({ id });
      if (!company) {
        return {
          message: 'ko tim thay company',
          status: 400,
        };
      }

      const res = await this.companyRepository.delete(id);

      if (res.affected > 0) {
        return {
          message: 'Delete Ok',
          status: 200,
        };
      }
    } catch (error) {}
  }
}
