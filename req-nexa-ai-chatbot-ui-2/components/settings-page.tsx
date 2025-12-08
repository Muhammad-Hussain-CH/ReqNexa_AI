"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [settings, setSettings] = useState({
    accountName: "John Doe",
    accountEmail: "john@example.com",
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "public",
      allowAnalytics: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
    },
    theme: "dark",
  })

  const [saved, setSaved] = useState(false)

  const handleSaveSettings = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "👁️" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "theme", label: "Theme", icon: "🎨" },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Settings Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-48 flex flex-col gap-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1 overflow-y-auto"
        >
          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-6 backdrop-blur">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      value={settings.accountName}
                      onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      value={settings.accountEmail}
                      onChange={(e) => setSettings({ ...settings, accountEmail: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
                    <select className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none">
                      <option>Pro</option>
                      <option>Enterprise</option>
                      <option>Free</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-6 backdrop-blur">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                    {
                      key: "pushNotifications",
                      label: "Push Notifications",
                      desc: "Receive browser push notifications",
                    },
                    { key: "marketingEmails", label: "Marketing Emails", desc: "Receive promotional content" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              [item.key]: e.target.checked,
                            },
                          })
                        }
                        className="h-5 w-5 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-6 backdrop-blur">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Privacy Controls</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, profileVisibility: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition">
                    <div>
                      <p className="font-medium text-foreground">Allow Analytics</p>
                      <p className="text-sm text-muted-foreground">Help us improve with usage data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowAnalytics}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, allowAnalytics: e.target.checked },
                        })
                      }
                      className="h-5 w-5 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-6 backdrop-blur">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Security Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorAuth: e.target.checked },
                        })
                      }
                      className="h-5 w-5 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700">Change Password</Button>
                </div>
              </div>
            </div>
          )}

          {/* Theme Settings */}
          {activeTab === "theme" && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-6 backdrop-blur">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Appearance</h3>
                <div className="grid grid-cols-3 gap-4">
                  {["light", "dark", "auto"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSettings({ ...settings, theme })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.theme === theme
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                          : "border-border hover:border-blue-500"
                      }`}
                    >
                      <div className="capitalize font-medium text-foreground">{theme}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {theme === "light" && "Light mode"}
                        {theme === "dark" && "Dark mode"}
                        {theme === "auto" && "System preference"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <motion.div className="mt-6 flex gap-3" animate={{ opacity: 1 }}>
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            {saved && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 font-medium">
                ✓ Settings saved successfully!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
