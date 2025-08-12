// components/mcu/report/DassDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from './reportStyles';

// Skala dan pertanyaan DASS-21
const dassQuestions = [
    { id: "dass1", scale: "s" }, { id: "dass2", scale: "a" }, { id: "dass3", scale: "d" },
    { id: "dass4", scale: "a" }, { id: "dass5", scale: "d" }, { id: "dass6", scale: "s" },
    { id: "dass7", scale: "a" }, { id: "dass8", scale: "s" }, { id: "dass9", scale: "a" },
    { id: "dass10", scale: "d" }, { id: "dass11", scale: "s" }, { id: "dass12", scale: "s" },
    { id: "dass13", scale: "d" }, { id: "dass14", scale: "s" }, { id: "dass15", scale: "a" },
    { id: "dass16", scale: "d" }, { id: "dass17", scale: "d" }, { id: "dass18", scale: "s" },
    { id: "dass19", scale: "a" }, { id: "dass20", scale: "a" }, { id: "dass21", scale: "d" },
];

// Fungsi untuk menghitung skor DASS
const calculateDassScores = (answers) => {
    if (!answers) return { depression: 0, anxiety: 0, stress: 0 };

    let scores = { d: 0, a: 0, s: 0 };
    dassQuestions.forEach(q => {
        if (answers[q.id]) {
            scores[q.scale] += parseInt(answers[q.id], 10);
        }
    });

    // Kalikan 2 sesuai standar scoring DASS-21
    return {
        depression: scores.d * 2,
        anxiety: scores.a * 2,
        stress: scores.s * 2,
    };
};

// Fungsi untuk menentukan tingkat keparahan
const getSeverity = (scale, score) => {
    const cutoffs = {
        depression: { normal: 9, mild: 13, moderate: 20, severe: 27, extremelySevere: 999 },
        anxiety: { normal: 7, mild: 9, moderate: 14, severe: 19, extremelySevere: 999 },
        stress: { normal: 14, mild: 18, moderate: 25, severe: 33, extremelySevere: 999 },
    };
    if (score <= cutoffs[scale].normal) return "Normal";
    if (score <= cutoffs[scale].mild) return "Ringan";
    if (score <= cutoffs[scale].moderate) return "Sedang";
    if (score <= cutoffs[scale].severe) return "Parah";
    return "Sangat Parah";
};

export const DassDocument = ({ data }) => {
    // --- PERBAIKAN DI SINI: Ambil jawaban dari object 'raw' ---
    const scores = calculateDassScores(data?.dassTestAnswers?.raw);
    
    const results = {
        depression: { score: scores.depression, severity: getSeverity('depression', scores.depression) },
        anxiety: { score: scores.anxiety, severity: getSeverity('anxiety', scores.anxiety) },
        stress: { score: scores.stress, severity: getSeverity('stress', scores.stress) },
    };

    return (
        <Page size="A4" style={globalStyles.page}>
            <ReportHeader />
            <PatientInfo patient={data?.patient} />

            <View style={globalStyles.body}>
                <Text style={localStyles.title}>HASIL PEMERIKSAAN DASS-21</Text>
                <Text style={localStyles.subTitle}>(DEPRESSION ANXIETY STRESS SCALES)</Text>

                <View style={localStyles.table}>
                    <View style={localStyles.tableRow}>
                        <Text style={[localStyles.tableColHeader, { width: '40%' }]}>Skala</Text>
                        <Text style={[localStyles.tableColHeader, { width: '30%' }]}>Total Skor</Text>
                        <Text style={[localStyles.tableColHeader, { width: '30%' }]}>Tingkat Keparahan</Text>
                    </View>
                    <View style={localStyles.tableRow}>
                        <Text style={[localStyles.tableCol, { width: '40%' }]}>Depresi</Text>
                        <Text style={[localStyles.tableCol, { width: '30%' }]}>{results.depression.score}</Text>
                        <Text style={[localStyles.tableCol, { width: '30%' }]}>{results.depression.severity}</Text>
                    </View>
                    <View style={localStyles.tableRow}>
                        <Text style={[localStyles.tableCol, { width: '40%' }]}>Kecemasan</Text>
                        <Text style={[localStyles.tableCol, { width: '30%' }]}>{results.anxiety.score}</Text>
                        <Text style={[localStyles.tableCol, { width: '30%' }]}>{results.anxiety.severity}</Text>
                    </View>
                    <View style={localStyles.tableRow}>
                        <Text style={[localStyles.tableCol, { width: '40%' }]}>Stres</Text>
                        <Text style={[localStyles.tableCol, { width: '30%' }]}>{results.stress.score}</Text>
                        <Text style={[localStyles.tableCol, { width: '30%' }]}>{results.stress.severity}</Text>
                    </View>
                </View>

                <View style={localStyles.interpretationSection}>
                    <Text style={localStyles.sectionTitle}>Interpretasi</Text>
                    <Text style={localStyles.interpretationText}>
                        Skor dihitung berdasarkan jawaban pasien selama seminggu terakhir. Hasil ini
                        bukanlah diagnosis klinis, namun dapat menjadi indikator awal kondisi psikologis
                        yang mungkin memerlukan perhatian lebih lanjut dari profesional kesehatan mental.
                    </Text>
                </View>
            </View>

            <ReportFooter />
        </Page>
    );
};

const localStyles = StyleSheet.create({
    title: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 5, textDecoration: 'underline', textAlign: 'center' },
    subTitle: { fontSize: 10, fontFamily: "Helvetica", textAlign: 'center', marginBottom: 20 },
    table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: '#333' },
    tableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: '#333' },
    tableColHeader: { padding: 6, fontFamily: 'Helvetica-Bold', backgroundColor: '#f0f0f0', textAlign: 'center', borderRightWidth: 1, borderRightColor: '#333', fontSize: 10 },
    tableCol: { padding: 6, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#333', fontSize: 10 },
    interpretationSection: { marginTop: 25 },
    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 5 },
    interpretationText: { fontSize: 9, lineHeight: 1.5, textAlign: 'justify' },
});
