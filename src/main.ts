import "module-alias/register";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const PORT: number = configService.get("API_PORT") ?? 3000;
    await app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

bootstrap();
