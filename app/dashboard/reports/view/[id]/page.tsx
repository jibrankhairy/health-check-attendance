import React from 'react';
import { McuReportDocument } from './McuReportDocument'; // Komponen ini akan kita buat selanjutnya

// Halaman ini akan menerima ID laporan dari URL, misal: /dashboard/reports/view/xyz
const ViewReportPage = ({ params }: { params: { id:string } }) => {
  return (
    // Kita sengaja tidak pakai layout dashboard standar agar halaman cetaknya bersih
    <div className="bg-gray-100 min-h-screen">
      <McuReportDocument mcuResultId={params.id} />
    </div>
  );
};

export default ViewReportPage;
