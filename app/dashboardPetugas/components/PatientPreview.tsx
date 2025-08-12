import * as React from "react";

type PatientData = {
  id?: string;
  mcuId?: string;
  fullName: string;
  dob: string;
};

type Props = {
  open: boolean;
  onCancel: () => void;
  onContinue: () => void;
  patient?: PatientData | null;
};

export default function PatientPreview({
  open,
  onCancel,
  onContinue,
  patient,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold mb-1">Konfirmasi Pasien</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pastikan biodata berikut sudah sesuai sebelum melanjutkan.
        </p>

        {patient ? (
          <div className="space-y-3 mb-6">
            <div>
              <div className="text-xs text-gray-500">Nama Lengkap</div>
              <div className="font-medium">{patient.fullName}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Tanggal Lahir</div>
                <div className="font-medium">{patient.dob}</div>
              </div>
              {patient.mcuId ? (
                <div>
                  <div className="text-xs text-gray-500">MCU ID</div>
                  <div className="font-medium">{patient.mcuId}</div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mb-6 text-red-600">Data pasien tidak tersedia.</div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}
