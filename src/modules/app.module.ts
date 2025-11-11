import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { FileAppModule } from "./file-app/file-app.module";
import { UserAppModule } from "./user-app/user-app.module";
import { ChatAppModule } from "./chat-app/chat-app.module";
import { ToolAppModule } from "./tool-app/tool-app.module";
import { WebAppModule } from "./web-app/web-app.module";
import * as chatEntities from "./chat-app/chat-app.entities";
import * as userEntities from "./user-app/user-app.entities";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: "postgres",
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT as any, 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: false,
          logging: false,
          entities: [...Object.values(chatEntities), ...Object.values(userEntities)],
        };
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "app_jwt_secret",
      signOptions: { expiresIn: "365d" },
    }),
    FileAppModule,
    ChatAppModule,
    UserAppModule,
    ToolAppModule,
    WebAppModule,
  ],
})
export class AppModule {}
