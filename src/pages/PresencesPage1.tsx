// src/pages/EmployesPage.tsx
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, PlusIcon, RefreshCwIcon } from "lucide-react"
import axiosInstance from "@/api/axiosInstance"
import { EmployeeTable } from "@/components/EmployeeTable"
import { format } from "date-fns"

export default function EmployesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    poste: "all",
    sortBy: "nom",
    sortOrder: "asc"
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.poste !== "all") params.append('poste', filters.poste)

      const response = await axiosInstance.get(`/employes/?${params.toString()}`)
      setEmployees(response.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: key,
      sortOrder: prev.sortBy === key && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleEdit = (id: number) => {
    // TODO: Ouvrir un modal d'édition
    console.log("Modifier employé:", id)
  }

  const handleDelete = (id: number) => {
    // TODO: Confirmer et supprimer
    console.log("Supprimer employé:", id)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    const aValue = a[filters.sortBy as keyof typeof a] || ""
    const bValue = b[filters.sortBy as keyof typeof b] || ""
    
    if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1
    return 0
  })

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
        <h1 className="text-3xl font-bold">Gestion des Employés</h1>
        <div className="flex space-x-2">
          {(user?.role === "admin" || user?.role === "rh") && (
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Ajouter un employé
            </Button>
          )}
          <Button variant="outline" onClick={fetchEmployees}>
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
              <label className="text-sm font-medium">Rechercher</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nom, poste, email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Poste</label>
              <Select value={filters.poste} onValueChange={(value) => handleFilterChange('poste', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les postes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les postes</SelectItem>
                  <SelectItem value="Développeur">Développeur</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Chef de projet">Chef de projet</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des employés */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des employés ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length > 0 ? (
            <EmployeeTable
              employees={sortedEmployees}
              onSort={handleSort}
              sortConfig={{
                key: filters.sortBy as keyof any,
                direction: filters.sortOrder as 'asc' | 'desc'
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              userRole={user?.role || "staff"}
            />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Aucun employé trouvé pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}