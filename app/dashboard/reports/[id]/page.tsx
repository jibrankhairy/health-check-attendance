import React from 'react';
import { Header } from '../../components/Header';
import { McuResultForm } from '../McuResultForm'; // Komponen form yang akan kita buat

// Params akan berisi ID dari URL, contoh: { id: 'cme0ir0jm0001uvngo8crb1jz' }
const InputHasilMcuPage = async ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Header companyName="Input Hasil Laporan MCU" />
      <main className="flex-1 p-4 sm:p-8 bg-gray-50">
        <McuResultForm mcuResultId={params.id} />
      </main>
    </>
  );
};

export default InputHasilMcuPage;
