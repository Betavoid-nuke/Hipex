"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown, Star } from "lucide-react";
import dataManager from "../data/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";

interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export  default function AppSidebar({ currentView, onNavigate }: AppSidebarProps) {
  const { state } = useSidebar();
  const isOpen = state === "expanded"; // "collapsed" if closed

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="text-white border-r border-[#333336]"
      style={{border:'none', backgroundColor:'#171718'}}
    >

      {/* ---------- HEADER ---------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ---------- CONTENT ---------- */}
      <SidebarContent style={{scrollbarWidth:'none'}}>

        {dataManager().sidebarConfig.map((section: any) => (
          <SidebarGroup key={section.title}>
            
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>

                    <SidebarGroupLabel asChild>
                      <CollapsibleTrigger>
                        {section.title}
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>

                    <SidebarGroupContent>
                      <SidebarMenu>
                        {section.items.map((item: any) => {
                          const isActive = currentView === item.view;
                          return (
                            <SidebarMenuItem key={item.view}>
                              <SidebarMenuButton asChild>
                                <button
                                  onClick={() => onNavigate(item.view)}
                                  className={`
                                    flex items-center w-full rounded-md px-3 py-2 text-sm font-medium
                                    transition-all duration-200 ease-in-out
                                    ${
                                      isActive
                                        ? "bg-[#6366F1]/20 text-[#6366F1]"
                                        : "text-gray-300 hover:bg-[#333336] hover:text-white"
                                    }
                                  `}
                                >
                                  <item.icon className="w-5 h-5 shrink-0" />
                                  {isOpen && <span className="ml-3">{item.text}</span>}
                                </button>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>

                  </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>

          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ---------- FOOTER ---------- */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                className={`
                  flex items-center w-full rounded-md px-3 py-2 text-sm font-medium
                  bg-[#6366F1] hover:bg-indigo-600 transition-all
                  ${isOpen ? "justify-start" : "justify-center"}
                `}
              >
                <Star className="w-5 h-5 shrink-0" />
                {isOpen && <span className="ml-3">Unlock Premium</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}
