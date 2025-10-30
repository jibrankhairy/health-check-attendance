"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, ArrowLeft } from "lucide-react";
import { format, isValid } from "date-fns";
import { id as localeID } from "date-fns/locale";
import Image from "next/image";

type ReportData = {
  patient: {
    fullName: string;
    patientId: string;
    dob: string;
    age: number;
    gender: "LAKI-LAKI" | "PEREMPUAN";
    company: { name: string };
    mcuPackage: string[];
    address: string;
  };
  updatedAt: string;
  [key: string]: any;
};

// --- KOMPONEN BARU: Header Laporan Bio-Lab ---
const ReportHeaderBioLab = () => (
  <header className="flex justify-between items-center px-8 pt-8">
    <Image
      src="/images/logo-biolab.png"
      alt="Logo Bio-Lab"
      width={150}
      height={50}
    />
    <div className="text-right">
      <h2 className="text-xl font-bold text-gray-700">HASIL PEMERIKSAAN</h2>
      {/* Logo Hiperkes bisa ditambahkan di sini jika ada */}
    </div>
  </header>
);

// --- KOMPONEN BARU: Footer Laporan Bio-Lab ---
const ReportFooterBioLab = ({ pageNumber }: { pageNumber?: string }) => (
  <footer className="w-full text-center text-xs text-gray-600 border-t mt-auto py-3 px-8">
    <p className="font-bold">
      JL. TGK. DAUD BEUREUEH, KOTA BANDA ACEH - TELP. 085243022200
    </p>
    <p>PERUSAHAAN JASA K3 BIDANG PEMERIKSAAN KESEHATAN PEKERJA</p>
    {pageNumber && (
      <span className="absolute right-8 bottom-3 text-gray-500">
        {pageNumber}
      </span>
    )}
  </footer>
);

// --- KOMPONEN BARU: Info Pasien Bio-Lab ---
const PatientInfoBioLab = ({ data }: { data: ReportData }) => {
  const dobDate = new Date(data.patient.dob);
  const updatedAtDate = new Date(data.updatedAt);
  const formattedDob = isValid(dobDate)
    ? format(dobDate, "dd.MM.yyyy", { locale: localeID })
    : "-";
  const formattedUpdatedAt = isValid(updatedAtDate)
    ? format(updatedAtDate, "dd MMMM yyyy / HH:mm 'WIB'", { locale: localeID })
    : "-";

  return (
    <div className="px-8 mt-4 text-xs">
      <div className="border-2 border-gray-400 p-2">
        <p>
          <span className="font-bold">
            Ps. {data.patient.fullName} / {formattedDob} / {data.patient.age}Th
            / {data.patient.gender}
          </span>
        </p>
        <p>
          {data.patient.address?.toUpperCase() || "ALAMAT TIDAK TERSEDIA"} /{" "}
          {data.patient.company.name.toUpperCase()} / -
        </p>
        <p>TANGGAL & WAKTU PEMERIKSAAN: {formattedUpdatedAt.toUpperCase()}</p>
        <p>DOKTER PENGIRIM: -</p>
      </div>
    </div>
  );
};

// --- KOMPONEN BARU: Layout Halaman Cetak ---
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="printable-page bg-white shadow-lg flex flex-col min-h-[297mm]">
    {children}
  </div>
);

// --- KOMPONEN BARU: Tabel Hasil Lab Detail ---
type LabRow = {
  test: string;
  result?: string | null;
  reference: string;
  unit: string;
  isHeader?: boolean;
};

