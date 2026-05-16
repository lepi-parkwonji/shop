import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../libs/decorators/auth.decorator';
import { ReqAdmin } from '../../libs/decorators/req-admin.decorator';
import type { JwtPayload } from './guards/admin-auth.guard';
import { TokensDTO } from '../../libs/dtos/tokens.dto';
import { AdminDTO } from './dtos/admin.dto';
import { AdminSignInDTO } from './dtos/admin-sign-in.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOkResponse({ type: TokensDTO }) @ApiBody({ type: AdminSignInDTO })
  @Post('signin')
  signin(@Body() body: AdminSignInDTO): Promise<TokensDTO> {
    return this.adminService.signin(body);
  }

  @ApiBearerAuth() @ApiOkResponse({ type: AdminDTO })
  @Get('me')
  @Auth()
  me(@ReqAdmin() payload: JwtPayload): Promise<AdminDTO> {
    return this.adminService.getMe(payload.sub);
  }

  @ApiBearerAuth() @ApiOkResponse({ schema: { properties: { accessToken: { type: 'string' } } } })
  @Post('refresh')
  @Auth()
  refresh(@ReqAdmin() payload: JwtPayload): Pick<TokensDTO, 'accessToken'> {
    return this.adminService.createAccessToken(payload.sub);
  }

  @ApiBearerAuth() @ApiOkResponse({ schema: { properties: { message: { type: 'string' } } } })
  @Post('logout')
  @Auth()
  logout(): { message: string } {
    return { message: '로그아웃 되었습니다.' };
  }
}
