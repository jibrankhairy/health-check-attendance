"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText } from "lucide-react";
import {
<<<<<<< HEAD
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  FileText,
  MoreHorizontal
} from "lucide-react";
import {
=======
>>>>>>> 7ce396ace79bb6198b54ca3285e501e97fc2e440
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
<<<<<<< HEAD
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
=======
  SidebarMenuButton,
>>>>>>> 7ce396ace79bb6198b54ca3285e501e97fc2e440
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
<<<<<<< HEAD
=======
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/create-account", label: "Create Account", icon: Users },
    { href: "/dashboard/reports", label: "Laporan MCU", icon: FileText },
  ];
>>>>>>> 7ce396ace79bb6198b54ca3285e501e97fc2e440
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
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
    </aside>
  );
};
