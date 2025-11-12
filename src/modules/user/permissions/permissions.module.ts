import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, User } from '../user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [TypeOrmModule, PermissionsService], 
})
export class PermissionsModule {}