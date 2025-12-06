import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/auth.store";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  useEffect(() => { checkAuth(); }, [checkAuth]);
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
