import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginRequestDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  @ApiProperty({ example: 'abcd@naver.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '12345678' })
  @Length(8, 20)
  password: string;
}
