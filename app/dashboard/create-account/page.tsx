import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCompanyForm } from "./CreateCompanyForm";

const CreateAccountPage = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Buat Akun Perusahaan Rekanan
            </CardTitle>
            <CardDescription>
              Daftarkan perusahaan baru beserta akun login untuk HRD mereka.
              Akun HRD dapat digunakan untuk mendaftarkan pasien MCU dari
              perusahaan tersebut.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCompanyForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAccountPage;
