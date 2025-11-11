import { Module } from '@nestjs/common';
import { WebAppService } from './web-app.service';
import { WebAppController } from './web-app.controller';
import { UserAppModule } from '@modules/user-app/user-app.module';
import { AdminModule } from './admin/admin.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [UserAppModule, AdminModule, ServicesModule],
  providers: [WebAppService],
  controllers: [WebAppController]
})
export class WebAppModule {}
