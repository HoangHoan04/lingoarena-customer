import { REGEX } from "./regex";

export const validators = {
  isEmpty: (value: string) => !value || value.trim().length === 0,

  isValidEmail: (email: string) => REGEX.EMAIL.test(email),

  isValidPhone: (phone: string) => REGEX.PHONE.test(phone),

  isValidPassword: (password: string) => REGEX.PASSWORD.test(password),

  validateContact: (value: string) => {
    if (!value) return "Vui lòng nhập Email hoặc Số điện thoại";
    if (!REGEX.EMAIL.test(value) && !REGEX.PHONE.test(value)) {
      return "Định dạng không hợp lệ";
    }
    return "";
  },
};
