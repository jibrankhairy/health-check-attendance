"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
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

  fisikValidatorName?: Nullable<string>;
  fisikValidatorQr?: Nullable<string>;
}

type PemeriksaanFisikDocumentProps = {
  data?: {
    patient?: Patient;
    pemeriksaanFisikForm?: PemeriksaanFisikForm;
  };
};

const localStyles = StyleSheet.create({
  txt: { fontFamily: "Helvetica", fontSize: 10, lineHeight: 1.3 },
  txtBold: { fontFamily: "Helvetica-Bold" },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
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
    fontSize: 10,
    backgroundColor: "#F5F5F5",
    padding: "5 8",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  sectionBody: { flexDirection: "row", padding: "4 8" },
  column: { flex: 1, paddingHorizontal: 4 },
  dataItem: { flexDirection: "row", marginBottom: 4 },
  dataItemLabel: { width: "55%" },
  dataItemColon: { width: "5%" },
  dataItemValue: { flex: 1, fontFamily: "Helvetica-Bold" },

  validatorBox: {
    position: "absolute",
    right: 40,
    bottom: 72,
    alignItems: "center",
  },
  validatorQr: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  validatorName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  validatorLabel: {
    fontSize: 5,
  },
});

const display = (v: unknown): string =>
  v !== null && v !== undefined && v !== "" ? String(v) : "-";

const DataItem: React.FC<{ label: string; value: unknown }> = ({
  label,
  value,
}) => (
  <View style={localStyles.dataItem}>
    <Text style={[localStyles.txt, localStyles.dataItemLabel]}>{label}</Text>
    <Text style={[localStyles.txt, localStyles.dataItemColon]}>:</Text>
    <Text style={[localStyles.txt, localStyles.dataItemValue]}>
      {display(value)}
    </Text>
  </View>
);

const TwoColumnSection: React.FC<{
  title: string;
  items: { label: string; value: unknown }[];
}> = ({ title, items }) => {
  const midPoint = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, midPoint);
  const rightItems = items.slice(midPoint);

  return (
    <View style={localStyles.section}>
      <Text style={localStyles.sectionTitle}>{title}</Text>
      <View style={localStyles.sectionBody}>
        <View style={localStyles.column}>
          {leftItems.map((item, index) => (
            <DataItem key={index} label={item.label} value={item.value} />
          ))}
        </View>
        <View style={localStyles.column}>
          {rightItems.map((item, index) => (
            <DataItem key={index} label={item.label} value={item.value} />
          ))}
        </View>
      </View>
    </View>
  );
};

const getLingkarPerutValue = (
  bmi: number | string | null | undefined,
  lingkarPerutSaatIni: number | string | null | undefined
): string | number => {
  const lpNumerik = Number(lingkarPerutSaatIni);
  if (!isNaN(lpNumerik) && lpNumerik > 0) {
    return lpNumerik; 
  }

  const bmiNumerik = Number(bmi);
  if (isNaN(bmiNumerik) || bmiNumerik <= 0) {
    return "-"; 
  }

  if (bmiNumerik < 17) {
    return "50";
  } else if (bmiNumerik < 18.5) {
    return "55";
  } else if (bmiNumerik <= 25) {
    return "70";
  } else if (bmiNumerik <= 30) {
    return "85";
  } else if (bmiNumerik <= 35) {
    return "90";
  } else {
    return "95";
  }
};

export const PemeriksaanFisikDocument: React.FC<
  PemeriksaanFisikDocumentProps
