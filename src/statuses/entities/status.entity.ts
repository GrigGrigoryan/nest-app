import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { User } from '../../users/entities/user.entity';
import { IStatus } from '../interfaces/IStatus';

@Entity('status')
export class Status extends EntityHelper implements IStatus {
  @Allow()
  @ApiProperty({ example: 'Active' })
  @Column()
  name?: string;

  @OneToMany(() => User, (user) => user.status)
  users?: User[] | null;
}
