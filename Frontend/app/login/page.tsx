"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { LoginFormData } from "../types/auth";
import { loginUser } from "../lib/auth-api";
import Image from "next/image";
import logo from "../../public/assets/Agricultural_Market_Price.png";
import Alert from "../components/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginUser(formData);
      if (result.success && result.token) {
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        console.log(result.user);
        if (result.user.email === "Admin@gmail.com") {
          setSuccess("ការចូលគណនីរបស់អ្នកទទួលបានជោគជ័យ។");
          setTimeout(() => {
            router.push("/admin");
          }, 2000);
        } else {
          setSuccess("ការចូលគណនីរបស់អ្នកទទួលបានជោគជ័យ។");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } else {
        setError(result.message || "ការចូលបានបរាជ័យ");
      }
    } catch (err) {
      console.log(err);
      setError("ឈ្មោះអ្នកប្រើ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
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
            ចូលក្នុងគណនី
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
            ឬ{" "}
            <Link
              href="/register"
              className="font-medium cursor-pointer text-green-600 hover:text-green-500 transition-colors"
            >
              បង្កើតគណនីថ្មី
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
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
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content"
              >
                ឈ្មោះអ្នកប្រើ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                  placeholder="សូមបញ្ចូលឈ្មោះអ្នកប្រើ"
                />
              </div>
            </div>

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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-khmer-content"
                >
                  ចងចាំខ្ញុំ
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-green-600 hover:text-green-500 transition-colors font-khmer-content"
                >
                  ភ្លេចពាក្យសម្ងាត់?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-khmer-content"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "ចូលក្នុងគណនី"
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-khmer-content">
            ដោយបន្ត អ្នកយល់ព្រមចំពោះ{" "}
            <Link href="/terms" className="text-green-600 hover:text-green-500">
              លក្ខខណ្ឌសេវាកម្ម
            </Link>{" "}
            និង{" "}
            <Link
              href="/privacy"
              className="text-green-600 hover:text-green-500"
            >
              គោលការណ៍ភាពឯកជន
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
