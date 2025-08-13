// components/mcu/report/FullReportDocument.tsx
"use client";

import React from "react";
import { Document } from "@react-pdf/renderer";

// Import semua bagian dokumen
import { MainCoverDocument } from "./MainCoverDocument"; // <-- Tambahin ini
import { CoverPageDocument } from "./CoverPageDocument";
import { HealthHistoryDocument } from "./HealthHistoryDocument";
import { DassDocument } from "./DassDocument";
import { FasDocument } from "./FasDocument";
import { ConsentDocument } from "./ConsentDocument";
import { HematologiDocument } from "./HematologiDocument";
import { UrinalisaDocument } from "./UrinalisaDocument";
import { KimiaDarahDocument } from "./KimiaDarahDocument";
import { RontgenDocument } from "./RontgenDocument";
import { EkgDocument } from "./EkgDocument";
import { AudiometriDocument } from "./AudiometriDocument";
import { SpirometriDocument } from "./SpirometriDocument";
import { UsgAbdomenDocument } from "./UsgAbdomenDocument";
import { UsgMammaeDocument } from "./UsgMammaeDocument";
import { ConclusionDocument } from "./ConclusionDocument";

export const FullReportDocument = ({ data }) => {
    const packageItemsLower = (data?.patient?.mcuPackage || []).map(p => p.toLowerCase());
    const hasItem = (item) => packageItemsLower.includes(item.toLowerCase());

    const showHematologi = hasItem("MCU Regular") || hasItem("MCU Eksekutif") || hasItem("MCU Akhir");
    const showKimiaDarah = hasItem("MCU Regular") || hasItem("MCU Eksekutif") || hasItem("MCU Akhir");
    const showUrinalisa = hasItem("MCU Regular") || hasItem("MCU Eksekutif") || hasItem("MCU Akhir");
    const showRontgen = hasItem("MCU Regular") || hasItem("MCU Eksekutif") || hasItem("MCU Akhir") || hasItem("Radiologi thoraks");
    const showEkg = hasItem("MCU Eksekutif") || hasItem("EKG") || hasItem("Treadmill");
    const showAudiometri = hasItem("MCU Eksekutif") || hasItem("Audiometri");
    const showSpirometri = hasItem("MCU Eksekutif") || hasItem("Spirometri");
    const showUsgAbdomen = hasItem("MCU Eksekutif") || hasItem("USG Whole Abdomen");
    const showUsgMammae = hasItem("MCU Eksekutif") || hasItem("USG Mammae");

    const showDass = !!data.dassTestAnswers;
    const showFas = !!data.fasTestAnswers;
    const showConsent = !!data.formSubmittedAt;

    return (
        <Document>
            {/* Halaman Pertama */}
            <MainCoverDocument data={data} /> 

            {/* Halaman Kedua */}
            <CoverPageDocument data={data} />

            <HealthHistoryDocument data={data} />

            {showDass && <DassDocument data={data} />}
            {showFas && <FasDocument data={data} />}

            {showConsent && <ConsentDocument data={data} />}

            {showHematologi && <HematologiDocument data={data} />}
            {showUrinalisa && <UrinalisaDocument data={data} />}
            {showKimiaDarah && <KimiaDarahDocument data={data} />}
            {showRontgen && <RontgenDocument data={data} />}
            {showEkg && <EkgDocument data={data} />}
            {showAudiometri && <AudiometriDocument data={data} />}
            {showSpirometri && <SpirometriDocument data={data} />}
            {showUsgAbdomen && <UsgAbdomenDocument data={data} />}
            {showUsgMammae && <UsgMammaeDocument data={data} />}

            <ConclusionDocument data={data} />
        </Document>
    );
};
