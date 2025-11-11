import { Controller, Get, Post, Body, Param, Delete, Patch, ParseUUIDPipe, BadRequestException, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, SearchUserDto, UpdateUserDto } from "./users.dto";
import { HttpResp } from "@common/utils/http.helper";
import { Monitoring } from "@common/utils/monitor.helper";
import { JwtGuard } from "@common/guards/jwt.guard";
import { Roles } from "@common/decorators/roles.decorator";

@Controller("api/user-app/users")
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Roles("ADMIN")
  async create(@Body() dto: CreateUserDto) {
    const data = await this.usersService.create(dto);
    return HttpResp.success(data);
  }

  @Get(":id")
  @UseGuards(JwtGuard)
  @Roles("ADMIN")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    const data = await this.usersService.findOne({ id });
    return HttpResp.success(data);
  }

  @Patch(":id")
  @UseGuards(JwtGuard)
  @Roles("ADMIN")
  async update(@Param("id", new ParseUUIDPipe()) id: string, @Body() dto: UpdateUserDto) {
    await this.usersService.update(id, dto);
    return HttpResp.success();
  }

  @Delete(":id")
  @UseGuards(JwtGuard)
  @Roles("ADMIN")
  async remove(@Param("id", new ParseUUIDPipe()) id: string) {
    await this.usersService.remove(id);
    return HttpResp.success();
  }

  @Post(":id/assign-roles")
  @UseGuards(JwtGuard)
  @Roles("ADMIN")
  async assignRoles(@Param("id", new ParseUUIDPipe()) id: string, @Body("roles") roles: string[]) {
    if (!roles || !Array.isArray(roles)) {
      throw new BadRequestException("roles must be an array of IDs or codes");
    }
    await this.usersService.assignRoles(id, roles);
    return HttpResp.success();
  }

  @Post(":id/profile")
  @UseGuards(JwtGuard)
  @Roles("ADMIN")
  async getProfilesByIds(@Body("ids") ids: string[]) {

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException("ids must be a non-empty array of UUIDs");
    }

    const profiles = await this.usersService.findProfilesByUserIds(ids);
    return HttpResp.success(profiles);
  }

  @Post("search")
  @Monitoring()
  @Roles("ADMIN")
  async search(@Body() dto: SearchUserDto) {
    const { data, meta } = await this.usersService.search(dto);
    return HttpResp.success(data, meta);
  }


}
