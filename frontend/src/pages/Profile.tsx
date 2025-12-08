import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuthStore } from "../stores/auth.store";
import { LogOut, Mail, Phone, MapPin, Calendar, Copy, Check } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  function copy(text: string, field: string) {
    try {
      navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your profile and preferences</p>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-primary text-white grid place-items-center text-2xl font-bold">
              {user?.name?.slice(0, 2).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
              <p className="mt-1 text-sm text-primary">{user?.role || "Member"}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
          <h3 className="mb-6 text-lg font-bold">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium">{user?.email || "user@example.com"}</p>
                </div>
              </div>
              <button className="text-sm text-gray-600 dark:text-gray-300" onClick={() => copy(user?.email || "", "email")}>{copied === "email" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <button className="text-sm text-gray-600 dark:text-gray-300" onClick={() => copy("+1 (555) 123-4567", "phone")}>{copied === "phone" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium">San Francisco, CA</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium">January 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-red-500/30 rounded-lg p-6 bg-red-900/10 dark:bg-red-900/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Logout</h3>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Sign out from your account on this device</p>
            </div>
            {!confirm ? (
              <button className="px-3 py-2 rounded bg-red-600 text-white flex items-center gap-2" onClick={() => setConfirm(true)}>
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded border" onClick={() => setConfirm(false)}>Cancel</button>
                <button className="px-3 py-2 rounded bg-red-600 text-white flex items-center gap-2" onClick={logout}>
                  <LogOut className="h-4 w-4" /> Confirm Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
