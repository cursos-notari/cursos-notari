import { BookMarked, CalendarCheck } from "lucide-react"

import { NavUserWrapper } from "@/components/manager/nav-user-wrapper"
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
import { Suspense } from "react"
import { SidebarNavSkeleton } from "../skeletons/sidebar-nav-skeleton"

const data = {
  items: [
    {
      title: "Turmas",
      url: "#",
      icon: BookMarked,
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
        <TeamSwitcher />
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
        <Suspense fallback={<SidebarNavSkeleton />}>
          <NavUserWrapper />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}