import { Company } from 'src/company/entities/company.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  skill: string;

  @Column()
  salary: string;

  @Column()
  level: string;

  @Column()
  quantity: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;

  @OneToMany(()=> Resume,(resume)=>resume.job)
  resume:Resume
}

// 1 job thuoc 1 cong ty
