import { JobService } from './job.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FilterDto } from './dto/filter-job.dto';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  findAll(@Param() filter:FilterDto) {
    return this.jobService.findAll(filter)
  }

  @Get('/:id')
  findOne(@Param('id') id: number,) {
    return this.jobService.findOne(id)
  }

  @Post()
  create(@Body() createJob: CreateJobDto) {
    return this.jobService.create(createJob);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() updateJob: UpdateJobDto) {
    return this.jobService.update(id, updateJob);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.jobService.delete(id);
  }
}
