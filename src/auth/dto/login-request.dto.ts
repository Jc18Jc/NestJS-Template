import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @ApiProperty({ example: 'abc@naver.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '1234' })
  password: string;
}
