import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminService {
    
  constructor(private configService: ConfigService) {}
  
  getAppName(): string {
    return this.configService.get<string>("APP_NAME") || "";
  }
}
