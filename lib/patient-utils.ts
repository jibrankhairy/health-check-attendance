import * as XLSX from "xlsx";
import { toast } from "sonner";
import { type PatientData } from "@/components/dashboard/PatientTable";
import { mcuPackages } from "@/lib/mcu-data";

/**
 * Fungsi ini sekarang hanya bertugas membaca file Excel dan mengubahnya menjadi data JSON.
 * Tidak lagi mengirim data ke API.
 * @param file File Excel yang diunggah.
 * @returns Promise yang berisi array data pasien yang sudah diparsing.
 */
export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: "yyyy-mm-dd",
        });

        if (!json || json.length === 0) {
          resolve([]);
          return;
        }

        const newPatients = json.map((row: any, index: number) => {
          const nik = row["NIK"];
          const name = row["Name"];
          const dob = row["Date of birth"];

          if (!nik || !name || !dob) {
            throw new Error(
              `Data NIK, Name, atau Date of Birth kosong di baris Excel ${
                index + 2
              }.`
            );
          }

          const mcuPackage: string[] = [];
          const mainPackageFromExcel = row["Package"];
          if (
            mainPackageFromExcel &&
            String(mainPackageFromExcel).trim() !== ""
          ) {
            const matchedPackage = mcuPackages.find((p) =>
              p.label
                .toLowerCase()
                .includes(String(mainPackageFromExcel).trim().toLowerCase())
            );
            if (matchedPackage) {
              mcuPackage.push(matchedPackage.id);
            }
          }

          const addOnDefinitions = [
            { id: "EKG", excelVariations: ["EKG"] },
            { id: "Treadmill", excelVariations: ["Treadmill"] },
            { id: "Audiometry", excelVariations: ["Audiometry", "Audiometri"] },
            { id: "Spirometry", excelVariations: ["Spirometry", "Spirometri"] },
            {
              id: "Panel Hepatitis",
              excelVariations: ["Panel Hepatitis", "Panel Hepatitits"],
            },
            { id: "Biomonitoring", excelVariations: ["Biomonitoring"] },
          ];

          addOnDefinitions.forEach((addOn) => {
            for (const excelColumnName of addOn.excelVariations) {
              if (
                row[excelColumnName] &&
                String(row[excelColumnName]).trim() !== ""
              ) {
                if (!mcuPackage.includes(addOn.id)) {
                  mcuPackage.push(addOn.id);
                }
                break;
              }
            }
          });

          return {
            nik: String(nik),
            fullName: String(name),
            email: row["Email"] || null,
            dob: dob,
            age: parseInt(row["Age"], 10),
            position: String(row["Position"]),
            division: String(row["Division"]),
            status: String(row["Status"]),
            location: String(row["Location"]),
            gender: String(row["Gender"]),
            mcuPackage: mcuPackage,
          };
        });
        resolve(newPatients);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
  });
};

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
