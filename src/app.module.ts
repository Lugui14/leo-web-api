import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./infrastructure/config/env.validation";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            validate: validateEnv,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
