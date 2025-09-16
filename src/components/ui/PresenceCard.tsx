// src/components/PresenceCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { useState } from "react"
import axiosInstance from "@/api/axiosInstance"

interface PresenceCardProps {
  presence?: {
    id: number
    employe: {
      nom: string
      user: {
        username: string
        id?: number
      }
    }
    date: string
    heure_arrivee: string | null
    heure_sortie: string | null
    statut: string
  }
  onPresenceUpdate: () => void
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

  // 🔒 Protection : si pas de présence, afficher un message d'erreur visuel
  if (!presence) {
    return (
      <Card className="border border-dashed border-red-300 bg-red-50">
        <CardContent className="p-4 text-center text-red-700">
          Données indisponibles
        </CardContent>
      </Card>
    )
  }

  const isStaff = userRole === "staff"
  const isAdmin = userRole === "admin"
  const isManager = userRole === "manager"
  const isRH = userRole === "rh"
  
  const today = new Date().toDateString()
  const presenceDate = new Date(presence.date).toDateString()
  const isToday = presenceDate === today
  const isOwnPresence = currentUserId === presence.employe?.user?.id

  const showMessage = (message: string, isSuccess: boolean = true) => {
    console.log(isSuccess ? "✅" : "❌", message)
    alert(message)
  }

  const handleArrivee = async () => {
    setLoading(true)
    try {
      let response
      
      if (isStaff && isOwnPresence && isToday) {
        response = await axiosInstance.post("/ma-presence/arrivee/")
      } else if (isAdmin || isManager || isRH) {
        response = await axiosInstance.post(`/presences/${presence.id}/arrivee/`)
      } else {
        showMessage("Vous n'avez pas l'autorisation d'effectuer cette action.", false)
        return
      }

      if (response.data.success) {
        showMessage(response.data.message)
        onPresenceUpdate()
      } else {
        showMessage(response.data.message, false)
      }
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de l'arrivée:", error)
      const message = error.response?.data?.message 
                    || error.response?.data?.detail 
                    || "Erreur lors de l'enregistrement de l'arrivée"
      showMessage(message, false)
    } finally {
      setLoading(false)
    }
  }

  const handleSortie = async () => {
    setLoading(true)
    try {
      let response
      
      if (isStaff && isOwnPresence && isToday) {
        response = await axiosInstance.post("/ma-presence/sortie/")
      } else if (isAdmin || isManager || isRH) {
        response = await axiosInstance.post(`/presences/${presence.id}/sortie/`)
      } else {
        showMessage("Vous n'avez pas l'autorisation d'effectuer cette action.", false)
        return
      }

      if (response.data.success) {
        showMessage(response.data.message)
        onPresenceUpdate()
      } else {
        showMessage(response.data.message, false)
      }
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la sortie:", error)
      const message = error.response?.data?.message 
                    || error.response?.data?.detail 
                    || "Erreur lors de l'enregistrement de la sortie"
      showMessage(message, false)
    } finally {
      setLoading(false)
    }
  }

  const canShowButtons = () => {
    if (isAdmin || isManager || isRH) return true
    if (isStaff && isToday && isOwnPresence) return true
    return false
  }

  const formatHeure = (heure: string | null) => {
    if (!heure) return "–"
    return heure.length > 5 ? heure.substring(0, 5) : heure
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold">{presence.employe?.nom || "Inconnu"}</span>
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
        
        <div className="flex items-center text-sm">
          <ClockIcon className="mr-2 h-4 w-4 text-green-500" />
          <span className="font-medium">Arrivée:</span> {formatHeure(presence.heure_arrivee)}
        </div>
        
        <div className="flex items-center text-sm">
          <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
          <span className="font-medium">Sortie:</span> {formatHeure(presence.heure_sortie)}
        </div>

        {canShowButtons() && (
          <div className="flex space-x-2 pt-2">
            {!presence.heure_arrivee && (
              <Button
                size="sm"
                onClick={handleArrivee}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
              >
                <ClockIcon className="mr-1 h-4 w-4" />
                {loading ? "Pointage..." : "Arrivée"}
              </Button>
            )}
            
            {presence.heure_arrivee && !presence.heure_sortie && (
              <Button
                size="sm"
                onClick={handleSortie}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              >
                <ClockIcon className="mr-1 h-4 w-4" />
                {loading ? "Pointage..." : "Sortie"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}