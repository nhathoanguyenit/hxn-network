import { Controller, Post, Body, Res, UseGuards, Get, Patch } from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto, UpdateUserProfileDto } from "./auth.dto";
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { HttpResp } from "@common/utils/http.helper";
import { JwtGuard } from "@common/guards/jwt.guard";
import { HttpAuth } from "@common/decorators/session.decorator";
import { UUID } from "@common/utils/uuid.hepler";
import { UsersService } from "../users/users.service";
import { CryptoHelper } from "@common/utils/crypto.helper";
import { PasswordHepler } from "@common/utils/password.helper";

@ApiTags("Auth")
@ApiBearerAuth("jwt-auth")
@ApiCookieAuth("jwt")
@Controller("api/user-app/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() { username, password }: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(username, password);
    const roles = await this.authService.roles(user.id);
    const payload = { sub: user.id, fullname: user.fullname, type: "USER", roles };
    const { accessToken } = await this.authService.generateJwt(payload);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return HttpResp.success({ accessToken });
  }

  @Get("profile")
  @UseGuards(JwtGuard)
  async getProfile(@HttpAuth() user: AuthUser) {
    if(user.type === 'GUEST'){
      return HttpResp.success({
        userId: user.id,
        type: "GUEST",
        displayName: user.fullname
      })
    }
    const profile = await this.authService.profile(user.id);
    return HttpResp.success(profile);
  }

  @Patch("profile")
  @UseGuards(JwtGuard)
  public async updateProfile(@HttpAuth() user: AuthUser, @Body() dto: UpdateUserProfileDto) {
    return await this.authService.updateProfile(user.id, dto);
  }

  @Post("logout")
  @UseGuards(JwtGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("jwt");
    return HttpResp.success();
  }
  
}