> = ({ data }) => {
  const pf = data?.pemeriksaanFisikForm ?? {};

  const pemeriksaanUmumItems = [
    { label: "Kondisi Kesehatan", value: pf.kondisiKesehatan },
    { label: "Kesadaran", value: pf.kesadaran || "COMPOS MENTIS" },
    { label: "Berat Badan", value: `${display(pf.beratBadanKg)} kg` },
    { label: "Tinggi Badan", value: `${display(pf.tinggiBadanCm)} cm` },
    { label: "BMI", value: `${display(pf.bmi)} kg/m²` },
    {
      label: "Lingkar Perut",
      value: `${getLingkarPerutValue(pf.bmi, pf.lingkarPerutCm)} cm`,
    },
    { label: "Suhu", value: `${display(pf.suhuC)} °C` },
    {
      label: "Tekanan Darah",
      value: `${display(pf.tensiSistol)}/${display(pf.tensiDiastol)} mmHg`,
    },
    { label: "Nadi", value: `${pf.nadiPerMenit || 80} /menit` },
    { label: "Pernapasan", value: `${pf.pernapasanPerMenit || 20} /menit` },
    { label: "Kulit (Hipo/Hiperpigmentasi)", value: pf.hipoHiperpigmentasi },
    { label: "Kulit (Rash)", value: pf.rash },
  ];

  const kepalaLeherItems = [
    { label: "Hidung (Deviasi Septum)", value: pf.deviasiSeptum },
    { label: "Hidung (Pembesaran Konka)", value: pf.pembesaranKonka },
    { label: "Tonsil - Ukuran", value: pf.tonsilUkuran },
    { label: "Pharing - Hipermis", value: pf.pharingHipermis },
    { label: "Lidah", value: pf.lidah },
    { label: "Gigi Karies", value: pf.gigiKaries },
    { label: "Gigi Hilang", value: pf.gigiHilang },
    { label: "Gigi Palsu", value: pf.gigiPalsu },
    { label: "Leher (Kondisi Umum)", value: pf.leherKondisi },
    { label: "Leher (Kelenjar Tiroid)", value: pf.tiroid },
    { label: "Leher (Kelenjar Lymph)", value: pf.kelenjarLymp },
  ];

  const mataItems = [
    { label: "Buta Warna", value: pf.butaWarna },
    {
      label: "Anemia OD/OS",
      value: `${display(pf.anemiaOD)} / ${display(pf.anemiaOS)}`,
    },
    {
      label: "Ikterik OD/OS",
      value: `${display(pf.ikterikOD)} / ${display(pf.ikterikOS)}`,
    },
    {
      label: "Pupil OD/OS",
      value: `${display(pf.pupilOD)} / ${display(pf.pupilOS)}`,
    },
    {
      label: "Refleks Cahaya OD/OS",
      value: `${display(pf.refleksOD)} / ${display(pf.refleksOS)}`,
    },
    {
      label: "Visus OD/OS",
      value: `${display(pf.visusOD)} / ${display(pf.visusOS)}`,
    },
    { label: "Kacamata", value: pf.kacamata },
    {
      label: "Ukuran OD/OS",
      value: `${display(pf.ukuranOD)} / ${display(pf.ukuranOS)}`,
    },
    { label: "Lapang Pandang", value: pf.lapangPandang },
    { label: "Ketajaman", value: pf.ketajaman },
    { label: "Pupil Distance", value: pf.pupilDistance },
  ];

  const thtItems = [
    {
      label: "Pendengaran AD/AS",
      value: `${display(pf.kemampuanPendengaranAD)} / ${display(
        pf.kemampuanPendengaranAS
      )}`,
    },
    {
      label: "Telinga Luar AD/AS",
      value: `${display(pf.telingaLuarAD)} / ${display(pf.telingaLuarAS)}`,
    },
    {
      label: "Nyeri Tekan AD/AS",
      value: `${display(pf.nyeriTekanAD)} / ${display(pf.nyeriTekanAS)}`,
    },
    {
      label: "Serumen AD/AS",
      value: `${display(pf.serumenAD)} / ${display(pf.serumenAS)}`,
    },
    {
      label: "Gendang Telinga AD/AS",
      value: `${display(pf.gendangAD)} / ${display(pf.gendangAS)}`,
    },
  ];

  const kardiovaskularItems = [
    { label: "Ictus Cordis (Inspeksi)", value: pf.ictusInspeksi },
    { label: "Ictus Cordis (Palpasi)", value: pf.ictusPalpasi },
    { label: "Batas Jantung", value: pf.batasJantung },
    { label: "Bising Jantung", value: pf.bisingJantung },
  ];

  const pernafasanItems = [
    { label: "Paru (Inspeksi)", value: pf.paruInspeksi },
    { label: "Paru (Palpasi)", value: pf.paruPalpasi },
    { label: "Paru (Perkusi)", value: pf.paruPerkusi },
    { label: "Paru (Auskultasi)", value: pf.paruAuskultasi },
  ];

  const pencernaanItems = [
    { label: "Abdomen (Inspeksi)", value: pf.cernaInspeksi },
    { label: "Hepar", value: pf.hepar },
    { label: "Lien", value: pf.lien },
    { label: "Peristaltik", value: pf.peristaltik },
  ];

  const ekstremitasItems = [
    {
      label: "Deformitas",
      value:
        pf.deformitas && pf.deformitas !== "-" ? pf.deformitas : "TIDAK ADA",
    },
    {
      label: "Oedema",
      value: pf.oedema && pf.oedema !== "-" ? pf.oedema : "TIDAK ADA",
    },
    { label: "Refleks Fisiologis", value: pf.refleksFisiologis },
    { label: "Refleks Patologis", value: pf.refleksPatologis },
    { label: "Tulang Belakang", value: pf.tulangBelakang },
    { label: "Kontak Psikis", value: pf.psikis },
    { label: "Sikap & Tingkah Laku", value: pf.sikap },
    { label: "Daya Ingat", value: pf.dayaIngat },
  ];

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.title}>HASIL PEMERIKSAAN FISIK</Text>

        <TwoColumnSection
          title="A. PEMERIKSAAN UMUM"
          items={pemeriksaanUmumItems}
        />
        <TwoColumnSection
          title="B. KEPALA DAN LEHER"
          items={kepalaLeherItems}
        />
        <TwoColumnSection
          title="C. SISTEM PENGLIHATAN (MATA)"
          items={mataItems}
        />
        <TwoColumnSection
          title="D. SISTEM PENDENGARAN (THT)"
          items={thtItems}
        />
        <TwoColumnSection
          title="E. SISTEM KARDIOVASKULAR"
          items={kardiovaskularItems}
        />
        <TwoColumnSection
          title="F. SISTEM PERNAFASAN"
          items={pernafasanItems}
        />
        <TwoColumnSection
          title="G. SISTEM PENCERNAAN"
          items={pencernaanItems}
        />
        <TwoColumnSection title="H. EKSTREMITAS" items={ekstremitasItems} />
      </View>

      {(pf.fisikValidatorName || pf.fisikValidatorQr) && (
        <View style={localStyles.validatorBox}>
          {pf.fisikValidatorQr && (
            <Image
              src={pf.fisikValidatorQr as string}
              style={localStyles.validatorQr}
            />
          )}
          {pf.fisikValidatorName && (
            <Text style={localStyles.validatorName}>
              {pf.fisikValidatorName}
            </Text>
          )}
          <Text style={localStyles.validatorLabel}>Dokter Pemeriksa</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};
