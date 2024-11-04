import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/login-request.dto";
import { Public } from "src/utils/setMeta";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessTokenDto } from "./dto/access-token.dto";

@Controller('auth')
@Public()
@ApiTags('Auth Controller')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, type: AccessTokenDto })
  @ApiOperation({ summary: '회원가입' })
  async signup(@Body() loginRequestDto: LoginRequestDto): Promise<AccessTokenDto> {
    const accessToken = await this.authService.signup(loginRequestDto);

    return { accessToken };
  }

  @Post('signin')
  @ApiResponse({ status: 201, type: AccessTokenDto })
  @ApiOperation({ summary: '로그인' })
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<AccessTokenDto> {
    const accessToken = await this.authService.login(loginRequestDto);

    return { accessToken };
  }
  
}