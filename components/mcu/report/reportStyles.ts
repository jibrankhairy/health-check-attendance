// components/mcu/report/reportStyles.ts
import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    // Page & Body
    page: {
        fontFamily: "Helvetica",
        fontSize: 12,
        paddingTop: 120, // DIUBAH
        paddingBottom: 90, // DIUBAH
        paddingHorizontal: 40,
        backgroundColor: '#fff',
    },
    body: {
        flexGrow: 1,
    },
    
    // Header
    headerContainer: {
        position: 'absolute',
        top: 25,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1.5, // DIUBAH
        borderBottomColor: '#333',
    },
    headerLeft: {
        width: '20%',
    },
    headerCenter: {
        width: '60%',
        textAlign: 'center',
    },
    headerRight: {
        width: '20%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    logoYm: {
        width: 90,
        height: 80,
        objectFit: 'contain',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: '#333',
        letterSpacing: 1,
    },
    logoSide: {
        width: 40,
        height: 40,
        marginLeft: 4,
        objectFit: 'contain',
    },

    // Patient Info
    patientInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10, // DITAMBAHKAN
        marginBottom: 20,
        fontSize: 8.5,
        marginLeft: 5,
    },
    patientInfoColumn: {
      width: '48%',
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    infoLabel: {
      width: '40%',
      fontFamily: 'Helvetica-Bold',
    },
    infoValue: {
      width: '60%',
    },

    // Main Title
    mainTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'left',
        marginBottom: 10,
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
    },

    // Table
    table: {
        width: "auto",
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    tableRow: {
        flexDirection: "row",
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    tableRowLast: {
        borderBottomWidth: 0,
    },
    tableColHeader: {
        backgroundColor: "#f7f7f7",
        padding: 5,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
    },
    tableCol: {
        padding: 4,
        fontSize: 8,
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
    },
    tableColLast: {
      borderRightWidth: 0,
    },
    colNo: { width: "5%", textAlign: 'center' },
    colJenis: { width: "35%" },
    colHasil: { width: "15%", textAlign: 'center' },
    colRujukan: { width: "30%" },
    colSatuan: { width: "15%", textAlign: 'center' },
    resultAbnormal: {
        color: '#c0392b',
        fontFamily: 'Helvetica-Bold',
    },

    // Styles untuk Halaman Kesimpulan
    conclusionContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
    },
    conclusionBox: {
        borderWidth: 1,
        borderColor: '#333',
        padding: 10,
        textAlign: 'center',
        marginBottom: 15,
    },
    conclusionText: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
    },
    abnormalList: {
        paddingLeft: 10,
    },
    abnormalItem: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    abnormalLabel: {
        width: '35%',
    },
    abnormalValue: {
        width: '65%',
        fontFamily: 'Helvetica-Bold',
    },

    // Footer
     footerContainer: {
        position: 'absolute',
        bottom: 25,
        left: 40,
        right: 40,
        flexDirection: 'column', // DIUBAH: untuk menumpuk garis dan teks
        alignItems: 'center',    // DIUBAH: untuk menengahkan semua konten
        fontSize: 8,
    },
    footerBlueBar: { // STYLE BARU
        width: '100%',
        height: 2,
        backgroundColor: '#005f99', // Warna biru, bisa diganti
        marginBottom: 8,
    },
    companySection: { // DIUBAH
        width: '100%',
        textAlign: 'center',
    },
    companyName: { // STYLE BARU (opsional, untuk styling)
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        marginBottom: 2,
    },
    companyAddress: { // STYLE BARU (opsional, untuk styling)
        fontSize: 7,
        color: '#444',
    },
    companyContact: { // STYLE BARU (opsional, untuk styling)
        fontSize: 7,
        color: '#444',
        marginTop: 2,
    }
    // signatureSection dan style footer lama lainnya sudah tidak diperlukan
});