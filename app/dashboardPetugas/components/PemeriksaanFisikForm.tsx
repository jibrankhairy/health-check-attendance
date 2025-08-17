"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export type PemeriksaanFisikFormValues = {
  kondisiKesehatan: "BAIK" | "SEDANG" | "BURUK";
  kesadaran: string;
  beratBadanKg: number | "";
  tinggiBadanCm: number | "";
  bmi: number;
  lingkarPerutCm: number | "";
  suhuC: number | "";
  tensiSistol: number | "";
  tensiDiastol: number | "";
  nadiPerMenit: number | "";
  pernapasanPerMenit: number | "";
  hipoHiperpigmentasi: "POSITIF" | "NEGATIF";
  rash: "POSITIF" | "NEGATIF";

  deviasiSeptum: "YA" | "TIDAK";
  pembesaranKonka: "YA" | "TIDAK";
  tonsilUkuran: string;
  pharingHipermis: "YA" | "TIDAK";
  lidah: "NORMAL" | "ABNORMAL";
  gigiKaries: "ADA" | "TIDAK";
  gigiHilang: "ADA" | "TIDAK";
  gigiPalsu: "ADA" | "TIDAK";
  leherKondisi: "NORMAL" | "ABNORMAL";
  tiroid: "POSITIF" | "NEGATIF";
  kelenjarLymp: "POSITIF" | "NEGATIF";

  butaWarna: "NORMAL" | "ABNORMAL";
  anemiaOD: string;
  anemiaOS: string;
  ikterikOD: string;
  ikterikOS: string;
  pupilOD: string;
  pupilOS: string;
  refleksOD: "NORMAL" | "ABNORMAL";
  refleksOS: "NORMAL" | "ABNORMAL";
  pupilDistance: string;
  kacamata: "ADA" | "TIDAK";
  ukuranOD: string;
  ukuranOS: string;
  visusOD: string;
  visusOS: string;
  lapangPandang: "NORMAL" | "ABNORMAL";
  ketajaman: "NORMAL" | "ABNORMAL";

  kemampuanPendengaranAD: "BAIK" | "SEDANG" | "BURUK";
  kemampuanPendengaranAS: "BAIK" | "SEDANG" | "BURUK";
  telingaLuarAD: "NORMAL" | "ABNORMAL";
  telingaLuarAS: "NORMAL" | "ABNORMAL";
  nyeriTekanAD: "YA" | "TIDAK";
  nyeriTekanAS: "YA" | "TIDAK";
  serumenAD: "POSITIF" | "NEGATIF";
  serumenAS: "POSITIF" | "NEGATIF";
  gendangAD: string;
  gendangAS: string;

  ictusInspeksi: string;
  ictusPalpasi: string;
  batasJantung: "NORMAL" | "ABNORMAL";
  bisingJantung: "ADA" | "TIDAK";

  paruInspeksi: string;
  paruPalpasi: "NORMAL" | "ABNORMAL";
  paruPerkusi: string;
  paruAuskultasi: string;

  cernaInspeksi: string;
  hepar: string;
  lien: string;
  cernaPerkusi: "NORMAL" | "ABNORMAL";
  peristaltik: "NORMAL" | "ABNORMAL";

  deformitas: string;
  oedema: string;
  functioLaesa: string;
  refleksFisiologis: "ADA" | "TIDAK";
  refleksPatologis: "ADA" | "TIDAK";

  tulangBelakang: "NORMAL" | "ABNORMAL";

  psikis: "NORMAL" | "ABNORMAL";
  sikap: "NORMAL" | "ABNORMAL";
  dayaIngat: "BAIK" | "SEDANG" | "BURUK";
  orientasi: "BAIK" | "SEDANG" | "BURUK";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PemeriksaanFisikFormValues) => Promise<void> | void;
  submitting?: boolean;
  onBack?: () => void;
};

