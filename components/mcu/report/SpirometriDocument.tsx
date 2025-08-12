// components/mcu/report/SpirometriDocument.tsx
"use client";

import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Line,
  Rect,
  Polyline,
  Circle,
} from "@react-pdf/renderer";

import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

// ====== Konstanta chart ======
const FV_W = 260;          // lebar chart Flow–Volume
const FV_H = 180;          // tinggi chart Flow–Volume
const VT_W = 260;          // lebar chart Volume–Time
const VT_H = 180;          // tinggi chart Volume–Time
const M = { top: 18, right: 22, bottom: 28, left: 32 };

const clampNum = (v: any, fallback = 0) => {
  const n = typeof v === "number" ? v : v ? Number(v) : fallback;
  return Number.isFinite(n) ? n : fallback;
};

// ====== Style ======
const localStyles = StyleSheet.create({
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
    textDecoration: "underline",
  },
  chartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartBox: {
    width: FV_W,
    height: FV_H + 16,
  },
  chartTitle: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  reportSection: { marginTop: 12, fontSize: 10 },
  reportRow: {
    flexDirection: "row",
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: 6,
  },
  reportLabel: { width: "30%", fontFamily: "Helvetica-Bold" },
  reportValue: { width: "70%" },
});

// ====== SCALE UTILS ======
// Linear scale helper
const scaleLinear = (domainMin: number, domainMax: number, rangeMin: number, rangeMax: number) => {
  const d = domainMax - domainMin || 1;
  const r = rangeMax - rangeMin;
  return (x: number) => rangeMin + ((x - domainMin) / d) * r;
};

// ====== Flow–Volume Chart ======
function FlowVolumeChart({
  FVC,
  PEF,
  FEF25,
  FEF50,
  FEF75,
}: {
  FVC: number;
  PEF: number;
  FEF25: number | null;
  FEF50: number | null;
  FEF75: number | null;
}) {
  // Domain X = Volume [0..FVC], Y = Flow [0..yMax]
  const yMax = Math.max(10, Math.ceil((PEF || 0) * 1.2)); // beri headroom
  const x = scaleLinear(0, Math.max(FVC, 1), M.left, FV_W - M.right);
  const y = scaleLinear(0, yMax, FV_H - M.bottom, M.top);

  // Titik kontrol:
  const vPEF = 0.15 * FVC; // asumsi peak flow tercapai ~15% FVC (bisa di-tune)
  const pts: Array<[number, number]> = [
    [0, 0],
    [vPEF, PEF],
  ];
  if (FEF25 != null) pts.push([0.25 * FVC, FEF25]);
  if (FEF50 != null) pts.push([0.50 * FVC, FEF50]);
  if (FEF75 != null) pts.push([0.75 * FVC, FEF75]);
  pts.push([FVC, 0]);

  const svgPts = pts.map(([vx, fy]) => `${x(vx)},${y(fy)}`).join(" ");

  // y ticks tiap 1–2 L/s (biar rapih)
  const yTickStep = yMax <= 8 ? 1 : 2;
  const yTicks: number[] = [];
  for (let t = 0; t <= yMax; t += yTickStep) yTicks.push(t);

  // x ticks per 0.5 L
  const xTicks: number[] = [];
  const xStep = FVC <= 3 ? 0.5 : 1;
  for (let t = 0; t <= Math.ceil(FVC); t += xStep) xTicks.push(t);

  return (
    <View style={localStyles.chartBox}>
      <Text style={localStyles.chartTitle}>FLOW – VOLUME</Text>
      <Svg width={FV_W} height={FV_H}>
        <Rect x={0} y={0} width={FV_W} height={FV_H} fill="#fff" stroke="#ccc" strokeWidth={1} />

        {/* Grid Y */}
        {yTicks.map((t) => (
          <React.Fragment key={`fy-${t}`}>
            <Line x1={M.left} y1={y(t)} x2={FV_W - M.right} y2={y(t)} stroke="#eaeaea" />
            <Text x={M.left - 6} y={y(t) + 3} fontSize={7} textAnchor="end" fill="#333">
              {t}
            </Text>
          </React.Fragment>
        ))}

        {/* Grid X */}
        {xTicks.map((t) => (
          <React.Fragment key={`fx-${t}`}>
            <Line x1={x(t)} y1={M.top} x2={x(t)} y2={FV_H - M.bottom} stroke="#f5f5f5" />
            <Text x={x(t)} y={FV_H - M.bottom + 12} fontSize={7} textAnchor="middle" fill="#333">
              {t}
            </Text>
          </React.Fragment>
        ))}

        {/* Axes */}
        <Line x1={M.left} y1={M.top} x2={M.left} y2={FV_H - M.bottom} stroke="#555" />
        <Line x1={M.left} y1={FV_H - M.bottom} x2={FV_W - M.right} y2={FV_H - M.bottom} stroke="#555" />

        {/* Curve & dots */}
        <Polyline points={svgPts} fill="none" stroke="#000" strokeWidth={1.2} />
        {pts.map(([vx, fy], i) => (
          <Circle key={`p-${i}`} cx={x(vx)} cy={y(fy)} r={2.1} fill="#000" />
        ))}

        <Text x={M.left - 20} y={M.top - 6} fontSize={7} textAnchor="start" fill="#333">
          L/s
        </Text>
        <Text x={(FV_W - M.right + M.left) / 2} y={FV_H - 2} fontSize={7} textAnchor="middle" fill="#333">
          Volume (L)
        </Text>
      </Svg>
    </View>
  );
}

