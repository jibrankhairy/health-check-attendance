"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

// --- PERUBAHAN BESAR: Skema validasi diperluas untuk semua field dari semua PDF ---
const formSchema = z.object({
  // Pemeriksaan Fisik
  beratBadan: z.coerce.number().optional(),
  tinggiBadan: z.coerce.number().optional(),
  bmi: z.string().optional(),
  lingkarPerut: z.string().optional(),
  tekananDarah: z.string().optional(),
  nadi: z.string().optional(),
  suhu: z.string().optional(),
  pernafasan: z.string().optional(),
  fisikKondisiUmum: z.string().optional(),
  fisikKesadaran: z.string().optional(),
  fisikKulit: z.string().optional(),
  fisikKepalaLeher: z.string().optional(),

  // Mata
  visusOd: z.string().optional(),
  visusOs: z.string().optional(),
  butaWarna: z.string().optional(),
  kacamata: z.string().optional(),
  kacamataOd: z.string().optional(),
  kacamataOs: z.string().optional(),
  lapangPandang: z.string().optional(),
  fisikMataLainnya: z.string().optional(),

  // THT & Pendengaran
  fisikTelinga: z.string().optional(),
  fisikHidung: z.string().optional(),
  fisikTenggorokan: z.string().optional(),

  // Sistem Lainnya (Fisik)
  fisikKardiovaskular: z.string().optional(),
  fisikPernafasan: z.string().optional(),
  fisikPencernaan: z.string().optional(),
  fisikEkstremitas: z.string().optional(),

  // Darah Lengkap & Hematologi
  hemoglobin: z.string().optional(),
  leukosit: z.string().optional(),
  trombosit: z.string().optional(),
  hematokrit: z.string().optional(),
  eritrosit: z.string().optional(),
  led: z.string().optional(),
  mcv: z.string().optional(),
  mch: z.string().optional(),
  mchc: z.string().optional(),
  rdw: z.string().optional(),
  mpv: z.string().optional(),
  pdw: z.string().optional(),
  // Hitung Jenis
  hitungJenisEosinofil: z.string().optional(),
  hitungJenisBasofil: z.string().optional(),
  hitungJenisNeutrofilStab: z.string().optional(),
  hitungJenisNeutrofilSegmen: z.string().optional(),
  hitungJenisLimfosit: z.string().optional(),
  hitungJenisMonosit: z.string().optional(),

  // Kimia Darah
  gulaDarahPuasa: z.string().optional(),
  gulaDarah2JamPP: z.string().optional(),
  sgot: z.string().optional(),
  sgpt: z.string().optional(),
  asamUrat: z.string().optional(),
  kolesterolTotal: z.string().optional(),
  trigliserida: z.string().optional(),
  ureum: z.string().optional(),
  kreatinin: z.string().optional(),
  hdl: z.string().optional(),
  ldl: z.string().optional(),
  hbsag: z.string().optional(),
  bilirubinTotal: z.string().optional(),
  bilirubinDirect: z.string().optional(),
  alkaliPhosphatase: z.string().optional(),

  // Urinalisa
  urinWarna: z.string().optional(),
  urinKejernihan: z.string().optional(),
  urinBau: z.string().optional(),
  urinPh: z.string().optional(),
  urinBeratJenis: z.string().optional(),
  urinProtein: z.string().optional(),
  urinGlukosa: z.string().optional(),
  urinBilirubin: z.string().optional(),
  urinUrobilinogen: z.string().optional(),
  urinKeton: z.string().optional(),
  urinNitrit: z.string().optional(),
  urinLeukositEsterase: z.string().optional(),
  urinBlood: z.string().optional(),
  // Sedimen
  urinSedimenEritrosit: z.string().optional(),
  urinSedimenLeukosit: z.string().optional(),
  urinSedimenEpitel: z.string().optional(),
  urinCaOxalat: z.string().optional(),
  urinUridAcid: z.string().optional(),
  urinGranulaCast: z.string().optional(),

  // Penunjang Medis
  kesanRontgen: z.string().optional(),
  kesanEkg: z.string().optional(),
  kesanUsgAbdomen: z.string().optional(),
  kesanUsgMammae: z.string().optional(),

  // Audiometri
  audiometriTelingaKanan: z.string().optional(),
  audiometriTelingaKiri: z.string().optional(),
  kesimpulanAudiometri: z.string().optional(), // Tetap ada untuk kesimpulan umum

  // Spirometri
  spirometriFvc: z.string().optional(),
  spirometriFev1: z.string().optional(),
  spirometriFev1Fvc: z.string().optional(),
  kesimpulanSpirometri: z.string().optional(),

  // Lainnya
  framinghamScore: z.string().optional(),
  kesimpulanTesPsikologi: z.string().optional(),

  // Kesimpulan Akhir
  kesimpulan: z.string().min(1, "Kesimpulan harus diisi."),
  saran: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// --- Nilai default untuk semua field baru ditambahkan ---
const defaultFormValues: FormValues = {
  beratBadan: 0,
  tinggiBadan: 0,
  bmi: "",
  lingkarPerut: "",
  tekananDarah: "",
  nadi: "",
  suhu: "",
  pernafasan: "",
  fisikKondisiUmum: "",
  fisikKesadaran: "",
  fisikKulit: "",
  fisikKepalaLeher: "",
  visusOd: "",
  visusOs: "",
  butaWarna: "",
  kacamata: "",
  kacamataOd: "",
  kacamataOs: "",
  lapangPandang: "",
  fisikMataLainnya: "",
  fisikTelinga: "",
  fisikHidung: "",
  fisikTenggorokan: "",
  fisikKardiovaskular: "",
  fisikPernafasan: "",
  fisikPencernaan: "",
  fisikEkstremitas: "",
  hemoglobin: "",
  leukosit: "",
  trombosit: "",
  hematokrit: "",
  eritrosit: "",
  led: "",
  mcv: "",
  mch: "",
  mchc: "",
  rdw: "",
  mpv: "",
  pdw: "",
  hitungJenisEosinofil: "",
  hitungJenisBasofil: "",
  hitungJenisNeutrofilStab: "",
  hitungJenisNeutrofilSegmen: "",
  hitungJenisLimfosit: "",
  hitungJenisMonosit: "",
  gulaDarahPuasa: "",
  gulaDarah2JamPP: "",
  sgot: "",
  sgpt: "",
  asamUrat: "",
  kolesterolTotal: "",
  trigliserida: "",
  ureum: "",
  kreatinin: "",
  hdl: "",
  ldl: "",
  hbsag: "",
  bilirubinTotal: "",
  bilirubinDirect: "",
  alkaliPhosphatase: "",
  urinWarna: "",
  urinKejernihan: "",
  urinBau: "",
  urinPh: "",
  urinBeratJenis: "",
  urinProtein: "",
  urinGlukosa: "",
  urinBilirubin: "",
  urinUrobilinogen: "",
  urinKeton: "",
  urinNitrit: "",
  urinLeukositEsterase: "",
  urinBlood: "",
  urinSedimenEritrosit: "",
  urinSedimenLeukosit: "",
  urinSedimenEpitel: "",
  urinCaOxalat: "",
  urinUridAcid: "",
  urinGranulaCast: "",
  kesanRontgen: "",
  kesanEkg: "",
  kesanUsgAbdomen: "",
  kesanUsgMammae: "",
  audiometriTelingaKanan: "",
  audiometriTelingaKiri: "",
  kesimpulanAudiometri: "",
  spirometriFvc: "",
  spirometriFev1: "",
  spirometriFev1Fvc: "",
  kesimpulanSpirometri: "",
  framinghamScore: "",
  kesimpulanTesPsikologi: "",
  kesimpulan: "",
  saran: "",
};

// --- PERUBAHAN BESAR: SEMUA KOMPONEN FORM DIPERBARUI & DITAMBAH ---

const PemeriksaanFisikForm = ({ control }: { control: any }) => (
  <section className="space-y-6">
    <h3 className="text-xl font-bold mb-4 border-b pb-2">Pemeriksaan Fisik</h3>

    {/* Pemeriksaan Umum */}
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">Pemeriksaan Umum</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="beratBadan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Berat Badan (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tinggiBadan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tinggi Badan (cm)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="bmi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BMI</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lingkarPerut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lingkar Perut (cm)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tekananDarah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tekanan Darah (mmHg)</FormLabel>
              <FormControl>
                <Input placeholder="120/80" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="nadi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nadi (x/menit)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="suhu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suhu (°C)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="pernafasan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pernafasan (x/menit)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fisikKondisiUmum"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kondisi Umum</FormLabel>
              <FormControl>
                <Input placeholder="Baik" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fisikKesadaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kesadaran</FormLabel>
              <FormControl>
                <Input placeholder="Compos Mentis" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Mata */}
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">Mata</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="visusOd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visus OD</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="visusOs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visus OS</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="butaWarna"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buta Warna</FormLabel>
              <FormControl>
                <Input placeholder="Normal/Parsial" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lapangPandang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lapang Pandang</FormLabel>
              <FormControl>
                <Input placeholder="Normal" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="kacamata"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kacamata</FormLabel>
              <FormControl>
                <Input placeholder="Ada/Tidak" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="kacamataOd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ukuran Kacamata OD</FormLabel>
              <FormControl>
                <Input placeholder="-1.50" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="kacamataOs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ukuran Kacamata OS</FormLabel>
              <FormControl>
                <Input placeholder="-1.75" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="fisikMataLainnya"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Temuan Lain Pemeriksaan Mata</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Anemia, Ikterik, Pupil, Refleks Cahaya, dll."
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>

    {/* Temuan Klinis Lainnya */}
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">Temuan Klinis Lainnya</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="fisikKulit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kulit</FormLabel>
              <FormControl>
                <Textarea placeholder="Temuan pada kulit..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fisikKepalaLeher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kepala & Leher</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hidung, Tenggorokan, Lidah, Gigi, Kelenjar, dll."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fisikKardiovaskular"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kardiovaskular (Jantung)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Inspeksi, Palpasi, Perkusi, Auskultasi..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fisikPernafasan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sistem Pernafasan (Paru)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Inspeksi, Palpasi, Perkusi, Auskultasi..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fisikPencernaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sistem Pencernaan (Abdomen)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Inspeksi, Palpasi, Perkusi, Auskultasi..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fisikEkstremitas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ekstremitas & Tulang Belakang</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deformitas, Oedema, Refleks, dll."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  </section>
);

const DarahLengkapForm = ({ control }: { control: any }) => (
  <section className="space-y-6">
    <h3 className="text-xl font-bold mb-4 border-b pb-2">
      Darah Lengkap / Hematologi
    </h3>
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">Parameter Utama</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="hemoglobin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hemoglobin (g/dL)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="leukosit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leukosit (Sel/µl)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="trombosit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trombosit (Sel/µl)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hematokrit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hematokrit (%)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="eritrosit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eritrosit (10^6/µL)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="led"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LED (mm/jam)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">
        Indeks Eritrosit & Trombosit
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="mcv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MCV (fl)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="mch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MCH (pg)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="mchc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MCHC (g/dL)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="rdw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RDW (%)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="mpv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MPV (fl)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="pdw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PDW (fl)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">Hitung Jenis Leukosit (%)</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <FormField
          control={control}
          name="hitungJenisEosinofil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eosinofil</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hitungJenisBasofil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Basofil</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hitungJenisNeutrofilStab"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neutrofil Stab</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hitungJenisNeutrofilSegmen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neutrofil Segmen</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hitungJenisLimfosit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limfosit</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hitungJenisMonosit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monosit</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  </section>
);

const KimiaDarahForm = ({ control }: { control: any }) => (
  <section className="space-y-6">
    <h3 className="text-xl font-bold mb-4 border-b pb-2">Kimia Darah</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <FormField
        control={control}
        name="gulaDarahPuasa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gula Darah Puasa</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="gulaDarah2JamPP"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gula Darah 2 Jam PP</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="kolesterolTotal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kolesterol Total</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="trigliserida"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trigliserida</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hdl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HDL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="ldl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LDL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sgot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SGOT</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sgpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SGPT</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="ureum"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ureum</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="kreatinin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kreatinin</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="asamUrat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asam Urat</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hbsag"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HbsAg</FormLabel>
            <FormControl>
              <Input placeholder="Negatif/Positif" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bilirubinTotal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bilirubin Total</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bilirubinDirect"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bilirubin Direct</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="alkaliPhosphatase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alkali Phosphatase</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  </section>
);

const UrinalisaForm = ({ control }: { control: any }) => (
  <section className="space-y-6">
    <h3 className="text-xl font-bold mb-4 border-b pb-2">Urinalisa</h3>
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">Makroskopis</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="urinWarna"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warna</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinKejernihan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kejernihan</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinBau"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bau</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinBeratJenis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Berat Jenis</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinPh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>pH</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinProtein"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Protein</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinGlukosa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Glukosa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinKeton"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keton</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinNitrit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nitrit</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinLeukositEsterase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leukosit Esterase</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinBlood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinBilirubin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bilirubin</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinUrobilinogen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urobilinogen</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
    <div className="p-4 border rounded-md">
      <h4 className="text-md font-semibold mb-3">Mikroskopis (Sedimen)</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="urinSedimenEritrosit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eritrosit (/LPB)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinSedimenLeukosit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leukosit (/LPB)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinSedimenEpitel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epitel Sel (/LPK)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinCaOxalat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CA Oxalat (/LPK)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinUridAcid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urid Acid (/LPK)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="urinGranulaCast"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Granula Cast (/LPK)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  </section>
);

const RontgenThoraxForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">Rontgen Thorax</h3>
    <FormField
      control={control}
      name="kesanRontgen"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kesan</FormLabel>
          <FormControl>
            <Textarea
              rows={4}
              placeholder="Cor besar dan bentuk normal.&#10;Pulmo: tak tampak infiltrat, bronchovascular pattern tampak baik.&#10;Sinus phrenicocostalis kanan kiri tajam.&#10;...&#10;KESAN: Cor dan pulmo tak tampak kelainan"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </section>
);

const EkgForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">
      EKG (Elektrokardiogram)
    </h3>
    <FormField
      control={control}
      name="kesanEkg"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kesan</FormLabel>
          <FormControl>
            <Textarea
              rows={4}
              placeholder="Rhythm: Sinus Rhythm&#10;Qrs Rate: 64 bpm&#10;...&#10;Conclusion: Normal ECG"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </section>
);

const UsgAbdomenForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">USG Abdomen</h3>
    <FormField
      control={control}
      name="kesanUsgAbdomen"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kesan</FormLabel>
          <FormControl>
            <Textarea
              rows={4}
              placeholder="HEPAR: Ukuran normal...&#10;KESIMPULAN: USG abdomen normal"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </section>
);

const UsgMammaeForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">USG Mammae</h3>
    <FormField
      control={control}
      name="kesanUsgMammae"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kesan</FormLabel>
          <FormControl>
            <Textarea
              rows={4}
              placeholder="Intensitas echo parenchym...&#10;Kesimpulan: USG mamma dextra dan sinistra normal"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </section>
);

// --- Form Baru ---
const AudiometriForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">Audiometri</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="audiometriTelingaKanan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telinga Kanan</FormLabel>
            <FormControl>
              <Input placeholder="Normal" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="audiometriTelingaKiri"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telinga Kiri</FormLabel>
            <FormControl>
              <Input placeholder="Normal" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
    <FormField
      control={control}
      name="kesimpulanAudiometri"
      render={({ field }) => (
        <FormItem className="mt-4">
          <FormLabel>Kesimpulan & Saran</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Kesimpulan umum dan saran jika ada..."
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </section>
);

// --- Form Baru ---
const SpirometriForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">Spirometri</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="spirometriFvc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FVC (L)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="spirometriFev1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FEV1 (L)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="spirometriFev1Fvc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FEV1/FVC (%)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
    <FormField
      control={control}
      name="kesimpulanSpirometri"
      render={({ field }) => (
        <FormItem className="mt-4">
          <FormLabel>Kesimpulan</FormLabel>
          <FormControl>
            <Textarea placeholder="Fungsi paru normal..." {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </section>
);

const FraminghamScoreForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">Framingham Score</h3>
    <FormField
      control={control}
      name="framinghamScore"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hasil Score</FormLabel>
          <FormControl>
            <Input placeholder="Contoh: Risiko Rendah (1%)" {...field} />
          </FormControl>
          <FormDescription>
            Hitung skor secara manual/terpisah lalu masukkan hasilnya di sini.
          </FormDescription>
        </FormItem>
      )}
    />
  </section>
);

