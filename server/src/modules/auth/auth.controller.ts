import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@Req() req: { headers: { authorization?: string } }) {
    return this.authService.me(req.headers.authorization);
  }

  @Post('logout')
  logout(@Req() req: { headers: { authorization?: string } }) {
    return this.authService.logout(req.headers.authorization);
  }
}
