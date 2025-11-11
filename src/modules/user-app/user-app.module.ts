import { Module } from "@nestjs/common";
import { PermissionsModule } from "./permissions/permissions.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";

@Module({
    imports: [
        AuthModule,
        PermissionsModule,
        RolesModule,
        UsersModule,
    ],
    providers: []
})
export class UserAppModule {}
