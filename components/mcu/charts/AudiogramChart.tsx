"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  title: string;
  acValues: (number | null | undefined)[];
  bcValues: (number | null | undefined)[];
};

const FREQS = ["250", "500", "1000", "2000", "3000", "4000", "6000", "8000"];

export default function AudiogramChart({ title, acValues, bcValues }: Props) {
  const data = FREQS.map((f, i) => ({
    freq: f,
    AC: typeof acValues[i] === "number" ? acValues[i] : null,
    BC: typeof bcValues[i] === "number" ? bcValues[i] : null,
  }));

  return (
    <div className="w-full">
      <div className="mb-2 text-center font-semibold">{title}</div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="freq" />
            {/* audiogram: sumbu Y dibalik (semakin besar dB makin turun) */}
            <YAxis type="number" domain={[80, 0]} ticks={[0,10,20,30,40,50,60,70,80]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="AC" dot activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="BC" dot strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
