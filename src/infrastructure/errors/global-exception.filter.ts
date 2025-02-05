import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    UnauthorizedException,
    ForbiddenException,
    HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch(Error, UnauthorizedException, ForbiddenException)
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException | UnauthorizedException | Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.message,
        });
    }
}
