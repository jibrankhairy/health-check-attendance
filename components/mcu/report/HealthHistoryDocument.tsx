// components/mcu/report/HealthHistoryDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// DIUBAH: Import PatientInfo juga
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from './reportStyles';

// Style lokal khusus untuk halaman ini (tidak berubah)
const localStyles = StyleSheet.create({
    title: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        marginBottom: 20,
        textDecoration: 'underline',
        textAlign: 'center'
    },
    section: {
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
        fontSize: 10,
        lineHeight: 1.5
    },
    question: {
        width: '65%',
        marginLeft: 10,
    },
    answer: {
        width: '35%',
        fontFamily: 'Helvetica-Bold'
    },
    subQuestion: {
        paddingLeft: 20
    },
    detail: {
        fontStyle: 'italic',
        color: '#555'
    }
});

// Helper untuk format jawaban (tidak berubah)
const formatAnswer = (value: string | undefined | null, detail?: string | undefined | null) => {
    if (!value || value.toLowerCase() === 'tidak') return ': TIDAK ADA';
    let formatted = value.replace(/_/g, ' ').replace('tidakada', 'TIDAK ADA');
    if (formatted.toLowerCase() === 'ya') formatted = 'YA';
    
    let result = `: ${formatted.toUpperCase()}`;
    if (detail) {
        result += ` (${detail})`;
    }
    return result;
};

const QuestionRow = ({ number, question, answer }: { number: string, question: string, answer: string }) => (
    <View style={localStyles.row}>
        <Text style={localStyles.question}>{`${number}. ${question}`}</Text>
        <Text style={localStyles.answer}>{answer}</Text>
    </View>
);

const SubQuestionRow = ({ letter, question, answer }: { letter: string, question: string, answer: string }) => (
    <View style={[localStyles.row, localStyles.subQuestion]}>
        <Text style={localStyles.question}>{`${letter}. ${question}`}</Text>
        <Text style={localStyles.answer}>{answer}</Text>
    </View>
);

export const HealthHistoryDocument = ({ data }) => {
    const answers = data.healthHistoryAnswers || {};

    return (
        <Page size="A4" style={globalStyles.page}>
            <ReportHeader />

            {/* DITAMBAHKAN: Memanggil komponen identitas pasien */}
            <PatientInfo patient={data?.patient} />

            <View style={globalStyles.body}>
                <Text style={localStyles.title}>RIWAYAT KESEHATAN</Text>
                
                {/* ... Konten Riwayat Kesehatan tidak berubah ... */}
                <View style={localStyles.section}>
                    <QuestionRow 
                        number="1" 
                        question="Apakah Pasien Merasa Sehat Saat Ini" 
                        answer={formatAnswer(answers.merasaSehat)} 
                    />
                    <QuestionRow 
                        number="2" 
                        question="Keluhan Kesehatan Pasien Saat Ini" 
                        answer={formatAnswer(answers.keluhanKesehatan, answers.keluhanDetail)} 
                    />
                </View>

                <View style={localStyles.section}>
                    <QuestionRow number="3" question="Riwayat Penyakit Pasien (Ada / Tidak Ada)" answer={formatAnswer(answers.riwayatPenyakit)} />
                    {answers.riwayatPenyakit === 'ada' && (
                        <>
                            <SubQuestionRow letter="a" question="Dirawat di RS > 1 Minggu (Dalam 1 Tahun Terakhir)" answer={formatAnswer(answers.dirawatDiRS)} />
                            <SubQuestionRow letter="b" question="Memiliki Riwayat Penyakit" answer={formatAnswer(answers.memilikiRiwayatPenyakit, answers.riwayatPenyakitDetail)} />
                            <SubQuestionRow letter="c" question="Pernah Dioperasi" answer={formatAnswer(answers.pernahDioperasi)} />
                        </>
                    )}
                </View>

                <View style={localStyles.section}>
                    <QuestionRow number="4" question="Riwayat Penyakit Keluarga (Ada / Tidak Ada)" answer={formatAnswer(answers.riwayatPenyakitKeluarga)} />
                    {answers.riwayatPenyakitKeluarga === 'ada' && (
                         <SubQuestionRow letter="a" question="Detail Riwayat Penyakit Keluarga" answer={formatAnswer(answers.riwayatPenyakitKeluarga, answers.riwayatPenyakitKeluargaDetail)} />
                    )}
                </View>

                <View style={localStyles.section}>
                    <QuestionRow number="5" question="Riwayat Kebiasaan Hidup (Tidak / Kadang-kadang / Rutin)" answer="" />
                    <SubQuestionRow letter="a" question="Makan Teratur" answer={formatAnswer(answers.makanTeratur)} />
                    <SubQuestionRow letter="b" question="Alkohol" answer={formatAnswer(answers.alkohol)} />
                    <SubQuestionRow letter="c" question="Rokok - Batang / Hari" answer={formatAnswer(answers.rokok, answers.rokokDetail)} />
                    <SubQuestionRow letter="d" question="Olahraga" answer={formatAnswer(answers.olahraga)} />
                </View>

                <View style={localStyles.section}>
                    <QuestionRow number="6" question="Riwayat Konsumsi Obat-Obatan Teratur" answer="" />
                    <SubQuestionRow letter="a" question="Obat Diabetes" answer={formatAnswer(answers.obatDiabetes)} />
                    <SubQuestionRow letter="b" question="Obat Hipertensi" answer={formatAnswer(answers.obatHipertensi)} />
                    <SubQuestionRow letter="c" question="Suplemen" answer={formatAnswer(answers.suplemen)} />
                    <SubQuestionRow letter="d" question="Obat-Obatan Lainnya" answer={formatAnswer(answers.obatLainnya)} />
                </View>
            </View>

            <ReportFooter />
        </Page>
    );
};