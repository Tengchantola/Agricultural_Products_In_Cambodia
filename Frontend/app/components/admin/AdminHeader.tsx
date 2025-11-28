"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Teng_Chantola from "../../../public/assets/Teng_Chantola.png";
import {
  BarChart2,
  BellDot,
  ChevronDown,
  LogOut,
  Search,
  User,
} from "lucide-react";
import { ProfileUser } from "@/app/types/auth";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<ProfileUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-green-700 dark:bg-gray-800 drop-shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="ស្វែងរក..."
              className="w-full pl-10 text-white pr-4 py-2 border border-gray-300 dark:border-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pl-4">
          <button
            aria-label="Notifications"
            className="relative cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <BellDot className="text-white w-8 h-8" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex hover:bg-green-600 items-center cursor-pointer space-x-3 p-2 rounded-lg dark:hover:bg-gray-700 transition-colors"
            >
              <Image
                src={Teng_Chantola}
                className="rounded-full"
                width={40}
                height={40}
                alt="profile"
              />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-white dark:text-white font-khmer-content">
                  {user?.username}
                </p>
                <p className="text-xs text-white dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-white" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <Link
                  href="admin/profiles"
                  className="flex flex-row px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-khmer-content"
                >
                  <User className="w-5 h-5 mr-2" />
                  ទម្រង់គណនី
                </Link>
                <Link
                  href="/admin/reports"
                  className="flex flex-row px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-khmer-content"
                >
                  <BarChart2 className="w-5 h-5 mr-2" />
                  របាយការណ៍
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex px-4 py-2 cursor-pointer flex-row text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-khmer-content"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  ចាកចេញ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
