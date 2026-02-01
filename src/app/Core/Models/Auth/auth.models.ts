export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  requiresPasswordChange: boolean;
  token: {
    token: string;
    roleName: string;
    permissions: string[];
  };
  isVerified: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phoneNumber: string;
}

export interface BasicInfoRequest {
  bankBalance: number;
  monthlyCashBalance: number;
  netWealth: number;
  totalObligationsAmount: number;
}

export interface OTPVerifyRequest {
  code: string;
}
