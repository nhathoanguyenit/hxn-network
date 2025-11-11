import { Controller, Get, HttpException, HttpStatus, Render, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { JwtGuard, OptionalJwtGuard } from "@common/guards/jwt.guard";
import { CryptoHelper } from "@common/utils/crypto.helper";
import { UUID } from "@common/utils/uuid.hepler";
import { HttpAuth } from "@common/decorators/session.decorator";
import { ServicesService } from "./services.service";

@Controller()
export class ServicesController {

  constructor(private servicesService: ServicesService) {}


  @Get(["services/converter", "services/encryption", "services/message-digest"])
  @Render("layout")
  @UseGuards(OptionalJwtGuard)
  publicServicesPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    const path = req.path.replace("/", "");
    return {
      appName: this.servicesService.getAppName(),
      title: "Services",
      page: path,
      roles: user?.roles || [],
    };
  }

  @Get(["services/image-detection"])
  @Render("layout")
  @UseGuards(OptionalJwtGuard)
  imageDetectionServicePage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    const path = req.path.replace("/", "");
    return {
      appName: this.servicesService.getAppName(),
      title: "Services",
      page: path,
      roles: user?.roles || [],
    };
  }

}
