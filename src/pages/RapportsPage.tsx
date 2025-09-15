// src/pages/RapportsPage.tsx
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import axiosInstance from "@/api/axiosInstance"
import { ReportCard } from "@/components/ui/RapportCard"
import {
  RefreshCwIcon,
  PlusIcon,
  CalendarIcon,
  FileTextIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon
} from "lucide-react"
import { format } from "date-fns"

export default function RapportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: "all",
    search: ""
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newReport, setNewReport] = useState({
    type: "mensuel",
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: new Date().toISOString().split('T')[0],
    contenu: ""
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.type !== "all") params.append('type', filters.type)
      if (filters.search) params.append('search', filters.search)

      const response = await axiosInstance.get(`/rapports/?${params.toString()}`)
      setReports(response.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des rapports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReport = async () => {
    try {
      await axiosInstance.post("/rapports/", newReport)
      setIsCreateModalOpen(false)
      setNewReport({
        type: "mensuel",
        date_debut: new Date().toISOString().split('T')[0],
        date_fin: new Date().toISOString().split('T')[0],
        contenu: ""
      })
      fetchReports()
    } catch (error) {
      console.error("Erreur lors de la création du rapport:", error)
    }
  }

  const handleEdit = (id: number) => {
    
    console.log("Modifier rapport:", id)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
      return
    }
    try {
      await axiosInstance.delete(`/rapports/${id}/`)
      fetchReports()
    } catch (error) {
      console.error("Erreur lors de la suppression du rapport:", error)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleInputChange = (key: string, value: string) => {
    setNewReport(prev => ({ ...prev, [key]: value }))
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
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Rapports</h1>
        <div className="flex space-x-2">
          {(user?.role === "admin" || user?.role === "rh" || user?.role === "manager") && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Créer un rapport
            </Button>
          )}
          <Button variant="outline" onClick={fetchReports}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs">Type de rapport</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="mensuel">Mensuel</SelectItem>
                  <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                  <SelectItem value="annuel">Annuel</SelectItem>
                  <SelectItem value="personnalise">Personnalisé</SelectItem>
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

      {/* Liste des rapports */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5" />
              Liste des rapports ({reports.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  userRole={user?.role || "staff"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileTextIcon className="mx-auto h-12 w-12 mb-4" />
              Aucun rapport trouvé pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de création de rapport */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau rapport</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={newReport.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensuel">Mensuel</SelectItem>
                  <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                  <SelectItem value="annuel">Annuel</SelectItem>
                  <SelectItem value="personnalise">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_debut" className="text-right">
                Date début
              </Label>
              <Input
                id="date_debut"
                type="date"
                value={newReport.date_debut}
                onChange={(e) => handleInputChange('date_debut', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_fin" className="text-right">
                Date fin
              </Label>
              <Input
                id="date_fin"
                type="date"
                value={newReport.date_fin}
                onChange={(e) => handleInputChange('date_fin', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contenu" className="text-right">
                Contenu
              </Label>
              <textarea
                id="contenu"
                value={newReport.contenu}
                onChange={(e) => handleInputChange('contenu', e.target.value)}
                className="col-span-3 p-2 border rounded-md"
                rows={5}
                placeholder="Entrez le contenu du rapport..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateReport}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Créer le rapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}