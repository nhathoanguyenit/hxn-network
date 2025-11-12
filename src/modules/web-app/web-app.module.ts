import { Module } from '@nestjs/common';
import { WebAppService } from './web-app.service';
import { WebAppController } from './web-app.controller';
import { AdminModule } from './admin/admin.module';
import { ServicesModule } from './services/services.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [ AdminModule, ServicesModule, GamesModule],
  providers: [WebAppService],
  controllers: [WebAppController]
})
export class WebAppModule {}
