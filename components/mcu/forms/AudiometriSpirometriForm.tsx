"use client";

import { useFormContext, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignatureField } from "./SignatureField";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import AudiogramChart from "@/components/mcu/charts/AudiogramChart";
import { FlowVolumeChart } from "@/components/mcu/charts/FlowVolumeChart";
import { VolumeTimeChart } from "@/components/mcu/charts/VolumeTimeChart";

const frekuensi = [
  "250",
  "500",
  "1000",
  "2000",
  "3000",
  "4000",
  "6000",
  "8000",
];

const toNum = (v: any) => {
  const n = typeof v === "number" ? v : v ? Number(v) : null;
  return Number.isFinite(n) ? (n as number) : null;
};

export const AudiometriSpirometriForm = ({
  itemsToCheck,
}: {
  itemsToCheck: Set<string>;
}) => {
  const { register, control } = useFormContext();
  const [showPostBD, setShowPostBD] = useState(false);

  const acKanan = useWatch({
    control,
    name: frekuensi.map((f) => `audioAcKanan${f}`),
  }).map(toNum);
  const bcKanan = useWatch({
    control,
    name: frekuensi.map((f) => `audioBcKanan${f}`),
  }).map(toNum);
  const acKiri = useWatch({
    control,
    name: frekuensi.map((f) => `audioAcKiri${f}`),
  }).map(toNum);
  const bcKiri = useWatch({
    control,
    name: frekuensi.map((f) => `audioBcKiri${f}`),
  }).map(toNum);

  const spiroChartValues = useWatch({
    control,
    name: [
      "spirometriFvc",
      "spirometriFvcPred",
      "spirometriFvcPost",
      "spirometriFev1",
      "spirometriFev1Pred",
      "spirometriFev1Post",
      "spirometriPef",
      "spirometriPefPred",
      "spirometriPefPost",
      "spirometriFef25",
      "spirometriFef25Pred",
      "spirometriFef25Post",
      "spirometriFef50",
      "spirometriFef50Pred",
      "spirometriFef50Post",
      "spirometriFef75",
      "spirometriFef75Pred",
      "spirometriFef75Post",
    ],
  });

  const spiroDataForChart = {
    fvc: spiroChartValues[0],
    fvcPred: spiroChartValues[1],
    fvcPost: spiroChartValues[2],
    fev1: spiroChartValues[3],
    fev1Pred: spiroChartValues[4],
    fev1Post: spiroChartValues[5],
    pef: spiroChartValues[6],
    pefPred: spiroChartValues[7],
    pefPost: spiroChartValues[8],
    fef25: spiroChartValues[9],
    fef25Pred: spiroChartValues[10],
    fef25Post: spiroChartValues[11],
    fef50: spiroChartValues[12],
    fef50Pred: spiroChartValues[13],
    fef50Post: spiroChartValues[14],
    fef75: spiroChartValues[15],
    fef75Pred: spiroChartValues[16],
    fef75Post: spiroChartValues[17],
  };

  const pct = (actual?: any, pred?: any) => {
    const a = Number(actual);
    const p = Number(pred);
    if (!Number.isFinite(a) || !Number.isFinite(p) || p === 0) return "";
    return Math.round((a / p) * 100);
  };
  const deltaPct = (post?: any, pre?: any) => {
    const p = Number(pre),
      q = Number(post);
    if (!Number.isFinite(p) || !Number.isFinite(q) || p === 0) return "";
    return Math.round(((q - p) / p) * 100);
  };

  const SpiroRow = ({
    label,
    actualName,
    predictedName,
    unit,
  }: {
    label: string;
    actualName: string;
    predictedName?: string;
    unit?: string;
  }) => {
    const actual = useWatch({ control, name: actualName });
    const predicted = predictedName
      ? useWatch({ control, name: predictedName })
      : null;
    const percent = predictedName ? pct(actual, predicted) : "";
    return (
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-4">
          <Label className="text-xs">{label}</Label>
        </div>
        <div className="col-span-3">
          <Input
            type="number"
            step="any"
            inputMode="decimal"
            {...register(actualName)}
          />
        </div>
        <div className="col-span-3">
          {predictedName ? (
            <Input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="Pred."
              {...register(predictedName)}
            />
          ) : (
            <div className="text-xs text-muted-foreground">—</div>
          )}
        </div>
        <div className="col-span-1">
          {predictedName ? (
            <Input readOnly value={percent === "" ? "" : `${percent}`} />
          ) : (
            <div className="text-xs text-muted-foreground">—</div>
          )}
        </div>
        <div className="col-span-1 text-xs text-muted-foreground">
          {unit || ""}
        </div>
      </div>
    );
  };

  const fev1_pre = toNum(spiroDataForChart.fev1);
  const fvc_pre = toNum(spiroDataForChart.fvc);
  const fev1_post = toNum(spiroDataForChart.fev1Post);
  const fvc_post = toNum(spiroDataForChart.fvcPost);

  const AudioCellInput = ({ name }: { name: string }) => (
    <Input
      type="number"
      inputMode="numeric"
      className="
        h-10
        text-base
        text-center
        w-full
        px-2
        [appearance:textfield]
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
      "
      {...register(name)}
    />
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Khusus</CardTitle>
        <CardDescription>
          Input hasil audiometri dan spirometri.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10">
        {itemsToCheck.has("Audiometri") && (
          <div>
            <h3 className="font-semibold mb-4 border-b pb-2">
              Audiometri - Test Audiogram
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-2 text-center">TELINGA KANAN</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px] p-2 text-xs">
                        Frekuensi
                      </TableHead>
                      {frekuensi.map((f) => (
                        <TableHead
                          key={`kanan-head-${f}`}
                          className="text-center p-2 text-xs"
                        >
                          {f}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium p-2 text-xs whitespace-nowrap">
                        AC - KANAN
                      </TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`ac-kanan-${f}`} className="p-1.5">
                          <AudioCellInput name={`audioAcKanan${f}`} />
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-2 text-xs whitespace-nowrap">
                        BC - KANAN
                      </TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`bc-kanan-${f}`} className="p-1.5">
                          <AudioCellInput name={`audioBcKanan${f}`} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-center">TELINGA KIRI</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px] p-2 text-xs">
                        Frekuensi
                      </TableHead>
                      {frekuensi.map((f) => (
                        <TableHead
                          key={`kiri-head-${f}`}
                          className="text-center p-2 text-xs"
                        >
                          {f}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium p-2 text-xs whitespace-nowrap">
                        AC - KIRI
                      </TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`ac-kiri-${f}`} className="p-1.5">
                          <AudioCellInput name={`audioAcKiri${f}`} />
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-2 text-xs whitespace-nowrap">
                        BC - KIRI
                      </TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`bc-kiri-${f}`} className="p-1.5">
                          <AudioCellInput name={`audioBcKiri${f}`} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudiogramChart
                title="TELINGA KANAN"
                acValues={acKanan}
                bcValues={bcKanan}
              />
              <AudiogramChart
                title="TELINGA KIRI"
                acValues={acKiri}
                bcValues={bcKiri}
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audio-kanan">Telinga Kanan</Label>
                  <Input
                    id="audio-kanan"
                    placeholder="Normal / Tuli Konduktif / etc."
                    {...register("audiometriKesimpulanTelingaKanan")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audio-kiri">Telinga Kiri</Label>
                  <Input
                    id="audio-kiri"
                    placeholder="Normal / Tuli Sensorineural / dll."
                    {...register("audiometriKesimpulanTelingaKiri")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio-kesimpulan">Kesimpulan</Label>
                <Textarea
                  id="audio-kesimpulan"
                  placeholder="Tuliskan kesimpulan umum dari hasil pemeriksaan audiometri..."
                  {...register("audiometriKesimpulanUmum")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio-saran">Saran</Label>
                <Textarea
                  id="audio-saran"
                  placeholder="Tuliskan saran yang diperlukan (jika ada)..."
                  {...register("audiometriSaran")}
                />
              </div>
            </div>

            <SignatureField
              nameFieldName="audiometriValidatorName"
              qrFieldName="audiometriValidatorQr"
              label="Nama Pemeriksa Audiometri"
            />
          </div>
        )}

        {itemsToCheck.has("Spirometri") && (
          <div>
            <h3 className="font-semibold mb-4 border-b pb-2">Spirometri</h3>
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50/50">
              <FlowVolumeChart data={spiroDataForChart} />
              <VolumeTimeChart data={spiroDataForChart} />
            </div>
            <div className="rounded-md border p-4 space-y-3">
              <div className="grid grid-cols-12 gap-2 font-semibold text-xs">
                <div className="col-span-4">Parameter</div>
                <div className="col-span-3">Actual</div>
                <div className="col-span-3">Predicted</div>
                <div className="col-span-1">%Pred</div>
                <div className="col-span-1">Unit</div>
              </div>
              <SpiroRow
                label="FVC"
                actualName="spirometriFvc"
                predictedName="spirometriFvcPred"
                unit="L"
              />
              <SpiroRow
                label="FEV1"
                actualName="spirometriFev1"
                predictedName="spirometriFev1Pred"
                unit="L"
              />
              <SpiroRow
                label="FEV1/FVC"
                actualName="spirometriFev1Fvc"
                predictedName="spirometriFev1FvcPred"
                unit="%"
              />
              <SpiroRow
                label="FEV6"
                actualName="spirometriFev6"
                predictedName="spirometriFev6Pred"
                unit="L"
              />
              <SpiroRow
                label="PEF"
                actualName="spirometriPef"
                predictedName="spirometriPefPred"
                unit="L/s"
              />
              <SpiroRow
                label="FEF25–75"
                actualName="spirometriFef2575"
                predictedName="spirometriFef2575Pred"
                unit="L/s"
              />
              <SpiroRow
                label="FEF25"
                actualName="spirometriFef25"
                predictedName="spirometriFef25Pred"
                unit="L/s"
              />
              <SpiroRow
                label="FEF50"
                actualName="spirometriFef50"
                predictedName="spirometriFef50Pred"
                unit="L/s"
              />
              <SpiroRow
                label="FEF75"
                actualName="spirometriFef75"
                predictedName="spirometriFef75Pred"
                unit="L/s"
              />
            </div>
            <div className="mt-4 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">
                  Post-Bronchodilator (opsional)
                </Label>
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPostBD}
                    onChange={(e) => setShowPostBD(e.target.checked)}
                  />
                  Aktifkan
                </label>
              </div>
              {showPostBD && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      Post-BD Values
                    </h4>
                    <div className="space-y-3 rounded-md border p-3">
                      <SpiroRow
                        label="FVC Post"
                        actualName="spirometriFvcPost"
                        predictedName="spirometriFvcPred"
                        unit="L"
                      />
                      <SpiroRow
                        label="FEV1 Post"
                        actualName="spirometriFev1Post"
                        predictedName="spirometriFev1Pred"
                        unit="L"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Perubahan</h4>
                    <div className="space-y-2 rounded-md border p-3 text-sm">
                      <div className="flex justify-between">
                        <span>Perubahan FVC:</span>
                        <span className="font-mono">
                          {deltaPct(fvc_post, fvc_pre) || "-"}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Perubahan FEV1:</span>
                        <span className="font-mono">
                          {deltaPct(fev1_post, fev1_pre) || "-"}%
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <Label className="text-xs">Catatan Respon</Label>
                        <Input
                          className="mt-1"
                          placeholder="Reversibilitas, dll."
                          {...register("spirometriPostBdNote")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Quality – Acceptability</Label>
                <Input
                  placeholder="Baik / Cukup / Kurang"
                  {...register("spirometriQualityAccept")}
                />
              </div>
              <div className="space-y-2">
                <Label>Quality – Repeatability</Label>
                <Input
                  placeholder="Memenuhi / Tidak"
                  {...register("spirometriQualityRepeat")}
                />
              </div>
              <div className="space-y-2">
                <Label>Jumlah Usaha (Effort)</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  {...register("spirometriEffortCount")}
                />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Label>Kesimpulan Spirometri</Label>
              <Textarea
                {...register("kesimpulanSpirometri")}
                placeholder="Tuliskan kesimpulan hasil pemeriksaan..."
              />
            </div>
            <div className="mt-4 space-y-2">
              <Label>Upload Gambar Grafik Spirometri (opsional)</Label>
              <Input type="file" {...register("spirometriImage")} />
              <p className="text-xs text-muted-foreground">
                FV loop & VT curve dari alat (jika ada).
              </p>
            </div>
            <SignatureField
              nameFieldName="spirometriValidatorName"
              qrFieldName="spirometriValidatorQr"
              label="Nama Pemeriksa Spirometri"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
