"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Building } from "lucide-react";

type StatData = {
  totalPatients: number;
  totalCompanies: number;
  genderDistribution: { name: string; value: number }[];
  packageDistribution: { name: string; total: number }[];
  registrationByDate: { name: string; total: number }[];
  locationDistribution: { name: string; total: number }[];
};

const COLORS = {
  blue: { base: "#01449D", light: "#EB528D", lighter: "#A0C3ED" },
  teal: "#14B8A6",
  amber: "#F59E0B",
  rose: "#F43F5E",
  indigo: "#9062F5",
  blueDark: "#280C6C",
};

const GENDER_COLORS = [COLORS.blue.base, COLORS.blue.light];

const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="flex flex-col space-y-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          className="flex items-center justify-between text-sm"
        >
          <div className="flex items-center">
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span>{entry.value}</span>
          </div>
          <span className="font-semibold">{entry.payload.value}</span>
        </li>
      ))}
    </ul>
  );
};

export const DashboardStats = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard-stats");
        if (!response.ok) throw new Error("Gagal memuat data statistik");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Memuat statistik...</div>;
  }
  if (!stats) {
    return <div className="p-8 text-center">Gagal memuat data statistik.</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Perusahaan
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registrasi Pasien (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.registrationByDate}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: COLORS.blue.lighter, opacity: 0.3 }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="total"
                  fill={COLORS.blueDark}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Gender</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genderDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {stats.genderDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">
                  {stats.totalPatients}
                </span>
                <span className="text-xs text-muted-foreground">
                  Total Pasien
                </span>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <CustomLegend
                payload={stats.genderDistribution.map((entry, index) => ({
                  value: entry.name,
                  color: GENDER_COLORS[index % GENDER_COLORS.length],
                  payload: entry,
                }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Paket MCU</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.packageDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: COLORS.teal, opacity: 0.1 }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar dataKey="total" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pasien per Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.locationDistribution}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: COLORS.amber, opacity: 0.1 }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="total"
                  fill={COLORS.amber}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
