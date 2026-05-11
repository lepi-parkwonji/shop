import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AdminDTO {
  @Expose()
  id: number;

  @Expose()
  usrname: string;

  @Expose()
  displayName: string;
}
