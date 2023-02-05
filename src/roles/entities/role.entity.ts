import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { User } from '../../users/entities/user.entity';
import { IRole } from '../interfaces/IRole';

@Entity('role')
export class Role extends EntityHelper implements IRole {
  @Allow()
  @ApiProperty({ example: 'Admin' })
  @Column()
  name?: string;

  @OneToMany(() => User, (user) => user.role)
  users?: User[] | null;
}
