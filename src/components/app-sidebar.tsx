// src/components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { HomeIcon, UsersIcon, CalendarIcon, FileTextIcon, LogOutIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard">
                <HomeIcon />
                <span className="font-bold">Gpresence</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton>
                👤 {user.username} ({user.role})
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <HomeIcon />
                    <span>Tableau de bord</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Affiche "Employés" seulement pour admin et rh */}
              {(user?.role === "admin" || user?.role === "rh") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/employes">
                      <UsersIcon />
                      <span>Employés</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Affiche "Présences" pour tous sauf staff (staff va directement sur ses présences) */}
              {user?.role !== "staff" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/presences">
                      <CalendarIcon />
                      <span>Présences</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Affiche "Rapports" pour admin, rh, manager */}
              {(user?.role === "admin" || user?.role === "rh" || user?.role === "manager") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/rapports">
                      <FileTextIcon />
                      <span>Rapports</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={() => {
                localStorage.removeItem("accessToken")
                localStorage.removeItem("user")
                window.location.href = "/login-form"
              }}>
                <LogOutIcon />
                <span>Se déconnecter</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}