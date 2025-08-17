"use client";

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

type Nullable<T> = T | null | undefined;

interface Patient {
  [k: string]: unknown;
}

interface PemeriksaanFisikForm {
  kondisiKesehatan?: Nullable<string>;
  kesadaran?: Nullable<string>;
  beratBadanKg?: Nullable<number | string>;
  tinggiBadanCm?: Nullable<number | string>;
  bmi?: Nullable<number | string>;
  lingkarPerutCm?: Nullable<number | string>;
  suhuC?: Nullable<number | string>;
  tensiSistol?: Nullable<number | string>;
  tensiDiastol?: Nullable<number | string>;
  nadiPerMenit?: Nullable<number | string>;
  pernapasanPerMenit?: Nullable<number | string>;
  hipoHiperpigmentasi?: Nullable<string>;
  rash?: Nullable<string>;

  deviasiSeptum?: Nullable<string>;
  pembesaranKonka?: Nullable<string>;
  tonsilUkuran?: Nullable<string>;
  pharingHipermis?: Nullable<string>;
  lidah?: Nullable<string>;
  gigiKaries?: Nullable<string | number>;
  gigiHilang?: Nullable<string | number>;
  gigiPalsu?: Nullable<string | number>;
  leherKondisi?: Nullable<string>;
  tiroid?: Nullable<string>;
  kelenjarLymp?: Nullable<string>;

  butaWarna?: Nullable<string>;
  anemiaOD?: Nullable<string>;
  anemiaOS?: Nullable<string>;
  ikterikOD?: Nullable<string>;
  ikterikOS?: Nullable<string>;
  pupilOD?: Nullable<string>;
  pupilOS?: Nullable<string>;
  refleksOD?: Nullable<string>;
  refleksOS?: Nullable<string>;
  visusOD?: Nullable<string>;
  visusOS?: Nullable<string>;
  kacamata?: Nullable<string>;
  ukuranOD?: Nullable<string>;
  ukuranOS?: Nullable<string>;
  lapangPandang?: Nullable<string>;
  ketajaman?: Nullable<string>;
  pupilDistance?: Nullable<string | number>;

  kemampuanPendengaranAD?: Nullable<string>;
  kemampuanPendengaranAS?: Nullable<string>;
  telingaLuarAD?: Nullable<string>;
  telingaLuarAS?: Nullable<string>;
  nyeriTekanAD?: Nullable<string>;
  nyeriTekanAS?: Nullable<string>;
  serumenAD?: Nullable<string>;
  serumenAS?: Nullable<string>;
  gendangAD?: Nullable<string>;
  gendangAS?: Nullable<string>;

  ictusInspeksi?: Nullable<string>;
  ictusPalpasi?: Nullable<string>;
  batasJantung?: Nullable<string>;
  bisingJantung?: Nullable<string>;

  paruInspeksi?: Nullable<string>;
  paruPalpasi?: Nullable<string>;
  paruPerkusi?: Nullable<string>;
  paruAuskultasi?: Nullable<string>;

  cernaInspeksi?: Nullable<string>;
  hepar?: Nullable<string>;
  lien?: Nullable<string>;
  peristaltik?: Nullable<string>;

  deformitas?: Nullable<string>;
  oedema?: Nullable<string>;
  refleksFisiologis?: Nullable<string>;
  refleksPatologis?: Nullable<string>;

  tulangBelakang?: Nullable<string>;
  psikis?: Nullable<string>;
  sikap?: Nullable<string>;
  dayaIngat?: Nullable<string>;
}

type PemeriksaanFisikDocumentProps = {
  data?: {
    patient?: Patient;
    pemeriksaanFisikForm?: PemeriksaanFisikForm;
  };
};

const BASE_FONT = "Helvetica";
const BASE_SIZE = 10;

const localStyles = StyleSheet.create({
  txt: {
    fontFamily: BASE_FONT,
    fontSize: BASE_SIZE,
    lineHeight: 1.25,
  },

  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: BASE_SIZE,
    marginBottom: 10,
    textDecoration: "underline",
    textAlign: "center",
  },

  section: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#E5E5E5",
    borderRadius: 3,
    overflow: "hidden",
  },

  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: BASE_SIZE,
    backgroundColor: "#F5F5F5",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },

  sectionBody: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  label: {
    width: "40%",
  },
  colon: {
    width: "3%",
    textAlign: "center",
  },
  value: {
    width: "57%",
    fontFamily: "Helvetica-Bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  gridLabel: {
    width: "58%",
  },
  gridColon: {
    width: "6%",
    textAlign: "center",
  },
  gridValue: {
    width: "36%",
    fontFamily: "Helvetica-Bold",
  },
});

