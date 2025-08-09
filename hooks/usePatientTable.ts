import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  downloadMultipleQrCodes,
  processImportedExcelFile,
} from "@/lib/patient-utils";
import { PatientData } from "@/components/dashboard/PatientTable";

export const usePatientTable = (companyId: string) => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(
    null
  );
  const [deletingPatient, setDeletingPatient] = useState<PatientData | null>(
    null
  );
  const [viewingMcuResultId, setViewingMcuResultId] = useState<string | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(
    new Set()
  );
  const [isDownloadingAllQrs, setIsDownloadingAllQrs] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fetchPatients = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/patients?companyId=${companyId}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setPatients(data);
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
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      if (!response.ok) throw new Error("Gagal mengambil data pasien.");
      const data = await response.json();
      setEditingPatient(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pasien untuk diedit.");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    await processImportedExcelFile(file, companyId, fetchPatients);
    setIsImporting(false);

    if (event.target) {
      event.target.value = "";
    }
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
      patients.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.department.toLowerCase().includes(searchQuery.toLowerCase())
      ),
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
    // State
    patients,
    loading,
    isDialogOpen,
    editingPatient,
    deletingPatient,
    viewingMcuResultId,
    searchQuery,
    currentPage,
    rowsPerPage,
    selectedPatients,
    isDownloadingAllQrs,
    isImporting,

    // Setters
    setIsDialogOpen,
    setEditingPatient,
    setDeletingPatient,
    setViewingMcuResultId,
    setSearchQuery,
    setCurrentPage,
    setRowsPerPage,

    // Handlers
    fetchPatients,
    handleDeleteConfirm,
    handleEditClick,
    handleFileChange,
    handleDownloadAllSelectedQrs,
    handleSelectPatient,
    handleSelectAllOnPage,

    // Derived State
    filteredPatients,
    currentRows,
    totalPages,
    areAllOnPageSelected,
  };
};
