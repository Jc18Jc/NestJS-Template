import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({ example: 'kim@naver.com' })
  email: string;

  @ApiProperty({ example: ['user'] })
  roles: string[];

  @ApiProperty({ example: 1 })
  id: number;
}