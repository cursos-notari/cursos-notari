"use client"

import * as React from "react"
import {
  CalendarCheck,
} from "lucide-react"

import {
  IconBuilding,
  IconDashboard,
} from "@tabler/icons-react"

import { NavUser } from "@/components/manager/nav-user"
import { TeamSwitcher } from "@/components/manager/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Leandro Notari",
    email: "engenier2014@gmail.com",
    avatar: "/img/leandro.jpeg",
  },
  team:
  {
    name: "Engenharia Notari",
    logo: IconBuilding,
    plan: "Empresa",
  },
  items: [
    {
      title: "Turmas",
      url: "#",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "Calendário",
      url: "#",
      icon: CalendarCheck,
      isActive: false,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                  >
                    <a
                      href={item.url}
                      aria-disabled={!item.isActive}
                      tabIndex={item.isActive ? -1 : undefined}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}