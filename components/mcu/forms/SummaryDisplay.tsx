import React from "react";
import {
  MetricItem,
  hematologyDataMap,
  kimiaDarahDataMap,
  urinalisaDataMap,
  isAbnormal,
  SummaryConclusionData,
  Summaries,
  isQualitative,
} from "@/utils/mcuSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryDisplayProps = {
  formData: SummaryConclusionData;
  summaries: Summaries;
  gender: string;
};

const formatUrineSpecificGravity = (
  item: MetricItem,
  resultValue: unknown
): string => {
  if (item.field === "urinBeratJenis" && resultValue != null) {
    const rawValue = String(resultValue).replace(/,/g, ".");
    let num = parseFloat(rawValue);

    if (!isNaN(num)) {
      if (Number.isInteger(num) && num > 100) {
        num = num / 1000;
        return num.toFixed(3);
      }
      return num.toFixed(3);
    }
  }
  return String(resultValue ?? "");
};

const getReferenceValue = (item: MetricItem, gender: string) => {
  const ref = item.ref;

  if (isQualitative(ref)) {
    return `Normal: ${ref.normal.join(", ")}`;
  }

  let range = ref.all;
  const g = gender.toUpperCase();

  if (ref.male && g === "LAKI-LAKI") range = ref.male;
  else if (ref.female && g === "PEREMPUAN") range = ref.female;

  if (!range) return "-";

  const min = range.min !== undefined ? range.min : "";
  const max = range.max !== undefined ? range.max : "";

  if (min !== "" && max !== "") return `${min} - ${max}`;
  if (min !== "") return `> ${min}`;
  if (max !== "") return `< ${max}`;
  return "-";
};

const renderLabTable = (
  title: string,
  dataMap: MetricItem[],
  formData: SummaryConclusionData,
  gender: string
) => {
  const tableRows = dataMap
    .map((item) => {
      const resultValue = (formData as Record<string, unknown>)?.[item.field];

      if (resultValue === undefined || resultValue === null) return null;

      const isAbnormalResult = isAbnormal(item, resultValue, gender);

      const displayValue =
        item.field === "urinBeratJenis"
          ? formatUrineSpecificGravity(item, resultValue)
          : String(resultValue);

      return (
        <tr
          key={item.field}
          className={`border-b ${
            isAbnormalResult
              ? "bg-red-50 text-red-700 font-medium"
              : "hover:bg-gray-50"
          }`}
        >
          <td className="p-2">{item.label}</td>
          <td className="p-2 text-center font-bold">{displayValue}</td>
          <td className="p-2 text-xs">{getReferenceValue(item, gender)}</td>
          <td className="p-2 text-center">{item.unit}</td>
        </tr>
      );
    })
    .filter(Boolean);

  if (tableRows.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2 text-gray-700">{title}</h4>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 text-left w-1/3">Pemeriksaan</th>
              <th className="p-2 text-center w-1/4">Hasil</th>
              <th className="p-2 text-left w-1/4">Nilai Rujukan</th>
              <th className="p-2 text-center w-1/6">Unit</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </div>
  );
};

export const SummaryDisplay = ({
  formData,
  summaries,
  gender,
}: SummaryDisplayProps) => {
  const labDataMaps = [
    { title: "LABORATORIUM - HEMATOLOGI DARAH RUTIN", map: hematologyDataMap },
    { title: "LABORATORIUM - HASIL KIMIA DARAH", map: kimiaDarahDataMap },
    { title: "LABORATORIUM - URIN RUTIN", map: urinalisaDataMap },
  ];

  const summaryItems = Object.entries(summaries)
    .filter(([, value]) => value !== undefined)
    .map(([key, value], index) => {
      const labelMap: Record<keyof Summaries, string> = {
        fisik: "Pemeriksaan Fisik",
        hematologi: "Lab - Hematologi Darah Rutin",
        kimiaDarah: "Lab - Hasil Kimia Darah",
        urinRutin: "Lab - Urin Rutin",
        rontgen: "Pemeriksaan Rontgen Thorax",
        ekg: "Pemeriksaan EKG",
        mammae: "Pemeriksaan Mammae (USG)",
        abdomen: "Pemeriksaan USG Abdomen",
        audiometry: "Pemeriksaan Audiometri",
        spirometry: "Pemeriksaan Spirometri",
        treadmill: "Pemeriksaan Treadmill",
        biomonitoring: "Lab - Biomonitoring",
        hepatitis: "Lab - Panel Hepatitis",
        refraktometri: "Pemeriksaan Refraktometri",
      };

      const label = labelMap[key as keyof Summaries] || key;
      const valueUpper = String(value).toUpperCase();

      const isNormal =
        valueUpper === "NORMAL" ||
        valueUpper.includes("NORMAL") ||
        valueUpper.includes("NEGATIVE ISCHEMIC RESPONSE") ||
        valueUpper.includes("NEGATIVE STRESS TEST");

      let textColorClass = "text-red-600";

      if (isNormal) {
        if (
          key === "treadmill" &&
          (valueUpper.includes("NEGATIVE ISCHEMIC RESPONSE") ||
            valueUpper.includes("NEGATIVE STRESS TEST"))
        ) {
          textColorClass = "text-black";
        } else {
          textColorClass = "text-primary";
        }
      }
      return (
        <div
          key={key}
          className="flex flex-col mb-2 p-2 border-b last:border-b-0"
        >
          <div className="flex items-start">
            <span className="font-semibold text-gray-700 mr-2 min-w-[30px]">
              {index + 1}.
            </span>
            <span className="font-semibold text-gray-700 w-1/3 min-w-[200px] flex-shrink-0">
              {label}
            </span>
            <span className="font-bold mr-2">:</span>
            <div className="flex-grow">
              <span className={`font-bold ${textColorClass}`}>
                {value || "TIDAK ADA"}
              </span>
            </div>
          </div>
        </div>
      );
    });

  return (
    <Card className="border-2 border-l-4">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-xl text-black flex items-center">
          RINGKASAN & DETAIL HASIL MCU
        </CardTitle>
        <p className="text-xs text-gray-600">
          Gunakan ringkasan real-time ini untuk mengisi Kesimpulan dan Saran.
          Hasil ABNORMAL ditandai merah.
        </p>
      </CardHeader>
      <CardContent className="pt-4 px-4">
        <h3 className="text-lg font-bold mb-3 text-black border-b pb-2">
          RESUME HASIL PEMERIKSAAN
        </h3>
        <div className="text-sm">
          {summaryItems.length > 0 ? (
            summaryItems
          ) : (
            <p className="text-gray-500">
              Hasil belum tersedia atau paket MCU tidak mencakup tes lab dasar.
            </p>
          )}
        </div>

        <h3 className="text-lg font-bold my-4 text-black border-b pb-2">
          NILAI RUJUKAN & DETAIL ABNORMAL
        </h3>
        <div className="space-y-6">
          {labDataMaps.map(({ title, map }) => (
            <div key={title}>
              {renderLabTable(title, map, formData, gender)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