const LabResultTable = ({ title, data }: { title: string; data: LabRow[] }) => (
  <div className="px-8 mt-4 break-inside-avoid">
    <h3 className="text-center font-bold text-sm underline mb-2">{title}</h3>
    <table className="w-full border-collapse border border-gray-500 text-xs">
      <thead>
        <tr className="bg-gray-200 font-bold">
          <td className="border border-gray-500 p-1 w-[40%]">
            JENIS PEMERIKSAAN
          </td>
          <td className="border border-gray-500 p-1 text-center w-[20%]">
            HASIL
          </td>
          <td className="border border-gray-500 p-1 w-[30%]">NILAI RUJUKAN</td>
          <td className="border border-gray-500 p-1 text-center w-[10%]">
            SATUAN
          </td>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          if (item.isHeader) {
            return (
              <tr key={index} className="font-bold bg-gray-100">
                <td colSpan={4} className="border border-gray-500 p-1">
                  {item.test}
                </td>
              </tr>
            );
          }
          return (
            <tr key={index}>
              <td className="border border-gray-500 p-1">{item.test}</td>
              <td className="border border-gray-500 p-1 text-center font-semibold">
                {item.result || "-"}
              </td>
              <td
                className="border border-gray-500 p-1"
                dangerouslySetInnerHTML={{ __html: item.reference }}
              ></td>
              <td className="border border-gray-500 p-1 text-center">
                {item.unit}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// --- KOMPONEN BARU: Hasil Deskriptif (Rontgen, EKG, dll) ---
const DescriptiveResultSection = ({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) => {
  if (!content) return null;
  return (
    <div className="px-8 mt-4 break-inside-avoid">
      <h3 className="text-center font-bold text-sm underline mb-2">{title}</h3>
      <div className="text-sm whitespace-pre-wrap p-2 border">{content}</div>
    </div>
  );
};

// --- KUMPULAN KOMPONEN HASIL BARU SESUAI FORMAT BIO-LAB ---

const SummaryResultBioLab = ({ data }: { data: ReportData }) => {
  // Resume dibuat statis sesuai format, hasil aktual di bagian lain
  const resumeData = [
    { label: "1. Pemeriksaan Fisik", value: "NORMAL" },
    { label: "2. Lab - Hematologi Darah Rutin", value: "NORMAL" },
    { label: "3. Lab - Hasil Kimia Darah", value: "NORMAL" },
    {
      label: "4. Lab - Urin Rutin",
      value: data.urinLeukositEsterase
        ? `${data.urinLeukositEsterase}`
        : "NORMAL",
    },
    { label: "5. Pemeriksaan Rontgen Thorax", value: "NORMAL" },
    { label: "6. Pemeriksaan EKG", value: "NORMAL" },
  ];
  return (
    <div className="px-8 mt-4 text-sm break-inside-avoid">
      <h3 className="font-bold">NO. 1. KESIMPULAN DAN REKOMENDASI</h3>
      <p className="mt-2">RESUME HASIL PEMERIKSAAN SEBAGAI BERIKUT:</p>
      <table className="w-full my-2">
        <tbody>
          {resumeData.map((item) => (
            <tr key={item.label}>
              <td className="w-1/2">{item.label}</td>
              <td>: {item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        DARI HASIL PEMERIKSAAN DIATAS, MAKA DAPAT DISIMPULKAN BAHWA KONDISI
        PASIEN :
      </p>
      <p className="font-bold my-2 text-center text-lg">
        {data.kesimpulan?.toUpperCase() || "FIT TO WORK"}
      </p>
      <p>
        SARAN YANG DAPAT DIBERIKAN ATAS HASIL PEMERIKSAAN YANG TELAH DILAKUKAN
        ADALAH:
      </p>
      <div className="whitespace-pre-wrap">
        {data.saran ||
          "1. Jaga pola hidup sehat, diet gizi seimbang dan olahraga rutin.\n2. Minum air mineral minimal 2 Liter/hari"}
      </div>
    </div>
  );
};

const DarahLengkapResultBioLab = ({ data }: { data: ReportData }) => {
  const isFemale = data.patient.gender === "PEREMPUAN";
  const labData: LabRow[] = [
    {
      test: "HEMOGLOBIN",
      result: data.hemoglobin,
      reference: isFemale ? "WANITA: 12.0-14.0" : "PRIA: 14.0-17.4",
      unit: "g/dL",
    },
    {
      test: "LEUKOSIT",
      result: data.leukosit,
      reference: "4.000-10.000",
      unit: "Sel/µl",
    },
    {
      test: "TROMBOSIT",
      result: data.trombosit,
      reference: "150.000-450.000",
      unit: "Sel/µl",
    },
    {
      test: "HEMATOKRIT",
      result: data.hematokrit,
      reference: isFemale ? "35.0-47.0" : "40.0-54.0",
      unit: "%",
    },
    {
      test: "ERITROSIT",
      result: data.eritrosit,
      reference: isFemale ? "4.00-5.50" : "4.50-6.10",
      unit: "10<sup>6</sup>/µL",
    },
    { test: "MCV", result: data.mcv, reference: "80.0-96.0", unit: "fl" },
    { test: "MCH", result: data.mch, reference: "27.0-31.0", unit: "pg" },
    { test: "MCHC", result: data.mchc, reference: "30.0-34.0", unit: "g/dL" },
    { test: "RDW", result: data.rdw, reference: "10.0-15.0", unit: "%" },
    { test: "MPV", result: data.mpv, reference: "6.50-11.0", unit: "fl" },
    { test: "PDW", result: data.pdw, reference: "10.0-18.0", unit: "fl" },
    {
      test: "EOSINOFIL",
      result: data.hitungJenisEosinofil,
      reference: "1-3",
      unit: "%",
    },
    {
      test: "BASOFIL",
      result: data.hitungJenisBasofil,
      reference: "0-1",
      unit: "%",
    },
    {
      test: "NEUTROFIL STAB",
      result: data.hitungJenisNeutrofilStab,
      reference: "3-5",
      unit: "%",
    },
    {
      test: "NEUTROFIL SEGMEN",
      result: data.hitungJenisNeutrofilSegmen,
      reference: "25-60",
      unit: "%",
    },
    {
      test: "LIMFOSIT",
      result: data.hitungJenisLimfosit,
      reference: "20-40",
      unit: "%",
    },
    {
      test: "MONOSIT",
      result: data.hitungJenisMonosit,
      reference: "4-8",
      unit: "%",
    },
    {
      test: "LAJU ENDAP DARAH",
      result: data.led,
      reference: "0-15",
      unit: "mm/jam",
    },
  ];
  return <LabResultTable title="HEMATOLOGI - DARAH RUTIN" data={labData} />;
};

const KimiaDarahResultBioLab = ({ data }: { data: ReportData }) => {
  const isFemale = data.patient.gender === "PEREMPUAN";
  const labData: LabRow[] = [
    {
      isHeader: true,
      test: "CARBOHIDRAT METABOLISME",
      reference: "",
      unit: "",
    },
    {
      test: "GULA DARAH - PUASA",
      result: data.gulaDarahPuasa,
      reference: "75-115",
      unit: "mg/dl",
    },
    {
      test: "GULA DARAH - 2 JAM PP",
      result: data.gulaDarah2JamPP,
      reference: "< 140",
      unit: "mg/dl",
    },
    {
      test: "GULA DARAH SEWAKTU",
      result: data.gulaDarahSewaktu,
      reference: "< 180",
      unit: "mg/dl",
    },
    {
      isHeader: true,
      test: "LIPID PROFILE - PROFIL LEMAK",
      reference: "",
      unit: "",
    },
    {
      test: "CHOLESTEROL TOTAL",
      result: data.kolesterolTotal,
      reference: "RESIKO RENDAH : < 200",
      unit: "mg/dl",
    },
    {
      test: "HDL-CHOLESTEROL",
      result: data.hdl,
      reference: "TIDAK BERESIKO: (L>55)(P>65)",
      unit: "mg/dl",
    },
    {
      test: "LDL-CHOLESTEROL",
      result: data.ldl,
      reference: "OPTIMAL: < 100",
      unit: "mg/dl",
    },
    {
      test: "TRIGLISERIDA",
      result: data.trigliserida,
      reference: "NORMAL: < 150",
      unit: "mg/dl",
    },
    { isHeader: true, test: "FUNGSI HATI", reference: "", unit: "" },
    { test: "SGOT", result: data.sgot, reference: "< 40", unit: "U/L" },
    { test: "SGPT", result: data.sgpt, reference: "< 41", unit: "U/L" },
    { isHeader: true, test: "FUNGSI GINJAL", reference: "", unit: "" },
    {
      test: "ASAM URAT",
      result: data.asamUrat,
      reference: isFemale ? "Wanita: 2.5-6.5" : "Pria: 3.0-7.5",
      unit: "mg/dl",
    },
    { test: "UREUM", result: data.ureum, reference: "10-50", unit: "mg/dL" },
    {
      test: "CREATININ",
      result: data.kreatinin,
      reference: "0.6-1.5",
      unit: "mg/dL",
    },
  ];
  return <LabResultTable title="KIMIA DARAH & LAINNYA" data={labData} />;
};

const UrinalisaResultBioLab = ({ data }: { data: ReportData }) => {
  const labData: LabRow[] = [
    { isHeader: true, test: "MAKROSKOPIS", reference: "", unit: "" },
    {
      test: "WARNA",
      result: data.urinWarna,
      reference: "Kuning Muda - Kuning",
      unit: "",
    },
    {
      test: "KEJERNIHAN",
      result: data.urinKejernihan,
      reference: "Jernih",
      unit: "",
    },
    {
      test: "BAU",
      result: data.urinBau,
      reference: "Tidak Menyengat",
      unit: "",
    },
    {
      test: "BERAT JENIS",
      result: data.urinBeratJenis,
      reference: "1.001-1.035",
      unit: "",
    },
    { test: "PH", result: data.urinPh, reference: "4.5-8.0", unit: "" },
    {
      test: "PROTEIN",
      result: data.urinProtein,
      reference: "Negatif",
      unit: "mg/dL",
    },
    {
      test: "GLUKOSA",
      result: data.urinGlukosa,
      reference: "Negatif",
      unit: "mg/dL",
    },
    {
      test: "LEUKOSIT ESTERASE",
      result: data.urinLeukositEsterase,
      reference: "Negatif",
      unit: "/µL",
    },
    { isHeader: true, test: "MIKROSKOPIS", reference: "", unit: "" },
    {
      test: "ERITROSIT",
      result: data.urinSedimenEritrosit,
      reference: "0-2",
      unit: "/LPB",
    },
    {
      test: "LEUKOSIT",
      result: data.urinSedimenLeukosit,
      reference: "0-5",
      unit: "/LPB",
    },
    {
      test: "EPITEL SEL",
      result: data.urinSedimenEpitel,
      reference: "< 10",
      unit: "/LPK",
    },
  ];
  return <LabResultTable title="URIN RUTIN" data={labData} />;
};

// Map komponen ke nama paket
const examinationComponents: { [key: string]: React.FC<any> } = {
  summary: SummaryResultBioLab,
  "Pemeriksaan Fisik": ({ data }) => (
    <DescriptiveResultSection
      title="HASIL PEMERIKSAAN FISIK"
      content={
        data.fisikKondisiUmum
          ? "Hasil pemeriksaan fisik terlampir dalam data."
          : "Normal"
      }
    />
  ),
  "Darah Lengkap": DarahLengkapResultBioLab,
  Hematologi: DarahLengkapResultBioLab,
  "Kimia Darah": KimiaDarahResultBioLab,
  Urinalisa: UrinalisaResultBioLab,
  "Rontgen Thorax": ({ data }) => (
    <DescriptiveResultSection
      title="HASIL PEMERIKSAAN RONTGEN"
      content={data.kesanRontgen}
    />
  ),
  "EKG (Elektrokardiogram)": ({ data }) => (
    <DescriptiveResultSection
      title="HASIL PEMERIKSAAN EKG"
      content={data.kesanEkg}
    />
  ),
  "USG Abdomen": ({ data }) => (
    <DescriptiveResultSection
      title="HASIL PEMERIKSAAN USG ABDOMEN"
      content={data.kesanUsgAbdomen}
    />
  ),
  "USG Mammae": ({ data }) => (
    <DescriptiveResultSection
      title="HASIL PEMERIKSAAN USG MAMMAE"
      content={data.kesanUsgMammae}
    />
  ),
};

// Komponen Utama Laporan
export const McuReportDocument = ({ mcuResultId }: { mcuResultId: string }) => {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/mcu/results/${mcuResultId}`);
        if (!response.ok) throw new Error("Gagal memuat data laporan.");
        const data = await response.json();
        setReportData(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mcuResultId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!reportData) {
    return (
      <p className="text-center text-red-500 py-10">
        Gagal memuat data laporan.
      </p>
    );
  }

  const packagesToRender = [
    "summary",
    ...new Set(reportData.patient.mcuPackage),
  ];

  return (
    <>
      <div className="p-4 bg-white shadow-md print:hidden sticky top-0 z-50 flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Cetak Laporan
        </Button>
      </div>

      <main className="bg-gray-200 print:bg-white flex justify-center p-4 print:p-0">
        <div className="report-container w-[210mm] space-y-4">
          {packagesToRender.map((pkg, index) => {
            const Component = examinationComponents[pkg];
            if (!Component) return null;

            return (
              <PageLayout key={index}>
                <div className="flex-grow">
                  <ReportHeaderBioLab />
                  <PatientInfoBioLab data={reportData} />
                  <Component data={reportData} />
                </div>
                <ReportFooterBioLab />
              </PageLayout>
            );
          })}
        </div>
      </main>

      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .printable-page {
            width: 210mm;
            height: 296mm; /* Kurangi sedikit untuk menghindari overflow */
            margin: 0 auto;
            box-shadow: none;
            border: none;
            page-break-before: always;
          }
          .print\:hidden {
            display: none;
          }
        }
        .report-container > .printable-page:first-child {
          break-before: auto !important;
        }
      `}</style>
    </>
  );
};
