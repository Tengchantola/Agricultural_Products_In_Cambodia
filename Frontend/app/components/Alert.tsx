"use client";

import { X } from "lucide-react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const bgColor =
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white";

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center justify-between p-4 rounded-lg shadow-lg ${bgColor} w-80 max-w-full z-50`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        title="btnClose"
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
