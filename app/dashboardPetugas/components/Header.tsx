"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IconLogout } from "@tabler/icons-react";

export const Header = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-transparent">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-klinik.png"
            alt="Logo"
            width={70}
            height={70}
          />
          <span
            className="font-semibold text-lg hidden sm:block"
            style={{ color: "#01449D" }}
          >
            Klinik Yuliarpan Medika
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-full p-1.5 hover:bg-slate-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#01449D]">
            <span
              className="font-medium text-sm hidden md:block"
              style={{ color: "#01449D" }}
            >
              {user.fullName}
            </span>
            <Avatar className="h-10 w-10 border-2 border-white/50">
              <AvatarImage
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName}`}
              />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2 w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
            >
              <IconLogout className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
