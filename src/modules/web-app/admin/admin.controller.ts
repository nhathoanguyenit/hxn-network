import { HttpAuth } from "@common/decorators/session.decorator";
import { JwtGuard } from "@common/guards/jwt.guard";
import { Controller, Get, Render, Req, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Roles } from "@common/decorators/roles.decorator";
import { RoleEnum } from "@common/enums/role.enum";

@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  @Render("admin/layout")
  @UseGuards(JwtGuard)
  @Roles(RoleEnum.ADMIN)
  adminPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    console.log(user.roles)
    return {
      appName: this.adminService.getAppName(),
      title: "Admin",
      page: "dashboard/index",
      roles: user?.roles || [],
    };
  }

  @Get("users")
  @Render("admin/layout")
  @UseGuards(JwtGuard)
  @Roles(RoleEnum.ADMIN)
  userManagementPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.adminService.getAppName(),
      title: "Admin",
      page: "users/index",
      roles: user?.roles || [],
    };
  }

  @Get("roles")
  @Render("admin/layout")
  @UseGuards(JwtGuard)
  @Roles(RoleEnum.ADMIN)
  roleManagementPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.adminService.getAppName(),
      title: "Admin",
      page: "roles/index",
      roles: user?.roles || [],
    };
  }

  @Get("permissions")
  @Render("admin/layout")
  @UseGuards(JwtGuard)
  @Roles(RoleEnum.ADMIN)
  permissionManagementPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.adminService.getAppName(),
      title: "Admin",
      page: "permissions/index",
      roles: user?.roles || [],
    };
  }

  @Get("logs")
  @Render("admin/layout")
  @UseGuards(JwtGuard)
  @Roles(RoleEnum.ADMIN)
  systemLogsPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.adminService.getAppName(),
      title: "Admin",
      page: "logs/index",
      roles: user?.roles || [],
    };
  }
}
