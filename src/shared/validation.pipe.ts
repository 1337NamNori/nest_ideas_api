import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationErrors } from '../types/validate-failed.interface';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (this.isEmpty(value)) {
            throw new HttpException('The request body is empty.', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            throw new HttpException(this.formatErrors(errors), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        
        return !types.includes(metatype);
    }

    private formatErrors(errors): string {
        const errorMessages: ValidationErrors = {};

        errors.map(error => {
            errorMessages[error.property] = Object.values(error.constraints)[0];
        });

        return JSON.stringify(errorMessages);
    }

    private isEmpty(value: any): boolean {
        if (Object.keys(value).length > 0) {
            return false;
        }

        return true;
    }
}
