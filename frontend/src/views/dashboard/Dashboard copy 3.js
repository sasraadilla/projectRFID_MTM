import React from 'react'
import {
  CRow,
  CCol,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { CBadge } from '@coreui/react'

/* =======================
   DUMMY DATA (FRONTEND)
======================= */
const assetData = [
  { asset: 'Box 6644', in: 40, out: 55, daily: -15, weekly: 10 },
  { asset: 'Trolley', in: 20, out: 10, daily: 10, weekly: 18 },
  { asset: 'Dolley', in: 5, out: 25, daily: -20, weekly: -30 },
]

/* =======================
   HELPER VIEW
======================= */
const diffView = (v) => {
  if (v > 0) return <span style={{ color: '#00ff5f' }}>▲ +{v}</span>
  if (v < 0) return <span style={{ color: '#ff4d4f' }}>▼ {v}</span>
  return <span style={{ color: '#adb5bd' }}>● 0</span>
}

const statusBadge = (weekly) => {
  if (weekly >= 10) return <CBadge color="success">AMAN</CBadge>
  if (weekly >= 0) return <CBadge color="warning">MENIPIS</CBadge>
  return <CBadge color="danger">KRITIS</CBadge>
}

/* =======================
   TABLE COLUMNS
======================= */
const mainColumns = [
  { name: 'ASSET', selector: r => r.asset, sortable: true },
  { name: 'IN', selector: r => r.in, center: true },
  { name: 'OUT', selector: r => r.out, center: true },
  { name: 'Δ HARIAN', cell: r => diffView(r.daily), center: true },
  { name: 'Δ MINGGUAN', cell: r => diffView(r.weekly), center: true },
  { name: 'STATUS', cell: r => statusBadge(r.weekly), center: true },
]

/* =======================
   TERMINAL PANEL
======================= */
const TerminalPanel = ({ title, children }) => (
  <div
    style={{
      backgroundColor: '#121a2f',
      border: '1px solid #1e2538',
      padding: '6px',
      height: '100%',
    }}
  >
    <div
      style={{
        fontSize: '11px',
        color: '#9fb3c8',
        marginBottom: '4px',
        textTransform: 'uppercase',
      }}
    >
      {title}
    </div>
    {children}
  </div>
)

/* =======================
   MAIN DASHBOARD
======================= */
const Dashboard = () => {
  return (
    <div
      style={{
        backgroundColor: '#0b0f1a',
        minHeight: '100vh',
        padding: '6px',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          fontSize: '12px',
          color: '#9fb3c8',
          marginBottom: '6px',
        }}
      >
        INDUSTRIAL RFID ASSET TERMINAL • LIVE
      </div>

      {/* TOP SECTION */}
      <CRow className="g-1">
        <CCol md={3}>
          <TerminalPanel title="SUMMARY">
            <div>Total Asset : <b>3</b></div>
            <div style={{ color: '#00ff5f' }}>IN Today : +65</div>
            <div style={{ color: '#ff4d4f' }}>OUT Today : -90</div>
            <div style={{ color: '#fadb14' }}>NET : -25</div>
          </TerminalPanel>
        </CCol>

        <CCol md={9}>
          <TerminalPanel title="ASSET IN / OUT BOARD">
            <DataTable
              columns={mainColumns}
              data={assetData}
              dense
              striped
              customStyles={{
                table: { style: { backgroundColor: '#121a2f' } },
                headRow: { style: { backgroundColor: '#1c2a4a' } },
                headCells: {
                  style: {
                    color: '#9fb3c8',
                    fontSize: '11px',
                    fontWeight: '600',
                  },
                },
                cells: {
                  style: {
                    color: '#e0e6ed',
                    fontSize: '12px',
                  },
                },
              }}
            />
          </TerminalPanel>
        </CCol>
      </CRow>

      {/* BOTTOM SECTION */}
      <CRow className="g-1 mt-1">
        <CCol md={4}>
          <TerminalPanel title="DAILY MOVEMENT">
            <DataTable
              columns={[
                { name: 'ASSET', selector: r => r.asset },
                { name: 'Δ', cell: r => diffView(r.daily) },
              ]}
              data={assetData}
              dense
            />
          </TerminalPanel>
        </CCol>

        <CCol md={4}>
          <TerminalPanel title="WEEKLY TREND">
            <DataTable
              columns={[
                { name: 'ASSET', selector: r => r.asset },
                { name: 'Δ', cell: r => diffView(r.weekly) },
              ]}
              data={assetData}
              dense
            />
          </TerminalPanel>
        </CCol>

        <CCol md={4}>
          <TerminalPanel title="STATUS LOG">
            {assetData.map((a, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                {a.asset} → {statusBadge(a.weekly)}
              </div>
            ))}
          </TerminalPanel>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
