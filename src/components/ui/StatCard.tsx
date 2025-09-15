// src/components/StatCard.tsx - VERSION CORRIGÉE
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

// SOLUTION 1: Utiliser LucideIcon et rendre le composant
interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon  // ← Type spécifique pour les icônes Lucide
  description?: string
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}


/*
interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode  
  description?: string
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}  
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
*/