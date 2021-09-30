import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        this.hasAuthHeader(request);
        request.user = await this.validateToken(request.headers.authorization);

        return true;
    }

    private hasAuthHeader(request) {
        if (!request.headers.authorization) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    private async validateToken(auth: string) {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }

        const token = auth.split(' ')[1];

        try { 
            const decode = await jwt.verify(token, process.env.SECRET);

            return decode;
        } catch (error) {
            const message = 'Invalid token: ' + (error.message || error.name);
            throw new HttpException(message, HttpStatus.UNAUTHORIZED);
        }
    }
}
