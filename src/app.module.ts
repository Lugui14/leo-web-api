import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServerModule } from "./infrastructure/server/server.module";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { CryptographyModule } from "./infrastructure/cryptography/cryptography.module";
import { EnvModule } from "./infrastructure/env/env.module";
import { envSchema } from "./infrastructure/env/env";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "./infrastructure/errors/global-exception.filter";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
            validate: (env) => envSchema.parse(env),
        }),
        ServerModule,
        AuthModule,
        CryptographyModule,
        EnvModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
    ],
})
export class AppModule {}
