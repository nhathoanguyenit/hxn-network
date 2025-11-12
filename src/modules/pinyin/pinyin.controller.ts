import { HttpAuth } from "@common/decorators/session.decorator";
import { JwtGuard } from "@common/guards/jwt.guard";
import { Controller, Get, Render, Req, UseGuards } from "@nestjs/common";
import { PinyinService } from "./pinyin.service";

@Controller('pinyin')
export class PinyinController {

    constructor(private pinyinService: PinyinService) {}


}
