import { ApiProperty } from '@nestjs/swagger';

export class TokensDTO {
  @ApiProperty({ type: String }) accessToken!: string;
  @ApiProperty({ type: String }) refreshToken!: string;
}
