export interface ContentPage {
  id?: string;
  slug?: string;
  title?: string;
  titleEn?: string;
  summary?: string;
  content?: any;
  blocks?: any[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
