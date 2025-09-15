// src/pages/EmployeesPage.tsx
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosInstance from "@/api/axiosInstance"
import {
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  CalendarIcon,
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCwIcon,
  UsersIcon,
  UserCheckIcon
} from "lucide-react"

// Types
interface User {
  id: number
  username: string
  email: string
  role: string
}

interface Employe {
  id: number
  user: User
  user_username: string
  user_email: string
  nom: string
  poste: string
  telephone?: string
  email?: string
  created_at: string
  updated_at: string
}

interface EmployeeFormData {
  nom: string
  poste: string
  telephone: string
  email: string
  user?: number
}

// Composant formulaire pour créer/modifier un employé
const EmployeeForm = ({ 
  employee, 
  isOpen, 
  onClose, 
  onSubmit, 
  loading 
}: {
  employee?: Employe | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => Promise<void>
  loading: boolean
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    nom: employee?.nom || '',
    poste: employee?.poste || '',
    telephone: employee?.telephone || '',
    email: employee?.email || ''
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        nom: employee.nom || '',
        poste: employee.poste || '',
        telephone: employee.telephone || '',
        email: employee.email || ''
      })
    } else {
      setFormData({ nom: '', poste: '', telephone: '', email: '' })
    }
  }, [employee, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Modifier l\'employé' : 'Nouvel employé'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poste">Poste *</Label>
              <Input
                id="poste"
                value={formData.poste}
                onChange={(e) => handleChange('poste', e.target.value)}
                placeholder="Développeur Full Stack"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                placeholder="0123456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="jean.dupont@company.com"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : (employee ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Composant principal de la page
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  
  // États pour les filtres et le tri
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Employe>('nom')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterPoste, setFilterPoste] = useState('all')
  
  // États pour les modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employe | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Erreur parsing user:', e)
      }
    }
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get('/employes/')
      console.log('Employés récupérés:', response.data)
      setEmployees(Array.isArray(response.data) ? response.data : [])
    } catch (error: any) {
      console.error('Erreur lors de la récupération des employés:', error)
      setError(error.response?.data?.detail || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  // Fonction de tri
  const handleSort = (field: keyof Employe) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Employés filtrés et triés
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = 
        emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.user_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesPoste = filterPoste === 'all' || emp.poste === filterPoste
      
      return matchesSearch && matchesPoste
    })

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      // Gestion des valeurs nulles
      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''
      
      // Conversion en string pour comparaison
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })

    return filtered
  }, [employees, searchTerm, sortField, sortDirection, filterPoste])

  // Postes uniques pour le filtre
  const uniquePostes = useMemo(() => {
    const postes = [...new Set(employees.map(emp => emp.poste).filter(Boolean))]
    return postes.sort()
  }, [employees])

  // Création d'un employé
  const handleCreateEmployee = async (data: EmployeeFormData) => {
    try {
      setFormLoading(true)
      const response = await axiosInstance.post('/employes/', data)
      console.log('Employé créé:', response.data)
      setEmployees(prev => [...prev, response.data])
      setIsCreateModalOpen(false)
      alert('Employé créé avec succès !')
    } catch (error: any) {
      console.error('Erreur création:', error)
      alert(error.response?.data?.details || 'Erreur lors de la création')
    } finally {
      setFormLoading(false)
    }
  }

  // Modification d'un employé
  const handleEditEmployee = async (data: EmployeeFormData) => {
    if (!editingEmployee) return
    
    try {
      setFormLoading(true)
      const response = await axiosInstance.put(`/employes/${editingEmployee.id}/`, data)
      console.log('Employé modifié:', response.data)
      setEmployees(prev => 
        prev.map(emp => emp.id === editingEmployee.id ? response.data : emp)
      )
      setEditingEmployee(null)
      alert('Employé modifié avec succès !')
    } catch (error: any) {
      console.error('Erreur modification:', error)
      alert(error.response?.data?.details || 'Erreur lors de la modification')
    } finally {
      setFormLoading(false)
    }
  }

  // Suppression d'un employé
  const handleDeleteEmployee = async (employee: Employe) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${employee.nom} ?`)) return
    
    try {
      await axiosInstance.delete(`/employes/${employee.id}/`)
      setEmployees(prev => prev.filter(emp => emp.id !== employee.id))
      alert('Employé supprimé avec succès !')
    } catch (error: any) {
      console.error('Erreur suppression:', error)
      alert(error.response?.data?.details || 'Erreur lors de la suppression')
    }
  }

  // Composant de tri pour les en-têtes
  const SortableHeader = ({ field, children }: { field: keyof Employe, children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ArrowUpIcon className="h-4 w-4" /> : 
            <ArrowDownIcon className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4">Chargement des employés...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <UserIcon className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <Button onClick={fetchEmployees} variant="outline">
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    )
  }

  const canManageEmployees = user?.role === 'admin' || user?.role === 'rh'

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Employés</h1>
          <p className="text-muted-foreground">
            Gérez les informations des employés de l'entreprise
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchEmployees} variant="outline">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
          {canManageEmployees && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nouvel employé
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Total Employés</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheckIcon className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold">{filteredAndSortedEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Postes Différents</p>
                <p className="text-2xl font-bold">{uniquePostes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Nouveau ce mois</p>
                <p className="text-2xl font-bold">
                  {employees.filter(emp => {
                    const created = new Date(emp.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && 
                           created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, poste, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterPoste} onValueChange={setFilterPoste}>
                <SelectTrigger>
                  <FilterIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par poste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les postes</SelectItem>
                  {uniquePostes.map(poste => (
                    <SelectItem key={poste} value={poste}>{poste}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des employés */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des employés ({filteredAndSortedEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedEmployees.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="nom">Nom</SortableHeader>
                    <SortableHeader field="poste">Poste</SortableHeader>
                    <SortableHeader field="user_username">Username</SortableHeader>
                    <TableHead>Contact</TableHead>
                    <SortableHeader field="created_at">Créé le</SortableHeader>
                    {canManageEmployees && <TableHead className="w-20">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                            {employee.nom.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{employee.nom}</p>
                            <p className="text-sm text-muted-foreground">ID: {employee.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.poste}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.user_username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {employee.email && (
                            <div className="flex items-center space-x-1 text-sm">
                              <MailIcon className="h-3 w-3 text-muted-foreground" />
                              <span>{employee.email}</span>
                            </div>
                          )}
                          {employee.telephone && (
                            <div className="flex items-center space-x-1 text-sm">
                              <PhoneIcon className="h-3 w-3 text-muted-foreground" />
                              <span>{employee.telephone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <time className="text-sm text-muted-foreground">
                          {new Date(employee.created_at).toLocaleDateString('fr-FR')}
                        </time>
                      </TableCell>
                      {canManageEmployees && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
                                <EditIcon className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteEmployee(employee)}
                                className="text-red-600"
                              >
                                <TrashIcon className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <UsersIcon className="mx-auto h-12 w-12 mb-4" />
              <p>Aucun employé trouvé pour les critères sélectionnés.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <EmployeeForm
        employee={null}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEmployee}
        loading={formLoading}
      />
      
      <EmployeeForm
        employee={editingEmployee}
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSubmit={handleEditEmployee}
        loading={formLoading}
      />
    </div>
  )
}