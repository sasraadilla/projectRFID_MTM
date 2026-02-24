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
    { value: 1, label: "Jan" }, { value: 2, label: "Feb" },
    { value: 3, label: "Mar" }, { value: 4, label: "Apr" },
    { value: 5, label: "May" }, { value: 6, label: "Jun" },
    { value: 7, label: "Jul" }, { value: 8, label: "Aug" },
    { value: 9, label: "Sep" }, { value: 10, label: "Oct" },
    { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
  ]);
  const [years, setYears] = useState([]);
  const [parts, setParts] = useState([]);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [partId, setPartId] = useState("");

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const resParts = await api.get("/parts");
        setParts(resParts.data);

        const resYears = await api.get("/forecast/months");
        setYears(resYears.data);
      } catch {
        Swal.fire("Error", "Gagal load filter data", "error");
      }
    };
    loadFilterData();
  }, []);

  const fetchData = async () => {
    if (!month || !year) {
      Swal.fire("Info", "Pilih bulan dan tahun terlebih dahulu", "warning");
      return;
    }
    try {
      let query = `/forecast/calc?month=${month}&year=${year}`;
      if (partId) query += `&part_id=${partId}`;

      const res = await api.get(query);
      setData(res.data);
    } catch {
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
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </CFormSelect>
          </CCol>
          <CCol xs={3}>
            <CFormSelect value={year} onChange={e => setYear(e.target.value)}>
              <option value="">Pilih Tahun</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </CFormSelect>
          </CCol>
          <CCol xs={3}>
            <CFormSelect value={partId} onChange={e => setPartId(e.target.value)}>
              <option value="">Pilih Part</option>
              {parts.map(p => <option key={p.id} value={p.id}>{p.part_number} - {p.part_name}</option>)}
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
