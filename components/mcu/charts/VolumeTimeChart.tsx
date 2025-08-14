"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

type SpirometryData = {
  fvc?: string | number | null;
  fvcPred?: string | number | null;
  fvcPost?: string | number | null;
  fev1?: string | number | null;
  fev1Pred?: string | number | null;
  fev1Post?: string | number | null;
};

type VolumeTimeChartProps = {
  data: SpirometryData;
};

const toNum = (v: any): number | null =>
  v != null && !isNaN(Number(v)) ? Number(v) : null;

const createCurvePoints = (fvc: number | null, fev1: number | null) => {
  if (!fvc) return [{ time: 0, volume: 0 }];

  let k = 1.2;
  if (fev1 && fvc && fev1 < fvc) {
    const ratio = 1 - fev1 / fvc;
    if (ratio > 0 && ratio < 1) k = -Math.log(ratio);
  }

  const samples = [];
  for (let t = 0; t <= 8; t += 0.2) {
    let vol = fvc * (1 - Math.exp(-k * t));
    if (vol > fvc) vol = fvc;
    samples.push({ time: t, volume: vol });
  }
  return samples;
};

export const VolumeTimeChart = ({ data }: VolumeTimeChartProps) => {
  const { fvc, fvcPred, fvcPost, fev1, fev1Pred, fev1Post } = data;

  const preData = React.useMemo(
    () => createCurvePoints(toNum(fvc), toNum(fev1)),
    [fvc, fev1]
  );
  const postData = React.useMemo(
    () => createCurvePoints(toNum(fvcPost), toNum(fev1Post)),
    [fvcPost, fev1Post]
  );
  const predData = React.useMemo(
    () => createCurvePoints(toNum(fvcPred), toNum(fev1Pred)),
    [fvcPred, fev1Pred]
  );

  const yMax = Math.max(
    toNum(fvc) || 0,
    toNum(fvcPost) || 0,
    toNum(fvcPred) || 0,
    5
  );

  return (
    <div>
      <h4 className="font-medium text-center text-sm mb-2">VOLUME – TIME</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="time"
            domain={[0, 8]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
          >
            <Label value="Time (s)" offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis type="number" domain={[0, Math.ceil(yMax)]}>
            <Label
              value="Liter"
              angle={-90}
              position="insideLeft"
              offset={10}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />

          <Line
            data={predData}
            type="monotone"
            name="Predicted"
            dataKey="volume"
            stroke="#ccc"
            strokeWidth={2}
            dot={false}
            activeDot={false}
            strokeDasharray="5 5"
          />
          <Line
            data={preData}
            type="monotone"
            name="Pre-BD"
            dataKey="volume"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
          {postData.length > 1 && (
            <Line
              data={postData}
              type="monotone"
              name="Post-BD"
              dataKey="volume"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
