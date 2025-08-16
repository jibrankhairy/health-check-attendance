import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    paddingTop: 120,
    paddingBottom: 90,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  body: {
    flexGrow: 1,
  },

  headerContainer: {
    position: "absolute",
    top: 25,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#333",
  },
  headerLeft: {
    width: "20%",
  },
  headerCenter: {
    width: "60%",
    textAlign: "center",
  },
  headerRight: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  logoYm: {
    width: 90,
    height: 80,
    objectFit: "contain",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#333",
    letterSpacing: 1,
  },
  logoSide: {
    width: 40,
    height: 40,
    marginLeft: 4,
    objectFit: "contain",
  },

  patientInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 8.5,
    marginLeft: 5,
  },
  patientInfoColumn: {
    width: "48%",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    width: "40%",
    fontFamily: "Helvetica-Bold",
  },
  infoValue: {
    width: "60%",
  },

  mainTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "left",
    marginBottom: 10,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },

  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableColHeader: {
    backgroundColor: "#f7f7f7",
    padding: 5,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    borderRightColor: "#e0e0e0",
    borderRightWidth: 1,
  },
  tableCol: {
    padding: 4,
    fontSize: 8,
    borderRightColor: "#e0e0e0",
    borderRightWidth: 1,
  },
  tableColLast: {
    borderRightWidth: 0,
  },
  colNo: { width: "5%", textAlign: "center" },
  colJenis: { width: "35%" },
  colHasil: { width: "15%", textAlign: "center" },
  colRujukan: { width: "30%" },
  colSatuan: { width: "15%", textAlign: "center" },
  resultAbnormal: {
    color: "#c0392b",
    fontFamily: "Helvetica-Bold",
  },

  conclusionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  conclusionBox: {
    borderWidth: 1,
    borderColor: "#333",
    padding: 10,
    textAlign: "center",
    marginBottom: 15,
  },
  conclusionText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  abnormalList: {
    paddingLeft: 10,
  },
  abnormalItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  abnormalLabel: {
    width: "35%",
  },
  abnormalValue: {
    width: "65%",
    fontFamily: "Helvetica-Bold",
  },

  footerContainer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: "column",
    alignItems: "center",
    fontSize: 8,
  },
  footerBlueBar: {
    width: "100%",
    height: 2,
    backgroundColor: "#005f99",
    marginBottom: 8,
  },
  companySection: {
    width: "100%",
    textAlign: "center",
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 2,
  },
  companyAddress: {
    fontSize: 7,
    color: "#444",
  },
  companyContact: {
    fontSize: 7,
    color: "#444",
    marginTop: 2,
  },
});
