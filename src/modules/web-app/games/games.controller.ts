import { Controller, Get, Render, Req, UseGuards } from "@nestjs/common";
import { GamesService } from "./games.service";
import { JwtGuard, OptionalJwtGuard } from "@common/guards/jwt.guard";
import { HttpAuth } from "@common/decorators/session.decorator";

@Controller("games")
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get("pinyin")
  @Render("games/layout")
  @UseGuards(JwtGuard)
  pinyinPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.gamesService.getAppName(),
      title: "Pinyin",
      page: "pinyin/index",
      user,
    };
  }

  @Get("pinyin/models/player")
  @Render("games/layout")
  @UseGuards(JwtGuard)
  pinyinModelPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.gamesService.getAppName(),
      title: "Pinyin",
      page: "pinyin/models/player/index",
      user,
    };
  }

  @Get("pinyin/models/bomb")
  @Render("games/layout")
  @UseGuards(JwtGuard)
  bombModelPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.gamesService.getAppName(),
      title: "Pinyin",
      page: "pinyin/models/bomb/index",
      user,
    };
  }
  @Get("pinyin/models/builder")
  @Render("games/layout")
  @UseGuards(JwtGuard)
  builderModelPage(@Req() req: Request, @HttpAuth() user: AuthUser) {
    return {
      appName: this.gamesService.getAppName(),
      title: "Pinyin",
      page: "pinyin/models/builder/index",
      user,
    };
  }
}
