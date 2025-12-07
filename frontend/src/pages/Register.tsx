import { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { register as apiRegister } from "../services/auth.service";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import logoPng from "../../logo/logo.png";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const s = strength(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) { setError("All fields are required"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (!terms) { setError("You must accept the terms"); return; }
    try {
      await apiRegister({ email, password, name });
      toast.success("Registered successfully");
      location.assign("/login");
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Registration failed";
      toast.error(msg);
      setError(msg);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <form className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow" onSubmit={onSubmit}>
        <div className="w-full flex justify-center">
          <picture>
            <source srcSet={logoPng} type="image/png" />
            <img src="/reqnexa-logo.svg" alt="ReqNexa AI" className="w-12 h-12" />
          </picture>
        </div>
        <h1 className="text-2xl font-semibold text-center">Create your account</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Name</label>
          <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
          <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Password</label>
          <div className="text-xs text-gray-500 dark:text-gray-400">Use at least 6 characters. Adding uppercase, lowercase, numbers, and symbols increases strength.</div>
          <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded">
            <div className={`h-2 rounded ${s<=2?"bg-red-500":s===3?"bg-yellow-500":"bg-green-500"}`} style={{ width: `${(s/5)*100}%` }} />
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Strength: {Math.round((s/5)*100)}%</div>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Confirm password</label>
          <Input placeholder="••••••••" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm dark:text-gray-300"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /> I agree to the terms</label>
        <Button type="submit">Create Account</Button>
        <div className="text-center text-sm dark:text-gray-300">Already have an account? <Link to="/login" className="text-primary">Login</Link></div>
      </form>
    </div>
  );
}
