// src/components/EmployeeTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EditIcon, TrashIcon } from "lucide-react"

interface Employee {
  id: number
  nom: string
  poste: string
  telephone: string | null
  email: string | null
  user: {
    username: string
    role: string
  }
}

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  userRole: string
}

export function EmployeeTable({ employees, onEdit, onDelete, userRole }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Poste</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Utilisateur</TableHead>
          {(userRole === "admin" || userRole === "rh") && (
            <TableHead className="text-right">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">{employee.nom}</TableCell>
            <TableCell>{employee.poste}</TableCell>
            <TableCell>{employee.telephone || "-"}</TableCell>
            <TableCell>{employee.email || "-"}</TableCell>
            <TableCell>{employee.user.username} ({employee.user.role})</TableCell>
            {(userRole === "admin" || userRole === "rh") && (
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(employee.id)}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(employee.id)}>
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}