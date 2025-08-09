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

import {
  DassForm,
  DassFormValues,
  allDassQuestions,
} from "./components/DassForm";

import { FasForm, FasFormValues } from "./components/FasForm";
import { VerificationStep } from "./components/VerificationStep";
import { ProgressStepper } from "./components/ProgressStepper";
import { SubmittedStep } from "./components/SubmittedStep";
import { ConsentForm } from "./components/ConsentForm";

type DassResult = {
  dass_depression_score: number;
  dass_depression_level: string;
  dass_anxiety_score: number;
  dass_anxiety_level: string;
  dass_stress_score: number;
  dass_stress_level: string;
};

type AllFormData = {
  healthHistory?: Partial<HealthHistoryValues>;
  dass?: Partial<DassFormValues>;
  fas?: Partial<FasFormValues>;
};

const calculateDassScores = (data: Partial<DassFormValues>): DassResult => {
  const getLevel = (score: number, type: "d" | "a" | "s"): string => {
    if (type === "d") {
      if (score <= 9) return "Normal";
      if (score <= 13) return "Ringan";
      if (score <= 20) return "Sedang";
      if (score <= 27) return "Parah";
      return "Sangat Parah";
    }
    if (type === "a") {
      if (score <= 7) return "Normal";
      if (score <= 9) return "Ringan";
      if (score <= 14) return "Sedang";
      if (score <= 19) return "Parah";
      return "Sangat Parah";
    }
    if (score <= 14) return "Normal";
    if (score <= 18) return "Ringan";
    if (score <= 25) return "Sedang";
    if (score <= 33) return "Parah";
    return "Sangat Parah";
  };

  let depressionSum = 0;
  let anxietySum = 0;
  let stressSum = 0;

  allDassQuestions.forEach((q) => {
    const raw = data[q.id as keyof DassFormValues];
    const score = parseInt((raw as string) ?? "0", 10);
    if (q.scale === "d") depressionSum += score;
    else if (q.scale === "a") anxietySum += score;
    else if (q.scale === "s") stressSum += score;
  });

  const depressionScore = depressionSum * 2;
  const anxietyScore = anxietySum * 2;
  const stressScore = stressSum * 2;

  return {
    dass_depression_score: depressionScore,
    dass_depression_level: getLevel(depressionScore, "d"),
    dass_anxiety_score: anxietyScore,
    dass_anxiety_level: getLevel(anxietyScore, "a"),
    dass_stress_score: stressScore,
    dass_stress_level: getLevel(stressScore, "s"),
  };
};

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

  const handleHealthNext = (data: HealthHistoryValues) => {
    setAllFormData((prev) => ({ ...prev, healthHistory: data }));
    setStep((prev) => prev + 1);
  };

  const handleDassNext = (data: DassFormValues) => {
    setAllFormData((prev) => ({ ...prev, dass: data }));
    setStep((prev) => prev + 1);
  };

  const handleFasNext = (data: FasFormValues) => {
    setAllFormData((prev) => ({ ...prev, fas: data }));
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleFinalSubmit = async () => {
    const dassResults = allFormData.dass
      ? calculateDassScores(allFormData.dass)
      : undefined;

    const payload = {
      formAnswers: {
        healthHistoryAnswers: allFormData.healthHistory ?? null,
        dassTestAnswers: allFormData.dass
          ? {
              raw: allFormData.dass,
              result: dassResults!,
            }
          : null,
        fasTestAnswers: allFormData.fas ?? null,
      },
    };

    console.log("DATA FINAL SIAP DIKIRIM:", payload);

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
        setStep(5);
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
            onNext={handleHealthNext}
            onBack={() => setStep(0)}
            defaultValues={
              (allFormData.healthHistory ?? {}) as Partial<HealthHistoryValues>
            }
          />
        );

      case 2:
        return (
          <DassForm
            onNext={handleDassNext}
            onBack={handlePrevStep}
            defaultValues={(allFormData.dass ?? {}) as Partial<DassFormValues>}
          />
        );

      case 3:
        return (
          <FasForm
            onNext={handleFasNext}
            onBack={handlePrevStep}
            defaultValues={(allFormData.fas ?? {}) as Partial<FasFormValues>}
          />
        );

      case 4:
        return (
          <ConsentForm onSubmit={handleFinalSubmit} onBack={handlePrevStep} />
        );

      case 5:
        return <SubmittedStep patientName={patientDetails.name} />;

      default:
        return <VerificationStep onVerified={handleVerificationSuccess} />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "Verifikasi ID Pasien";
      case 1:
        return "Kuesioner Riwayat Kesehatan";
      case 2:
        return "Kuesioner Tes Psikologi (DASS-21)";
      case 3:
        return "Kuesioner Tes Psikologi (FAS)";
      case 4:
        return "Pernyataan Persetujuan";
      default:
        return "";
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
            Formulir Riwayat Kesehatan Dan Tes Psikologi
          </h1>
        </div>
      )}

      {step < 5 && <ProgressStepper currentStep={step} />}

      <div className="w-full flex justify-center mt-8">
        {step > 0 && step < 5 ? (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                {getStepTitle()}
              </CardTitle>
              {step < 4 && (
                <CardDescription>
                  Selamat datang,{" "}
                  <span className="font-bold">{patientDetails.name}</span>.
                  Mohon isi semua pertanyaan di bawah ini.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>
        ) : (
          renderStepContent()
        )}
      </div>
    </div>
  );
};

export default MultiStepFormPage;