const display = (v: unknown): string =>
  v !== null && v !== undefined && v !== "" ? String(v) : "-";

const Row: React.FC<{ label: string; value: unknown }> = ({ label, value }) => (
  <View style={localStyles.row}>
    <Text style={[localStyles.txt, localStyles.label]}>{label}</Text>
    <Text style={[localStyles.txt, localStyles.colon]}>:</Text>
    <Text style={[localStyles.txt, localStyles.value]}>{display(value)}</Text>
  </View>
);

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={localStyles.grid}>{children}</View>
);

const GridItem: React.FC<{ label: string; value: unknown }> = ({
  label,
  value,
}) => (
  <View style={localStyles.gridItem}>
    <Text style={[localStyles.txt, localStyles.gridLabel]}>{label}</Text>
    <Text style={[localStyles.txt, localStyles.gridColon]}>:</Text>
    <Text style={[localStyles.txt, localStyles.gridValue]}>
      {display(value)}
    </Text>
  </View>
);

export const PemeriksaanFisikDocument: React.FC<
  PemeriksaanFisikDocumentProps
> = ({ data }) => {
  const pf = (data?.pemeriksaanFisikForm ??
    {}) as Partial<PemeriksaanFisikForm>;

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.title}>HASIL PEMERIKSAAN FISIK</Text>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>A. PEMERIKSAAN UMUM</Text>
          <View style={localStyles.sectionBody}>
            <Row label="Kondisi Kesehatan" value={pf.kondisiKesehatan} />
            <Row label="Kesadaran" value={pf.kesadaran} />
            <Grid>
              <GridItem
                label="Berat Badan"
                value={`${display(pf.beratBadanKg)} kg`}
              />
              <GridItem
                label="Tinggi Badan"
                value={`${display(pf.tinggiBadanCm)} cm`}
              />
              <GridItem label="BMI" value={`${display(pf.bmi)} kg/m²`} />
              <GridItem
                label="Lingkar Perut"
                value={`${display(pf.lingkarPerutCm)} cm`}
              />
              <GridItem label="Suhu" value={`${display(pf.suhuC)} °C`} />
              <GridItem
                label="Tekanan Darah"
                value={`${display(pf.tensiSistol)}/${display(
                  pf.tensiDiastol
                )} mmHg`}
              />
              <GridItem
                label="Nadi"
                value={`${display(pf.nadiPerMenit)} /menit`}
              />
              <GridItem
                label="Pernapasan"
                value={`${display(pf.pernapasanPerMenit)} /menit`}
              />
            </Grid>
            <Row
              label="Kulit (Hipo/Hiperpigmentasi)"
              value={pf.hipoHiperpigmentasi}
            />
            <Row label="Kulit (Rash)" value={pf.rash} />
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>B. KEPALA DAN LEHER</Text>
          <View style={localStyles.sectionBody}>
            <Row label="Hidung (Deviasi Septum)" value={pf.deviasiSeptum} />
            <Row label="Hidung (Pembesaran Konka)" value={pf.pembesaranKonka} />
            <Row label="Tonsil - Ukuran" value={pf.tonsilUkuran} />
            <Row label="Pharing - Hipermis" value={pf.pharingHipermis} />
            <Row label="Lidah" value={pf.lidah} />
            <Grid>
              <GridItem label="Gigi Karies" value={pf.gigiKaries} />
              <GridItem label="Gigi Hilang" value={pf.gigiHilang} />
              <GridItem label="Gigi Palsu" value={pf.gigiPalsu} />
            </Grid>
            <Row label="Leher (Kondisi Umum)" value={pf.leherKondisi} />
            <Row label="Leher (Kelenjar Tiroid)" value={pf.tiroid} />
            <Row label="Leher (Kelenjar Lymph)" value={pf.kelenjarLymp} />
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>
            C. SISTEM PENGLIHATAN (MATA)
          </Text>
          <View style={localStyles.sectionBody}>
            <Row label="Buta Warna" value={pf.butaWarna} />
            <Grid>
              <GridItem
                label="Anemia OD/OS"
                value={`${display(pf.anemiaOD)} / ${display(pf.anemiaOS)}`}
              />
              <GridItem
                label="Ikterik OD/OS"
                value={`${display(pf.ikterikOD)} / ${display(pf.ikterikOS)}`}
              />
              <GridItem
                label="Pupil OD/OS"
                value={`${display(pf.pupilOD)} / ${display(pf.pupilOS)}`}
              />
              <GridItem
                label="Refleks Cahaya OD/OS"
                value={`${display(pf.refleksOD)} / ${display(pf.refleksOS)}`}
              />
              <GridItem
                label="Visus OD/OS"
                value={`${display(pf.visusOD)} / ${display(pf.visusOS)}`}
              />
              <GridItem label="Kacamata" value={pf.kacamata} />
              <GridItem
                label="Ukuran OD/OS"
                value={`${display(pf.ukuranOD)} / ${display(pf.ukuranOS)}`}
              />
              <GridItem label="Lapang Pandang" value={pf.lapangPandang} />
              <GridItem label="Ketajaman" value={pf.ketajaman} />
              <GridItem label="Pupil Distance" value={pf.pupilDistance} />
            </Grid>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>
            D. SISTEM PENDENGARAN (THT)
          </Text>
          <View style={localStyles.sectionBody}>
            <Grid>
              <GridItem
                label="Pendengaran AD/AS"
                value={`${display(pf.kemampuanPendengaranAD)} / ${display(
                  pf.kemampuanPendengaranAS
                )}`}
              />
              <GridItem
                label="Telinga Luar AD/AS"
                value={`${display(pf.telingaLuarAD)} / ${display(
                  pf.telingaLuarAS
                )}`}
              />
              <GridItem
                label="Nyeri Tekan AD/AS"
                value={`${display(pf.nyeriTekanAD)} / ${display(
                  pf.nyeriTekanAS
                )}`}
              />
              <GridItem
                label="Serumen AD/AS"
                value={`${display(pf.serumenAD)} / ${display(pf.serumenAS)}`}
              />
              <GridItem
                label="Gendang Telinga AD/AS"
                value={`${display(pf.gendangAD)} / ${display(pf.gendangAS)}`}
              />
            </Grid>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>E. SISTEM KARDIOVASKULAR</Text>
          <View style={localStyles.sectionBody}>
            <Grid>
              <GridItem
                label="Ictus Cordis (Inspeksi)"
                value={pf.ictusInspeksi}
              />
              <GridItem
                label="Ictus Cordis (Palpasi)"
                value={pf.ictusPalpasi}
              />
              <GridItem label="Batas Jantung" value={pf.batasJantung} />
              <GridItem label="Bising Jantung" value={pf.bisingJantung} />
            </Grid>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>F. SISTEM PERNAFASAN</Text>
          <View style={localStyles.sectionBody}>
            <Grid>
              <GridItem label="Paru (Inspeksi)" value={pf.paruInspeksi} />
              <GridItem label="Paru (Palpasi)" value={pf.paruPalpasi} />
              <GridItem label="Paru (Perkusi)" value={pf.paruPerkusi} />
              <GridItem label="Paru (Auskultasi)" value={pf.paruAuskultasi} />
            </Grid>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>G. SISTEM PENCERNAAN</Text>
          <View style={localStyles.sectionBody}>
            <Grid>
              <GridItem label="Abdomen (Inspeksi)" value={pf.cernaInspeksi} />
              <GridItem label="Hepar" value={pf.hepar} />
              <GridItem label="Lien" value={pf.lien} />
              <GridItem label="Peristaltik" value={pf.peristaltik} />
            </Grid>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>H. EKSTREMITAS</Text>
          <View style={localStyles.sectionBody}>
            <Grid>
              <GridItem label="Deformitas" value={pf.deformitas} />
              <GridItem label="Oedema" value={pf.oedema} />
              <GridItem
                label="Refleks Fisiologis"
                value={pf.refleksFisiologis}
              />
              <GridItem label="Refleks Patologis" value={pf.refleksPatologis} />
              <GridItem label="Tulang Belakang" value={pf.tulangBelakang} />
              <GridItem label="Kontak Psikis" value={pf.psikis} />
              <GridItem label="Sikap & Tingkah Laku" value={pf.sikap} />
              <GridItem label="Daya Ingat" value={pf.dayaIngat} />
            </Grid>
          </View>
        </View>
      </View>

      <ReportFooter />
    </Page>
  );
};