const TesPsikologiForm = ({ control }: { control: any }) => (
  <section>
    <h3 className="text-xl font-bold mb-4 border-b pb-2">
      Tes Psikologi / Treadmill
    </h3>
    <FormField
      control={control}
      name="kesimpulanTesPsikologi"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kesimpulan</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Tidak ada gangguan psikologis / Hasil treadmill dalam batas normal..."
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </section>
);

// --- MAPPING SEMUA KOMPONEN FORM DIPERBARUI ---
const examinationComponents: { [key: string]: React.FC<any> } = {
  "Pemeriksaan Fisik": PemeriksaanFisikForm,
  "Darah Lengkap": DarahLengkapForm,
  Hematologi: DarahLengkapForm,
  "Kimia Darah": KimiaDarahForm,
  Urinalisa: UrinalisaForm,
  "Rontgen Thorax": RontgenThoraxForm,
  "EKG (Elektrokardiogram)": EkgForm,
  "USG Abdomen": UsgAbdomenForm,
  "USG Mammae": UsgMammaeForm,
  Audiometri: AudiometriForm,
  Spirometri: SpirometriForm,
  "Framingham Score": FraminghamScoreForm,
  "Tes Psikologi": TesPsikologiForm,
  Treadmill: TesPsikologiForm,
};

