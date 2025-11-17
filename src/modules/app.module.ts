import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { FileModule } from "./file/file.module";
import { UserModule } from "./user/user.module";
import { ChatModule } from "./chat/chat.module";
import { ToolModule } from "./tool/tool.module";
import { WebAppModule } from "./web-app/web-app.module";
import * as chatEntities from "./chat/chat.entities";
import * as userEntities from "./user/user.entities";
import * as graphicEntities from "./graphic/graphic.entities";
import { GraphicModule } from "./graphic/graphic.module";

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
          entities: [
            ...Object.values(chatEntities), 
            ...Object.values(userEntities),
            ...Object.values(graphicEntities)
          ],
        };
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "app_jwt_secret",
      signOptions: { expiresIn: "365d" },
    }),
    FileModule,
    ChatModule,
    UserModule,
    ToolModule,
    GraphicModule,
    WebAppModule,
  ],
})
export class AppModule {}
