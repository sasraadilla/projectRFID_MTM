import React, { useState, useEffect } from "react";
import {
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CFormSelect, CRow, CCol, CCard, CCardBody, CCardHeader
} from "@coreui/react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const DetailForecast = () => {
  const [data, setData] = useState([]);
  const [months] = useState([
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ]);
  const [years, setYears] = useState([]);
  const [parts, setParts] = useState([]);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [partId, setPartId] = useState("");

  // Mapping angka bulan ke string sesuai DB
  const monthMap = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember",
  };

  // Load filter data: parts dan tahun unik dari forecast_month
  const loadFilterData = async () => {
    try {
      const resParts = await api.get("/parts");
      setParts(resParts.data);

      const resYears = await api.get("/forecast/months"); // endpoint return tahun unik
      setYears(resYears.data);
    } catch (err) {
      Swal.fire("Error", "Gagal load filter data", "error");
    }
  };

  useEffect(() => {
    loadFilterData();
  }, []);

  const fetchData = async () => {
    if (!month || !year) {
      Swal.fire("Info", "Pilih bulan dan tahun terlebih dahulu", "warning");
      return;
    }

    try {
      const monthName = monthMap[month]; // konversi angka → string
      let query = `/forecast/calc?month=${encodeURIComponent(monthName)}&year=${year}`;
      if (partId) query += `&part_id=${partId}`;

      const res = await api.get(query);
      setData(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data kalkulasi", "error");
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong className="fs-5">Detail Forecast / Kalkulasi Kebutuhan Packaging</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol xs={3}>
            <CFormSelect value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">Pilih Bulan</option>
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs={3}>
            <CFormSelect value={year} onChange={e => setYear(e.target.value)}>
              <option value="">Pilih Tahun</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs={3}>
            <CFormSelect value={partId} onChange={e => setPartId(e.target.value)}>
              <option value="">Pilih Part</option>
              {parts.map(p => (
                <option key={p.id} value={p.id}>{p.part_number} - {p.part_name}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs={3}>
            <CButton color="primary" onClick={fetchData}>Hitung</CButton>
          </CCol>
        </CRow>

        <CTable striped responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Part</CTableHeaderCell>
              <CTableHeaderCell>Packaging</CTableHeaderCell>
              <CTableHeaderCell>Fc/Day</CTableHeaderCell>
              <CTableHeaderCell>Pack/Day</CTableHeaderCell>
              <CTableHeaderCell>Total Need</CTableHeaderCell>
              <CTableHeaderCell>Actual</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map(d => (
              <CTableRow key={d.forecast_month_id}>
                <CTableDataCell>{d.part_name}</CTableDataCell>
                <CTableDataCell>{d.packaging}</CTableDataCell>
                <CTableDataCell>{d.forecast_day}</CTableDataCell>
                <CTableDataCell>{d.packaging_per_day}</CTableDataCell>
                <CTableDataCell>{d.total_need}</CTableDataCell>
                <CTableDataCell>{d.actual}</CTableDataCell>
                <CTableDataCell>{d.status}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default DetailForecast;
