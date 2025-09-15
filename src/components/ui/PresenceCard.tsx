// src/components/PresenceCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { useState } from "react"
import axiosInstance from "@/api/axiosInstance"

interface PresenceCardProps {
  presence: {
    id: number
    employe: {
      nom: string
      user: {
        username: string
      }
    }
    date: string
    heure_arrivee: string | null
    heure_sortie: string | null
    statut: string
  }
  onPresenceUpdate: () => void // Callback pour rafraîchir les données
  userRole: string
  currentUserId?: number
}

export function PresenceCard({ 
  presence, 
  onPresenceUpdate, 
  userRole, 
  currentUserId 
}: PresenceCardProps) {
  const [loading, setLoading] = useState(false)
  const isStaff = userRole === "staff"
  const isToday = new Date(presence.date).toDateString() === new Date().toDateString()
  const isOwnPresence = currentUserId === presence.employe.user.id

  const handleArrivee = async () => {
    setLoading(true)
    try {
      if (isStaff && isOwnPresence) {
        // Utiliser l'endpoint pour l'employé lui-même
        await axiosInstance.post("/ma-presence/arrivee/")
      } else {
        // Utiliser l'endpoint pour les managers/admin
        await axiosInstance.post(`/presences/${presence.id}/arrivee/`)
      }
      onPresenceUpdate() // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'arrivée:", error)
      alert("Erreur lors de l'enregistrement de l'arrivée")
    } finally {
      setLoading(false)
    }
  }

  const handleSortie = async () => {
    setLoading(true)
    try {
      if (isStaff && isOwnPresence) {
        // Utiliser l'endpoint pour l'employé lui-même
        await axiosInstance.post("/ma-presence/sortie/")
      } else {
        // Utiliser l'endpoint pour les managers/admin
        await axiosInstance.post(`/presences/${presence.id}/sortie/`)
      }
      onPresenceUpdate() // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la sortie:", error)
      alert("Erreur lors de l'enregistrement de la sortie")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold">{presence.employe.nom}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            presence.statut === "arrive" ? "bg-green-100 text-green-800" :
            presence.statut === "parti" ? "bg-blue-100 text-blue-800" :
            "bg-red-100 text-red-800"
          }`}>
            {presence.statut === "arrive" ? "Arrivé" :
             presence.statut === "parti" ? "Parti" : "Absent"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {new Date(presence.date).toLocaleDateString('fr-FR')}
        </div>
        {presence.heure_arrivee && (
          <div className="flex items-center text-sm">
            <ClockIcon className="mr-2 h-4 w-4 text-green-500" />
            <span className="font-medium">Arrivée:</span> {presence.heure_arrivee}
          </div>
        )}
        {presence.heure_sortie && (
          <div className="flex items-center text-sm">
            <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
            <span className="font-medium">Sortie:</span> {presence.heure_sortie}
          </div>
        )}
        {(userRole === "admin" || userRole === "manager" || userRole === "rh" || (isStaff && isToday && isOwnPresence)) && (
          <div className="flex space-x-2 pt-2">
            {!presence.heure_arrivee && (
              <Button
                size="sm"
                onClick={handleArrivee}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <ClockIcon className="mr-1 h-4 w-4" />
                {loading ? "..." : "Arrivée"}
              </Button>
            )}
            {presence.heure_arrivee && !presence.heure_sortie && (
              <Button
                size="sm"
                onClick={handleSortie}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <ClockIcon className="mr-1 h-4 w-4" />
                {loading ? "..." : "Sortie"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}