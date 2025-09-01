"use client";
import { usePathname } from 'next/navigation';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from 'next/link';

import { Video, Upload, LayoutDashboard, User, Search, Settings, CalendarCog,ChartArea } from "lucide-react";

const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard", //createPageUrl("Dashboard"),
      icon: LayoutDashboard,
    },
    { title: "Campaigns", url: "/campaigns",icon: CalendarCog },
    {
      title: "Upload Video",
      url: "/upload",//createPageUrl("Upload"),
      icon: Upload,
    },
      { title: "Analytics", url: "/analytics",icon: ChartArea },
      { title: "Settings", url: "/settings",icon: Settings },
  ];

export const SidebarMenuItems = () =>{
    const pathname = usePathname();
    return (
        <>
          <SidebarMenu className="space-y-2">
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={`hover:bg-gray-800/50 hover:text-blue-400 transition-all duration-300 rounded-xl mb-1 ${
                    pathname === item.url 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10' 
                      : 'text-gray-300'
                  }`}
                >
                  <Link href={item.url as string} className="flex items-center gap-3 px-4 py-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </>
    )
}