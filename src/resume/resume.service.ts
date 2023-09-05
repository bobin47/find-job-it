import { Injectable, Body } from '@nestjs/common';
import { Resume } from './entities/resume.entity';
import { Job } from 'src/job/entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResumeDto } from './dto/resumer.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume) private resumeRepository: Repository<Resume>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
  ) {}

  async uploadCV(resumeDto:ResumeDto) {

    try {

      const id = Number(resumeDto.job)
      const Job = await this.jobRepository.findOneBy({ id });
      console.log(Job);
      const NewCv = await this.resumeRepository.save({ ...resumeDto, Job })

      return {
        message:"Oke",
        status:200,
      }
    } catch (error) {
      console.log(error)
    }
  }
}
