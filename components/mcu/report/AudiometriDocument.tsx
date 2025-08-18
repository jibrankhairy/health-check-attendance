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
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

type Maybe<T> = T | null | undefined;

type AudiometriData = {
  patient?: Maybe<Patient>;
  audiometriValidatorName?: string | null;
  audiometriValidatorQr?: string | null;

  audiometriKesimpulanTelingaKanan?: string | null;
  audiometriKesimpulanTelingaKiri?: string | null;
  audiometriKesimpulanUmum?: string | null;
  audiometriSaran?: string | null;

  kesimpulanAudiometri?: string | null;
} & Record<string, unknown>;

const FREQS = ["250", "500", "1000", "2000", "3000", "4000", "6000", "8000"];
const Y_MIN = 0;
const Y_MAX = 80;
const CHART_W = 250;
const CHART_H = 180;
const M = { top: 20, right: 20, bottom: 24, left: 28 };

const xScale = (i: number) =>
  M.left + (i * (CHART_W - M.left - M.right)) / (FREQS.length - 1);

const yScale = (val: number) => {
  const v = Math.min(Math.max(val, Y_MIN), Y_MAX);
  const t = (v - Y_MIN) / (Y_MAX - Y_MIN);
  return M.top + t * (CHART_H - M.top - M.bottom);
};

const toNum = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (v == null) return null;
  const n = Number(v as any);
  return Number.isFinite(n) ? n : null;
};

const buildPoints = (values: (number | null)[]) => {
  const pts: string[] = [];
  values.forEach((v, i) => {
    if (v == null) return;
    pts.push(`${xScale(i)},${yScale(v)}`);
  });
  return pts.join(" ");
};

const drawTicksY = () => {
  const ticks: number[] = [];
  for (let d = Y_MIN; d <= Y_MAX; d += 10) ticks.push(d);
  return ticks;
};

const localStyles = StyleSheet.create({
  header: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 12,
  },
  chartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  chartBox: {
    width: CHART_W,
    height: CHART_H + 18,
  },
  chartTitle: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#555",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: { flexDirection: "row", backgroundColor: "#fff" },
  tableColHeader: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#555",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    backgroundColor: "#f0f0f0",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: 8,
  },
  tableCol: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#555",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    textAlign: "center",
    fontSize: 9,
  },
  tableColFrekuensi: { width: "10.625%" },
  conclusionSection: { marginTop: 16, fontSize: 10, lineHeight: 1.5 },
  conclusionRow: { flexDirection: "row", marginBottom: 4 },
  conclusionLabel: { width: 120, fontFamily: "Helvetica-Bold" },
  conclusionValue: { flex: 1 },

  validatorBox: {
    position: "absolute",
    right: 40,
    bottom: 72,
    alignItems: "center",
  },
  validatorName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  validatorLabel: {
    fontSize: 5,
  },
  validatorQr: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
});

