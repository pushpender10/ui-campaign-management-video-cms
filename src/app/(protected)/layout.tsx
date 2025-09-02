"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { createPageUrl } from "@/lib/utils";
import {
  Video,
  Upload,
  LayoutDashboard,
  User,
  Search,
  Settings,
  CalendarCog,
  ChartArea,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { title } from "process";
import { useSession } from "next-auth/react";
// import { auth } from "@/lib/auth";
// import { User as UserEntity } from "@/entities/User";

const navigationItems = [
  {
    title: "Portal",
    url: "/portal", //createPageUrl("Portal"),
    icon: LayoutDashboard,
  },
  { title: "Campaigns", url: "/campaigns", icon: CalendarCog },
  {
    title: "Upload Video",
    url: "/upload", //createPageUrl("Upload"),
    icon: Upload,
  },
  { title: "Analytics", url: "/analytics", icon: ChartArea },
  { title: "Settings", url: "/settings", icon: Settings },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  // const session = await auth();
  const { data: session, update, status } = useSession();
  const pathname = usePathname();
  const [user, setUser] = React.useState(null);

  //To do: will correct user later.

  React.useEffect(() => {
    const loadUser = async () => {
      const currentUser = session?.user;
      if (currentUser) {
        setUser(currentUser as any);
      }
    };
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-950">
          <Sidebar className="border-r border-gray-800/50 bg-gray-800 backdrop-blur-xl">
            <SidebarHeader className="border-b border-blue-500/50 p-6">
              <div className="flex flex-col items-center justify-center text-center gap-3">
                <Link href={"/"} className="pointer">
                  <div className="flex items-center justify-center gap-3">
                    <div className="size-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Video className="w-5 h-5 text-white items-center" />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white tracking-tight">
                      VCMS
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">
                      Control panel
                    </p>
                  </div>
                </Link>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-fuchsia-800 font-semibold uppercase tracking-wider px-3 py-2">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-gray-800/50 hover:text-blue-400 transition-all duration-300 rounded-xl mb-1 ${
                            pathname === item.url
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10"
                              : "text-gray-300"
                          }`}
                        >
                          <Link
                            href={item.url as string}
                            className="flex items-center gap-3 px-4 py-3"
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-blue-500/50 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Content Creator
                  </p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col bg-gray-650 text-white">
            <header className="bg-gray-900/30 backdrop-blur-xl border-b border-gray-800 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 text-white" />
                <h1 className="text-xl font-bold text-white">VCMS</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
