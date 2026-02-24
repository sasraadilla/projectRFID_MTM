import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CButton,
  CBadge,
} from '@coreui/react'
import DataTable from 'react-data-table-component'

/* ================= DUMMY DATA ================= */

const forecastMonth = [
  { part: '123 ABC', forecast: 200000, hari: 21, perDay: 9524 },
  { part: '456 DEF', forecast: 5000, hari: 20, perDay: 250 },
  { part: '789 GHI', forecast: 8000, hari: 15, perDay: 533 },
]

const packagingPerDay = [
  { part: '123 ABC', jenis: 'Trolley', kapasitas: 100, total: 2880 },
  { part: '456 DEF', jenis: 'Dolley', kapasitas: 50, total: 150 },
  { part: '789 GHI', jenis: 'Pallet', kapasitas: 50, total: 330 },
]

const finalResult = [
  { part: '123 ABC', calc: 2880, actual: 2850, diff: -30 },
  { part: '456 DEF', calc: 150, actual: 165, diff: 15 },
  { part: '789 GHI', calc: 330, actual: 330, diff: 0 },
]

/* ================= HELPERS ================= */

const statusView = (diff) => {
  if (diff < 0) return <CBadge color="danger">Kurang</CBadge>
  if (diff > 0) return <CBadge color="warning">Lebih</CBadge>
  return <CBadge color="success">Pass</CBadge>
}

/* ================= COLUMNS ================= */

const colForecast = [
  { name: 'Part', selector: r => r.part },
  { name: 'Forecast / Month', selector: r => `${r.forecast.toLocaleString()} pcs` },
  { name: 'Hari Kerja', selector: r => r.hari, center: true },
  { name: 'Forecast / Day', selector: r => `${r.perDay.toLocaleString()} pcs/day` },
]

const colPackaging = [
  { name: 'Part', selector: r => r.part },
  { name: 'Jenis Packaging', selector: r => r.jenis },
  { name: 'Kapasitas', selector: r => `${r.kapasitas} pcs` },
  { name: 'Total Kebutuhan', selector: r => `${r.total} packaging` },
]

const colFinal = [
  { name: 'Part', selector: r => r.part },
  { name: 'Calculated', selector: r => `${r.calc} packaging` },
  { name: 'Actual', selector: r => `${r.actual} packaging` },
  {
    name: 'Selisih',
    cell: r => (
      <span
        style={{
          color: r.diff < 0 ? '#dc3545' : r.diff > 0 ? '#ffc107' : '#198754',
          fontWeight: 600,
        }}
      >
        {r.diff > 0 ? `+${r.diff}` : r.diff}
      </span>
    ),
  },
  { name: 'Status', cell: r => statusView(r.diff) },
]

/* ================= MAIN ================= */

const DetailForecast = () => {
  return (
    <>
      {/* HEADER */}
      <CRow className="mb-4">
        <CCol>
          <h3>Kalkulasi Kebutuhan Packaging</h3>
          <div className="text-muted">
            Perhitungan berdasarkan forecast & lead time
          </div>
        </CCol>
      </CRow>

      {/* FILTER */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol md={3}>
                  <label>Bulan</label>
                  <CFormSelect>
                    <option>Januari</option>
                    <option>Februari</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <label>Tahun</label>
                  <CFormSelect>
                    <option>2025</option>
                    <option>2026</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <label>Customer</label>
                  <CFormSelect>
                    <option>PT. AAA</option>
                    <option>PT. BBB</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3} className="d-flex align-items-end">
                  <CButton color="primary" className="w-100">
                    Import Forecast Excel
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* SUMMARY */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h5>Total Kebutuhan Packaging</h5>
              <h2 className="text-primary">12,450 packaging</h2>
              <div className="text-muted">Periode: Januari 2025</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h5>Total Kebutuhan Packaging</h5>
              <h2 className="text-primary">12,450 packaging</h2>
              <div className="text-muted">Januari 2025</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 1. FORECAST */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>1. Forecast per Month</strong>
              <CButton color="warning" size="sm">
                Hitung
              </CButton>
            </CCardHeader>

            <CCardBody>
              <DataTable
                columns={colForecast}
                data={forecastMonth}
                dense
                striped
                customStyles={{
                  headRow: { style: { backgroundColor: '#e7f1ff' } },
                  headCells: {
                    style: {
                      color: '#0d6efd',
                      fontWeight: '600',
                      fontSize: '14px',
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 2. PACKAGING */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>2. Packaging per Day</strong>
              <span className="float-end text-muted">
                Total Lead Time: 30 hari
              </span>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={colPackaging}
                data={packagingPerDay}
                dense
                striped
                customStyles={{
                  headRow: { style: { backgroundColor: '#e7f1ff' } },
                  headCells: {
                    style: {
                      color: '#0d6efd',
                      fontWeight: '600',
                      fontSize: '14px',
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* LEAD TIME */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader><strong>3. Lead Time</strong></CCardHeader>
            <CCardBody>
              <CRow>
                
                <CCol md={3} className="d-flex align-items-center">
                    <span className="me-2">Part</span>
                </CCol>

                <CCol md={3} className="d-flex align-items-center">
                    <span className="me-6">LT Produksi</span>
                    <CFormSelect style={{ width: '80px' }}>
                        {[1,2,3,4,5,6,7,8,9,10,15,20].map(v => (
                        <option key={v} value={v}>{v}</option>
                        ))}
                    </CFormSelect>
                    <span className="ms-2">hari</span>
                </CCol>

                <CCol md={3} className="d-flex align-items-center">
                    <span className="me-6">LT Store</span>
                    <CFormSelect style={{ width: '80px' }}>
                        {[1,2,3,4,5,6,7,8,9,10,15,20].map(v => (
                        <option key={v} value={v}>{v}</option>
                        ))}
                    </CFormSelect>
                    <span className="ms-2">hari</span>
                </CCol>

                <CCol md={3} className="d-flex align-items-center">
                    <span className="me-2">LT Customer</span>
                    <CFormSelect style={{ width: '80px' }}>
                        {[1,2,3,4,5,6,7,8,9,10,15,20].map(v => (
                        <option key={v} value={v}>{v}</option>
                        ))}
                    </CFormSelect>
                    <span className="ms-2">hari</span>
                </CCol>
                
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 3. FINAL RESULT */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>4. Total Packaging Calculated</strong>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={colFinal}
                data={finalResult}
                dense
                striped
                customStyles={{
                  headRow: { style: { backgroundColor: '#e7f1ff' } },
                  headCells: {
                    style: {
                      color: '#0d6efd',
                      fontWeight: '600',
                      fontSize: '14px',
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default DetailForecast