function AudiogramSvg({
  title,
  acValues,
  bcValues,
}: {
  title: string;
  acValues: (number | null)[];
  bcValues: (number | null)[];
}) {
  const yTicks = drawTicksY();

  return (
    <View style={localStyles.chartBox}>
      <Text style={localStyles.chartTitle}>{title}</Text>
      <Svg width={CHART_W} height={CHART_H}>
        <Rect
          x={0}
          y={0}
          width={CHART_W}
          height={CHART_H}
          fill="#ffffff"
          stroke="#cccccc"
          strokeWidth={1}
        />

        {yTicks.map((t) => (
          <React.Fragment key={`yt-${t}`}>
            <Line
              x1={M.left}
              y1={yScale(t)}
              x2={CHART_W - M.right}
              y2={yScale(t)}
              stroke="#e6e6e6"
              strokeWidth={1}
            />
            <Text
              x={M.left - 6}
              y={yScale(t) + 3}
              textAnchor="end"
              style={{ fontSize: 7, fill: "#333" } as any}
            >
              {t}
            </Text>
          </React.Fragment>
        ))}

        {FREQS.map((f, i) => (
          <React.Fragment key={`x-${f}`}>
            <Line
              x1={xScale(i)}
              y1={M.top}
              x2={xScale(i)}
              y2={CHART_H - M.bottom}
              stroke="#f0f0f0"
              strokeWidth={1}
            />
            <Text
              x={xScale(i)}
              y={CHART_H - M.bottom + 12}
              textAnchor="middle"
              style={{ fontSize: 7, fill: "#333" } as any}
            >
              {f}
            </Text>
          </React.Fragment>
        ))}

        <Line
          x1={M.left}
          y1={M.top}
          x2={M.left}
          y2={CHART_H - M.bottom}
          stroke="#555"
          strokeWidth={1}
        />
        <Line
          x1={M.left}
          y1={CHART_H - M.bottom}
          x2={CHART_W - M.right}
          y2={CHART_H - M.bottom}
          stroke="#555"
          strokeWidth={1}
        />

        {buildPoints(acValues) && (
          <Polyline
            points={buildPoints(acValues)}
            fill="none"
            stroke="#000000"
            strokeWidth={1.2}
          />
        )}
        {acValues.map((v, i) =>
          v == null ? null : (
            <Circle
              key={`ac-dot-${i}`}
              cx={xScale(i)}
              cy={yScale(v)}
              r={2.2}
              fill="#000000"
            />
          )
        )}

        {buildPoints(bcValues) && (
          <Polyline
            points={buildPoints(bcValues)}
            fill="none"
            stroke="#000000"
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
        )}
        {bcValues.map((v, i) =>
          v == null ? null : (
            <Circle
              key={`bc-dot-${i}`}
              cx={xScale(i)}
              cy={yScale(v)}
              r={2.2}
              fill="#000000"
            />
          )
        )}

        <Text
          x={M.left - 18}
          y={M.top - 6}
          textAnchor="start"
          style={{ fontSize: 7, fill: "#333" } as any}
        >
          dB HL
        </Text>
      </Svg>
    </View>
  );
}

function parseLegacyKesimpulan(s?: string | null) {
  const lines = (s || "").split("\n").map((x) => x.trim());
  const pick = (prefix: string) =>
    lines
      .find((l) => l.toLowerCase().startsWith(prefix))
      ?.split(":")[1]
      ?.trim() || undefined;
  return {
    kanan: pick("telinga kanan"),
    kiri: pick("telinga kiri"),
    umum: pick("kesimpulan"),
    saran: pick("saran"),
  };
}

