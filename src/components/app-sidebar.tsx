"use client"

import * as React from "react"
import { useLocation } from "react-router-dom"
import { Hospital } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { mainMenus } from "@/config/menu"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  // Convert menu config to nav format
  const navItems = mainMenus.map(menu => {
    if (menu.type === '1') {
      // Single menu item
      return {
        title: menu.title,
        url: menu.url || '#',
        icon: menu.icon,
        isActive: location.pathname === menu.url,
        items: undefined,
      }
    } else {
      // Menu with children
      const isActive = menu.children?.some(child => 
        location.pathname.startsWith(child.url)
      ) || false

      return {
        title: menu.title,
        url: '#',
        icon: menu.icon,
        isActive,
        items: menu.children?.map(child => ({
          title: child.title,
          url: child.url,
          isActive: location.pathname === child.url || location.pathname.startsWith(child.url),
        })),
      }
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Hospital className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Hospital Management
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              System Information
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// Keep the old code commented for reference
/*
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      isActive: true,
      items: [
        ...
      ],
    },
  ],
}
*/
