import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./infrastructure/config/env.validation";
import { ServerModule } from "./infrastructure/server/server.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            validate: validateEnv,
        }),
        ServerModule,
    ],
})
export class AppModule {}
