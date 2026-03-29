export interface BasePermissions {
  isCanView: boolean;
  isCanEdit: boolean;
  isCanDeactivate: boolean;
  isCanActivate: boolean;
  isCanCreate: boolean;
  isCanImport: boolean;
  isCanExport: boolean;
}

export interface BaseDto extends BasePermissions {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDeleted: boolean;
}

export interface PaginationDto<T> {
  skip: number;
  take: number;
  where?: T;
}

export class PageResponse<T = any> {
  data: T[] = [];
  total: number = 0;
}

export interface SuccessResponse<T = any> {
  message: string;
  data: T;
}

export interface ActionLogDto extends BaseDto {
  functionId: string;
  functionType: string;
  type: string;
  description: string;
  createdByName?: string;
  employeeCode?: string;
}

export interface FileDto {
  fileName: string;
  fileUrl: string;
}
