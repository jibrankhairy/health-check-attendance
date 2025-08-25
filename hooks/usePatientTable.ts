import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { downloadMultipleQrCodes, parseExcelFile } from "@/lib/patient-utils";
import { type PatientData } from "@/components/dashboard/PatientTable";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export const usePatientTable = (companyId: string) => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(
    null
  );
  const [deletingPatient, setDeletingPatient] = useState<PatientData | null>(
    null
  );
  const [viewingMcuResultId, setViewingMcuResultId] = useState<string | null>(
    null
  );
  const [viewingPatientPackage, setViewingPatientPackage] = useState<
    string[] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(
    new Set()
  );
  const [isDownloadingAllQrs, setIsDownloadingAllQrs] = useState(false);

  const [isImporting, setIsImporting] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [parsedPatients, setParsedPatients] = useState<any[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState<number | null>(null);

  const fetchPatients = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/patients?companyId=${companyId}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();

      const patientsWithProgress = data.map((patient: PatientData) => {
        if (!patient.mcuResults || patient.mcuResults.length === 0) {
          return {
            ...patient,
            progress: 0,
            lastProgress: patient.lastProgress || "MENUNGGU",
          };
        }

        const latestMcu = patient.mcuResults[0];

        const totalCheckpoints = Array.isArray(patient.mcuPackage)
          ? patient.mcuPackage.length
          : 0;

        const completedCheckpoints =
          latestMcu.progress?.filter((p) => p.status === "COMPLETED").length ||
          0;

        const progressPercentage =
          totalCheckpoints > 0
            ? (completedCheckpoints / totalCheckpoints) * 100
            : 0;

        return {
          ...patient,
          progress: progressPercentage,
          lastProgress: patient.lastProgress,
        };
      });

      setPatients(patientsWithProgress);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Gagal memuat data pasien.");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDeleteConfirm = async () => {
    if (!deletingPatient) return;
    const promise = fetch(`/api/patients/${deletingPatient.id}`, {
      method: "DELETE",
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus pasien.");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: `Menghapus data ${deletingPatient.fullName}...`,
      success: () => {
        setDeletingPatient(null);
        fetchPatients();
        return `Pasien ${deletingPatient.fullName} berhasil dihapus.`;
      },
      error: (err) => err.message,
    });
  };

  const handleEditClick = async (patientId: number) => {
    setIsEditLoading(true);
    setIsDialogOpen(true);
    setEditingPatient(null);
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      if (!response.ok) throw new Error("Gagal mengambil data pasien.");
      const data = await response.json();
      setEditingPatient(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pasien untuk diedit.");
      setIsDialogOpen(false);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleViewProgressClick = (patient: PatientData) => {
    if (patient.mcuResults && patient.mcuResults.length > 0) {
      setViewingMcuResultId(patient.mcuResults[0].id);
      setViewingPatientPackage(patient.mcuPackage as string[]);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const parsedData = await parseExcelFile(file);
      if (parsedData.length === 0) {
        toast.info("Tidak ada data valid yang ditemukan di file Excel.");
        return;
      }
      setParsedPatients(parsedData);
      setIsImportConfirmOpen(true);
    } catch (error) {
      toast.error(
        `Gagal memproses file: ${
          error instanceof Error ? error.message : "Terjadi kesalahan"
        }`
      );
    } finally {
      setIsImporting(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleConfirmImport = async (sendEmail: boolean) => {
    setIsImportConfirmOpen(false);
    if (parsedPatients.length === 0) return;

    const CHUNK_SIZE = 25;
    const chunks = chunkArray(parsedPatients, CHUNK_SIZE);

    let totalCreated = 0;
    let totalSkipped = 0;
    let totalFailedBatches = 0;

    const toastId = toast.loading(
      `Mengimpor ${parsedPatients.length} pasien (0/${chunks.length} batch)...`
    );

    try {
      for (let i = 0; i < chunks.length; i++) {
        const batch = chunks[i];

        const res = await fetch("/api/patients/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patients: batch,
            companyId,
            sendEmail,
          }),
        });

        const text = await res.text();
        let data: any = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          totalFailedBatches += 1;
          toast.loading(
            `Batch ${i + 1}/${
              chunks.length
            } melewati batas waktu. Lanjut ke batch berikutnya...`,
            { id: toastId }
          );
          continue;
        }

        if (!res.ok) {
          totalFailedBatches += 1;
          toast.loading(
            `Batch ${i + 1}/${chunks.length} gagal: ${
              data?.message || res.statusText
            }`,
            { id: toastId }
          );
        } else {
          totalCreated += Number(data?.createdCount ?? 0);
          totalSkipped += Number(data?.skippedCount ?? 0);
          toast.loading(
            `Mengimpor ${parsedPatients.length} pasien (${i + 1}/${
              chunks.length
            } batch)...`,
            { id: toastId }
          );
        }

        await new Promise((r) => setTimeout(r, 150));
      }

      const summary = [
        "Ringkasan impor",
        "----------------",
        `Total data        : ${parsedPatients.length}`,
        `Berhasil dibuat   : ${totalCreated}`,
        `Dilewati (duplikat): ${totalSkipped}`,
        ...(totalFailedBatches
          ? [`Batch gagal       : ${totalFailedBatches}`]
          : []),
      ].join("\n");

      toast.success(summary, { id: toastId, duration: 7000 });
      fetchPatients();
    } catch (err: any) {
      toast.error(
        `Impor gagal: ${err?.message || "Terjadi kesalahan tak terduga."}`,
        { id: toastId }
      );
    } finally {
      setParsedPatients([]);
    }
  };

  const handleSendQrEmail = async (patient: PatientData) => {
    if (!patient.email) {
      toast.error("Pasien ini tidak memiliki alamat email.");
      return;
    }
    setIsSendingEmail(patient.id);
    const promise = fetch("/api/patients/send-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: patient.id }),
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal mengirim email.");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: `Mengirim QR Code ke ${patient.fullName}...`,
      success: (data) => data.message,
      error: (err) => err.message,
    });
    promise.finally(() => setIsSendingEmail(null));
  };

  const handleDownloadAllSelectedQrs = async () => {
    if (selectedPatients.size === 0) return;

    setIsDownloadingAllQrs(true);
    const patientsToDownload = patients.filter((p) =>
      selectedPatients.has(p.id)
    );
    await downloadMultipleQrCodes(patientsToDownload);
    setIsDownloadingAllQrs(false);
    setSelectedPatients(new Set());
  };

  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) => {
        const query = searchQuery.toLowerCase();
        return (
          patient.fullName.toLowerCase().includes(query) ||
          patient.patientId.toLowerCase().includes(query) ||
          (patient.nik && String(patient.nik).toLowerCase().includes(query)) ||
          (patient.position && patient.position.toLowerCase().includes(query))
        );
      }),
    [patients, searchQuery]
  );

  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredPatients.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredPatients, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);

  const handleSelectPatient = (patientId: number, checked: boolean) => {
    setSelectedPatients((prev) => {
      const newSet = new Set(prev);
      if (checked) newSet.add(patientId);
      else newSet.delete(patientId);
      return newSet;
    });
  };

  const handleSelectAllOnPage = (checked: boolean) => {
    const pagePatientIds = currentRows.map((p) => p.id);
    setSelectedPatients((prev) => {
      const newSet = new Set(prev);
      if (checked) pagePatientIds.forEach((id) => newSet.add(id));
      else pagePatientIds.forEach((id) => newSet.delete(id));
      return newSet;
    });
  };

  const areAllOnPageSelected = useMemo(
    () =>
      currentRows.length > 0 &&
      currentRows.every((p) => selectedPatients.has(p.id)),
    [currentRows, selectedPatients]
  );

  return {
    patients,
    loading,
    isDialogOpen,
    editingPatient,
    deletingPatient,
    viewingMcuResultId,
    viewingPatientPackage,
    searchQuery,
    currentPage,
    rowsPerPage,
    selectedPatients,
    isDownloadingAllQrs,
    isImporting,
    setIsDialogOpen,
    setEditingPatient,
    setDeletingPatient,
    setViewingMcuResultId,
    setViewingPatientPackage,
    setSearchQuery,
    setCurrentPage,
    setRowsPerPage,
    fetchPatients,
    handleDeleteConfirm,
    handleEditClick,
    handleViewProgressClick,
    handleFileChange,
    handleDownloadAllSelectedQrs,
    handleSelectPatient,
    handleSelectAllOnPage,
    filteredPatients,
    currentRows,
    totalPages,
    areAllOnPageSelected,
    isImportConfirmOpen,
    setIsImportConfirmOpen,
    parsedPatients,
    setParsedPatients,
    handleConfirmImport,
    isSendingEmail,
    handleSendQrEmail,
    isEditLoading,
  };
};
