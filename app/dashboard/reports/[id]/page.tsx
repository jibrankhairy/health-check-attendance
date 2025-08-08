import React from "react";
import { Header } from "../../components/Header";
import { McuResultForm } from "../McuResultForm";

export default async function InputHasilMcuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header companyName="Input Hasil Laporan MCU" />
      <main className="flex-1 p-4 sm:p-8 bg-gray-50">
        <McuResultForm mcuResultId={id} />
      </main>
    </>
  );
}
