import React from "react";
import { McuReportDocument } from "./McuReportDocument";

export default async function ViewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // wajib await
  return (
    <div className="bg-gray-100 min-h-screen">
      <McuReportDocument mcuResultId={id} />
    </div>
  );
}
