import { API_ENDPOINTS } from "./api-route";
import apiService from "./api.service";

interface SendOptResponse {
  isSuccess: boolean;
  message: string;
  code: number;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
  sendMethod: string;
  otpCode: string;
}

const checkPhoneEmail = async (body: {
  phone: string;
  email: string;
  duprId: string;
}) => {
  try {
    const res = await apiService.post<any>(
      API_ENDPOINTS.CUSTOMER.CHECK_PHONE_EMAIL,
      body
    );

    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

const sendOtpCustomer = async (body: {
  sendMethod: string;
  phone: string;
  email: string;
}): Promise<SendOptResponse | undefined> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.CUSTOMER.SEND_OTP,
      body
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};

const sendOtpVerifyCustomer = async (body: {
  sendMethod: string;
  phone: string;
  email: string;
}): Promise<SendOptResponse | undefined> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.CUSTOMER.SEND_OTP_VERIFY,
      body
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};

const forgotPassword = async (body: {
  sendMethod: string;
  customerId: string;
  otpCode: string;
  password: string;
  confirmPassword: string;
}): Promise<SendOptResponse | undefined> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.CUSTOMER.FORGOT_PASSWORD,
      body
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};

const registerCustomer = async (body: RegisterRequest): Promise<any> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.CUSTOMER.REGISTER,
      body
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};

const verifyLoginOtp = async (body: {
  sendMethod: string;
  phone: string;
  email: string;
  otpCode: string;
}): Promise<any> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.CUSTOMER.VERIFY_OTP,
      body
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};
const loginWithGoogle = async (token: string): Promise<any> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.LOGIN_WITH_GOOGLE,
      { idToken: token },
      {
        showToastOnError: true,
      } as any
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};
const loginWithFacebook = async (accessToken: string): Promise<any> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.LOGIN_WITH_FACEBOOK,
      { accessToken },
      {
        showToastOnError: true,
      } as any
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};

const loginWithZalo = async (code: string): Promise<any> => {
  try {
    const res: any = await apiService.post<any>(
      API_ENDPOINTS.LOGIN_WITH_ZALO,
      { code: code },
      {
        showToastOnError: true,
      } as any
    );
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};

const loginNormal = async (body: {
  username: string;
  password: string;
}): Promise<any> => {
  try {
    const res: any = await apiService.post<any>(API_ENDPOINTS.LOGIN, body, {
      showToastOnError: true,
    } as any);
    return res;
  } catch (error) {
    if (error) {
      throw error;
    }
    return undefined;
  }
};

const getMe = async (): Promise<any> => {
  try {
    const res: any = await apiService.post<any>(API_ENDPOINTS.GET_ME);
    return res;
  } catch (error: any) {
    console.error("GetMe error:", error);
    return undefined;
  }
};

export {
  checkPhoneEmail,
  forgotPassword,
  getMe,
  loginNormal,
  loginWithFacebook,
  loginWithGoogle,
  loginWithZalo,
  registerCustomer,
  sendOtpCustomer,
  sendOtpVerifyCustomer,
  verifyLoginOtp,
};
