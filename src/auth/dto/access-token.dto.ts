import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDto {
  @ApiProperty({ example: 'eyabcdefg', description: 'jwt token' })
  accessToken: string;
}