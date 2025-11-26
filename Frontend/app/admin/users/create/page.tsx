"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Alert from "@/app/components/Alert";

interface UserFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  confirm_password: string;
  is_active: boolean;
}

export default function CreateUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    is_active: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (formData.password !== formData.confirm_password) {
      setError("ពាក្យសម្ងាត់មិនត្រូវគ្នា");
      setSaving(false);
      return;
    }
    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        password: formData.password,
        is_active: formData.is_active,
      };
      const res = await fetch("http://127.0.0.1:8000/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create user");
      }
      setSuccess("បានបង្កើតអ្នកប្រើប្រាស់ដោយជោគជ័យ!");
      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("មិនអាចបង្កើតអ្នកប្រើប្រាស់បាន");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center mb-6">
        <button
          title="btnBack"
          onClick={() => router.push("/admin/users")}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            បន្ថែមអ្នកប្រើប្រាស់ថ្មី
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            បង្កើតអ្នកប្រើប្រាស់ថ្មីក្នុងប្រព័ន្ធ
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-khmer-heading">
                ព័ត៌មានផ្ទាល់ខ្លួន
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    នាម <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                      placeholder="បញ្ចូលនាម"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    អុីមែល <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                      placeholder="បញ្ចូលអុីមែល"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    នាមត្រកូល <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                    placeholder="បញ្ចូលនាមត្រកូល"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    នាមខ្លួន <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                    placeholder="បញ្ចូលនាមខ្លួន"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    លេខទូរស័ព្ទ
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                      placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    ស្ថានភាព
                  </label>
                  <select
                    title="selectActive"
                    name="is_active"
                    value={formData.is_active.toString()}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                  >
                    <option value="true">សកម្ម</option>
                    <option value="false">អសកម្ម</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-khmer-heading">
                ពាក្យសម្ងាត់
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    ពាក្យសម្ងាត់ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                      placeholder="បញ្ចូលពាក្យសម្ងាត់"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                    បញ្ជាក់ពាក្យសម្ងាត់ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                      placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center font-khmer-content"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    កំពុងបង្កើត...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    បង្កើតអ្នកប្រើប្រាស់
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/users")}
                className="bg-gray-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-khmer-content"
              >
                បោះបង់
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