// ====== Volume–Time Chart ======
function VolumeTimeChart({
  FVC,
  FEV1,
  FEV6,
}: {
  FVC: number;
  FEV1: number | null;
  FEV6: number | null;
}) {
  // Domain waktu 0..6s (umum)
  const tMax = 6;
  const x = scaleLinear(0, tMax, M.left, VT_W - M.right);
  const y = scaleLinear(0, Math.max(FVC, 1), VT_H - M.bottom, M.top);

  // Bentuk kurva eksponensial: V(t) = FVC*(1 - e^{-k t})
  // k ditentukan agar V(1) = FEV1 (kalau ada). Jika tidak ada, pakai k default.
  let k = 1.2; // default
  if (FEV1 && FVC && FEV1 < FVC) {
    const ratio = 1 - FEV1 / FVC;
    if (ratio > 0 && ratio < 1) k = -Math.log(ratio); // k = -ln(1 - FEV1/FVC)
  }

  const samples: Array<[number, number]> = [];
  const step = 0.15; // sampling 0.15s
  for (let t = 0; t <= tMax + 1e-6; t += step) {
    let vol = FVC * (1 - Math.exp(-k * t));
    if (FEV6 && t >= 6) vol = FEV6; // kalau ada FEV6, kunci titik di 6s
    if (vol > FVC) vol = FVC;
    samples.push([t, vol]);
  }
  const pts = samples.map(([t, v]) => `${x(t)},${y(v)}`).join(" ");

  // grid
  const tTicks = [0, 1, 2, 3, 4, 5, 6];
  const vTicks: number[] = [];
  const vStep = FVC <= 3 ? 0.5 : 1;
  for (let v = 0; v <= Math.ceil(FVC); v += vStep) vTicks.push(v);

  return (
    <View style={{ width: VT_W, height: VT_H + 16 }}>
      <Text style={localStyles.chartTitle}>VOLUME – TIME</Text>
      <Svg width={VT_W} height={VT_H}>
        <Rect x={0} y={0} width={VT_W} height={VT_H} fill="#fff" stroke="#ccc" strokeWidth={1} />

        {/* Grid Y */}
        {vTicks.map((v) => (
          <React.Fragment key={`vy-${v}`}>
            <Line x1={M.left} y1={y(v)} x2={VT_W - M.right} y2={y(v)} stroke="#eaeaea" />
            <Text x={M.left - 6} y={y(v) + 3} fontSize={7} textAnchor="end" fill="#333">
              {v}
            </Text>
          </React.Fragment>
        ))}

        {/* Grid X */}
        {tTicks.map((t) => (
          <React.Fragment key={`vt-${t}`}>
            <Line x1={x(t)} y1={M.top} x2={x(t)} y2={VT_H - M.bottom} stroke="#f5f5f5" />
            <Text x={x(t)} y={VT_H - M.bottom + 12} fontSize={7} textAnchor="middle" fill="#333">
              {t}
            </Text>
          </React.Fragment>
        ))}

        {/* Axes */}
        <Line x1={M.left} y1={M.top} x2={M.left} y2={VT_H - M.bottom} stroke="#555" />
        <Line x1={M.left} y1={VT_H - M.bottom} x2={VT_W - M.right} y2={VT_H - M.bottom} stroke="#555" />

        {/* Curve */}
        <Polyline points={pts} fill="none" stroke="#000" strokeWidth={1.2} />

        {/* Markers FEV1 & FEV6 jika ada */}
        {FEV1 != null && (
          <>
            <Line x1={x(1)} y1={y(0)} x2={x(1)} y2={y(FEV1)} stroke="#999" strokeDasharray="3 3" />
            <Line x1={x(0)} y1={y(FEV1)} x2={x(1)} y2={y(FEV1)} stroke="#999" strokeDasharray="3 3" />
            <Circle cx={x(1)} cy={y(FEV1)} r={2.1} fill="#000" />
          </>
        )}
        {FEV6 != null && (
          <>
            <Line x1={x(6)} y1={y(0)} x2={x(6)} y2={y(FEV6)} stroke="#bbb" strokeDasharray="4 3" />
            <Circle cx={x(6)} cy={y(FEV6)} r={2.1} fill="#000" />
          </>
        )}

        <Text x={M.left - 20} y={M.top - 6} fontSize={7} textAnchor="start" fill="#333">
          Liter
        </Text>
        <Text x={(VT_W - M.right + M.left) / 2} y={VT_H - 2} fontSize={7} textAnchor="middle" fill="#333">
          Time (s)
        </Text>
      </Svg>
    </View>
  );
}

