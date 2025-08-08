"use client";

import React, { useState } from "react";
import { toast, Toaster } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  HealthHistoryForm,
  HealthHistoryValues,
} from "./components/HealthHistoryForm";
import { DassForm, DassResult } from "./components/DassForm";
import { FasForm, FasFormValues } from "./components/FasForm";
import { VerificationStep } from "./components/VerificationStep";
import { ProgressStepper } from "./components/ProgressStepper";
import { SubmittedStep } from "./components/SubmittedStep";

type AllFormData = Partial<HealthHistoryValues & DassResult & FasFormValues>;

const MultiStepFormPage = () => {
  const [step, setStep] = useState(0);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    resultId: "",
  });

  const [allFormData, setAllFormData] = useState<AllFormData>({});

  const handleVerificationSuccess = (details: {
    name: string;
    resultId: string;
  }) => {
    setPatientDetails(details);
    setStep(1);
  };

  const handleNextStep = (
    currentStepData: HealthHistoryValues | DassResult
  ) => {
    setAllFormData((prevData) => {
      const updatedData = { ...prevData, ...currentStepData };
      console.log("Data terkumpul:", updatedData);
      return updatedData;
    });
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (lastStepData: FasFormValues) => {
    const finalData = { ...allFormData, ...lastStepData };
    const payload = { formAnswers: finalData };

    const promise = fetch(`/api/mcu/results/${patientDetails.resultId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengirim data.");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: "Mengirim semua jawaban...",
      success: () => {
        setStep(4);
        return "Semua jawaban berhasil dikirim!";
      },
      error: (err) => err.message || "Terjadi kesalahan.",
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <VerificationStep onVerified={handleVerificationSuccess} />;
      case 1:
        return (
          <HealthHistoryForm
            onNext={handleNextStep}
            onBack={() => setStep(0)}
          />
        );
      case 2:
        return <DassForm onNext={handleNextStep} onBack={handlePrevStep} />;
      case 3:
        return <FasForm onSubmit={handleFinalSubmit} onBack={handlePrevStep} />;
      case 4:
        return <SubmittedStep patientName={patientDetails.name} />;
      default:
        return <VerificationStep onVerified={handleVerificationSuccess} />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Kuesioner Riwayat Kesehatan";
      case 2:
        return "Kuesioner Tes Psikologi (DASS-21)";
      case 3:
        return "Kuesioner Tes Psikologi (FAS)";
      default:
        return ""; // Kosongkan untuk step 0
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 sm:py-12 px-4 form-bg">
      <style jsx global>{`
        .form-bg {
          background: linear-gradient(to bottom right, #f0f4ff, #e6e9f0);
        }
        body {
          background-color: #f0f4ff;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Toaster richColors position="top-center" />

      {step === 0 && (
        <div className="w-full max-w-4xl mb-8 text-center animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Formulir Pemeriksaan Kesehatan Awal
          </h1>
        </div>
      )}

      {step < 4 && <ProgressStepper currentStep={step} />}

      <div className="w-full flex justify-center mt-8">
        {step > 0 && step < 4 ? (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                {getStepTitle()}
              </CardTitle>
              <CardDescription>
                Selamat datang,{" "}
                <span className="font-bold">{patientDetails.name}</span>. Mohon
                isi semua pertanyaan di bawah ini.
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>
        ) : (
          // Tampilan tanpa Card besar untuk Verifikasi (step 0) dan Halaman Sukses (step 4)
          // Ini akan menjaga ukuran Card verifikasi tetap kecil.
          renderStepContent()
        )}
      </div>
    </div>
  );
};

export default MultiStepFormPage;
