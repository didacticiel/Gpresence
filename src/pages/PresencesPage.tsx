// src/pages/PresencesPage.tsx
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axiosInstance from "@/api/axiosInstance"
import { StatCard } from "@/components/ui/StatCard"  
import { PresenceCard } from "@/components/ui/PresenceCard"  
import {
  RefreshCwIcon,
  PlusIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  SearchIcon,
  FilterIcon
} from "lucide-react"

export default function PresencesPage() {
  const [presences, setPresences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [myPresence, setMyPresence] = useState<any>(null) // Pour la présence de l'utilisateur connecté
  const [stats, setStats] = useState({
    total: 0,
    arrived: 0,
    left: 0,
    absent: 0
  })
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    statut: "all",
    search: ""
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      
      // Si c'est un staff, charger sa présence du jour
      if (userData.role === "staff") {
        loadMyPresence()
      }
    }
    fetchPresences()
  }, [])

  // Recharger les données quand les filtres changent
  useEffect(() => {
    fetchPresences()
  }, [filters])

  const fetchPresences = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.date) params.append('date', filters.date)
      if (filters.statut !== "all") params.append('statut', filters.statut)
      if (filters.search) params.append('search', filters.search)

      const response = await axiosInstance.get(`/presences/?${params.toString()}`)
      setPresences(response.data)
      
      // Calculer les stats
      const total = response.data.length
      const arrived = response.data.filter((p: any) => p.statut === "arrive").length
      const left = response.data.filter((p: any) => p.statut === "parti").length
      const absent = response.data.filter((p: any) => p.statut === "absent").length
      
      setStats({ total, arrived, left, absent })
    } catch (error) {
      console.error("Erreur lors de la récupération des présences:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMyPresence = async () => {
    try {
      const response = await axiosInstance.get("/ma-presence/")
      if (response.data.success && response.data.presence) {
        setMyPresence(response.data.presence)
      } else {
        setMyPresence(null)
      }
    } catch (error) {
      console.error("Erreur lors du chargement de ma présence:", error)
      setMyPresence(null)
    }
  }

  const handleCreateMyPresence = async () => {
    try {
      const response = await axiosInstance.post("/ma-presence/")
      if (response.data.success) {
        alert(response.data.message)
        setMyPresence(response.data.presence)
        fetchPresences() // Recharger la liste
      } else {
        alert(response.data.message)
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de la présence:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Erreur lors de la création de la présence")
      }
    }
  }

  const handleMyArrivee = async () => {
    try {
      const response = await axiosInstance.post("/ma-presence/arrivee/")
      if (response.data.success) {
        alert(response.data.message)
        setMyPresence(response.data.presence)
        fetchPresences() // Recharger la liste
      } else {
        alert(response.data.message)
      }
    } catch (error: any) {
      console.error("Erreur lors du pointage arrivée:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Erreur lors du pointage de l'arrivée")
      }
    }
  }

  const handleMySortie = async () => {
    try {
      const response = await axiosInstance.post("/ma-presence/sortie/")
      if (response.data.success) {
        alert(response.data.message)
        setMyPresence(response.data.presence)
        fetchPresences() // Recharger la liste
      } else {
        alert(response.data.message)
      }
    } catch (error: any) {
      console.error("Erreur lors du pointage sortie:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Erreur lors du pointage de la sortie")
      }
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePresenceUpdate = () => {
    fetchPresences()
    if (user?.role === "staff") {
      loadMyPresence()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Présences</h1>
        <Button onClick={fetchPresences} variant="outline">
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Rafraîchir
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs">Date</Label>
              <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut" className="text-xs">Statut</Label>
              <Select value={filters.statut} onValueChange={(value) => handleFilterChange('statut', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="arrive">Arrivés</SelectItem>
                  <SelectItem value="parti">Partis</SelectItem>
                  <SelectItem value="absent">Absents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="search" className="text-xs">Rechercher un employé</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom ou username..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total présences"
          value={stats.total}
          icon={UsersIcon}
          description="Aujourd'hui"
        />
        <StatCard
          title="Arrivés"
          value={stats.arrived}
          icon={CheckCircleIcon}
          description="Présents"
        />
        <StatCard
          title="Partis"
          value={stats.left}
          icon={ClockIcon}
          description="Déjà sortis"
        />
        <StatCard
          title="Absents"
          value={stats.absent}
          icon={XCircleIcon}
          description="Non présents"
        />
      </div>

      {/* Section employé - Mon pointage */}
      {user?.role === "staff" && (
        <Card>
          <CardHeader>
            <CardTitle>Mon pointage aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Affichage de ma présence si elle existe */}
            {myPresence && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Ma présence du {new Date().toLocaleDateString('fr-FR')}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    myPresence.statut === "arrive" ? "bg-green-100 text-green-800" :
                    myPresence.statut === "parti" ? "bg-blue-100 text-blue-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {myPresence.statut === "arrive" ? "Arrivé" :
                     myPresence.statut === "parti" ? "Parti" : "Absent"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Arrivée:</span> 
                    <span className="ml-1">{myPresence.heure_arrivee || "Non pointée"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Sortie:</span>
                    <span className="ml-1">{myPresence.heure_sortie || "Non pointée"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {!myPresence && (
                <Button 
                  onClick={handleCreateMyPresence} 
                  className="bg-primary hover:bg-primary/90"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Créer ma présence
                </Button>
              )}
              
              {(!myPresence || !myPresence.heure_arrivee) && (
                <Button
                  onClick={handleMyArrivee}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  Pointer mon arrivée
                </Button>
              )}
              
              {myPresence && myPresence.heure_arrivee && !myPresence.heure_sortie && (
                <Button
                  onClick={handleMySortie}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  Pointer ma sortie
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des présences */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <FilterIcon className="mr-2 h-5 w-5" />
              Liste des présences ({presences.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {presences.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {presences.map((presence) => (
                <PresenceCard
                  key={presence.id}
                  presence={presence}
                  onPresenceUpdate={handlePresenceUpdate}
                  userRole={user?.role || "staff"}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <AlertCircleIcon className="mx-auto h-12 w-12 mb-4" />
              Aucune présence trouvée pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}