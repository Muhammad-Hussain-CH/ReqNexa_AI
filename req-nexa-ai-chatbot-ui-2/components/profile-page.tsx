"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, Mail, Phone, MapPin, Calendar, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ProfilePageProps {
  onLogout?: () => void
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api"

  // Mock user data - replace with real data from your backend
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    role: "Premium User",
    avatar: "SJ",
    subscription: "Pro Plan",
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleLogout = () => {
    onLogout?.()
  }

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-blue-950/10 p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Login Card */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border border-border/50 bg-gradient-to-br from-blue-950/10 via-background to-blue-900/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-bold text-foreground">Login</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button
                onClick={async () => {
                  setAuthMessage(null)
                  setAuthLoading(true)
                  try {
                    const res = await fetch(`${API_BASE}/auth/login`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, password }),
                    })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data?.error || `Login failed (${res.status})`)
                    if (typeof window !== "undefined") {
                      localStorage.setItem("reqnexa_token", data.tokens?.accessToken || "")
                      localStorage.setItem("reqnexa_refresh", data.tokens?.refreshToken || "")
                    }
                    setAuthMessage("Login successful. You can now use the chat.")
                  } catch (err: any) {
                    setAuthMessage(err?.message || "Login error")
                  } finally {
                    setAuthLoading(false)
                  }
                }}
                disabled={!email || !password || authLoading}
              >
                {authLoading ? "Logging in…" : "Login"}
              </Button>
              {authMessage && <p className="text-sm text-muted-foreground">{authMessage}</p>}
            </div>
          </Card>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="mt-2 text-muted-foreground">Manage your profile and preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-8 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <Avatar className="h-24 w-24 border-2 border-blue-500">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} />
                <AvatarFallback className="bg-blue-500 text-2xl font-bold text-white">{userData.avatar}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground">{userData.name}</h2>
                <p className="mt-1 text-sm font-semibold text-blue-400">{userData.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{userData.subscription}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6 backdrop-blur-sm">
            <h3 className="mb-6 text-lg font-bold text-foreground">Contact Information</h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{userData.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(userData.email, "email")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copied === "email" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{userData.phone}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(userData.phone, "phone")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copied === "phone" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <MapPin className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{userData.location}</p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-medium text-foreground">{userData.joinDate}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Account Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6 backdrop-blur-sm">
            <h3 className="mb-6 text-lg font-bold text-foreground">Preferences</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates and notifications via email</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div>
                  <p className="font-medium text-foreground">Marketing Emails</p>
                  <p className="text-xs text-muted-foreground">Get news and updates about ReqNexa AI</p>
                </div>
                <input type="checkbox" defaultChecked={false} className="h-4 w-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                </div>
                <input type="checkbox" defaultChecked={false} className="h-4 w-4 cursor-pointer" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border border-red-500/30 bg-gradient-to-br from-red-950/20 via-background to-red-900/10 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Logout</h3>
                <p className="mt-1 text-xs text-muted-foreground">Sign out from your account on this device</p>
              </div>

              {!showLogoutConfirm ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Confirm Logout
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
