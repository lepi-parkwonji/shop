export interface FaqDTO {
  id: number;
  question: string;
  answer: string;
  isExposed: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
