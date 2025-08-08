"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SubmittedStep = ({ patientName }: { patientName: string }) => (
  <Card className="w-full max-w-2xl text-center animate-fade-in border-0 shadow-none">
    <CardHeader>
      <CardTitle className="text-2xl text-green-600">
        Submit Berhasil!
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <p>
        Terima kasih, {patientName}. Jawaban Anda telah berhasil dikirim. Anda
        dapat menutup halaman ini.
      </p>
    </CardContent>
  </Card>
);
