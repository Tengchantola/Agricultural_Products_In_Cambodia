"use client";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileUser } from "../types/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/");
      return;
    }
    const parsedUser: ProfileUser = JSON.parse(storedUser);
    setUser(parsedUser);
    if (parsedUser.email !== "Admin@gmail.com") {
      router.replace("/");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}
