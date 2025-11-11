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
  
      // ---- 1) Bearer header (optional) ----
      let token = client.handshake?.headers?.authorization?.replace('Bearer ', '');
  
      // ---- 2) handshake auth (Socket.io 4.x) ----
      if (!token) {
        token = client.handshake?.auth?.token;
      }
  
      // ---- 3) Cookies ----
      if (!token && client.handshake?.headers?.cookie) {
        const parsed = cookie.parse(client.handshake.headers.cookie);
        token = parsed.jwt; // <-- cookie name
      }
  
      if (!token) {
        throw new UnauthorizedException('Missing WebSocket token');
      }
  
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET') ?? 'app_jwt_secret',
        });
  
        // ✅ Attach user to socket
        client.user = payload;
        return true;
      } catch (e) {
        throw new UnauthorizedException('Invalid WebSocket token');
      }
    }
  }
  