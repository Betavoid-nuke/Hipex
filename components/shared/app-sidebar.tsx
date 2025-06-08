'use client'

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { data } from "../../CustomizingPlatform/SidebarMenuContent"
import projectInfo from "../../CustomizingPlatform/information.json"
import Image from "next/image"
import {MakeNewProject} from "../Drawer/Drawer.jsx"
import { useRouter, usePathname } from 'next/navigation'
 

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const router = useRouter();
  const pathname = usePathname();
  const logoColor = projectInfo.NameColor;

  //solves the pathname maybe null issue
  if (pathname == null) {
    return
  }

  return (
    <Sidebar {...props}>

      <SidebarHeader className="menuHeader">
        <SidebarMenu>
          <SidebarMenuItem>
              <a href="#" style={{display:'flex', justifyContent:'center'}}>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold" style={{color:logoColor, fontSize:'22px', marginTop:'20px'}}>{projectInfo.name}</span>
                </div>
              </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="sidebar-content">
        <SidebarGroup>
          <SidebarMenu>

            {data.navMain.map((item) => {

              const isTabActive = (pathname.includes(item.url) && item.url.length > 1) ||  pathname === item.url;

              return (
                <SidebarMenuItem style={{marginLeft:'40px', marginTop:'20px'}} key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium" style={{fontWeight:'lighter'}}>
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={isTabActive}>
                            <a style={{fontWeight:'lighter', color:'darkgray'}} href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              )
            })}

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            
              <div>
                <MakeNewProject />
              </div>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
