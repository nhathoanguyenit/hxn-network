
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'hxn_graphic', name: 'models_' })
export class Model3D {
  @PrimaryGeneratedColumn('uuid', { name: 'id_' })
  id: string;

  @Column({ name: 'name_', type: 'text' })
  name: string;

  @Column({ name: 'type_', type: 'varchar' })
  type: string;

  @Column({ name: 'description_', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'data_', type: 'json', nullable: true })
  data: any | null; 

  @CreateDateColumn({ name: 'created_at_' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at_' })
  updatedAt: Date;
}
