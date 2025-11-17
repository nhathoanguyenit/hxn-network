// src/modules/graphic/graphic.entities.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'hxn_graphic', name: 'models_' })
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedAt: Date;

  @OneToMany(() => Object3D, obj => obj.model)
  objects: Object3D[];
}

@Entity({ schema: 'hxn_graphic', name: 'objects_' })
export class Object3D {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  modelId: string;

  @ManyToOne(() => Model, model => model.objects)
  model: Model;

  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;

  @Column("float8", { array: true, default: () => "'{0,0,0}'" })
  position: number[];

  @Column("float8", { array: true, default: () => "'{0,0,0}'" })
  rotation: number[];

  @Column("float8", { array: true, default: () => "'{1,1,1}'" })
  scale: number[];

  @OneToMany(() => Geometry, geo => geo.object)
  geometries: Geometry[];

  @OneToMany(() => Material, mat => mat.object)
  materials: Material[];
}

@Entity({ schema: 'hxn_graphic', name: 'geometry_' })
export class Geometry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  objectId: string;

  @ManyToOne(() => Object3D, obj => obj.geometries)
  object: Object3D;

  @Column({ type: 'jsonb' })
  vertices: any;

  @Column({ type: 'jsonb', nullable: true })
  indices: any;

  @Column({ type: 'jsonb', nullable: true })
  normals: any;

  @Column({ type: 'jsonb', nullable: true })
  uvs: any;

  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedAt: Date;
}

@Entity({ schema: 'hxn_graphic', name: 'materials_' })
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  objectId: string;

  @ManyToOne(() => Object3D, obj => obj.materials)
  object: Object3D;

  @Column({ default: '#ffffff' })
  color: string;

  @Column({ type: 'float8', default: 0.5 })
  roughness: number;

  @Column({ type: 'float8', default: 0.0 })
  metalness: number;

  @Column({ nullable: true })
  textureUrl: string;
}
