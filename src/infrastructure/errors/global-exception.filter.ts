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

        if (exception instanceof UnauthorizedException) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: exception.message,
            });
        } else if (exception instanceof ForbiddenException) {
            return response.status(HttpStatus.FORBIDDEN).json({
                statusCode: HttpStatus.FORBIDDEN,
                message: exception.message,
            });
        }

        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.message,
        });
    }
}
