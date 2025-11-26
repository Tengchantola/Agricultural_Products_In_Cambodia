"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { menuItems } from "@/app/data/menu-Items";

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`bg-white dark:bg-gray-800 drop-shadow-xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center bg-green-700 dark:bg-gray-800 justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-white font-khmer-heading">
              ផ្នែកគ្រប់គ្រង
            </h1>
            <p className="text-sm text-white dark:text-gray-400 font-khmer-content">
              Admin Dashboard
            </p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3.5 rounded-lg cursor-pointer transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium font-khmer-content">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
