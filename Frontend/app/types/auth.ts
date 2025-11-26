export interface LoginFormData {
  username: string;
  password: string;
}

export interface ProfileUser {
  username: string;
  email: string;
}

export interface RegisterFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  password2: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  username: string;
  email: string;
  id: number;
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}
