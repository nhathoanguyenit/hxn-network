import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        const authHeader = req?.headers?.authorization;
        const cookieJwt = req?.cookies?.jwt;

        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          return token;
        }

        if (cookieJwt) {
          return cookieJwt;
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'app_jwt_secret',
    });
  }

  async validate(payload: any, req: Request) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = {
      id: payload.sub,
      type: payload.type,
      fullname: payload.fullname,
      roles: payload.roles || [],
      ip: req.ip, 
    };

    return user; 
  }
}
