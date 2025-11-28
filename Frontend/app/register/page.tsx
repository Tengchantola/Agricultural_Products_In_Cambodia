"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { AuthResponse, RegisterFormData } from "../types/auth";
import { registerUser } from "../lib/auth-api";
import Image from "next/image";
import logo from "../../public/assets/Agricultural_Market_Price.png";
import Alert from "../components/Alert";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.password2) {
      setError("ពាក្យសម្ងាត់មិនត្រូវគ្នា");
      return false;
    }
    if (formData.password.length < 6) {
      setError("ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៦ តួអក្សរ");
      return false;
    }
    if (!formData.agreeToTerms) {
      setError("សូមយល់ព្រមជាមួយនឹងលក្ខខណ្ឌសេវាកម្ម");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const result: AuthResponse = await registerUser(formData);
      if (result && result.username) {
        setSuccess("ការចុះឈ្មោះបានជោគជ័យ! ចូលក្នុងគណនីរបស់អ្នក។");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError("ការចុះឈ្មោះបានបរាជ័យ");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("អ៊ីមែលនេះមានរួចហើយ ឬមានបញ្ហាកើតឡើង");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex cursor-pointer items-center">
            <Image
              src={logo}
              width={70}
              height={70}
              alt="logo"
              className="rounded-full"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            បង្កើតគណនីថ្មី
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
            ឬ{" "}
            <Link
              href="/login"
              className="font-medium cursor-pointer text-green-600 hover:text-green-500 transition-colors"
            >
              ចូលក្នុងគណនីរបស់អ្នក
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 space-y-6">
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            )}

            {success && (
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            )}

            <div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content"
                >
                  ឈ្មោះគណនី
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                    placeholder="ឈ្មោះគណនី"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content"
              >
                អាសយដ្ឋានអ៊ីមែល
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                  placeholder="yourname@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content"
              >
                ពាក្យសម្ងាត់
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                  placeholder="យ៉ាងហោចណាស់ ៦ តួអក្សរ"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content"
              >
                បញ្ជាក់ពាក្យសម្ងាត់
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password2}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                  placeholder="វាយពាក្យសម្ងាត់ម្តងទៀត"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-khmer-content"
              >
                ខ្ញុំយល់ព្រមជាមួយនឹង{" "}
                <Link
                  href="/terms"
                  className="text-green-600 hover:text-green-500"
                >
                  លក្ខខណ្ឌសេវាកម្ម
                </Link>{" "}
                និង{" "}
                <Link
                  href="/privacy"
                  className="text-green-600 hover:text-green-500"
                >
                  គោលការណ៍ភាពឯកជន
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-khmer-content"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "បង្កើតគណនី"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-khmer-content">
            ដោយបង្កើតគណនី អ្នកយល់ព្រមចំពោះលក្ខខណ្ឌសេវាកម្ម
            និងគោលការណ៍ភាពឯកជនរបស់យើង
          </p>
        </div>
      </div>
    </div>
  );
}
