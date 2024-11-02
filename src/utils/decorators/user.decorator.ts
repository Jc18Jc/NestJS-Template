import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 요청 객체에서 user 객체를 추출, Request 데코레이터 대신 사용
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
});