export const AudiometriDocument: React.FC<{ data: AudiometriData }> = ({
  data,
}) => {
  const acKanan = FREQS.map((f) => toNum(data?.[`audioAcKanan${f}`]));
  const bcKanan = FREQS.map((f) => toNum(data?.[`audioBcKanan${f}`]));
  const acKiri = FREQS.map((f) => toNum(data?.[`audioAcKiri${f}`]));
  const bcKiri = FREQS.map((f) => toNum(data?.[`audioBcKiri${f}`]));

  const legacy = parseLegacyKesimpulan(data?.kesimpulanAudiometri);

  const telingaKanan =
    data?.audiometriKesimpulanTelingaKanan ?? legacy.kanan ?? "-";

  const telingaKiri =
    data?.audiometriKesimpulanTelingaKiri ?? legacy.kiri ?? "-";

  const kesimpulan = data?.audiometriKesimpulanUmum ?? legacy.umum ?? "-";

  const saran = data?.audiometriSaran ?? legacy.saran ?? "-";

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={localStyles.chartsRow as any} />

      <View style={globalStyles.body}>
        <Text style={localStyles.header}>HASIL PEMERIKSAAN AUDIOMETRI</Text>

        <View style={localStyles.chartsRow}>
          <AudiogramSvg
            title="TELINGA KANAN"
            acValues={acKanan}
            bcValues={bcKanan}
          />
          <AudiogramSvg
            title="TELINGA KIRI"
            acValues={acKiri}
            bcValues={bcKiri}
          />
        </View>

        <View style={localStyles.table}>
          <View style={localStyles.tableRow}>
            <View style={[localStyles.tableColHeader]}>
              <Text>Frekuensi</Text>
            </View>
            {FREQS.map((f) => (
              <View
                key={`head-${f}`}
                style={[
                  localStyles.tableColHeader,
                  localStyles.tableColFrekuensi,
                ]}
              >
                <Text>{f}</Text>
              </View>
            ))}
          </View>

          <View style={localStyles.tableRow}>
            <View style={localStyles.tableCol}>
              <Text>AC KANAN</Text>
            </View>
            {FREQS.map((f) => (
              <View
                key={`ac-kanan-${f}`}
                style={[localStyles.tableCol, localStyles.tableColFrekuensi]}
              >
                <Text>{(data?.[`audioAcKanan${f}`] as any) ?? "-"}</Text>
              </View>
            ))}
          </View>

          <View style={localStyles.tableRow}>
            <View style={localStyles.tableCol}>
              <Text>BC KANAN</Text>
            </View>
            {FREQS.map((f) => (
              <View
                key={`bc-kanan-${f}`}
                style={[localStyles.tableCol, localStyles.tableColFrekuensi]}
              >
                <Text>{(data?.[`audioBcKanan${f}`] as any) ?? "-"}</Text>
              </View>
            ))}
          </View>

          <View style={localStyles.tableRow}>
            <View style={localStyles.tableCol}>
              <Text>AC KIRI</Text>
            </View>
            {FREQS.map((f) => (
              <View
                key={`ac-kiri-${f}`}
                style={[localStyles.tableCol, localStyles.tableColFrekuensi]}
              >
                <Text>{(data?.[`audioAcKiri${f}`] as any) ?? "-"}</Text>
              </View>
            ))}
          </View>

          <View style={localStyles.tableRow}>
            <View style={localStyles.tableCol}>
              <Text>BC KIRI</Text>
            </View>
            {FREQS.map((f) => (
              <View
                key={`bc-kiri-${f}`}
                style={[localStyles.tableCol, localStyles.tableColFrekuensi]}
              >
                <Text>{(data?.[`audioBcKiri${f}`] as any) ?? "-"}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={localStyles.conclusionSection}>
          <View style={localStyles.conclusionRow}>
            <Text style={localStyles.conclusionLabel}>Telinga Kanan</Text>
            <Text style={localStyles.conclusionValue}>: {telingaKanan}</Text>
          </View>
          <View style={localStyles.conclusionRow}>
            <Text style={localStyles.conclusionLabel}>Telinga Kiri</Text>
            <Text style={localStyles.conclusionValue}>: {telingaKiri}</Text>
          </View>
          <View style={localStyles.conclusionRow}>
            <Text style={localStyles.conclusionLabel}>Kesimpulan</Text>
            <Text style={localStyles.conclusionValue}>: {kesimpulan}</Text>
          </View>
          <View style={localStyles.conclusionRow}>
            <Text style={localStyles.conclusionLabel}>Saran</Text>
            <Text style={localStyles.conclusionValue}>: {saran}</Text>
          </View>
        </View>
      </View>

      {(data?.audiometriValidatorName || data?.audiometriValidatorQr) && (
        <View style={localStyles.validatorBox}>
          {data?.audiometriValidatorQr && (
            <Image
              src={data.audiometriValidatorQr as string}
              style={localStyles.validatorQr}
            />
          )}
          {data?.audiometriValidatorName && (
            <Text style={localStyles.validatorName}>
              {data.audiometriValidatorName as string}
            </Text>
          )}
          <Text style={localStyles.validatorLabel}>Validator</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};
