import React, { useState, useEffect } from "react";
import {
  CRow, CCol, CCard, CCardBody, CCardHeader,
  CFormSelect, CButton, CSpinner, CBadge
} from "@coreui/react";
import DataTable from "react-data-table-component";
import api from "../../api/axios";
import Swal from "sweetalert2";

const HitungForecast = () => {
  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  const [years, setYears] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);

  const [forecastMonth, setForecastMonth] = useState([]);
  const [packagingPerDay, setPackagingPerDay] = useState([]);
  const [leadTime, setLeadTime] = useState([]);
  const [finalResult, setFinalResult] = useState([]);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    const c = await api.get("/customers");
    const y = await api.get("/forecast/months");
    setCustomers(c.data);
    setYears(y.data);
  };

  const fetchData = async () => {
    if (!month || !year) {
      Swal.fire("Info", "Pilih bulan dan tahun", "warning");
      return;
    }

    setLoading(true);
    try {
      let url = `/forecast/calc?month=${month}&year=${year}`;
      if (customerId) url += `&customer_id=${customerId}`;

      const res = await api.get(url);
      setForecastMonth(res.data.forecastMonth);
      setPackagingPerDay(res.data.packagingPerDay);
      setLeadTime(res.data.leadTime);
      setFinalResult(res.data.finalResult);
    } catch {
      Swal.fire("Error", "Gagal hitung forecast", "error");
    }
    setLoading(false);
  };

  const statusView = (diff) => {
    if (diff < 0) return <CBadge color="danger">Kurang</CBadge>;
    if (diff > 0) return <CBadge color="warning">Lebih</CBadge>;
    return <CBadge color="success">Pass</CBadge>;
  };

  const colForecast = [
    { name: 'Part', selector: r => r.part },
    { name: 'Forecast / Month', selector: r => r.forecast },
    { name: 'Hari Kerja', selector: r => r.hari },
    { name: 'Forecast / Day', selector: r => r.perDay },
  ];

  const colPackaging = [
    { name: 'Part', selector: r => r.part },
    { name: 'Jenis', selector: r => r.jenis },
    { name: 'Kapasitas', selector: r => r.kapasitas },
    { name: 'Pack / Day', selector: r => r.perDay },
    { name: 'Total', selector: r => r.total },
  ];

  const colLeadTime = [
    { name: 'Part', selector: r => r.part },
    { name: 'LT Produksi', selector: r => r.ltProduksi },
    { name: 'LT Store', selector: r => r.ltStore },
    { name: 'LT Customer', selector: r => r.ltCustomer },
  ];

  const colFinal = [
    { name: 'Part', selector: r => r.part },
    { name: 'Calculated', selector: r => r.calc },
    { name: 'Actual', selector: r => r.actual },
    { name: 'Diff', selector: r => r.diff },
    { name: 'Status', cell: r => statusView(r.diff) },
  ];

  return (
    <>
      <CRow className="mb-3">
        <CCol md={3}>
          <CFormSelect value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Bulan</option>
            {months.map(m => <option key={m}>{m}</option>)}
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Tahun</option>
            {years.map(y => <option key={y}>{y}</option>)}
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CButton color="primary" onClick={fetchData} disabled={loading}>
            {loading ? <><CSpinner size="sm"/> Hitung...</> : "Hitung"}
          </CButton>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>1. Forecast per Month</CCardHeader>
        <CCardBody>
          <DataTable columns={colForecast} data={forecastMonth} dense striped />
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>2. Packaging per Day</CCardHeader>
        <CCardBody>
          <DataTable columns={colPackaging} data={packagingPerDay} dense striped />
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>3. Lead Time</CCardHeader>
        <CCardBody>
          <DataTable columns={colLeadTime} data={leadTime} dense striped />
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader>4. Final Result</CCardHeader>
        <CCardBody>
          <DataTable columns={colFinal} data={finalResult} dense striped />
        </CCardBody>
      </CCard>
    </>
  );
};

export default HitungForecast;
