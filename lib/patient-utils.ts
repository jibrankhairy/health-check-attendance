import * as XLSX from "xlsx";
import { toast } from "sonner";
import { PatientData } from "@/components/dashboard/PatientTable";

/**
 * Memproses file Excel yang diimpor untuk membuat pasien secara massal.
 * @param file - File Excel (dari input).
 * @param companyId - ID perusahaan.
 * @param onComplete - Callback untuk me-refresh data setelah selesai.
 */
export const processImportedExcelFile = async (
  file: File,
  companyId: string,
  onComplete: () => void
) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = async (e) => {
    try {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils
        .sheet_to_json(worksheet, {
          header: [
            "NIK",
            "Nama Pegawai",
            "Email",
            "Jenis Kelamin",
            "Tanggal Lahir",
            "Bagian / Departemen",
          ],
          raw: false,
          dateNF: "yyyy-mm-dd",
        })
        .slice(1);

      const newPatients = json.map((row: any, index: number) => {
        if (!row["NIK"] || !row["Nama Pegawai"] || !row["Tanggal Lahir"]) {
          throw new Error(
            `Data tidak lengkap di baris ${
              index + 2
            }. Pastikan NIK, Nama, dan Tanggal Lahir terisi.`
          );
        }
        return {
          nik: String(row["NIK"]),
          fullName: String(row["Nama Pegawai"]),
          email: row["Email"] || null,
          dob: row["Tanggal Lahir"],
          department: String(row["Bagian / Departemen"] || "N/A"),
          gender: String(row["Jenis Kelamin"]),
        };
      });

      const response = await fetch("/api/patients/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patients: newPatients, companyId }),
      });

      const resultData = await response.json();
      if (!response.ok) {
        throw new Error(resultData.message || "Gagal mengimpor data pasien.");
      }

      toast.success(resultData.message);
      onComplete(); // Refresh data pasien
    } catch (error) {
      console.error("Error importing patients:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`
      );
    }
  };
};

/**
 * Mengunduh satu gambar QR code.
 * @param qrCode - Data string untuk QR code.
 * @param patientName - Nama pasien untuk nama file.
 */
export const downloadQrCode = async (qrCode: string, patientName: string) => {
  const toastId = toast.loading("Mengunduh QR Code...");
  try {
    const response = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`
    );
    if (!response.ok) throw new Error("Gagal mengambil gambar QR Code.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR_${patientName.replace(/\s/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.success("QR Code berhasil diunduh.", { id: toastId });
  } catch (error) {
    console.error("Download QR error:", error);
    toast.error("Gagal mengunduh QR Code.", { id: toastId });
  }
};

/**
 * Mengunduh beberapa QR code secara berurutan.
 * @param patients - Array pasien yang QR code-nya akan diunduh.
 */
export const downloadMultipleQrCodes = async (patients: PatientData[]) => {
  const toastId = toast.loading(`Mengunduh ${patients.length} QR code...`);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  try {
    for (const patient of patients) {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${patient.qrCode}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR_${patient.fullName.replace(/\s/g, "_")}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        await delay(300);
      }
    }
    toast.success(`${patients.length} QR Code berhasil diunduh.`, {
      id: toastId,
    });
  } catch (error) {
    console.error("Bulk download QR error:", error);
    toast.error("Gagal mengunduh semua QR Code.", { id: toastId });
  }
};
