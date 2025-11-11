// libs/common/src/decorators/req-auth.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const HttpAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Express.User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const WsAuth = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const client = ctx.switchToWs().getClient();
  return client.user || null;
});
