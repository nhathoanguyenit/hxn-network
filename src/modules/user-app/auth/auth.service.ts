import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PasswordHepler } from "@common/utils/password.helper";
import { Role, User, UserProfile } from "../user-app.entities";
import { UpdateUserProfileDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserProfile) private readonly userProfileRepo: Repository<UserProfile>
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepo
      .createQueryBuilder("u")
      .addSelect("u.password")
      .leftJoinAndSelect("u.roles", "r")
      .where("u.username = :username", { username: username.toUpperCase() })
      .getOne();
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await PasswordHepler.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    return user;
  }

  async roles(userId: string): Promise<string[]> {
    
    const roles = await this.roleRepo
      .createQueryBuilder("role")
      .innerJoin("role.users", "user")
      .where("user.id = :userId", { userId })
      .getMany();
  
    return roles.map(r => r.code);
  }

  async profile(userId: string) {
    const user = await this.userProfileRepo.findOne({ where: { userId } });
    if (!user) throw new BadRequestException(`User not found with ${userId}`);
    return user;
  }

  public async updateProfile(id: string, dto: UpdateUserProfileDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new BadRequestException(`User not found with ${id}`);
    Object.assign(user, dto);
    return await this.userProfileRepo.save(user);
  }

  async generateJwt(payload: any) {
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
