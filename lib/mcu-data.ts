export const regularPackageItems = [
  "Pemeriksaan fisik dan anamnesis oleh dokter MCU",
  "Pemeriksaan kebugaran",
  "Pemeriksaan psikologis (FAS dan SDS)",
  "Hematologi (darah lengkap, golongan darah & rhesus)",
  "Profil lemak (kolesterol total, HDL, LDL, trigliserida)",
  "Panel diabetes (gula darah puasa, gula darah 2 jam PP)",
  "Fungsi hati (SGOT, SGPT)",
  "Fungsi ginjal (ureum, creatinin, asam urat)",
  "HIV",
  "Urinalisa lengkap",
  "Radiologi thoraks",
];

export const executivePackageItems = [
  ...regularPackageItems,
  "Audiometry",
  "Spirometry",
  "EKG",
  "Treadmill",
  "Panel Hepatitis",
  "USG Whole Abdomen",
  // "Pemeriksaan Dokter Gigi",
  // "Pemeriksaan Dokter Spesialis Mata",
  // "Pemeriksaan Dokter THT",
];

export const finalPackageItems = [...regularPackageItems];

export const dmcPackageItems = [
  "Pemeriksaan fisik dan anamnesis oleh dokter MCU",
  "Hematologi (darah lengkap, golongan darah & rhesus) + HbsAg",
  "Urinalisa lengkap",
  "Radiologi thoraks",
];

export const mcuPackages = [
  { id: "MCU Regular", label: "MCU Regular", details: regularPackageItems },
  {
    id: "MCU Eksekutif",
    label: "MCU Eksekutif",
    details: executivePackageItems,
  },
  { id: "MCU Akhir", label: "MCU Akhir", details: finalPackageItems },
  { id: "MCU DMC", label: "MCU DMC", details: dmcPackageItems },
];

export const addOnItems = [
  { id: "Audiometry", label: "Audiometry" },
  { id: "Spirometry", label: "Spirometry" },
  { id: "EKG", label: "EKG" },
  { id: "Treadmill", label: "Treadmill" },
  { id: "Biomonitoring", label: "Biomonitoring (Pb, Fe, As)" },
  { id: "Panel Hepatitis", label: "Panel Hepatitis" },
  { id: "Refraktometri", label: "Refraktometri" },
];
