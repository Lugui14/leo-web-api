import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvService } from "../env/env.service";

@Module({
    imports: [
        EnvModule,
        JwtModule.registerAsync({
            imports: [EnvModule],
            inject: [EnvModule],
            global: true,
            useFactory: (env: EnvService) => ({
                secret: env.get("JWT_SECRET"),
                signOptions: { expiresIn: "2h" },
            }),
        }),
    ],
    providers: [],
})
export class AuthModule {}
