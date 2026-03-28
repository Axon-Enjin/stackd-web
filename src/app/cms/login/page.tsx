"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useUserStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/custom-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user) {
        login(data.user, data.token);
        router.push("/cms");
        router.refresh();
      } else {
        throw new Error("Failed to retrieve user data from login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-sm border border-gray-100 bg-white shadow-xl">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded bg-black text-xl font-bold text-white shadow-md">
              A
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to manage application content
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all outline-none focus:ring-2 focus:ring-black"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 ">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-8 py-4 text-center ">
          <p className="text-xs text-gray-500">
            Contact your systems administrator if you cannot access your
            account.
          </p>
        </div>
      </div>
    </div>
  );
}
