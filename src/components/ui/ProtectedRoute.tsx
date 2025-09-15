
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const token = localStorage.getItem("accessToken")
  return token ? <Outlet /> : <Navigate to="/login" />
}

// si pas de token → redirige vers /login.//