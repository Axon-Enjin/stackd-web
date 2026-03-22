"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { User, Lock, Save, AlertCircle, CheckCircle2, ChevronLeft, UserCircle, ShieldCheck, Fingerprint, Loader2 } from "lucide-react";

type ViewMode = "details" | "change-username" | "change-password";

export default function ProfilePage() {
  const { user, login, loading } = useUserStore();
  const [mode, setMode] = useState<ViewMode>("details");

  // Username state
  const [newUsername, setNewUsername] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");

  // Update newUsername when user loads
  useEffect(() => {
    if (user?.username) {
      setNewUsername(user.username);
    }
  }, [user]);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetStates = () => {
    setError("");
    setSuccess("");
    setUsernamePassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleBack = () => {
    setMode("details");
    resetStates();
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/custom-auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-username",
          username: user?.username,
          password: usernamePassword,
          newUsername,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update username");

      // data should contain { id, username }
      login(data);
      setSuccess("Username updated successfully!");
      setUsernamePassword("");
      setTimeout(() => setMode("details"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/custom-auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          username: user?.username,
          password: currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setMode("details"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2">
        <AlertCircle className="text-red-500" size={32} />
        <p className="text-gray-600">Failed to load user profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {mode !== "details" && (
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors dark:hover:bg-zinc-800"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === "details" ? "Account Settings" : mode === "change-username" ? "Change Username" : "Change Password"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === "details" ? "Manage your profile and security." : "Please provide the details below to update your account."}
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 rounded border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded border border-green-100 bg-green-50 p-3 text-sm text-green-600 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Main Card */}
      <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {mode === "details" && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 rounded bg-gray-50 dark:bg-zinc-800/50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#2F80ED] to-[#2FB7A8] shadow-inner text-white shrink-0">
                <User size={40} />
              </div>
              <div className="space-y-3 min-w-0 flex-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Username / Name</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user?.username}</h3>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Account ID</p>
                  <div className="flex items-center gap-2">
                    <Fingerprint size={14} className="text-gray-400" />
                    <p className="text-xs text-gray-500 font-mono truncate">{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              <button
                onClick={() => {
                  setNewUsername(user?.username || "");
                  setMode("change-username");
                }}
                className="flex items-center justify-center gap-2 rounded border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <UserCircle size={18} />
                Change Username
              </button>
              <button
                onClick={() => setMode("change-password")}
                className="flex items-center justify-center gap-2 rounded border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <ShieldCheck size={18} />
                Change Password
              </button>
            </div>
          </div>
        )}

        {mode === "change-username" && (
          <form onSubmit={handleUpdateUsername} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password to Confirm
              </label>
              <input
                type="password"
                value={usernamePassword}
                onChange={(e) => setUsernamePassword(e.target.value)}
                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 rounded bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <Save size={16} />
                {isLoading ? "Saving..." : "Save New Username"}
              </button>
            </div>
          </form>
        )}

        {mode === "change-password" && (
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="pt-4 border-t border-gray-50 dark:border-zinc-800">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 rounded bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <Save size={16} />
                {isLoading ? "Saving..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
