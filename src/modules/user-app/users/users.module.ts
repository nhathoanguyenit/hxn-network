import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, User, UserProfile } from '../user-app.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Role, Permission]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
