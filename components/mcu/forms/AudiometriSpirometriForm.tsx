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
import { useMemo, useState } from "react";

import AudiogramChart from "@/components/mcu/charts/AudiogramChart";

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

  const spiroWatch = useWatch({
    control,
    name: [
      "spirometriFvc", // index 0
      "spirometriFvcPred", // index 1
      "spirometriFev1", // index 2
      "spirometriFev1Pred", // index 3
      "spirometriFev1Fvc", // index 4
      "spirometriFev1FvcPred", // index 5
      "spirometriPef", // index 6
      "spirometriPefPred", // index 7
      "spirometriFef2575", // index 8
      "spirometriFef2575Pred", // index 9
      "spirometriFef25", // index 10
      "spirometriFef25Pred", // index 11
      "spirometriFef50", // index 12
      "spirometriFef50Pred", // index 13
      "spirometriFef75", // index 14
      "spirometriFef75Pred", // index 15
      "spirometriFev6", // index 16
      "spirometriFev6Pred", // index 17
      // Post-BD (opsional)
      "spirometriFev1Post", // index 18
      "spirometriFvcPost", // index 19
    ],
  });

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
    readOnly = false,
  }: {
    label: string;
    actualName: string;
    predictedName?: string;
    unit?: string;
    readOnly?: boolean;
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
            disabled={readOnly}
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

  const fev1 = toNum(spiroWatch[2]);
  const fev1Post = toNum(spiroWatch[18]);
  const fvc = toNum(spiroWatch[0]);
  const fvcPost = toNum(spiroWatch[19]);
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
                      <TableHead className="w-[100px]">Frekuensi</TableHead>
                      {frekuensi.map((f) => (
                        <TableHead
                          key={`kanan-head-${f}`}
                          className="text-center"
                        >
                          {f}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">AC - KANAN</TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`ac-kanan-${f}`}>
                          <Input
                            type="number"
                            inputMode="numeric"
                            className="text-center"
                            {...register(`audioAcKanan${f}`)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BC - KANAN</TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`bc-kanan-${f}`}>
                          <Input
                            type="number"
                            inputMode="numeric"
                            className="text-center"
                            {...register(`audioBcKanan${f}`)}
                          />
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
                      <TableHead className="w-[100px]">Frekuensi</TableHead>
                      {frekuensi.map((f) => (
                        <TableHead
                          key={`kiri-head-${f}`}
                          className="text-center"
                        >
                          {f}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">AC - KIRI</TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`ac-kiri-${f}`}>
                          <Input
                            type="number"
                            inputMode="numeric"
                            className="text-center"
                            {...register(`audioAcKiri${f}`)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BC - KIRI</TableCell>
                      {frekuensi.map((f) => (
                        <TableCell key={`bc-kiri-${f}`}>
                          <Input
                            type="number"
                            inputMode="numeric"
                            className="text-center"
                            {...register(`audioBcKiri${f}`)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Grafik live */}
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

            <div className="mt-6 space-y-2">
              <Label>Kesimpulan & Saran Audiometri</Label>
              <Textarea
                {...register("kesimpulanAudiometri")}
                placeholder={`Kesimpulan: Normal\nTelinga Kanan: Normal\nTelinga Kiri: Normal\nSaran: Tidak ada`}
              />
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
                <div className="mt-3 grid grid-cols-12 gap-3">
                  <div className="col-span-4">
                    <Label className="text-xs">FEV1 Post (L)</Label>
                    <Input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      {...register("spirometriFev1Post")}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Δ%:{" "}
                      {deltaPct(fev1Post, fev1) === ""
                        ? "-"
                        : `${deltaPct(fev1Post, fev1)}%`}
                    </p>
                  </div>
                  <div className="col-span-4">
                    <Label className="text-xs">FVC Post (L)</Label>
                    <Input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      {...register("spirometriFvcPost")}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Δ%:{" "}
                      {deltaPct(fvcPost, fvc) === ""
                        ? "-"
                        : `${deltaPct(fvcPost, fvc)}%`}
                    </p>
                  </div>
                  <div className="col-span-4">
                    <Label className="text-xs">Catatan Respon</Label>
                    <Input
                      placeholder="Reversibilitas, dll."
                      {...register("spirometriPostBdNote")}
                    />
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
                placeholder="Tuliskan kesimpulan hasil pemeriksaan (Normal/Obstruktif/Restriktif/Mixed, derajat, rekomendasi, dll.)"
              />
            </div>

            <div className="mt-4 space-y-2">
              <Label>Upload Gambar Grafik Spirometri (jika ada)</Label>
              <Input type="file" {...register("spirometriImage")} />
              <p className="text-xs text-muted-foreground">
                FV loop & VT curve dari alat (opsional – PDF tetap bisa
                menggambar grafik dari angka).
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
