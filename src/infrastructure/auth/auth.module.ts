import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvService } from "../env/env.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
    imports: [
        EnvModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [EnvModule],
            inject: [EnvService],
            global: true,
            useFactory: (envService: EnvService) => ({
                secret: envService.get("JWT_SECRET"),
                signOptions: { expiresIn: "1h" },
            }),
        }),
    ],
    providers: [
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AuthModule {}
