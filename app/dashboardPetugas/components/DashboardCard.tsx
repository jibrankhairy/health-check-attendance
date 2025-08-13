"use client";

import React from "react";
import { ScanLine, MapPin, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  fullName: string;
};

type Checkpoint = {
  id: number;
  name: string;
  slug: string;
};

type DashboardCardProps = {
  user: User;
  checkPoints: Checkpoint[];
  selectedCheckPoint: string | null;
  onCheckPointChange: (value: string) => void;
  onScanClick: () => void;
};

const StepIndicator = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-700">{text}</h3>
  </div>
);

export const DashboardCard = ({
  user,
  checkPoints,
  selectedCheckPoint,
  onCheckPointChange,
  onScanClick,
}: DashboardCardProps) => {
  return (
    <Card className="w-full max-w-lg shadow-2xl rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30 animate-fade-in">
      <CardHeader className="p-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-white shadow-md">
            <AvatarImage
              src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName}`}
            />
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Selamat Datang, {user.fullName}!
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              Anda login sebagai Petugas.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <StepIndicator
            icon={<MapPin className="text-sky-500" size={24} />}
            text="Langkah 1: Pilih Pos Anda"
          />
          <Select
            onValueChange={onCheckPointChange}
            value={selectedCheckPoint || undefined}
          >
            <SelectTrigger className="w-full h-12 text-base border-2 focus:ring-sky-500 focus:border-sky-500 rounded-lg bg-white">
              <SelectValue placeholder="-- Pilih Pos Pemeriksaan --" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom">
              {checkPoints.map((point) => (
                <SelectItem
                  key={point.id}
                  value={point.slug}
                  className="text-base py-2"
                >
                  {point.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <StepIndicator
            icon={
              <ScanLine
                className={
                  selectedCheckPoint ? "text-green-500" : "text-slate-400"
                }
                size={24}
              />
            }
            text="Langkah 2: Scan QR Pasien"
          />
          <Button
            onClick={onScanClick}
            disabled={!selectedCheckPoint}
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-lg shadow-lg transition-all duration-300 transform disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed enabled:bg-[#01449D] enabled:hover:bg-[#01449D] enabled:shadow-[#01449D]/50 enabled:hover:shadow-[#01449D]/50 enabled:text-white enabled:hover:text-white enabled:scale-500/50 enabled:hover:scale-105 flex items-center justify-center gap-3"
          >
            {selectedCheckPoint ? (
              <>
                <ScanLine size={28} />
                <span>Mulai Scan</span>
              </>
            ) : (
              <>
                <Lock size={24} />
                <span>Pilih Pos Dulu</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
