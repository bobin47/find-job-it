import { IsNotEmpty } from "class-validator";
import { Job } from "src/job/entities/job.entity";


export class ResumeDto {
  linkCv:string

  job: Job;
}