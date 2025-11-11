import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class WebAppService {

  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {}

  getAppName(): string {
    return this.configService.get<string>("APP_NAME") || "";
  }

  async generateGuestJwt(payload: any) {
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

}

