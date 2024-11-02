import { ApiProperty } from "@nestjs/swagger";

export class JwtTokenDto {
  @ApiProperty({ example: 'eyabcdefg', description: 'jwt token' })
  jwtToken: string;
}