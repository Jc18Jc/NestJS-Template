import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  // payload의 email을 조회해 user가 있는지 확인
  async validate(payload: any): Promise<UserDto> {
    const email = payload.sub;
    const id = await this.authService.validateByEmail(email);

    const user = { email, id, roles: ['user'] } as UserDto;

    return user;
  }
}
