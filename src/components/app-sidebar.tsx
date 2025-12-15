"use client"

import * as React from "react"
import { useLocation } from "react-router-dom"

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
import logoCollapse from "@/assets/img/rsuad_logo_3.png"
import logoOpen from "@/assets/img/rsuad_logo_4.png"


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
        <div className="flex items-center justify-center">
          {/* Logo saat sidebar COLLAPSE */}
          <div className="object-contain hidden group-data-[collapsible=icon]:block">
            <img
              src={logoCollapse}
              alt="RSUAD Logo"
              className="h-8 w-8"
            />
          </div>

          {/* Logo saat sidebar TERBUKA */}
          <div className="object-contain group-data-[collapsible=icon]:hidden">
            <img
              src={logoOpen}
              alt="RSUAD Logo"
              className="h-16"
            />
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
