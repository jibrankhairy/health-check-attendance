import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b bg-white">
      <div>
        <h2 className="text-xl font-seminibold">Daftar Pasien</h2>
        <p className="text-sm text-gray-500">
          Status terbaru dari pendaftaran pasien medical check up.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-9 w-64" />
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
