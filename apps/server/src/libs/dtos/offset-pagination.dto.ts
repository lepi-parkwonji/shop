import { PageInfoDTO } from './page-info.dto';

export class OffsetPaginationDTO<T> {
  items: T[];
  pageInfo: PageInfoDTO;
}
