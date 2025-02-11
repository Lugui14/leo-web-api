import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode: number;
        let message: string;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof Error) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = exception.message;
        } else {
            statusCode = HttpStatus.BAD_REQUEST;
            message = "An unexpected error occurred";
        }

        response.status(statusCode).json({
            statusCode,
            message,
        });
    }
}
