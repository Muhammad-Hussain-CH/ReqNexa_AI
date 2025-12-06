import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
