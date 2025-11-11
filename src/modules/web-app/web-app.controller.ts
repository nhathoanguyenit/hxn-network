import { Controller, Get, HttpException, HttpStatus, Render, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { JwtGuard, OptionalJwtGuard } from "@common/guards/jwt.guard";
import { CryptoHelper } from "@common/utils/crypto.helper";
import { UUID } from "@common/utils/uuid.hepler";
import { HttpAuth } from "@common/decorators/session.decorator";
import { WebAppService } from "./web-app.service";

@Controller()
export class WebAppController {
  constructor(private webAppService: WebAppService) {}

  @Get("/")
  @Render("layout")
  @UseGuards(OptionalJwtGuard)
  async getIndex(@Req() req: Request, @Res({ passthrough: true }) res: Response, @HttpAuth() user: AuthUser) {
    const uid = await UUID.random();
    const guestName = `Guest_${CryptoHelper.hashMd5(uid).slice(0, 11)}`;
    if (!user) {
      const payload = {
        sub: uid,
        type: "GUEST",
        fullname: guestName,
        user,
      };

      const { accessToken } = await this.webAppService.generateGuestJwt(payload);

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      });
    }

    return {
      appName: this.webAppService.getAppName(),
      title: "Home",
      page: "home",
      user,
    };
  }

  @Get(["about", "contact"])
  @Render("layout")
  @UseGuards(OptionalJwtGuard)
  publicPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    const path = req.path.replace("/", "");
    const title = path.charAt(0).toUpperCase() + path.slice(1);
    return {
      appName: this.webAppService.getAppName(),
      title,
      page: path,
      user,
    };
  }

  @Get("login")
  @Render("login")
  loginPage(@Req() req: Request) {
    const redirect = req.query.redirect || "/";
    return {
      appName: this.webAppService.getAppName(),
      title: "Login",
      redirect,
      error: null,
      authenticated: true
    };
  }

  @Get("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("jwt");
    res.redirect("/");
  }

  @Get("404")
  @Render("layout")
  @UseGuards(OptionalJwtGuard)
  notFound(@HttpAuth() user: AuthUser) {
    return {
      appName: this.webAppService.getAppName(),
      title: "404 Not Found",
      page: "404",
    };
  }

}
