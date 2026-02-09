"use client";

import { LogIn } from "lucide-react";

export default function OAuthButton({ provider }: any) {
  return (
    <button
      onClick={() =>
        (window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`)
      }
      className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-100"
    >
      <LogIn className="w-4 h-4" />
      Continue with {provider}
    </button>
  );
}