// Fungsi untuk membersihkan nama paket (opsional, tapi bagus untuk konsistensi)
const sanitizePackageName = (name: string) => {
  // Implementasi sederhana, bisa diperluas
  if (name.toLowerCase().includes("fisik")) return "Pemeriksaan Fisik";
  if (name.toLowerCase().includes("ekg")) return "EKG (Elektrokardiogram)";
  // ...tambahkan alias lain jika perlu
  return name;
};

interface McuResultFormProps {
  mcuResultId: string;
}

export const McuResultForm = ({ mcuResultId }: McuResultFormProps) => {
  const router = useRouter();
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/mcu/results/${mcuResultId}`);
        if (!response.ok) throw new Error("Gagal memuat data pasien.");
        const data = await response.json();
        setPatientData(data);

        // Reset form dengan data yang ada, gunakan default jika tidak ada
        const existingData = { ...defaultFormValues };
        for (const key in formSchema.shape) {
          const formKey = key as keyof FormValues;
          if (data[formKey] !== null && data[formKey] !== undefined) {
            // @ts-ignore
            existingData[formKey] = data[formKey];
          }
        }
        form.reset(existingData);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mcuResultId, form]);

  const onSubmit = async (data: FormValues) => {
    const promise = fetch(`/api/mcu/results/${mcuResultId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("Gagal menyimpan data.");
      return res.json();
    });

    toast.promise(promise, {
      loading: "Menyimpan hasil MCU...",
      success: () => {
        router.push("/dashboard/reports");
        router.refresh();
        return "Hasil MCU berhasil disimpan!";
      },
      error: (err) => err.message,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    !patientData ||
    !patientData.patient ||
    !Array.isArray(patientData.patient.mcuPackage)
  ) {
    return (
      <p className="text-center text-red-500">
        Gagal memuat data paket pasien. Data mungkin tidak lengkap.
      </p>
    );
  }

  // Render komponen unik berdasarkan paket
  const packagesToRender = [...new Set(patientData.patient.mcuPackage)];

  return (
    <Card className="max-w-5xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl">
          Input Hasil MCU untuk: {patientData.patient.fullName}
        </CardTitle>
        <CardDescription>
          Isi hasil pemeriksaan sesuai dengan paket yang diambil oleh pasien.
          Bagian yang tidak relevan dapat dikosongkan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {packagesToRender.map((packageName: string) => {
              const sanitizedName = sanitizePackageName(packageName);
              const Component = examinationComponents[sanitizedName];
              return Component ? (
                <div key={packageName}>
                  <Component control={form.control} />
                </div>
              ) : (
                <div
                  key={packageName}
                  className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
                >
                  <p>
                    <span className="font-bold">Peringatan:</span> Komponen form
                    untuk paket "<strong>{packageName}</strong>" tidak
                    ditemukan.
                  </p>
                </div>
              );
            })}

            <Separator />

            <section>
              <h3 className="text-xl font-bold mb-4 border-b pb-2">
                Kesimpulan & Saran
              </h3>
              <div className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="kesimpulan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kesimpulan Akhir</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="cth: Fit to Work / Fit with Note / Unfit"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="saran"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saran Dokter</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Tuliskan saran atau rekomendasi umum berdasarkan semua hasil pemeriksaan..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="mr-4"
              >
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Simpan & Selesaikan Laporan
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};