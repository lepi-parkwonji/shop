export interface NoticeDTO {
  id: number;
  title: string;
  content: string;
  isExposed: boolean;
  isPinned: boolean;
  imageURL: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
