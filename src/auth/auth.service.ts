import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginRequestDto } from './dto/login-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}

  // 회원가입
  async jwtSignup(loginRequestDto: LoginRequestDto): Promise<string> {
    const { email, password } = loginRequestDto;

    const auth = await this.findByEmail(email);
    
    if(auth) {
      throw new HttpException('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prismaService.auth.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    return this.generateJwtToken(email);
  }

  // 로그인
  async jwtLogin(loginRequestDto: LoginRequestDto): Promise<string> {
    const { email, password } = loginRequestDto;

    const auth = await this.findByEmail(email);

    if (!auth) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, auth.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.generateJwtToken(email);
  }

  // auth 유효성 검사
  async validateByEmail(email: string): Promise<string> {
    const isExist = await this.findByEmail(email);
    if (isExist) {
      return email;
    }
    throw new UnauthorizedException();
  }

  // auth 조회
  findByEmail(email: string): Promise<Auth> {
    return this.prismaService.auth.findUnique({
      where: {
        email
      }
    });
  }

  // jwt 토큰 생성
  generateJwtToken(email: string): string {
    const payload = { sub: email };

    return this.jwtService.sign(payload);
  }
}
