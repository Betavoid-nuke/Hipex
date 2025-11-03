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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ChevronDown, Star } from "lucide-react";
import dataManager from "../data/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import LimitedAccessComponent from "@/General/Security/LimitedAccessComponent";
import { usePathname } from "next/navigation";


interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export  default function AppSidebar({ currentView, onNavigate }: AppSidebarProps) {
    
  const { state } = useSidebar();
  const isOpen = state === "expanded"; // "collapsed" if closed

  const { user, isLoaded } = useUser();
  if (!isLoaded) return null; // or loading spinner
  const userId = user?.id;

  const pathname = usePathname();


  return (
    <>
      <LimitedAccessComponent>
        <Sidebar
          collapsible="icon"
          side="left"
          className="text-white border-r border-[#333336]"
          style={{border:'none', backgroundColor:'#171718'}}
        >
        
          {/* ---------- HEADER ---------- */}
          <SidebarHeader>
            <div style={{color:'gray', display:'flex', alignItems:'center', gap:'8px', fontWeight:'600', height:'100%', width:'100%', justifyContent:'center', fontSize:'26px', fontFamily:'monospace', marginBottom:'-20px'}}>
              Hipex.
            </div>
            <div style={{height:'1px', width:'100%', backgroundColor:'#48484f', marginTop:'23px'}}></div>
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
                              const isActive = pathname === (item.idneeded ? `${item.href}/${userId}` : item.href);
                              return (
                                <SidebarMenuItem key={item.view}>
                                  <SidebarMenuButton asChild>
                                    <Link
                                      href={item.idneeded ? `${item.href}/${userId}` : item.href}
                                      className={`
                                        flex items-center gap-2 p-2 rounded w-full justify-start transition-all duration-200
                                        ${isActive 
                                          ? "bg-[#3A3A3C] text-white font-semibold" 
                                          : "text-gray-400 hover:text-white hover:bg-gray-800 hover:scale-[1.01]"
                                        }
                                      `}
                                    >
                                      <item.icon size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                      <span className="transition-all duration-200">{item.text}</span>
                                    </Link>
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
      </LimitedAccessComponent>
    </>
  );
}
