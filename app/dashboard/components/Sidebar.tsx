"use client";

import React from "react";
import {
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  FileText,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  IconLogout,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-white flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Image
          src="/images/logo-klinik.png"
          alt="Logo"
          width={50}
          height={52}
          className="mr-2"
        />
        <h1 className="text-sm font-semibold">Klinik Yuliarpan Medika</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-6">
        <Button variant="secondary" className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Manajemen Pasien
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Laporan MCU
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Briefcase className="mr-2 h-4 w-4" />
          Paket MCU
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Pengaturan
        </Button>
      </nav>
      <div className="mb-4">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="ml-2 h-8 w-8 rounded-lg">
                <AvatarImage
                  src={"/images/avatars/user.svg"}
                  alt={user?.fullName}
                />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.fullName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={"/images/avatars/user.svg"}
                    alt={user?.fullName}
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.fullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
    </aside>
  );
};
