// components/mcu/report/FasDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from './reportStyles';

const fasQuestions = [
    { id: "fas1", text: "Saya terganggu karena kelelahan." },
    { id: "fas2", text: "Saya sangat cepat untuk mudah merasa lelah." },
    { id: "fas3", text: "Saya tidak dapat banyak melakukan sesuatu selama seharian penuh." },
    { id: "fas4", text: "Saya memiliki energi untuk aktivitas harian.", reverse: true },
    { id: "fas5", text: "Secara fisik, saya merasa kelelahan." },
    { id: "fas6", text: "Saya memiliki masalah untuk mulai berpikir." },
    { id: "fas7", text: "Saya memiliki masalah untuk berpikir secara jernih." },
    { id: "fas8", text: "Saya tidak punya gairah untuk melakukan segala sesuatu." },
    { id: "fas9", text: "Secara mental, saya merasa kelelahan." },
    { id: "fas10", text: "Ketika saya melakukan sesuatu, saya dapat berkonsentrasi dengan baik.", reverse: true },
];

// Fungsi untuk menghitung skor FAS
const calculateFasScore = (answers) => {
    if (!answers) return { totalScore: 0, conclusion: "Data tidak lengkap." };

    let totalScore = 0;
    fasQuestions.forEach(q => {
        if (answers[q.id]) {
            let score = parseInt(answers[q.id], 10);
            // Reverse score untuk pertanyaan nomor 4 dan 10
            if (q.reverse) {
                score = 6 - score;
            }
            totalScore += score;
        }
    });

    const conclusion = totalScore >= 22
        ? "Terdapat indikasi kelelahan yang signifikan (Skor ≥ 22)."
        : "Tidak terdapat indikasi kelelahan yang signifikan (Skor < 22).";

    return { totalScore, conclusion };
};

export const FasDocument = ({ data }) => {
    const { totalScore, conclusion } = calculateFasScore(data?.fasTestAnswers);

    return (
        <Page size="A4" style={globalStyles.page}>
            <ReportHeader />
            <PatientInfo patient={data?.patient} />

            <View style={globalStyles.body}>
                <Text style={localStyles.title}>HASIL PEMERIKSAAN FAS</Text>
                <Text style={localStyles.subTitle}>(FATIGUE ASSESSMENT SCALE)</Text>

                <View style={localStyles.resultBox}>
                    <Text style={localStyles.scoreLabel}>Total Skor Kelelahan:</Text>
                    <Text style={localStyles.scoreValue}>{totalScore}</Text>
                </View>

                <View style={localStyles.conclusionSection}>
                    <Text style={localStyles.sectionTitle}>Kesimpulan</Text>
                    <Text style={localStyles.conclusionText}>{conclusion}</Text>
                </View>

                <View style={localStyles.interpretationSection}>
                    <Text style={localStyles.sectionTitle}>Interpretasi</Text>
                    <Text style={localStyles.interpretationText}>
                        Fatigue Assessment Scale (FAS) mengukur tingkat kelelahan yang dirasakan pasien.
                        Skor total berkisar antara 10 hingga 50. Skor 22 atau lebih tinggi menunjukkan
                        adanya tingkat kelelahan yang signifikan dan mungkin memerlukan evaluasi lebih lanjut.
                    </Text>
                </View>
            </View>

            <ReportFooter />
        </Page>
    );
};

const localStyles = StyleSheet.create({
    title: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 5, textDecoration: 'underline', textAlign: 'center' },
    subTitle: { fontSize: 10, fontFamily: "Helvetica", textAlign: 'center', marginBottom: 30 },
    resultBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333', padding: 15, marginBottom: 25 },
    scoreLabel: { fontSize: 11, fontFamily: 'Helvetica' },
    scoreValue: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginLeft: 10 },
    conclusionSection: { marginBottom: 25 },
    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 5 },
    conclusionText: { fontSize: 10, lineHeight: 1.5 },
    interpretationSection: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
    interpretationText: { fontSize: 9, lineHeight: 1.5, textAlign: 'justify' },
});
