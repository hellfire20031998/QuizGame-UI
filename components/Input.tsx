"use client";

import { Mail, Lock } from "lucide-react";

export default function Input({ icon, ...props }: any) {
  const Icon = icon === "mail" ? Mail : Lock;

  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
      <Icon className="w-5 h-5 text-gray-500" />
      <input
        {...props}
        className="outline-none w-full bg-transparent"
      />
    </div>
  );
}
