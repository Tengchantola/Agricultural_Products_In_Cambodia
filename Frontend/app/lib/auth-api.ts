import { AuthResponse, RegisterFormData } from "../types/auth";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const res = await axios.post("http://localhost:8000/api/login/", formData);
    const token = res.data.access;
    console.log(token);
    const userRes = await axios.get("http://localhost:8000/api/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, token, user: userRes.data };
  } catch (err: unknown) {
    let message = "Login failed";
    if (axios.isAxiosError(err) && err.response) {
      message = err.response.data?.detail || message;
    }
    return { success: false, message };
  }
};

export async function registerUser(
  userData: RegisterFormData
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Registration failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
}
