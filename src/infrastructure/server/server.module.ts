import { Module } from "@nestjs/common";
import { PrismaModule } from "../database/prisma.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { SignupController } from "./controllers/signup.controller";
import { ChangePasswordController } from "./controllers/change-password.controller";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateUseCase } from "@/domain/club/use-cases/authenticate";
import { SignUpUseCase } from "@/domain/club/use-cases/signup";
import { ChangePasswordUseCase } from "@/domain/club/use-cases/change-password";
import { RefreshController } from "./controllers/refresh.controller";
import { RefreshUseCase } from "@/domain/club/use-cases/refresh";

@Module({
    imports: [PrismaModule, CryptographyModule],
    controllers: [AuthenticateController, SignupController, ChangePasswordController, RefreshController],
    providers: [AuthenticateUseCase, SignUpUseCase, ChangePasswordUseCase, RefreshUseCase],
})
export class ServerModule {}
