import React, { useEffect, useState } from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLayers, cilFactory, cilSettings, cilSwapHorizontal } from '@coreui/icons'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import api from '../../api/axios'

/* ===================== HELPERS ===================== */
const diffView = (value) => {
  const v = Number(value)

  if (v > 0) {
    return (
      <span
        style={{
          color: '#059669',
          background: 'rgba(16, 185, 129, 0.15)',
          padding: '6px 10px',
          borderRadius: '8px',
          fontWeight: 700,
          fontFamily: "'Inter', monospace",
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        ▲ +{v}
      </span>
    )
  }

  if (v <= -20) {
    return (
      <span
        style={{
          color: '#7f1d1d', // Merah hati pekat
          background: 'rgba(127, 29, 29, 0.15)',
          padding: '6px 10px',
          borderRadius: '8px',
          fontWeight: 800,
          fontFamily: "'Inter', monospace",
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        ▼ {v}
      </span>
    )
  }

  if (v < 0) {
    return (
      <span
        style={{
          color: '#dc2626',
          background: 'rgba(239, 68, 68, 0.15)',
          padding: '6px 10px',
          borderRadius: '8px',
          fontWeight: 700,
          fontFamily: "'Inter', monospace",
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        ▼ {v}
      </span>
    )
  }

  return (
    <span
      style={{
        color: '#64748b',
        fontFamily: "'Inter', monospace",
        padding: '6px 10px',
        background: 'rgba(100, 116, 139, 0.1)',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      ● 0
    </span>
  )
}

/* ===================== MAIN ===================== */
const Dashboard = () => {
  const navigate = useNavigate()
  const [summary, setSummary] = useState({})
  const [assetData, setAssetData] = useState([])

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const kpi = await api.get('/dashboard/kpi')
        setSummary(kpi.data)

        // Use dummy data as requested by the user for the IN/OUT Status table
        const dummyData = [
          {
            customer: 'PT ASTRA Otoparts',
            asset: 'Pallet Kayu',
            in: 150,
            out: 120,
            daily: 30,
            weekly: 50,
            mtd: 120,
          },
          {
            customer: 'PT Denso Indonesia',
            asset: 'Box Plastik',
            in: 80,
            out: 95,
            daily: -15,
            weekly: -20,
            mtd: -40,
          },
          {
            customer: 'PT GS Battery',
            asset: 'Trolley',
            in: 45,
            out: 45,
            daily: 0,
            weekly: 10,
            mtd: 25,
          },
          {
            customer: 'PT Showa Indonesia',
            asset: 'Keranjang',
            in: 200,
            out: 150,
            daily: 50,
            weekly: 120,
            mtd: 350,
          },
          {
            customer: 'PT Akebono Brake',
            asset: 'Pallet Besi',
            in: 30,
            out: 40,
            daily: -10,
            weekly: -5,
            mtd: -15,
          },
        ]

        setAssetData(dummyData)
      } catch (err) {
        console.error(err)
        Swal.fire('Error', 'Gagal mengambil data kpi dashboard', 'error')
      }
    }

    loadDashboard()
  }, [])

  const mainColumns = [
    { name: 'Customer', selector: (row) => row.customer, sortable: true },
    { name: 'Asset', selector: (row) => row.asset, sortable: true },
    { name: 'IN', selector: (row) => row.in, center: true },
    { name: 'OUT', selector: (row) => row.out, center: true },
    { name: 'Δ Harian', cell: (row) => diffView(row.daily), center: true },
    { name: 'Δ Mingguan', cell: (row) => diffView(row.weekly), center: true },
    {
      name: 'Akum MTD',
      center: true,
      cell: (row) => {
        const value = Number(row.mtd)
        const isPos = value > 0
        const isNeg = value < 0 && value > -20
        const isVeryNeg = value <= -20

        const gradient = isPos
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : isVeryNeg
            ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)' // Merah Hati
            : isNeg
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'

        return (
          <div
            onClick={() => navigate(`/dashboard/grafik/${row.customer}/${row.asset}`)}
            style={{
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '10px',
              background: gradient,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: isPos
                ? '0 4px 10px rgba(16, 185, 129, 0.3)'
                : isVeryNeg
                  ? '0 4px 10px rgba(127, 29, 29, 0.4)'
                  : isNeg
                    ? '0 4px 10px rgba(239, 68, 68, 0.3)'
                    : '0 4px 10px rgba(100, 116, 139, 0.2)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {value > 0 ? `+${value}` : value}
            <span style={{ fontSize: '0.7rem' }}>
              {isPos ? '▲' : isNeg || isVeryNeg ? '▼' : '●'}
            </span>
          </div>
        )
      },
    },
  ]

  return (
    <>
      {/* ===== INFO BOX ===== */}
      <CRow className="mb-4 mt-2 align-items-stretch">
        <CCol lg={3} xs={6} className="mb-3 mb-lg-0">
          <CCard
            className="h-100"
            style={{
              backgroundColor: '#ef4444',
              borderRadius: '16px',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CCardBody className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    opacity: 0.9,
                    marginBottom: '4px',
                  }}
                >
                  Supporting Facility
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                  {summary.total_asset || 0}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '12px',
                  borderRadius: '50%',
                }}
              >
                <CIcon icon={cilLayers} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={3} xs={6} className="mb-3 mb-lg-0">
          <CCard
            className="h-100"
            style={{
              backgroundColor: '#6366f1',
              borderRadius: '16px',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CCardBody className="p-4 d-flex justify-content-between align-items-center">
              <div className="w-100">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      opacity: 0.9,
                    }}
                  >
                    Di Customer
                  </div>
                  <div
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Target: {summary.di_total || 80}
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                  {summary.di_customer || 0}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '12px',
                  borderRadius: '50%',
                }}
              >
                <CIcon icon={cilSwapHorizontal} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={3} xs={6} className="mb-3 mb-lg-0">
          <CCard
            className="h-100"
            style={{
              backgroundColor: '#22c55e',
              borderRadius: '16px',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CCardBody className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    opacity: 0.9,
                    marginBottom: '4px',
                  }}
                >
                  Di Internal
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                  {summary.di_internal || 0}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '12px',
                  borderRadius: '50%',
                }}
              >
                <CIcon icon={cilFactory} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={3} xs={6} className="mb-3 mb-lg-0">
          <CCard
            className="h-100"
            style={{
              backgroundColor: '#f59e0b',
              borderRadius: '16px',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CCardBody className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    opacity: 0.9,
                    marginBottom: '4px',
                  }}
                >
                  Repair
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                  {summary.repair || 0}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '12px',
                  borderRadius: '50%',
                }}
              >
                <CIcon icon={cilSettings} size="xl" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== TRADING BOARD ===== */}
      <CRow className="mb-5">
        <CCol xs={12}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <CCardBody className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    color: '#1e293b',
                    margin: 0,
                    textTransform: 'uppercase',
                    fontSize: '1.05rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Asset In / Out Status
                </h5>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  Last Update: {new Date().toLocaleTimeString()}
                </span>
              </div>

              <DataTable
                columns={mainColumns}
                data={assetData}
                highlightOnHover
                customStyles={{
                  table: { style: { backgroundColor: 'transparent' } },
                  headRow: {
                    style: {
                      backgroundColor: '#1e3a8a', // Dark blue matching screenshot header
                      color: 'white',
                      borderBottom: 'none',
                      minHeight: '44px',
                      borderRadius: '8px 8px 0 0',
                    },
                  },
                  headCells: {
                    style: {
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    },
                  },
                  rows: {
                    style: {
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      borderBottomColor: '#f1f5f9',
                      minHeight: '50px',
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

export default Dashboard
