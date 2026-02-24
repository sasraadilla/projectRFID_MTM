import React, { useState, useEffect } from "react";
import {
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CFormSelect, CRow, CCol, CCard, CCardBody, CCardHeader
} from "@coreui/react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const HitungForecast = () => {
  const [data, setData] = useState([]);
  const [months] = useState([
    { value: "Januari", label: "Januari" },
    { value: "Februari", label: "Februari" },
    { value: "Maret", label: "Maret" },
    { value: "April", label: "April" },
    { value: "Mei", label: "Mei" },
    { value: "Juni", label: "Juni" },
    { value: "Juli", label: "Juli" },
    { value: "Agustus", label: "Agustus" },
    { value: "September", label: "September" },
    { value: "Oktober", label: "Oktober" },
    { value: "November", label: "November" },
    { value: "Desember", label: "Desember" },
  ]);
  const [years, setYears] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [customerId, setCustomerId] = useState("");

  // Load filter data: customer dan tahun unik dari forecast_month
  const loadFilterData = async () => {
    try {
      const resCustomers = await api.get("/customers");
      setCustomers(resCustomers.data);

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
      let query = `/forecast/calc?month=${encodeURIComponent(month)}&year=${year}`;
      if (customerId) query += `&customer_id=${customerId}`;

      const res = await api.get(query);
      setData(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data kalkulasi", "error");
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong className="fs-5">Hitung Forecast / Kebutuhan Packaging</strong>
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
            <CFormSelect value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="">Pilih Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.customer_name}</option>
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
              <CTableHeaderCell>Customer</CTableHeaderCell>
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
                <CTableDataCell>{d.customer_name}</CTableDataCell>
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

export default HitungForecast;