// ====== Halaman ======
export const SpirometriDocument = ({ data }) => {
  const FVC = clampNum(data?.spirometriFvc, 0);
  const FEV1 = data?.spirometriFev1 != null ? clampNum(data.spirometriFev1) : null;
  const FEV6 = data?.spirometriFev6 != null ? clampNum(data.spirometriFev6) : null; // opsional jika ada
  const FEV1FVC = data?.spirometriFev1Fvc;

  const PEF = clampNum(data?.spirometriPef ?? data?.spirometriPEF ?? data?.PEF, 0);
  const FEF25 = data?.spirometriFef25 != null ? clampNum(data.spirometriFef25) : null;
  const FEF50 = data?.spirometriFef50 != null ? clampNum(data.spirometriFef50) : null;
  const FEF75 = data?.spirometriFef75 != null ? clampNum(data.spirometriFef75) : null;

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.headerText}>HASIL PEMERIKSAAN SPIROMETRI</Text>

        {/* Grafik */}
        <View style={localStyles.chartsRow}>
          <FlowVolumeChart FVC={FVC} PEF={PEF} FEF25={FEF25} FEF50={FEF50} FEF75={FEF75} />
          <VolumeTimeChart FVC={FVC} FEV1={FEV1} FEV6={FEV6} />
        </View>

        {/* Nilai-nilai ringkas */}
        <View style={localStyles.reportSection}>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>FVC (L)</Text>
            <Text style={localStyles.reportValue}>: {data?.spirometriFvc || "-"}</Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>FEV1 (L)</Text>
            <Text style={localStyles.reportValue}>: {data?.spirometriFev1 || "-"}</Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>FEV1/FVC (%)</Text>
            <Text style={localStyles.reportValue}>: {FEV1FVC || "-"}</Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>PEF (L/s)</Text>
            <Text style={localStyles.reportValue}>: {data?.spirometriPef || data?.spirometriPEF || data?.PEF || "-"}</Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>FEF25/50/75 (L/s)</Text>
            <Text style={localStyles.reportValue}>: {(data?.spirometriFef25 ?? "-")}/{(data?.spirometriFef50 ?? "-")}/{(data?.spirometriFef75 ?? "-")}</Text>
          </View>
          <View style={[localStyles.reportRow, { marginTop: 10 }]}>
            <Text style={localStyles.reportLabel}>Kesimpulan</Text>
            <Text style={localStyles.reportValue}>: {data?.kesimpulanSpirometri || "-"}</Text>
          </View>
        </View>

        {/* Signature kanan bawah (format seragam) */}
        {(data?.spirometriValidatorName || data?.spirometriValidatorQr) && (
          <View style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}>
            {data?.spirometriValidatorQr && (
              <Image src={data.spirometriValidatorQr} style={{ width: 80, height: 80, marginBottom: 8 }} />
            )}
            {data?.spirometriValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>{data.spirometriValidatorName}</Text>
            )}
            <Text style={{ fontSize: 5 }}>Validator</Text>
          </View>
        )}
      </View>

      <ReportFooter />
    </Page>
  );
};
