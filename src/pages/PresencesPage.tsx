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
 // CalendarIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  SearchIcon,
  FilterIcon
} from "lucide-react"
//import { format } from "date-fns"

export default function PresencesPage() {
  const [presences, setPresences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
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
      setUser(JSON.parse(storedUser))
    }
    fetchPresences()
  }, [])

  const fetchPresences = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.date) params.append('date', filters.date)
      if (filters.statut !== "all") params.append('statut', filters.statut)
      if (filters.search) params.append('search', filters.search)

      const response = await axiosInstance.get(`/presences/?${params.toString()}`)
      setPresences(response.data)
      
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

  const handleArrivee = async (id: number) => {
    try {
      await axiosInstance.post(`/presences/${id}/arrivee/`)
      fetchPresences()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'arrivée:", error)
    }
  }

  const handleSortie = async (id: number) => {
    try {
      await axiosInstance.post(`/presences/${id}/sortie/`)
      fetchPresences()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la sortie:", error)
    }
  }

  const handleCreateMyPresence = async () => {
    try {
      await axiosInstance.post("/ma-presence/")
      fetchPresences()
    } catch (error) {
      console.error("Erreur lors de la création de la présence:", error)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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

      {user?.role === "staff" && (
        <Card>
          <CardHeader>
            <CardTitle>Votre présence aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button onClick={handleCreateMyPresence} className="bg-primary hover:bg-primary/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Créer ma présence
              </Button>
              <Button
                onClick={() => window.location.href = "/dashboard/presences/ma-presence/arrivee/"}
                className="bg-green-500 hover:bg-green-600"
              >
                <ClockIcon className="mr-2 h-4 w-4" />
                Marquer mon arrivée
              </Button>
              <Button
                onClick={() => window.location.href = "/dashboard/presences/ma-presence/sortie/"}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <ClockIcon className="mr-2 h-4 w-4" />
                Marquer ma sortie
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                  onArriveeClick={handleArrivee}
                  onSortieClick={handleSortie}
                  userRole={user?.role || "staff"}
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