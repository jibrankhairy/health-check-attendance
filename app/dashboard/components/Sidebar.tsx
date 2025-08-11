"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { IconLogout, IconDotsVertical } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const allNavItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["ADMINISTRASI", "HRD", "PETUGAS"],
    },
    {
      href: "/dashboard/create-account",
      label: "Buat Akun",
      icon: Users,
      roles: ["ADMINISTRASI"],
    },
    {
      href: "/dashboard/reports",
      label: "Laporan MCU",
      icon: FileText,
      roles: ["ADMINISTRASI", "PETUGAS"],
    },
  ];

  const navItems = user
    ? allNavItems.filter((item) => item.roles.includes(user.role))
    : [];

  const { isMobile } = useSidebar();

  if (!user) {
    return (
      <aside className="w-64 flex-shrink-0 border-r bg-white flex flex-col p-6">
        <div>Loading...</div>
      </aside>
    );
  }

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
      <nav className="flex-1 px-4 py-6 space-y-4">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start h-11"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
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
              <IconLogout className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
