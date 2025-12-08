import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuthStore } from "../stores/auth.store";
import { useThemeStore } from "../stores/theme.store";

export default function Settings() {
  const { user } = useAuthStore();
  const { mode, set: setMode, toggle } = useThemeStore();
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-background via-background to-blue-950/10 p-2 md:p-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your preferences and appearance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
            <div className="font-semibold">Appearance</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Current theme: {mode}</div>
            <div className="mt-3 flex items-center gap-2">
              <button className="px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={toggle}>Toggle Theme</button>
              <button className="px-3 py-1.5 rounded border dark:border-gray-700" onClick={() => setMode("light")}>Light</button>
              <button className="px-3 py-1.5 rounded border dark:border-gray-700" onClick={() => setMode("dark")}>Dark</button>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
            <div className="font-semibold">Account</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Name: {user?.name || "User"}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Email: {user?.email || "user@example.com"}</div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Profile editing is not yet implemented.</div>
          </div>
        </div>
        <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
          <div className="font-semibold">Preferences</div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Feature toggles can be added here.</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
