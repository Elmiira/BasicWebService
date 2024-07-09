import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as IpAddress from 'ip-address';
import { CreateDataDto, Message } from './create-data.dto';
@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metaData: ArgumentMetadata) {
    const { metatype } = metaData;

    if (!metatype || !this.isClass(metatype)) {
      return value;
    }

    if (this.isInvalidDate(value.ts)) {
      throw new HttpException(
        `Validation failed, Invalid timestamp`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (value?.sent_from_ip) {
      if (this.isNotIpV4(value.sent_from_ip)) {
        throw new HttpException(
          `Validation failed, Invalid IPv4 address`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (this.isEmpty(value)) {
      throw new HttpException(
        `Validation failed, no payload provided`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (this.isEmptyMessage(value.message)) {
      throw new HttpException(
        `Validation failed, message should have at least one field`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return object;
  }

  private isClass(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private isEmpty(value: CreateDataDto) {
    if (Object.keys(value).length < 1) {
      return true;
    }
    return false;
  }

  private isEmptyMessage(message: Message) {
    if (Object.keys(message).length < 1) {
      return true;
    }
    return false;
  }

  private isInvalidDate(timestamp: string) {
    return new Date(timestamp).getTime() < 0;
  }

  private isNotIpV4(ip: any) {
    const ipv4 = IpAddress.Address4;
    try {
      new ipv4(ip);
      return false;
    } catch (error) {
      return true;
    }
  }

  private formatErrors(errors: any[]) {
    return errors.map(err => Object.values(err.constraints)).join(', ');
  }
}
