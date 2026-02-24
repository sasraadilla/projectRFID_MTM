import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLayers,
  cilPeople,
  cilFactory,
  cilSettings,
  cilArrowRight,
} from '@coreui/icons'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'

/* ===================== DATA ===================== */
const assetData = [
  { customer: 'AHM 1', asset: 'Trolley', in: 40, out: 55, daily: -15, weekly: 10, mtd: 25 },
  { customer: 'ADM', asset: 'Box', in: 20, out: 10, daily: 10, weekly: 18, mtd: 40 },
  { customer: 'IGP', asset: 'Pallet', in: 5, out: 25, daily: -20, weekly: -30, mtd: -45 },

  { customer: 'AHM 2', asset: 'Dolley', in: 60, out: 45, daily: 15, weekly: 22, mtd: 55 },
  { customer: 'TMMIN', asset: 'Box', in: 30, out: 50, daily: -20, weekly: -12, mtd: -8 },
  { customer: 'HPM', asset: 'Trolley', in: 90, out: 70, daily: 20, weekly: 35, mtd: 80 },

  
]

/* ===================== HELPERS ===================== */
const diffView = (value) => {
  const v = Number(value)

  // POSITIF
  if (v > 0) {
    return (
      <span
        style={{
          color: '#166534',
          background: '#dcfce7',
          border: '1px solid #22c55e',
          padding: '4px 8px',
          borderRadius: 4,
          fontWeight: 700,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}
      >
        ▲ +{v}
      </span>
    )
  }

  // NEGATIF PARAH
  if (v <= -20) {
    return (
      <span
        style={{
          color: '#ffffff',
          background: 'linear-gradient(90deg, #7f1d1d, #dc2626)',
          border: '1px solid #991b1b',
          padding: '4px 8px',
          borderRadius: 4,
          fontWeight: 800,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
          boxShadow: '0 0 6px rgba(220,38,38,0.8)',
        }}
      >
        ▼ {v}
      </span>
    )
  }

  // NEGATIF BIASA
  if (v < 0) {
    return (
      <span
        style={{
          color: '#b91c1c',
          background: '#fee2e2',
          border: '1px solid #f87171',
          padding: '4px 8px',
          borderRadius: 4,
          fontWeight: 700,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}
      >
        ▼ {v}
      </span>
    )
  }

  // NETRAL
  return (
    <span
      style={{
        color: '#64748b',
        fontFamily: 'monospace',
      }}
    >
      ● 0
    </span>
  )
}


/* ===================== MAIN ===================== */
const Dashboard = () => {
  const navigate = useNavigate()

  const mainColumns = [
    { name: 'Customer', selector: row => row.customer, sortable: true },
    { name: 'Asset', selector: row => row.asset, sortable: true },
    { name: 'IN', selector: row => row.in, center: true },
    { name: 'OUT', selector: row => row.out, center: true },
    { name: 'Δ Harian', cell: row => diffView(row.daily), center: true },
    { name: 'Δ Mingguan', cell: row => diffView(row.weekly), center: true },
    {
   name: 'Akum MTD',
center: true,
cell: (row) => {
  const value = Number(row.mtd)

  const color =
    value > 0 ? '#15803d' : value < 0 ? '#b91c1c' : '#475569'

  const bg =
    value > 0 ? '#dcfce7' : value < 0 ? '#fee2e2' : '#f1f5f9'

  return (
    <span
      onClick={() => navigate('/dashboard/grafik')}
      title="Klik untuk melihat detail Akumulasi MTD"
      style={{
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.9rem',

        color,
        padding: '6px 10px',
        borderRadius: 6,
        background: bg,
        border: `1.5px solid ${color}`,

        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,

        whiteSpace: 'nowrap',          // ✅ KUNCI 1 BARIS (INI YANG BENERIN)
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none'
      }}
    >
      {/* VALUE */}
      {value > 0 ? `+${value}` : value}

      {/* TREND */}
      <span style={{ fontSize: '0.7rem' }}>
        {value > 0 ? '▲' : value < 0 ? '▼' : '●'}
      </span>

      {/* CTA */}
      <span
        style={{
          fontSize: '0.6rem',
          fontWeight: 600,
          opacity: 0.75,
        }}
      >
        Klik detail
      </span>
    </span>
  )
},



    },
  ]

  return (
    <>
      {/* ===== INFO BOX ===== */}
      <CRow className="mb-4 align-items-stretch">

        <CCol lg={3} xs={6}>
          <CCard color="danger" textColor="white" className="shadow h-100">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-5 fw-semibold">Total Fasilitas</div>
                  <div className="fs-3 fw-bold">150</div>
                </div>
                <CIcon icon={cilLayers} size="xxl" className="opacity-50" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={3} xs={6}>
          <CCard color="primary" textColor="white" className="shadow h-100">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fs-5 fw-semibold">Di</div>
                  <div className="fs-5 fw-semibold">Customer</div>
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.18)',
                  }}
                >
                  120 / 80
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={3} xs={6}>
          <CCard color="success" textColor="white" className="shadow h-100">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-5 fw-semibold">Di Internal</div>
                  <div className="fs-3 fw-bold">65</div>
                </div>
                <CIcon icon={cilFactory} size="xxl" className="opacity-50" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={3} xs={6}>
          <CCard color="warning" textColor="white" className="shadow h-100">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-5 fw-semibold">Repair</div>
                  <div className="fs-3 fw-bold">53</div>
                </div>
                <CIcon icon={cilSettings} size="xxl" className="opacity-50" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>

      {/* ===== TRADING BOARD ===== */}
     <CRow>
  <CCol xs={12}>
    <CCard>
      <CCardHeader>
        <strong>ASSET IN / OUT</strong>
      </CCardHeader>

      <CCardBody>
        <DataTable
          columns={mainColumns}
          data={assetData}
          dense
          highlightOnHover
          customStyles={{
            table: {
              style: {
                backgroundColor: '#ffffff',
              },
            },
            headRow: {
              style: {
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
              },
            },
            headCells: {
              style: {
                color: '#0f172a',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              },
            },
            rows: {
              style: {
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.85rem',
              },
              highlightOnHoverStyle: {
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
              },
            },
            cells: {
              style: {
                color: '#0f172a',
                paddingTop: '10px',
                paddingBottom: '10px',
                fontFamily: 'monospace',
              },
            },
          }}
        />
      </CCardBody>
    </CCard>
  </CCol>
</CRow>


      {/* ===== ASSET SELECTOR ===== */}
      {/* ===== ASSET SELECTOR – BLOOMBERG TERMINAL STYLE ===== */}
<CRow className="mt-4">
  {[
    { name: 'Trolley', code: 'AST-TRL' },
    { name: 'Dolley', code: 'AST-DLY' },
    { name: 'Box', code: 'AST-BOX' },
    { name: 'Pallet', code: 'AST-PLT' },
  ].map((item) => (
    <CCol xs={12} md={6} lg={3} key={item.name}>
      <CCard
        className="mb-3"
        style={{
          cursor: 'pointer',
          background: '#ffffff',
          border: '1px solid #c7d2fe',
          borderLeft: '6px solid #1e3a8a',
          transition: 'all 0.12s ease',
        }}
        onClick={() => navigate(`/dashboard/detail/${item.name}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderLeft = '6px solid #2563eb'
          e.currentTarget.style.boxShadow = '0 0 0 1px #2563eb'
          e.currentTarget.style.background = '#f8fafc'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderLeft = '6px solid #1e3a8a'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.background = '#ffffff'
        }}
      >
        <CCardBody
          style={{
            padding: '12px 14px',
            fontFamily: 'monospace',
          }}
        >
          {/* TOP ROW */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              {/* ICON TERMINAL */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#1e40af',
                }}
              >
                ▣
              </div>

              {/* ASSET NAME */}
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#020617',
                  textTransform: 'uppercase',
                }}
              >
                {item.name}
              </div>
            </div>

            {/* CHEVRON */}
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#1e40af',
              }}
            >
              &gt;&gt;
            </div>
          </div>

          {/* SEPARATOR */}
          <div
            style={{
              height: 1,
              background: '#e5e7eb',
              margin: '6px 0',
            }}
          />

          {/* BOTTOM ROW */}
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ fontSize: '0.65rem' }}
          >
            <div
              style={{
                letterSpacing: '1px',
                color: '#475569',
                textTransform: 'uppercase',
              }}
            >
              Asset Detail
            </div>

            {/* ASSET CODE */}
            <div
              style={{
                color: '#1e3a8a',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              {item.code}
            </div>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  ))}
</CRow>

    </>
  )
}

export default Dashboard
