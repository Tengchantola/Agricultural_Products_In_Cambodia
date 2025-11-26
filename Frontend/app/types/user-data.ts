export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active?: boolean;
  date_joined?: string;
  picture: string;
}

export interface UserFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  password?: string;
  confirm_password?: string;
}

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}