export default function PemeriksaanFisikFormModal({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  onBack,
}: Props) {
  const DEFAULTS: PemeriksaanFisikFormValues = {
    kondisiKesehatan: "BAIK",
    kesadaran: "",
    beratBadanKg: "",
    tinggiBadanCm: "",
    bmi: 0,
    lingkarPerutCm: "",
    suhuC: "",
    tensiSistol: "",
    tensiDiastol: "",
    nadiPerMenit: "",
    pernapasanPerMenit: "",
    hipoHiperpigmentasi: "NEGATIF",
    rash: "NEGATIF",
    deviasiSeptum: "TIDAK",
    pembesaranKonka: "TIDAK",
    tonsilUkuran: "",
    pharingHipermis: "TIDAK",
    lidah: "NORMAL",
    gigiKaries: "TIDAK",
    gigiHilang: "TIDAK",
    gigiPalsu: "TIDAK",
    leherKondisi: "NORMAL",
    tiroid: "NEGATIF",
    kelenjarLymp: "NEGATIF",
    butaWarna: "NORMAL",
    anemiaOD: "",
    anemiaOS: "",
    ikterikOD: "",
    ikterikOS: "",
    pupilOD: "",
    pupilOS: "",
    refleksOD: "NORMAL",
    refleksOS: "NORMAL",
    pupilDistance: "-",
    kacamata: "TIDAK",
    ukuranOD: "-",
    ukuranOS: "-",
    visusOD: "",
    visusOS: "",
    lapangPandang: "NORMAL",
    ketajaman: "NORMAL",
    kemampuanPendengaranAD: "BAIK",
    kemampuanPendengaranAS: "BAIK",
    telingaLuarAD: "NORMAL",
    telingaLuarAS: "NORMAL",
    nyeriTekanAD: "TIDAK",
    nyeriTekanAS: "TIDAK",
    serumenAD: "NEGATIF",
    serumenAS: "NEGATIF",
    gendangAD: "",
    gendangAS: "",
    ictusInspeksi: "",
    ictusPalpasi: "",
    batasJantung: "NORMAL",
    bisingJantung: "TIDAK",
    paruInspeksi: "",
    paruPalpasi: "NORMAL",
    paruPerkusi: "",
    paruAuskultasi: "",
    cernaInspeksi: "",
    hepar: "",
    lien: "",
    cernaPerkusi: "NORMAL",
    peristaltik: "NORMAL",
    deformitas: "-",
    oedema: "-",
    functioLaesa: "-",
    refleksFisiologis: "TIDAK",
    refleksPatologis: "TIDAK",
    tulangBelakang: "NORMAL",
    psikis: "NORMAL",
    sikap: "NORMAL",
    dayaIngat: "BAIK",
    orientasi: "BAIK",
  };

  const form = useForm<PemeriksaanFisikFormValues>({
    defaultValues: DEFAULTS,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(DEFAULTS);
    }
  }, [isOpen, form]);

  const bb = form.watch("beratBadanKg");
  const tb = form.watch("tinggiBadanCm");

  useEffect(() => {
    const w = Number(bb);
    const hcm = Number(tb);

    if (Number.isFinite(w) && Number.isFinite(hcm) && hcm > 0) {
      const hm = hcm / 100;
      const bmi = parseFloat((w / (hm * hm)).toFixed(2));
      form.setValue("bmi", bmi, { shouldDirty: true, shouldValidate: false });
    } else {
      form.setValue("bmi", 0, { shouldDirty: true, shouldValidate: false });
    }
  }, [bb, tb, form]);

  const RowInput = (
    name: keyof PemeriksaanFisikFormValues,
    label: string,
    placeholder?: string,
    type: "text" | "number" = "text",
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <FormField
      control={form.control}
      name={name as any}
      rules={type === "text" ? { required: "Wajib diisi" } : undefined}
      render={({ field }) => (
        <FormItem className="rounded-lg border p-4 shadow-sm">
          <FormLabel className="text-sm font-normal">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              value={type === "number" ? field.value ?? 0 : field.value ?? ""}
              onChange={(e) => {
                if (type === "number") {
                  const v = e.target.value;
                  field.onChange(v === "" ? 0 : Number(v));
                } else {
                  field.onChange(e.target.value);
                }
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              {...inputProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const RowRadio = (
    name: keyof PemeriksaanFisikFormValues,
    label: string,
    options: string[],
    opts?: { stacked?: boolean }
  ) => {
    const stacked = opts?.stacked ?? false;

    return (
      <FormField
        control={form.control}
        name={name as any}
        rules={{ required: "Pilih salah satu" }}
        render={({ field }) => (
          <FormItem
            className={[
              "rounded-lg border p-4 shadow-sm",
              stacked ? "" : "sm:flex sm:items-center sm:justify-between",
            ].join(" ")}
          >
            <FormLabel
              className={[
                "text-sm font-normal",
                stacked ? "mb-3" : "mb-3 sm:mb-0 sm:pr-4",
              ].join(" ")}
            >
              {label}
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value ? String(field.value) : undefined}
                className={[
                  "flex flex-wrap gap-x-4 gap-y-2",
                  stacked ? "justify-start" : "justify-start sm:justify-end",
                ].join(" ")}
              >
                {options.map((opt) => (
                  <FormItem key={opt} className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={opt} />
                    </FormControl>
                    <FormLabel className="font-normal text-sm">{opt}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const submit = (vals: PemeriksaanFisikFormValues) => onSubmit(vals);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => (!submitting && !o ? onClose() : null)}
    >
      <DialogContent
        className="
            w-[96vw]
            sm:w-[92vw]
            md:w-auto
            sm:max-w-2xl
            md:max-w-3xl
            lg:max-w-5xl
            xl:max-w-6xl
            max-h-[90vh]
            p-0
            flex flex-col   
            overflow-hidden    
        "
        aria-describedby={undefined}
      >
        <DialogHeader className="flex flex-row items-center gap-2 px-6 pt-6 shrink-0">
          {onBack && (
            <Button type="button" variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft size={18} />
            </Button>
          )}
          <DialogTitle>Form Pemeriksaan Fisik</DialogTitle>
        </DialogHeader>

        <div
          className="
            px-6 pb-6
            flex-1 min-h-0 
            overflow-y-auto 
            "
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
              {/* A. Pemeriksaan Umum */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold">A. Pemeriksaan Umum</h3>
                {RowRadio(
                  "kondisiKesehatan",
                  "Kondisi Kesehatan Saat Diperiksa",
                  ["BAIK", "SEDANG", "BURUK"]
                )}
                {RowInput(
                  "kesadaran",
                  "Kesadaran Umum",
                  "cth..   COMPOS MENTIS",
                  "text"
                )}

                <div className="rounded-lg border p-4 shadow-sm space-y-4">
                  <div className="text-sm font-semibold">Ukuran Badan</div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {RowInput(
                      "beratBadanKg",
                      "Berat Badan (Kg)",
                      "Masukkan berat badan",
                      "number"
                    )}
                    {RowInput(
                      "tinggiBadanCm",
                      "Tinggi Badan (cm)",
                      "Masukkan tinggi badan",
                      "number"
                    )}
                    <div>
                      <FormField
                        control={form.control}
                        name="bmi"
                        render={({ field }) => (
                          <FormItem className="rounded-lg border p-4 shadow-sm">
                            <FormLabel className="text-sm font-normal">
                              Body Mass Index (kg/m²)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  readOnly
                                  tabIndex={-1}
                                  className="bg-gray-50 pr-28"
                                  inputMode="numeric"
                                  value={field.value ?? ""}
                                />
                                {(() => {
                                  const bmi = field.value;
                                  let text = "Belum dihitung";
                                  let color = "text-gray-500 border-gray-300";

                                  if (bmi && bmi > 0) {
                                    if (bmi < 18.5) {
                                      text = "Kekurangan";
                                      color = "text-blue-600 border-blue-400";
                                    } else if (bmi <= 24.9) {
                                      text = "Normal";
                                      color = "text-green-600 border-green-400";
                                    } else if (bmi <= 29.9) {
                                      text = "Kelebihan";
                                      color =
                                        "text-yellow-600 border-yellow-400";
                                    } else {
                                      text = "Obesitas";
                                      color = "text-red-600 border-red-400";
                                    }
                                  }

                                  return (
                                    <span
                                      className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded border ${color} bg-white`}
                                    >
                                      {text}
                                    </span>
                                  );
                                })()}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {RowInput(
                      "lingkarPerutCm",
                      "Lingkar Perut (cm)",
                      "Masukkan lingkar perut",
                      "number"
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {RowInput(
                    "suhuC",
                    "Suhu Badan (°C)",
                    "Masukkan suhu badan",
                    "number"
                  )}

                  <div className="rounded-lg border p-4 shadow-sm">
                    <div className="text-sm font-normal mb-3">
                      Tekanan Darah (mmHg)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={"tensiSistol"}
                        rules={{ required: "Wajib diisi" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Sistole</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="cth.. 120"
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value)
                                  )
                                }
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={"tensiDiastol"}
                        rules={{ required: "Wajib diisi" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Diastole</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="cth.. 80"
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value)
                                  )
                                }
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {RowInput("nadiPerMenit", "Nadi / Menit", "0", "number")}
                  {RowInput(
                    "pernapasanPerMenit",
                    "Pernapasan / Menit",
                    "0",
                    "number"
                  )}
                </div>

                <div className="rounded-lg border p-4 shadow-sm space-y-2">
                  <div className="text-sm font-semibold">Kulit</div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {RowRadio(
                      "hipoHiperpigmentasi",
                      "Hipo / Hiperpigmentasi",
                      ["POSITIF", "NEGATIF"],
                      { stacked: true }
                    )}
                    {RowRadio("rash", "Rash", ["POSITIF", "NEGATIF"], {
                      stacked: true,
                    })}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">B. Kepala dan Leher</h3>
                <div className="rounded-lg border p-4 shadow-sm space-y-4">
                  <div className="text-sm font-semibold">Hidung</div>
                  {RowRadio("deviasiSeptum", "Deviasi Septum", ["YA", "TIDAK"])}
                  {RowRadio("pembesaranKonka", "Pembesaran Konka", [
                    "YA",
                    "TIDAK",
                  ])}
                </div>

                <div className="rounded-lg border p-4 shadow-sm space-y-4">
                  <div className="text-sm font-semibold">Tenggorokan</div>
                  {RowInput("tonsilUkuran", "Tonsil - Ukuran", "cth.. T1/T1")}
                  {RowRadio("pharingHipermis", "Pharing - Hipermis", [
                    "YA",
                    "TIDAK",
                  ])}
                </div>

                {RowRadio("lidah", "Lidah", ["NORMAL", "ABNORMAL"])}

                <div className="rounded-lg border p-4 shadow-sm space-y-4">
                  <div className="text-sm font-semibold">Gigi</div>
                  {RowRadio("gigiKaries", "Gigi Karies", ["ADA", "TIDAK"])}
                  {RowRadio("gigiHilang", "Gigi Hilang", ["ADA", "TIDAK"])}
                  {RowRadio("gigiPalsu", "Gigi Palsu", ["ADA", "TIDAK"])}
                </div>

                <div className="rounded-lg border p-4 shadow-sm space-y-4">
                  <div className="text-sm font-semibold">Leher</div>
                  {RowRadio("leherKondisi", "Kondisi Umum", [
                    "NORMAL",
                    "ABNORMAL",
                  ])}
                  {RowRadio("tiroid", "Pembesaran Kelenjar Tiroid", [
                    "NEGATIF",
                    "POSITIF",
                  ])}
                  {RowRadio("kelenjarLymp", "Pembesaran Kelenjar Lymph", [
                    "NEGATIF",
                    "POSITIF",
                  ])}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">
                  C. Sistem Penglihatan
                </h3>

                {RowRadio("butaWarna", "Buta Warna", ["NORMAL", "ABNORMAL"])}
                <div className="rounded-lg border p-4 shadow-sm space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {RowInput("anemiaOD", "Anemia — OD", "cth.. TIDAK")}
                    {RowInput("anemiaOS", "Anemia — OS", "cth.. TIDAK")}
                    {RowInput("ikterikOD", "Ikterik — OD", "cth.. TIDAK")}
                    {RowInput("ikterikOS", "Ikterik — OS", "cth.. TIDAK")}

                    {RowInput("pupilOD", "Pupil — OD", "cth.. ISOKOR")}
                    {RowInput("pupilOS", "Pupil — OS", "cth.. ISOKOR")}
                    {RowRadio(
                      "refleksOD",
                      "Refleks Cahaya OD",
                      ["NORMAL", "ABNORMAL"],
                      { stacked: true }
                    )}
                    {RowRadio(
                      "refleksOS",
                      "Refleks Cahaya OS",
                      ["NORMAL", "ABNORMAL"],
                      { stacked: true }
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {RowInput("pupilDistance", "Pupil Distance", "-")}
                  {RowRadio("kacamata", "Kaca Mata", ["ADA", "TIDAK"])}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {RowInput("ukuranOD", "Ukuran Kacamata — OD", "-")}
                  {RowInput("ukuranOS", "Ukuran Kacamata — OS", "-")}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {RowInput("visusOD", "Visus — OD", "cth.. 6/38")}
                  {RowInput("visusOS", "Visus — OS", "cth.. 6/38")}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {RowRadio(
                    "lapangPandang",
                    "Lapang Pandang",
                    ["NORMAL", "ABNORMAL"],
                    { stacked: true }
                  )}
                  {RowRadio(
                    "ketajaman",
                    "Ketajaman Penglihatan",
                    ["NORMAL", "ABNORMAL"],
                    { stacked: true }
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">
                  D. Sistem Pendengaran
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {RowRadio(
                    "kemampuanPendengaranAD",
                    "Kemampuan Pendengaran Umum — AD",
                    ["BAIK", "SEDANG", "BURUK"],
                    { stacked: true }
                  )}
                  {RowRadio(
                    "kemampuanPendengaranAS",
                    "Kemampuan Pendengaran Umum — AS",
                    ["BAIK", "SEDANG", "BURUK"],
                    { stacked: true }
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {RowRadio(
                    "telingaLuarAD",
                    "Kondisi Telinga Luar — AD",
                    ["NORMAL", "ABNORMAL"],
                    { stacked: true }
                  )}
                  {RowRadio(
                    "telingaLuarAS",
                    "Kondisi Telinga Luar — AS",
                    ["NORMAL", "ABNORMAL"],
                    { stacked: true }
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {RowRadio(
                    "nyeriTekanAD",
                    "Nyeri Tekan — AD",
                    ["YA", "TIDAK"],
                    { stacked: true }
                  )}
                  {RowRadio(
                    "nyeriTekanAS",
                    "Nyeri Tekan — AS",
                    ["YA", "TIDAK"],
                    { stacked: true }
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {RowRadio(
                    "serumenAD",
                    "Liang Telinga — Serumen AD",
                    ["POSITIF", "NEGATIF"],
                    { stacked: true }
                  )}
                  {RowRadio(
                    "serumenAS",
                    "Liang Telinga — Serumen AS",
                    ["POSITIF", "NEGATIF"],
                    { stacked: true }
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {RowInput("gendangAD", "Gendang Telinga — AD", "cth.. INTAK")}
                  {RowInput("gendangAS", "Gendang Telinga — AS", "cth.. INTAK")}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">
                  E. Sistem Kardiovaskular
                </h3>
                {RowInput(
                  "ictusInspeksi",
                  "Inspeksi — Ictus Cordis",
                  "cth.. TIDAK TAMPAK"
                )}
                {RowInput(
                  "ictusPalpasi",
                  "Palpasi — Ictus Cordis",
                  "cth.. TERABA"
                )}
                {RowRadio("batasJantung", "Perkusi — Batas Jantung", [
                  "NORMAL",
                  "ABNORMAL",
                ])}
                {RowRadio("bisingJantung", "Auskultasi — Bising Jantung", [
                  "TIDAK",
                  "ADA",
                ])}
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">
                  F. Sistem Pernafasan
                </h3>
                {RowInput("paruInspeksi", "Inspeksi", "cth.. SIMETRIS")}
                {RowRadio("paruPalpasi", "Palpasi", ["NORMAL", "ABNORMAL"])}
                {RowInput("paruPerkusi", "Perkusi", "cth.. SONOR")}
                {RowInput("paruAuskultasi", "Auskultasi", "cth.. VESIKULER")}
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">
                  G. Sistem Pencernaan
                </h3>
                {RowInput("cernaInspeksi", "Inspeksi", "cth.. SIMETRIS")}
                <div className="rounded-lg border p-4 shadow-sm space-y-4">
                  <div className="text-sm font-semibold">Palpasi</div>
                  {RowInput("hepar", "Hepar", "cth.. TIDAK TERABA")}
                  {RowInput("lien", "Lien", "cth.. TIDAK TERABA")}
                </div>
                {RowRadio("cernaPerkusi", "Perkusi", ["NORMAL", "ABNORMAL"])}
                {RowRadio("peristaltik", "Auskultasi Peristaltik", [
                  "NORMAL",
                  "ABNORMAL",
                ])}
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">
                  H. Ekstremitas / Anggota Gerak
                </h3>
                {RowInput("deformitas", "Deformitas", "-")}
                {RowInput("oedema", "Oedema", "-")}
                {RowInput("functioLaesa", "Functio Laesa", "-")}
                <div className="rounded-lg border p-4 shadow-sm space-y-2">
                  <div className="text-sm font-semibold">Reflex</div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {RowRadio("refleksFisiologis", "Fisiologis", [
                      "ADA",
                      "TIDAK",
                    ])}
                    {RowRadio("refleksPatologis", "Patologis", [
                      "ADA",
                      "TIDAK",
                    ])}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">I. Tulang Belakang</h3>
                {RowRadio("tulangBelakang", "Bentuk", ["NORMAL", "ABNORMAL"])}
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold">
                  J. Saraf dan Fungsi Luhur
                </h3>
                {RowRadio("psikis", "Kontak Psikis / Perhatian", [
                  "NORMAL",
                  "ABNORMAL",
                ])}
                {RowRadio("sikap", "Sikap dan Tingkah Laku", [
                  "NORMAL",
                  "ABNORMAL",
                ])}
                {RowRadio("dayaIngat", "Daya Ingat", [
                  "BAIK",
                  "SEDANG",
                  "BURUK",
                ])}
                {RowRadio("orientasi", "Orientasi", [
                  "BAIK",
                  "SEDANG",
                  "BURUK",
                ])}
              </section>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan & Check-in"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
