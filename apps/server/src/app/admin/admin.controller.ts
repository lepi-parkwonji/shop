import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma/prisma.service';
import { Auth } from '../../libs/decorators/auth.decorator';
import { ReqAdmin } from '../../libs/decorators/req-admin.decorator';
import { TokensDTO } from '../../libs/dtos/tokens.dto';
import { AuthUtil } from '../auth/auth.util';
import { AdminDTO } from './dtos/admin.dto';
import { AdminSignInDTO } from './dtos/admin-sign-in.dto';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService, private authUtil: AuthUtil) {}

  @Post('signin')
  async signin(@Body() body: AdminSignInDTO): Promise<TokensDTO> {
    const admin = await this.prisma.admin.findUnique({ where: { usrname: body.usrname } });
    if (!admin || !this.authUtil.compareHash(body.password, admin.password))
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');

    return {
      accessToken: this.authUtil.createToken({ sub: admin.id }, '1h'),
      refreshToken: this.authUtil.createToken({ sub: admin.id }, '7d'),
    };
  }

  @Get('me')
  @Auth()
  async me(@ReqAdmin() payload: { sub: number }): Promise<AdminDTO> {
    const admin = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin) throw new UnauthorizedException();
    return plainToInstance(AdminDTO, admin);
  }

  @Post('refresh')
  @Auth()
  refresh(@ReqAdmin() payload: { sub: number }): Pick<TokensDTO, 'accessToken'> {
    return { accessToken: this.authUtil.createToken({ sub: payload.sub }, '1h') };
  }

  @Post('logout')
  @Auth()
  logout(): { message: string } {
    return { message: '로그아웃 되었습니다.' };
  }
}
