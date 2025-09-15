// src/components/ReportCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, FileTextIcon, DownloadIcon, TrashIcon, EditIcon } from "lucide-react"
import { format } from "date-fns"

interface ReportCardProps {
  report: {
    id: number
    employe: {
      nom: string
      user: {
        username: string
      }
    }
    type: string
    date_debut: string
    date_fin: string
    contenu: string
    created_at: string
  }
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  userRole: string
}

export function ReportCard({ report, onEdit, onDelete, userRole }: ReportCardProps) {
  const canManage = userRole === "admin" || userRole === "rh" || userRole === "manager"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold">{report.employe.nom}</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {report.type === "mensuel" ? "Mensuel" :
             report.type === "hebdomadaire" ? "Hebdomadaire" :
             report.type === "annuel" ? "Annuel" : "Personnalisé"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(new Date(report.date_debut), 'dd/MM/yyyy')} - {format(new Date(report.date_fin), 'dd/MM/yyyy')}
        </div>
        <div className="text-sm">
          <p className="font-medium">Contenu :</p>
          <p className="text-muted-foreground line-clamp-3">{report.contenu}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Créé le {format(new Date(report.created_at), 'dd/MM/yyyy HH:mm')}
        </div>
        {canManage && (
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(report.id)}
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <EditIcon className="mr-1 h-4 w-4" />
              Modifier
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(report.id)}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <TrashIcon className="mr-1 h-4 w-4" />
              Supprimer
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50"
            >
              <DownloadIcon className="mr-1 h-4 w-4" />
              Télécharger
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}