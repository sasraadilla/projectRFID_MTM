import React, { useState, useEffect, useRef } from 'react';
import {
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CRow, CCol, CCard, CCardBody, CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCalculator, cilCloudUpload, cilChart } from '@coreui/icons';
import api from '../../api/axios';
import Swal from 'sweetalert2';

const HitungForecast = () => {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const monthsHeader = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB'];

  const loadFilterData = async () => {
    try {
      const resCustomers = await api.get('/customers');
      setCustomers(resCustomers.data);
    } catch (err) {
      Swal.fire('Error', 'Gagal load filter data', 'error');
    }
  };

  useEffect(() => {
    loadFilterData();
    fetchData(); // Load initial data on mount
  }, []);

  const fetchData = async () => {
    if (!year) {
      Swal.fire('Info', 'Pilih tahun terlebih dahulu', 'warning');
      return;
    }

    setLoading(true);
    try {
      let query = `/forecast/calc?year=${year}`;
      if (customerId) query += `&customer_id=${customerId}`;

      const res = await api.get(query);
      setData(res.data);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Gagal mengambil data kalkulasi';
      Swal.fire('Error', errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      await api.post('/forecast/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Berhasil', 'Data forecast berhasil diimport', 'success');
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal import CSV', 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const dummyData = [
    {
      part_number: '123',
      part_name: 'ABC',
      customer_name: 'PT.AAA',
      packaging: 'Trolley',
      qty_packaging: 100,
      hari_kerja: 20,
      forecasts: { [`Oktober_${parseInt(year) - 1}`]: 10000, [`November_${parseInt(year) - 1}`]: 200000, [`Desember_${parseInt(year) - 1}`]: 50000, [`Januari_${year}`]: 60000, [`Februari_${year}`]: 10000 },
      need_prod: 5,
      need_store: 10,
      need_cust: 15,
      total_need: 30,
      actual: 25,
      gap: -5,
      status: 'Kurang',
      lt_production: 1,
      lt_store: 2,
      lt_customer: 3
    },
    {
      part_number: '456',
      part_name: 'DEF',
      customer_name: 'PT.BBB',
      packaging: 'Dolly',
      qty_packaging: 50,
      hari_kerja: 20,
      forecasts: { [`Oktober_${parseInt(year) - 1}`]: 5000, [`November_${parseInt(year) - 1}`]: 1000, [`Desember_${parseInt(year) - 1}`]: 4000, [`Januari_${year}`]: 3000, [`Februari_${year}`]: 5000 },
      need_prod: 5,
      need_store: 10,
      need_cust: 15,
      total_need: 30,
      actual: 45,
      gap: 15,
      status: 'Lebih',
      lt_production: 5,
      lt_store: 10,
      lt_customer: 15
    },
    {
      part_number: '789',
      part_name: 'GHI',
      customer_name: 'PT.CCC',
      packaging: 'Pallet',
      qty_packaging: 50,
      hari_kerja: 20,
      forecasts: { [`Oktober_${parseInt(year) - 1}`]: 7000, [`November_${parseInt(year) - 1}`]: 6000, [`Desember_${parseInt(year) - 1}`]: 8000, [`Januari_${year}`]: 4500, [`Februari_${year}`]: 7000 },
      need_prod: 7,
      need_store: 14,
      need_cust: 21,
      total_need: 42,
      actual: 42,
      gap: 0,
      status: 'Pass',
      lt_production: 7,
      lt_store: 14,
      lt_customer: 21
    }
  ];

  // Set data to dummy if empty after fetching or for demo
  const displayData = data.length > 0 ? data : dummyData;

  const judgmentCount = {
    Kurang: displayData.filter((d) => d.status === 'Kurang').length,
    Lebih: displayData.filter((d) => d.status === 'Lebih').length,
    Pass: displayData.filter((d) => d.status === 'Pass').length,
  };

  return (
    <div style={{ padding: '20px', background: '#f4f7fc', minHeight: '100vh' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleImportCSV}
      />

      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div>
          <h3 style={{ fontWeight: '700', color: '#1e293b', margin: 0 }}>Dashboard Kebutuhan</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Total {displayData.length} Parts</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#fff',
              fontSize: '0.9rem',
              color: '#334155',
              outline: 'none',
              minWidth: '200px'
            }}
          >
            <option value="">Semua Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.customer_name || c.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              width: '100px',
              fontWeight: '600',
              color: '#334155'
            }}
          />
          <CButton color="primary" onClick={triggerFileInput} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', borderRadius: '8px', backgroundColor: '#3b82f6', border: 'none' }}>
            <CIcon icon={cilCloudUpload} /> Input CSV
          </CButton>
          <CButton color="success" onClick={fetchData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: 'white', borderRadius: '8px', border: 'none' }}>
            {loading ? <CSpinner size="sm" /> : <><CIcon icon={cilCalculator} /> Hitung</>}
          </CButton>
        </div>
      </div>

      <CRow>
        <CCol md={9}>
          {/* Table 1: FORECAST (pcs)/month */}
          <CCard className="mb-4" style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <CCardBody style={{ padding: '0' }}>
              <div style={{ padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                <h6 style={{ fontWeight: '700', margin: 0, color: '#334155' }}>FORECAST (pcs)/month</h6>
              </div>
              <CTable responsive hover style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important', padding: '12px' }}>PART NUMBER</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>PART NAME</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>CUSTOMER</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>PACKAGING</CTableHeaderCell>
                    <CTableHeaderCell colSpan={3} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>{parseInt(year) - 1}</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>{year}</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>JENIS</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>QTY</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>OCT</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>NOV</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>DEC</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>JAN</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>FEB</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {displayData.map((item, idx) => (
                    <CTableRow key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '600', color: '#1e293b' }}>{item.part_number}</CTableDataCell>
                      <CTableDataCell style={{ color: '#475569' }}>{item.part_name}</CTableDataCell>
                      <CTableDataCell style={{ fontWeight: '500' }}>{item.customer_name}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}><span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>{item.packaging}</span></CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '700' }}>{item.qty_packaging}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.forecasts[`Oktober_${parseInt(year) - 1}`]?.toLocaleString() || 0}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.forecasts[`November_${parseInt(year) - 1}`]?.toLocaleString() || 0}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.forecasts[`Desember_${parseInt(year) - 1}`]?.toLocaleString() || 0}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.forecasts[`Januari_${year}`]?.toLocaleString() || 0}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.forecasts[`Februari_${year}`]?.toLocaleString() || 0}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* Table 2: FORECAST (pcs)/day + Total Kebutuhan */}
          <CCard style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <CCardBody style={{ padding: '0' }}>
              <div style={{ padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                <h6 style={{ fontWeight: '700', margin: 0, color: '#334155' }}>FORECAST (pcs)/day + Total Kebutuhan</h6>
              </div>
              <CTable responsive hover style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important', padding: '12px' }}>PART NUMBER</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>PACKAGING</CTableHeaderCell>
                    <CTableHeaderCell colSpan={3} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>{parseInt(year) - 1}</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>{year}</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>QTY/ PKG</CTableHeaderCell>
                    <CTableHeaderCell colSpan={3} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>LT</CTableHeaderCell>
                    <CTableHeaderCell colSpan={4} style={{ backgroundColor: '#2563eb !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>TOTAL KEBUTUHAN</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>ACTUAL</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>STATUS</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2} style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', verticalAlign: 'middle', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>GAP</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>JENIS</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>QTY</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>OCT</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>NOV</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>DEC</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>JAN</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>FEB</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>PRD</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>ST</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#3b82f6 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>CUS</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#1d4ed8 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>PRD</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#1d4ed8 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>ST</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#1d4ed8 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>CUS</CTableHeaderCell>
                    <CTableHeaderCell style={{ backgroundColor: '#1d4ed8 !important', color: 'white !important', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3) !important' }}>TOTAL</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {displayData.map((item, idx) => {
                    const statusColor = item.status === 'Pass' ? '#22c55e' : item.status === 'Kurang' ? '#ef4444' : '#f59e0b';
                    return (
                      <CTableRow key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: '600' }}>{item.part_number}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{item.packaging}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: '700' }}>{item.qty_packaging}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Oktober_${parseInt(year) - 1}`] || 0) / item.hari_kerja)}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`November_${parseInt(year) - 1}`] || 0) / item.hari_kerja)}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Desember_${parseInt(year) - 1}`] || 0) / item.hari_kerja)}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Januari_${year}`] || 0) / item.hari_kerja)}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Februari_${year}`] || 0) / item.hari_kerja)}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', color: '#64748b' }}>{item.qty_packaging}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{item.lt_production}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{item.lt_store}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>{item.lt_customer}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#1d4ed8' }}>{item.need_prod || 0}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#1d4ed8' }}>{item.need_store || 0}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#1d4ed8' }}>{item.need_cust || 0}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: '800', backgroundColor: '#eff6ff', color: '#1e3a8a' }}>{item.total_need}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: '800', color: '#1e293b' }}>{item.actual}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            backgroundColor: `${statusColor}15`,
                            color: statusColor,
                            border: `1px solid ${statusColor}30`
                          }}>
                            {item.status}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center', fontWeight: '700', color: item.gap < 0 ? '#ef4444' : '#22c55e' }}>
                          {item.gap > 0 ? `+${item.gap}` : item.gap}
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={3}>
          {/* Judgment Widget */}
          <CCard style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <CCardBody style={{ padding: '20px' }}>
              <h5 style={{ fontWeight: '700', marginBottom: '20px', color: '#1e293b', fontSize: '1rem' }}>Judgment</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <JudgmentItem label="Kurang" count={judgmentCount.Kurang} color="#ef4444" />
                <JudgmentItem label="Lebih" count={judgmentCount.Lebih} color="#f59e0b" />
                <JudgmentItem label="Pass" count={judgmentCount.Pass} color="#22c55e" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

const JudgmentItem = ({ label, count, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '50%' }}></div>
      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>{label}</span>
    </div>
    <span style={{ fontWeight: '800', color: color, fontSize: '1.1rem' }}>{count}</span>
  </div>
);

export default HitungForecast;

