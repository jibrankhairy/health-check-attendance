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
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type StatData = {
  totalPatients: number;
  genderDistribution: { name: string; value: number }[];
  packageDistribution: { name: string; total: number }[];
  registrationByDate: { name: string; total: number }[];
  progressDistribution: { name: string; total: number }[];
  dassDistribution: {
    name: string;
    Depresi: number;
    Cemas: number;
    Stres: number;
  }[];
  healthIssuesDistribution: { name: string; total: number }[];
};

const COLORS = {
  blue: { base: "#01449D", light: "#EB528D", lighter: "#A0C3ED" },
  teal: "#14B8A6",
  amber: "#F59E0B",
  rose: "#F43F5E",
  indigo: "#9062F5",
  blueDark: "#280C6C",
  dassDepression: "#EF4444",
  dassAnxiety: "#F59E0B",
  dassStress: "#8B5CF6",
  healthIssue: "#10B981",
};
const GENDER_COLORS = [COLORS.blue.base, COLORS.blue.light];

const CustomLegend = ({ payload }: any) => (
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

export const CompanyStats = ({ companyId }: { companyId: string }) => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/company-stats/${companyId}`);
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
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-muted-foreground">
        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
        <span>Memuat statistik perusahaan...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-destructive">
        Gagal memuat data statistik.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Pasien & Gender</CardTitle>
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
            <CardTitle>Registrasi Pasien (7 Hari)</CardTitle>
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
            <CardTitle>Hasil Tes Psikologis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={stats.dassDistribution}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
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
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  dataKey="Depresi"
                  fill={COLORS.dassDepression}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Cemas"
                  fill={COLORS.dassAnxiety}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Stres"
                  fill={COLORS.dassStress}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risiko Kesehatan Umum</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.healthIssuesDistribution &&
            stats.healthIssuesDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={stats.healthIssuesDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#888888"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    width={110}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar
                    dataKey="total"
                    name="Jumlah Pasien"
                    fill={COLORS.healthIssue}
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-center text-gray-500">
                Tidak ada risiko kesehatan abnormal yang tercatat.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paket MCU</CardTitle>
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
            <CardTitle>Progres Pemeriksaan Pasien</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.progressDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: COLORS.indigo, opacity: 0.1 }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="total"
                  fill={COLORS.indigo}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
