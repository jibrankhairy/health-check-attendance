"use client";
import React from "react";

export const ProgressStepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Verifikasi", "Kesehatan", "Tes DASS", "Tes FAS"];
  const getStepClass = (stepIndex: number) => {
    if (stepIndex < currentStep)
      return "bg-green-500 border-green-500 text-white";
    if (stepIndex === currentStep)
      return "bg-[#01449D] border-[#01449D] text-white";
    return "bg-gray-200 border-gray-200 text-gray-500";
  };
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8 px-4">
      {steps.map((label, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${getStepClass(
                index
              )}`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <p
              className={`mt-2 text-xs md:text-sm ${
                index <= currentStep ? "font-semibold" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
