import { IsOptional, IsString } from 'class-validator';

export class UpdateFaqDTO {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;
}
