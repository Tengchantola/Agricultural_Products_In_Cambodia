import {
  BarChart2,
  LayoutDashboard,
  Package,
  Settings,
  Store,
  Tag,
  Users,
} from "lucide-react";

export const menuItems = [
  {
    name: "ទំព័រដើម",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "គ្រប់គ្រងតម្លៃ",
    href: "/admin/prices",
    icon: Tag,
  },
  {
    name: "ផលិតផល",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "ទីផ្សារ",
    href: "/admin/markets",
    icon: Store,
  },
  {
    name: "អ្នកប្រើប្រាស់",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "របាយការណ៍",
    href: "/admin/reports",
    icon: BarChart2,
  },
  {
    name: "ការកំណត់",
    href: "/admin/settings",
    icon: Settings,
  },
];
