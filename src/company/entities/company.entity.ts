import { Job } from 'src/job/entities/job.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  logo: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToMany(()=>Job,(job)=>job.company)
  jobs: Job[];
}

// company 1 cong ty co nhieu job
