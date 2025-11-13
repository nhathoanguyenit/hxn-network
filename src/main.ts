import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as express from "express";
import { GlobalHttpExceptionFilter } from "./libs/common/filters/global-http-exception.filter";
import { GlobalWsExceptionFilter } from "./libs/common/filters/global-ws-exception.filter";
import cookieParser from "cookie-parser";
import { SwaggerConfig } from "@common/configurations/swagger.config";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.useGlobalFilters(new GlobalHttpExceptionFilter());
    app.useGlobalFilters(new GlobalWsExceptionFilter());

    app.use("/assets", express.static(join(__dirname, "..", "assets")));
    app.use("/plugins/bootstrap", express.static(join(__dirname, "..", "node_modules/bootstrap/dist")));
    app.use("/plugins/pinyin",express.static(join(__dirname, "..", "plugins/pinyin")));
    app.use("/plugins/three",express.static(join(__dirname, "..", "plugins/three")));
    app.use("/plugins/crypto-js", express.static(join(__dirname, "..", "node_modules/crypto-js")));
    app.use("/plugins/socket-sdk", express.static(join(__dirname, "..", "plugins/socket-sdk")));
    app.use("/plugins/socket-io-client", express.static(join(__dirname, "..", "node_modules/socket.io-client/dist")));
    app.use("/plugins/chart-js", express.static(join(__dirname, "..", "node_modules/chart.js/dist")));
    app.use("/plugins/custom", express.static(join(__dirname, "..", "plugins/custom")));
    app.use("/plugins/axios", express.static(join(__dirname, "..", "node_modules/axios/dist")));
    
    SwaggerConfig.config(app)

    app.setBaseViewsDir(join(__dirname, "..", "views"));
    app.setViewEngine("ejs");
    await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
