import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { Company } from 'src/company/entities/company.entity';
import { UpdateJobDto } from './dto/update-job.dto';
import { FilterDto } from './dto/filter-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async findAll(query: FilterDto) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * 10;
    const keyword = query.search || '';
    const [res, total] = await this.jobRepository.findAndCount({
      
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
        'level',
        'description',
        'salary',
        'created_at',
        'updated_at',
        'startDate',
        'endDate',
        'skill',
        'quantity',
        'level',
      ],
      relations: {
        company: true,
        resume:true
      },
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

  async create(createJob: CreateJobDto) {
    const idCompany = createJob.company.id;
    const company = await this.companyRepository.findOneBy({
      id: idCompany,
    });
    // console.log(createJob)
    console.log(company);
    try {
      console.log(createJob);
      const res = await this.jobRepository.save({
        ...createJob,
        company,
      });

      console.log(res);
      const job = await this.jobRepository.findOneBy({ id: res.id });
      return {
        message: 'OK',
        status: 200,
        job,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateJob: UpdateJobDto) {
    try {
      console.log(id, updateJob);
      const res = await this.jobRepository.update(id, updateJob);
      if (res.affected > 0) {
        return {
          message: 'OK',
          status: 200,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id: number) {
    try {
      const res = await this.jobRepository.delete({ id });
      if (res.affected > 0) {
        return {
          message: 'OK',
          status: 200,
        };
      }
    } catch (error) {}
  }

  async findOne(id: number) {
    try {
      const user = await this.jobRepository.findOneBy({ id });
      return {
        message: 'OK',
        status: 200,
        user,
      };
    } catch (error) {}
  }
}
