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
              Create a Partner Company Account
            </CardTitle>
            <CardDescription>
              Register a new company and a login account for their HR
              department. The HR department account can be used to register MCU
              patients from that company.
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
