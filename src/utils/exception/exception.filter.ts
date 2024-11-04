import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { winstonLogger } from 'src/loggers/winston-logger';
import { UserDto } from 'src/auth/dto/user.dto';
import { maskEmail } from '../methods';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor() { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const ip = request.headers['x-forwarded-for'] || 'unknown';
    let status: number;
    let message: string;
    if (exception instanceof HttpException) {
      // HttpException 처리
      status = exception.getStatus();
      message = exception.message;
      // BadRequestException에 대한 추가 처리
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Prisma 예외 처리
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof Error) {
      // 기타 Error 처리
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    } else {
      // unknown 예외 처리
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    const user = request?.user;
    const path = request?.url;
    const maskedEmail = maskEmail(user?.email) || 'unknown';

    winstonLogger.error(`ip: ${ip}, path: ${path}, status: ${status}, exception: ${exception}, USER EMAIL = ${maskedEmail}, USER ID = ${user?.id || 'unknown'}`);
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message
    });
  }


}
