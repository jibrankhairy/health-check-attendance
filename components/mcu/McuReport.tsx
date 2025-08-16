import React from "react";

export type PatientReportData = {
  id: string;
  fullName: string;
  dob: string;
  age: number;
  gender: string;
  address?: string;
  phoneNumber?: string;
  companyName?: string;
};

type McuReportProps = {
  patient: PatientReportData;
};

const formatDateToIndonesian = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const McuReport = ({ patient }: McuReportProps) => {
  const examinationDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const examinationTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border max-w-4xl mx-auto font-sans">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold tracking-wider uppercase">
          Identitas Peserta Pemeriksaan Kesehatan
        </h1>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">NAMA LENGKAP</p>
          <p className="font-semibold">: {patient.fullName.toUpperCase()}</p>
        </div>
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">TANGGAL LAHIR / UMUR</p>
          <p className="font-semibold">
            : {formatDateToIndonesian(patient.dob)} / {patient.age} TAHUN
          </p>
        </div>
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">JENIS KELAMIN</p>
          <p className="font-semibold">: {patient.gender.toUpperCase()}</p>
        </div>
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">ALAMAT</p>
          <p className="font-semibold">
            : {patient.address?.toUpperCase() || "BELUM DIISI"}
          </p>
        </div>
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">NO. TELP</p>
          <p className="font-semibold">
            : {patient.phoneNumber || "BELUM DIISI"}
          </p>
        </div>
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">TANGGAL PEMERIKSAAN</p>
          <p className="font-semibold">: {examinationDate}</p>
        </div>
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">JAM PEMERIKSAAN</p>
          <p className="font-semibold">: {examinationTime} WIB</p>
        </div>
        <div className="flex">
          <p className="w-48 shrink-0 text-gray-600">PERUSAHAAN</p>
          <p className="font-semibold">
            : {patient.companyName?.toUpperCase() || "BELUM DIISI"}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-bold border-b-2 border-black pb-1 inline-block">
          HASIL TERLAMPIR :
        </h2>
      </div>
    </div>
  );
};
