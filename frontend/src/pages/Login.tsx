import { useEffect, useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Login() {
  const { login, isLoading, checkAuth, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (isAuthenticated) location.assign("/dashboard"); }, [isAuthenticated]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Email and password are required"); return; }
    try {
      await login(email, password);
      if (!remember) sessionStorage.setItem("accessToken", localStorage.getItem("accessToken") || "");
    } catch {
      toast.error("Invalid credentials");
      setError("Invalid email or password");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <form className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>
        <div className="text-center text-gray-600 dark:text-gray-300">Sign in to ReqNexa</div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
          <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Password</label>
          <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 dark:text-gray-300"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
          <a className="text-primary" href="#">Forgot password?</a>
        </div>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>
        <div className="text-center text-sm dark:text-gray-300">Don't have an account? <Link to="/register" className="text-primary">Register</Link></div>
      </form>
    </div>
  );
}
