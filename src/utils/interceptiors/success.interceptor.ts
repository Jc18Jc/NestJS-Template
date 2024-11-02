import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { winstonLogger } from "src/loggers/winston-logger";

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { url, method } = request;
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const user = request?.user;
    let logText = `ip = ${ip}, [${method}] path = ${url}`;
    if (user) {
      logText += `, USER EMAIL = ${user?.email || 'unknown'}, AUTH ID = ${user?.id || 'unknown' }`;
    }

    winstonLogger.info(logText);
    
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data
      }))
    );
  }
}
