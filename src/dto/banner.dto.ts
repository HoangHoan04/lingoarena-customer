import type { BaseDto, FileDto } from "./base.dto";

export interface BannerDto extends BaseDto {
  title: string;
  titleEn: string;
  displayOrder: number;
  isVisible: boolean;
  status: string;
  type: string;
  url?: string;
  image: FileDto[];
}
