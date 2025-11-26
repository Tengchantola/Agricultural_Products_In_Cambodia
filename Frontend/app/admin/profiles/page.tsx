"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, LogOut, Edit, Shield, User2 } from "lucide-react";
import { UserProfile } from "@/app/types/user-data";
import Loading from "@/app/components/Loading";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };
    loadUser();
  }, [router]);

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="pb-26 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
              {user.first_name} {user.last_name}
            </h1>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-khmer-content">
                  ឈ្មោះអ្នកប្រើ
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.username}
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Mail className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-khmer-content">
                  អ៊ីមែល
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <User2 className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-khmer-content">
                  នាម និងគោត្តនាម
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.first_name + user.last_name || "មិនមាន"}
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/edit-profile")}
              className="w-full flex items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
            >
              <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3 group-hover:text-green-600" />
              <span className="font-khmer-content text-gray-700 dark:text-gray-200 font-medium">
                កែប្រែទម្រង់
              </span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="w-full flex items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3 group-hover:text-red-600" />
              <span className="font-khmer-content text-gray-700 dark:text-gray-200 font-medium">
                ចាកចេញ
              </span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-khmer-content">
              គណនីដែលបានចុះឈ្មោះថ្មីៗ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
