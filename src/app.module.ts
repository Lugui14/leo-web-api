import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServerModule } from "./infrastructure/server/server.module";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { CryptographyModule } from "./infrastructure/cryptography/cryptography.module";
import { EnvModule } from "./infrastructure/env/env.module";
import { envSchema } from "./infrastructure/env/env";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            validate: (env) => envSchema.parse(env),
        }),
        ServerModule,
        AuthModule,
        CryptographyModule,
        EnvModule,
    ],
})
export class AppModule {}
