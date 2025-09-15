// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function DashboardPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      navigate("/login-form")  // Redirige vers login si non connecté
    }
  }, [navigate])

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenue, {user.username} !</h1>
      <p className="text-muted-foreground">Rôle : {user.role}</p>

      {/* Contenu personnalisé selon le rôle */}
      {user.role === "admin" && <AdminContent />}
      {user.role === "rh" && <RHContent />}
      {user.role === "manager" && <ManagerContent />}
      {user.role === "staff" && <StaffContent />}
    </div>
  )
}

function AdminContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tableau de bord Administrateur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Vous avez accès à toutes les fonctionnalités du système.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={() => window.location.href = "/dashboard/employes"}>Gérer les employés</Button>
          <Button onClick={() => window.location.href = "/dashboard/presences"}>Voir toutes les présences</Button>
          <Button onClick={() => window.location.href = "/dashboard/rapports"}>Générer des rapports</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RHContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tableau de bord RH</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Vous pouvez gérer les employés et consulter les présences.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={() => window.location.href = "/dashboard/employes"}>Gérer les employés</Button>
          <Button onClick={() => window.location.href = "/dashboard/presences"}>Voir toutes les présences</Button>
          <Button onClick={() => window.location.href = "/dashboard/rapports"}>Générer des rapports</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ManagerContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tableau de bord Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Vous pouvez consulter les présences et rapports de votre équipe.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={() => window.location.href = "/dashboard/presences"}>Voir les présences</Button>
          <Button onClick={() => window.location.href = "/dashboard/rapports"}>Générer des rapports</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StaffContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre Présence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Marquez votre arrivée/départ ci-dessous.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={() => window.location.href = "/dashboard/presences"}>Voir mes présences</Button>
          <Button onClick={() => window.location.href = "/dashboard/presences/1/arrivee/"}>Marquer mon arrivée</Button>
          <Button onClick={() => window.location.href = "/dashboard/presences/1/sortie/"}>Marquer ma sortie</Button>
        </div>
      </CardContent>
    </Card>
  )
}