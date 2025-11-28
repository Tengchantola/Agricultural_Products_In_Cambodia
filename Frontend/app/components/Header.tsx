"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import marketImage from "../../public/assets/Agricultural_Market_Price.png";

import {
  Store,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  Users,
  LayoutDashboard,
  Tag,
  X,
  Menu,
  LogOut,
} from "lucide-react";

import { ProfileUser } from "../types/auth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<ProfileUser | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  const links = [
    { href: "/", label: "ទំព័រដើម", icon: LayoutDashboard },
    { href: "/prices", label: "តម្លៃផលិតផល", icon: Tag },
    { href: "/markets", label: "ទីផ្សារ", icon: Store },
    { href: "/about", label: "អំពីពួកយើង", icon: Users },
  ];

  return (
    <header className="bg-green-700 text-white shadow-lg sticky top-0 z-40 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <Image
              src={marketImage}
              width={50}
              height={50}
              alt="Agricultural Market Logo"
              className="rounded-4xl"
            />
            <div>
              <h1 className="text-xl font-bold">ផលិតផលកសិកម្មនៅកម្ពុជា</h1>
              <p className="text-green-100 text-sm hidden sm:block dark:text-green-200">
                Agricultural products in Cambodia
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
              relative flex items-center text-lg px-6 py-2 rounded-xl transition-all duration-500
              group border-2
              ${
                isActive
                  ? "border-white text-white bg-white/10 shadow-lg"
                  : "border-transparent text-green-100 hover:border-white/50 hover:text-white hover:bg-white/5"
              }
            `}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-white/5 animate-pulse" />
                  )}

                  <Icon
                    className={`mr-2 w-5 mb-1 h-5 transition-all duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />

                  <span className="font-semibold relative z-10">
                    {link.label}
                  </span>

                  {isActive && (
                    <>
                      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-white rounded-tl" />
                      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-white rounded-tr" />
                      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-white rounded-bl" />
                      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-white rounded-br" />
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-700 rounded-lg hover:bg-green-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  <User className="w-5 h-5 mb-1" />
                  <span>{user.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/profiles"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-green-50 dark:text-white dark:hover:bg-gray-600"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      ទម្រង់គណនី
                    </Link>

                    <hr className="my-2 dark:border-gray-600" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full px-4 py-2 text-left text-red-600 hover:bg-green-50 dark:text-white dark:hover:bg-gray-600"
                    >
                      <LogOut className="mr-2 w-4 h-4 mt-1" />
                      ចាកចេញ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>ចូលគណនី</span>
                </Link>

                <Link
                  href="/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>ចុះឈ្មោះ</span>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md cursor-pointer dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-600 dark:border-gray-600">
            <nav className="flex flex-col space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex py-2 px-4 rounded-lg transition-colors duration-300 ${
                      isActive ? "bg-green-600" : "hover:bg-green-600"
                    }`}
                  >
                    <Icon className="mr-2 w-5 h-5 mb-1" />
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <div className="space-y-2 pt-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2 hover:bg-green-600 rounded-lg"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    {user.username}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full justify-center px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
                  >
                    <LogOut className="mr-2 w-4 h-4 mt-1" />
                    ចាកចេញ
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
                  >
                    ចូលគណនី
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    ចុះឈ្មោះ
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
