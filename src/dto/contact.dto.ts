export interface ContactDto {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SendContactResponse {
  success: boolean;
  message: string;
}
