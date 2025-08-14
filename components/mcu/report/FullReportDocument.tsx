// components/mcu/report/FullReportDocument.tsx
"use client";

import React from "react";
import { Document } from "@react-pdf/renderer";

// Import semua bagian dokumen
import { MainCoverDocument } from "./MainCoverDocument";
import { CoverPageDocument } from "./CoverPageDocument";
import { PemeriksaanFisikDocument } from "./PemeriksaanFisikDocument"; // <-- IMPORT BARU
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

    // Logika untuk menampilkan setiap bagian laporan
    const showPemeriksaanFisik = !!data.pemeriksaanFisikForm; // Tampilkan jika data fisiknya ada
    const showHematologi = hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir");
    const showKimiaDarah = hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir");
    const showUrinalisa = hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir");
    const showRontgen = hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir") || hasItem("radiologi thoraks");
    const showEkg = hasItem("mcu eksekutif") || hasItem("ekg") || hasItem("treadmill");
    const showAudiometri = hasItem("mcu eksekutif") || hasItem("audiometri");
    const showSpirometri = hasItem("mcu eksekutif") || hasItem("spirometri");
    const showUsgAbdomen = hasItem("mcu eksekutif") || hasItem("usg whole abdomen");
    const showUsgMammae = hasItem("mcu eksekutif") || hasItem("usg mammae");

    const showDass = !!data.dassTestAnswers;
    const showFas = !!data.fasTestAnswers;
    const showConsent = !!data.formSubmittedAt;
    const showHealthHistory = !!data.healthHistoryAnswers;

    return (
        <Document>
            {/* Halaman Cover Utama & Depan */}
            <MainCoverDocument data={data} /> 
            <CoverPageDocument data={data} />

            {/* Halaman Persetujuan & Riwayat Kesehatan */}
            {showConsent && <ConsentDocument data={data} />}
            {showHealthHistory && <HealthHistoryDocument data={data} />}

            {/* Halaman Pemeriksaan Fisik */}
            {showPemeriksaanFisik && <PemeriksaanFisikDocument data={data} />}

            {/* Halaman Hasil Tes Psikologi */}
            {showDass && <DassDocument data={data} />}
            {showFas && <FasDocument data={data} />}

            {/* Halaman Hasil Laboratorium & Penunjang Medis */}
            {showHematologi && <HematologiDocument data={data} />}
            {showUrinalisa && <UrinalisaDocument data={data} />}
            {showKimiaDarah && <KimiaDarahDocument data={data} />}
            {showRontgen && <RontgenDocument data={data} />}
            {showEkg && <EkgDocument data={data} />}
            {showAudiometri && <AudiometriDocument data={data} />}
            {showSpirometri && <SpirometriDocument data={data} />}
            {showUsgAbdomen && <UsgAbdomenDocument data={data} />}
            {showUsgMammae && <UsgMammaeDocument data={data} />}

            {/* Halaman Kesimpulan Akhir */}
            <ConclusionDocument data={data} />
        </Document>
    );
};
