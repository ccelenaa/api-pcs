import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();

  return data
    ? request.cookies[data]
    : request.cookies;
});

export const SignedCookies = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();

  return data
    ? request.signedCookies && request.signedCookies[data]
    : request.signedCookies;
});
