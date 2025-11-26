"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function HeaderFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeaderFooterExact = [
    "/login",
    "/register",
    "/admin",
    "/admin/prices",
    "/admin/products",
    "/admin/markets",
    "/admin/users",
    "/admin/users/create",
    "/admin/reports",
    "/admin/settings",
    "/admin/profiles",
  ];

  const hideHeaderFooter =
    hideHeaderFooterExact.includes(pathname) ||
    pathname.startsWith("/admin/users/edit/");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
