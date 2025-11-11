import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import * as cookie from 'cookie';
  
  @Injectable()
  export class WsJwtGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) {}
  
    canActivate(context: ExecutionContext): boolean {
      const client = context.switchToWs().getClient();

      let token = client.handshake?.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        token = client.handshake?.auth?.token;
      }

      if (!token && client.handshake?.headers?.cookie) {
        const parsed = cookie.parse(client.handshake.headers.cookie);
        token = parsed.jwt;
      }
  
      if (!token) {
        throw new UnauthorizedException('Missing WebSocket token');
      }
  
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET') ?? 'app_jwt_secret',
        });
   
        client.user = payload;
        return true;
      } catch (e) {
        throw new UnauthorizedException('Invalid WebSocket token');
      }
    }
  }
  