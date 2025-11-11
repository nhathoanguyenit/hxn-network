import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, Brackets, FindOptionsWhere } from "typeorm";
import { CreateUserDto, SearchUserDto, UpdateUserDto } from "./users.dto";
import { PasswordHepler } from "@common/utils/password.helper";
import { Role, User, UserProfile } from "../user-app.entities";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>
  ) {}

  async search(dto: SearchUserDto) {
    
    const { key, page = 1, limit = 10, roles, id } = dto;

    const qb = this.userRepo
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.roles", "r")
      .orderBy("u.createdAt", "DESC");

    if (id) {
      qb.andWhere("u.id = :id", { id });
    }

    if (key) {
      qb.andWhere(
        new Brackets((qb2) => {
          qb2.where("u.username ILIKE :key", { key: `%${key}%` })
             .orWhere("u.fullname ILIKE :key", { key: `%${key}%` });
        })
      );
    }

    if (roles && roles.length > 0) {
      qb.andWhere("r.code IN (:...roles)", { roles });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: ["roles"],
      order: { createdAt: "DESC" },
    });
  }

  async findOne({ id, username }: { id?: string; username?: string }): Promise<User> {
    if (!id && !username) {
      throw new BadRequestException("Must provide either id or username");
    }

    const where: FindOptionsWhere<User>[] = [];

    if (id) where.push({ id });
    if (username) where.push({ username });

    const user = await this.userRepo.findOne({
      where,
      relations: ["roles"],
    });

    if (!user) {
      throw new BadRequestException(`User not found with ${id ? `id: ${id}` : `username: ${username}`}`);
    }
    return user;
  }
  async create(dto: CreateUserDto): Promise<User> {

    const existing = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existing) throw new BadRequestException("Username already exists");

    const hash = await PasswordHepler.encode(dto.password);
  
    const user = this.userRepo.create({
      username: dto.username,
      fullname: dto.fullname,
      password: hash,
    });
  
    if (dto.roles?.length) {
      const roles = await this.findRolesByCodesOrIds(dto.roles);
      user.roles = roles;
    }
  
    const savedUser = await this.userRepo.save(user);
  
    const profile = this.profileRepo.create({
      userId: savedUser.id,
      displayName: dto.fullname, 
    });
    await this.profileRepo.save(profile);
  
    return savedUser;
  }
  
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ id });

    if (dto.password) {
      dto.password = await PasswordHepler.encode(dto.password);
    }

    Object.assign(user, dto);

    if (dto.roles) {
      const roles = await this.findRolesByCodesOrIds(dto.roles);
      user.roles = roles;
    }

    return await this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne({ id });
    await this.userRepo.remove(user);
  }

  async assignRoles(userId: string, roles: string[]): Promise<User> {
    const user = await this.findOne({ id: userId });
    const foundRoles = await this.findRolesByCodesOrIds(roles);

    user.roles = foundRoles;
    return await this.userRepo.save(user);
  }

  private async findRolesByCodesOrIds(values: string[]): Promise<Role[]> {
    const roles = await this.roleRepo.find({
      where: [{ id: In(values) }, { code: In(values) }],
    });

    if (roles.length === 0) throw new BadRequestException("No valid roles found for given IDs/codes");

    return roles;
  }

  async findProfilesByUserIds(ids: any) {
    return await this.profileRepo.find({ where: { userId: In(ids) }});
  }
}
