import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCompanyForm } from "./CreateCompanyForm";
import { CreatePetugasForm } from "./CreatePetugasForm";

const CreateAccountPage = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="hrd" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hrd">Create HRD Account</TabsTrigger>
            <TabsTrigger value="petugas">Create Petugas Account</TabsTrigger>
          </TabsList>

          <TabsContent value="hrd">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Create a Partner Company Account
                </CardTitle>
                <CardDescription>
                  Register a new company and a login account for their HR
                  department.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateCompanyForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="petugas">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Create a Petugas Account
                </CardTitle>
                <CardDescription>
                  Register a new account for internal clinic staff (Petugas).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreatePetugasForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateAccountPage;
