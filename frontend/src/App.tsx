import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/auth.store";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Documents from "./pages/Documents";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";

export default function App() {
  const token = useAuthStore((s) => s.token);
  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/projects"
        element={<ProtectedRoute><Projects /></ProtectedRoute>}
      />
      <Route
        path="/projects/:id"
        element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>}
      />
      <Route
        path="/admin"
        element={<ProtectedRoute><Admin /></ProtectedRoute>}
      />
      <Route
        path="/chat"
        element={<ProtectedRoute><Chat /></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><Settings /></ProtectedRoute>}
      />
      <Route
        path="/reports"
        element={<ProtectedRoute><Reports /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
