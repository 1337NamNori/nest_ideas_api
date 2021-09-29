import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus() || 500;
        const message = (status !== 500) ? (exception.message || null) : 'Internal Server Error';
        const method = request.method || null;

        const errorResponse = {
            status: status,
            method: method,
            path: request.url,
            message: message,
            timestamp: new Date().toISOString(),
        };

        Logger.error(`${method} ${request.url}`, JSON.stringify(errorResponse) , 'ExceptionFilter');

        response.status(status).json(errorResponse);
    }
}
