import { Module } from "@nestjs/common";
import { PrismaModule } from "../database/prisma.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { SingupController } from "./controllers/singup.controller";
import { ChangePasswordController } from "./controllers/change-password.controller";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateUseCase } from "@/domain/club/use-cases/authenticate";
import { SignUpUseCase } from "@/domain/club/use-cases/singup";
import { ChangePasswordUseCase } from "@/domain/club/use-cases/change-password";

@Module({
    imports: [PrismaModule, CryptographyModule],
    controllers: [AuthenticateController, SingupController, ChangePasswordController],
    providers: [AuthenticateUseCase, SignUpUseCase, ChangePasswordUseCase],
})
export class ServerModule {}
