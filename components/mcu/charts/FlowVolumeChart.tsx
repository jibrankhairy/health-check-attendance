// components/mcu/charts/FlowVolumeChart.tsx
"use client";

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';

const toNum = (v: any) => (v != null && !isNaN(Number(v)) ? Number(v) : null);

// Fungsi untuk membuat titik-titik kurva
const createCurvePoints = (fvc: number | null, pef: number | null, fef25: number | null, fef50: number | null, fef75: number | null) => {
    if (!fvc || !pef) return [{ volume: 0, flow: 0 }];
    
    const points = [
        { volume: 0, flow: 0 },
        { volume: fvc * 0.15, flow: pef }, // Asumsi PEF di 15% FVC
    ];
    if (fef25) points.push({ volume: fvc * 0.25, flow: fef25 });
    if (fef50) points.push({ volume: fvc * 0.5, flow: fef50 });
    if (fef75) points.push({ volume: fvc * 0.75, flow: fef75 });
    points.push({ volume: fvc, flow: 0 });

    return points.sort((a, b) => a.volume - b.volume);
};

export const FlowVolumeChart = ({ data }) => {
    const {
        fvc, fvcPred, fvcPost,
        pef, pefPred, pefPost,
        fef25, fef25Pred, fef25Post,
        fef50, fef50Pred, fef50Post,
        fef75, fef75Pred, fef75Post,
    } = data;

    const preData = React.useMemo(() => createCurvePoints(toNum(fvc), toNum(pef), toNum(fef25), toNum(fef50), toNum(fef75)), [fvc, pef, fef25, fef50, fef75]);
    const postData = React.useMemo(() => createCurvePoints(toNum(fvcPost), toNum(pefPost), toNum(fef25Post), toNum(fef50Post), toNum(fef75Post)), [fvcPost, pefPost, fef25Post, fef50Post, fef75Post]);
    const predData = React.useMemo(() => createCurvePoints(toNum(fvcPred), toNum(pefPred), toNum(fef25Pred), toNum(fef50Pred), toNum(fef75Pred)), [fvcPred, pefPred, fef25Pred, fef50Pred, fef75Pred]);

    const yMax = Math.max(toNum(pef) || 0, toNum(pefPost) || 0, toNum(pefPred) || 0, 8) * 1.2;
    const xMax = Math.max(toNum(fvc) || 0, toNum(fvcPost) || 0, toNum(fvcPred) || 0, 5);

    return (
        <div>
            <h4 className="font-medium text-center text-sm mb-2">FLOW – VOLUME</h4>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="volume" domain={[0, xMax]} allowDecimals={false}>
                        <Label value="Volume (L)" offset={-15} position="insideBottom" />
                    </XAxis>
                    <YAxis type="number" domain={[0, Math.ceil(yMax)]} allowDecimals={false}>
                        <Label value="L/s" angle={-90} position="insideLeft" offset={10} style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />

                    {/* Predicted Curve (Garis Referensi) */}
                    <Line data={predData} type="monotone" name="Predicted" dataKey="flow" stroke="#ccc" strokeWidth={2} dot={false} activeDot={false} strokeDasharray="5 5" />
                    {/* Pre-BD Curve */}
                    <Line data={preData} type="monotone" name="Pre-BD" dataKey="flow" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    {/* Post-BD Curve (jika ada) */}
                    {postData.length > 1 && (
                        <Line data={postData} type="monotone" name="Post-BD" dataKey="flow" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};