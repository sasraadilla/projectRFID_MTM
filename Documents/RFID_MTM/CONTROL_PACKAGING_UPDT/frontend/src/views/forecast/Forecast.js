import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CButton, CRow, CCol, CCard, CCardBody, CSpinner, CCardHeader
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCalculator, cilCloudUpload, cilChart } from '@coreui/icons';
import api from '../../api/axios';
import Swal from 'sweetalert2';

const Forecast = () => {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const loadFilterData = useCallback(async () => {
    try {
      const resCustomers = await api.get('/customers');
      setCustomers(resCustomers.data);
    } catch (err) {
      console.error('Error loading filter data:', err);
    }
  }, []);

  const fetchData = useCallback(async () => {
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
  }, [year, customerId]);

  useEffect(() => {
    // Inject custom font
    const font = document.createElement('link')
    font.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
    font.rel = 'stylesheet'
    document.head.appendChild(font)

    const style = document.createElement('style')
    style.innerHTML = `* { font-family: 'Plus Jakarta Sans', sans-serif !important; }`
    document.head.appendChild(style)

    loadFilterData();
    fetchData();

    return () => {
      document.head.removeChild(font)
      document.head.removeChild(style)
    }
  }, [loadFilterData, fetchData]);

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
      customer_name: 'PT.ADM',
      packaging: 'Polybox',
      qty_packaging: 10,
      hari_kerja: 20,
      forecasts: { [`Oktober_${parseInt(year) - 1}`]: 1000, [`November_${parseInt(year) - 1}`]: 1200, [`Desember_${parseInt(year) - 1}`]: 1100, [`Januari_${year}`]: 1300, [`Februari_${year}`]: 1200 },
      need_prod: 5,
      need_store: 5,
      need_cust: 5,
      total_need: 15,
      actual: 12,
      gap: -3,
      status: 'Kurang',
      lt_production: 1,
      lt_store: 1,
      lt_customer: 1
    }
  ];

  const displayData = data.length > 0 ? data : dummyData;

  const judgmentCount = {
    Kurang: displayData.filter((d) => d.status === 'Kurang').length,
    Lebih: displayData.filter((d) => d.status === 'Lebih').length,
    Pass: displayData.filter((d) => d.status === 'Pass').length,
  };

  const tableHeaderStyle = {
    backgroundColor: '#3b82f6 !important',
    color: 'white !important',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
    border: '1px solid rgba(255,255,255,0.2) !important'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    border: 'none',
    marginBottom: '25px'
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".csv" onChange={handleImportCSV} />

      {/* Control Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>KEBUTUHAN PACKAGING</h4>
            <p style={{ color: '#64748b', margin: '5px 0 0 0', fontWeight: '500' }}>Total {displayData.length} Parts Diproses</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#334155',
                outline: 'none',
                minWidth: '220px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <option value="">SEMUA CUSTOMER</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{(c.customer_name || c.name).toUpperCase()}</option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                width: '100px',
                fontWeight: '700',
                color: '#334155',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
            <CButton color="primary" onClick={triggerFileInput} style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: '700', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CIcon icon={cilCloudUpload} /> IMPORT CSV
            </CButton>
            <CButton color="success" onClick={fetchData} disabled={loading} style={{ borderRadius: '12px', padding: '10px 20px', color: 'white', fontWeight: '700', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? <CSpinner size="sm" /> : <><CIcon icon={cilCalculator} /> HITUNG</>}
            </CButton>
          </div>
        </div>
      </div>

      <CRow className="g-4">
        <CCol lg={9}>
          {/* Table 1 */}
          <div style={cardStyle}>
            <h5 style={{ fontWeight: '700', marginBottom: '20px', color: '#1e293b', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FORECAST (pcs)/month</h5>
            <CTable responsive hover style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>PART NUMBER</CTableHeaderCell>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>PART NAME</CTableHeaderCell>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>CUSTOMER</CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} style={tableHeaderStyle}>PACKAGING</CTableHeaderCell>
                  <CTableHeaderCell colSpan={3} style={tableHeaderStyle}>{parseInt(year) - 1}</CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} style={tableHeaderStyle}>{year}</CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell style={tableHeaderStyle}>JENIS</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>ISI</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>OCT</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>NOV</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>DEC</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>JAN</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>FEB</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {displayData.map((item, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell style={{ textAlign: 'center', fontWeight: '700', color: '#334155' }}>{item.part_number}</CTableDataCell>
                    <CTableDataCell style={{ fontWeight: '600', color: '#475569' }}>{item.part_name}</CTableDataCell>
                    <CTableDataCell style={{ fontWeight: '600', color: '#475569' }}>{item.customer_name}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center' }}><span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>{item.packaging}</span></CTableDataCell>
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
          </div>

          {/* Table 2 */}
          <div style={cardStyle}>
            <h5 style={{ fontWeight: '700', marginBottom: '20px', color: '#1e293b', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FORECAST (pcs)/day + Total Kebutuhan</h5>
            <CTable responsive hover style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>PART NUMBER</CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} style={tableHeaderStyle}>PACKAGING</CTableHeaderCell>
                  <CTableHeaderCell colSpan={3} style={tableHeaderStyle}>{parseInt(year) - 1}</CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} style={tableHeaderStyle}>{year}</CTableHeaderCell>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>ISI</CTableHeaderCell>
                  <CTableHeaderCell colSpan={3} style={tableHeaderStyle}>L/T</CTableHeaderCell>
                  <CTableHeaderCell colSpan={4} style={{ ...tableHeaderStyle, backgroundColor: '#1d4ed8 !important' }}>KEBUTUHAN (UNIT)</CTableHeaderCell>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>ACTUAL</CTableHeaderCell>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>STATUS</CTableHeaderCell>
                  <CTableHeaderCell rowSpan={2} style={tableHeaderStyle}>GAP</CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell style={tableHeaderStyle}>JENIS</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>QTY</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>OCT</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>NOV</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>DEC</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>JAN</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>FEB</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>PRD</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>ST</CTableHeaderCell>
                  <CTableHeaderCell style={tableHeaderStyle}>CUS</CTableHeaderCell>
                  <CTableHeaderCell style={{ ...tableHeaderStyle, backgroundColor: '#1d4ed8 !important' }}>PRD</CTableHeaderCell>
                  <CTableHeaderCell style={{ ...tableHeaderStyle, backgroundColor: '#1d4ed8 !important' }}>ST</CTableHeaderCell>
                  <CTableHeaderCell style={{ ...tableHeaderStyle, backgroundColor: '#1d4ed8 !important' }}>CUS</CTableHeaderCell>
                  <CTableHeaderCell style={{ ...tableHeaderStyle, backgroundColor: '#1d4ed8 !important' }}>TOTAL</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {displayData.map((item, idx) => {
                  const isNegative = item.gap < 0;
                  const isPositive = item.gap > 0;
                  const statusColor = item.status === 'Pass' ? '#22c55e' : item.status === 'Kurang' ? '#ef4444' : '#f59e0b';
                  return (
                    <CTableRow key={idx}>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '700' }}>{item.part_number}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.packaging}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '700' }}>{item.qty_packaging}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Oktober_${parseInt(year) - 1}`] || 0) / item.hari_kerja)}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`November_${parseInt(year) - 1}`] || 0) / item.hari_kerja)}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Desember_${parseInt(year) - 1}`] || 0) / item.hari_kerja)}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Januari_${year}`] || 0) / item.hari_kerja)}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{Math.round((item.forecasts[`Februari_${year}`] || 0) / item.hari_kerja)}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '600' }}>{item.qty_packaging}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.lt_production}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.lt_store}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>{item.lt_customer}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '700', color: '#1d4ed8' }}>{item.need_prod || 0}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '700', color: '#1d4ed8' }}>{item.need_store || 0}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '700', color: '#1d4ed8' }}>{item.need_cust || 0}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '800', backgroundColor: '#eff6ff', color: '#1e3a8a' }}>{item.total_need}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center', fontWeight: '800' }}>{item.actual}</CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          backgroundColor: `${statusColor}15`,
                          color: statusColor,
                          border: `1px solid ${statusColor}30`
                        }}>
                          {item.status.toUpperCase()}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'center' }}>
                        <div style={{
                          background: isPositive ? '#dcfce7' : isNegative ? '#fee2e2' : '#f1f5f9',
                          color: isPositive ? '#166534' : isNegative ? '#991b1b' : '#64748b',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          border: `1px solid ${isPositive ? '#86efac' : isNegative ? '#fca5a5' : '#e2e8f0'}`,
                          minWidth: '50px'
                        }}>
                          {isPositive ? `▲ +${item.gap}` : isNegative ? `▼ ${item.gap}` : `● ${item.gap}`}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </div>
        </CCol>

        <CCol lg={3}>
          {/* Judgment Section */}
          <div style={{ ...cardStyle, position: 'sticky', top: '24px' }}>
            <h5 style={{ fontWeight: '800', marginBottom: '25px', color: '#1e293b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CIcon icon={cilChart} size="lg" style={{ color: '#3b82f6' }} /> JUDGMENT
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <JudgmentItem label="KURANG" count={judgmentCount.Kurang} color="#ef4444" />
              <JudgmentItem label="LEBIH" count={judgmentCount.Lebih} color="#f59e0b" />
              <JudgmentItem label="PASS" count={judgmentCount.Pass} color="#22c55e" />
            </div>
            <div style={{ marginTop: '30px', padding: '15px', borderRadius: '15px', background: '#eff6ff', border: '1px solid #dbeafe' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#1e40af', fontWeight: '600', lineHeight: '1.5' }}>
                * Kebutuhan unit dihitung berdasarkan akumulasi Lead Time harian terhadap rata-rata forecast bulanan.
              </p>
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  );
};

const JudgmentItem = ({ label, count, color }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderRadius: '15px',
    backgroundColor: '#fff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '50%', boxShadow: `0 0 10px ${color}80` }}></div>
      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569', letterSpacing: '0.5px' }}>{label}</span>
    </div>
    <span style={{ fontWeight: '800', color: color, fontSize: '1.4rem' }}>{count}</span>
  </div>
);

export default Forecast;
