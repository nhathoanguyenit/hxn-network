import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ServicesService {
  constructor(private configService: ConfigService) {}

  getAppName(): string {
    return this.configService.get<string>("APP_NAME") || "";
  }
}
