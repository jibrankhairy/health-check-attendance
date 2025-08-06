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
    </header>
  );
};

export default Header;
