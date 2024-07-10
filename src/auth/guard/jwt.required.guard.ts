import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtRequiredGuard extends AuthGuard('jwt.required.strategy') {
  constructor() {
    super();
  }
}
