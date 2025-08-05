import React from "react";
import { PatientTable } from "./components/PatientTable";
import Header from "./components/Header";

const DashboardPage = () => {
  return (
    <>
      <Header />
      <PatientTable />
    </>
  );
};

export default DashboardPage;
