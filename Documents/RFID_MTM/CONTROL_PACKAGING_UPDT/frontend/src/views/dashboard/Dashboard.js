import React, { useEffect, useState, useCallback } from 'react'
import { CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLayers, cilFactory, cilSettings, cilPeople } from '@coreui/icons'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

/* ===================== HELPERS ===================== */
const diffView = (value) => {
  const v = Number(value)
  const isPositive = v > 0
  const isNegative = v < 0

  // Standard Colors: GREEN for increase, RED for decrease, BLUE/GREY for neutral
  const bg = isPositive ? '#dafbe1' : isNegative ? '#fee2e2' : '#f1f5f9'
  const color = isPositive ? '#166534' : isNegative ? '#991b1b' : '#64748b'
  const icon = isPositive ? '▲' : isNegative ? '▼' : ' '
  const sign = isPositive ? '+' : ''

  return (
    <div
      style={{
        background: bg,
        color: color,
        padding: '6px 12px',
        borderRadius: '8px',
        fontWeight: '800',
        fontSize: '0.9rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: `1px solid ${isPositive ? '#86efac' : isNegative ? '#fca5a5' : '#e2e8f0'}`,
        minWidth: '70px',
        justifyContent: 'center',
        boxShadow: isPositive || isNegative ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      <span style={{ fontSize: '0.7rem' }}>{icon}</span>
      <span>
        {sign}
        {v}
      </span>
    </div>
  )
}

/* ===================== KPI Card Component ===================== */
const KPICard = ({ title, value, icon, color, badge }) => (
  <div
    style={{
      background: `linear-gradient(135deg, ${color} 0%, ${color}ee 100%)`,
      borderRadius: '20px',
      padding: '24px',
      color: 'white',
      position: 'relative',
      height: '100%',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)'
      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 1,
      }}
    >
      <p
        style={{
          fontSize: '0.85rem',
          fontWeight: '700',
          margin: 0,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        {title}
      </p>
      {badge && (
        <span
          style={{
            background: 'rgba(255,255,255,0.25)',
            padding: '4px 10px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: '800',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {badge}
        </span>
      )}
    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        zIndex: 1,
      }}
    >
      <h2
        style={{
          fontSize: value && value.toString().length > 8 ? '1.8rem' : '2.6rem',
          fontWeight: '800',
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-1px',
        }}
      >
        {value || '0'}
      </h2>
      <div
        style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CIcon icon={icon} size="xl" />
      </div>
    </div>

    {/* Decorative Circle */}
    <div
      style={{
        position: 'absolute',
        right: '-20px',
        bottom: '-20px',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        zIndex: 0,
      }}
    />
  </div>
)

/* ===================== MAIN ===================== */
const Dashboard = () => {
  const navigate = useNavigate()

  const [summary, setSummary] = useState({
    total_asset: 0,
    di_customer: 0,
    di_customer_target: 80,
    di_internal: 0,
    repair: 0,
  })
  const [assetData, setAssetData] = useState([])

  const loadData = useCallback(async () => {
    try {
      const kpiRes = await api.get('/dashboard/kpi')
      const tableRes = await api.get('/dashboard/table')

      if (kpiRes.data) setSummary(kpiRes.data)
      if (tableRes.data) setAssetData(tableRes.data)
    } catch (err) {
      console.error('Error loading live dashboard data:', err)
    }
  }, [])

  useEffect(() => {
    // Inject custom font
    const font = document.createElement('link')
    font.href =
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
    font.rel = 'stylesheet'
    document.head.appendChild(font)

    // Global style for font
    const style = document.createElement('style')
    style.innerHTML = `* { font-family: 'Plus Jakarta Sans', sans-serif !important; }`
    document.head.appendChild(style)

    loadData()

    return () => {
      document.head.removeChild(font)
      document.head.removeChild(style)
    }
  }, [loadData])

  const mainColumns = [
    {
      name: 'CUSTOMER',
      selector: (row) => row.customer,
      sortable: true,
      cell: (row) => <span style={{ fontWeight: '700', color: '#1e293b' }}>{row.customer}</span>,
    },
    {
      name: 'ASSET',
      selector: (row) => row.asset,
      sortable: true,
      cell: (row) => <span style={{ color: '#475569', fontWeight: '500' }}>{row.asset}</span>,
    },
    {
      name: 'IN',
      selector: (row) => row.in,
      center: true,
      cell: (row) => (
        <span style={{ fontWeight: '800', color: '#1e40af', fontSize: '1rem' }}>{row.in}</span>
      ),
    },
    {
      name: 'OUT',
      selector: (row) => row.out,
      center: true,
      cell: (row) => (
        <span style={{ fontWeight: '800', color: '#b91c1c', fontSize: '1rem' }}>{row.out}</span>
      ),
    },
    {
      name: 'Δ HARIAN',
      center: true,
      cell: (row) => diffView(row.daily),
    },
    {
      name: 'Δ MINGGUAN',
      center: true,
      cell: (row) => diffView(row.weekly),
    },
    {
      name: 'AKUM MTD',
      center: true,
      cell: (row) => {
        const value = Number(row.mtd)
        const isPositive = value > 0
        const isNegative = value < 0
        const bg = isPositive ? '#dafbe1' : isNegative ? '#fee2e2' : '#f1f5f9'
        const color = isPositive ? '#166534' : isNegative ? '#991b1b' : '#64748b'
        const sign = isPositive ? '+' : ''

        return (
          <div
            onClick={() => navigate(`/dashboard/grafik/${row.customer}/${row.asset}`)}
            style={{
              cursor: 'pointer',
              background: bg,
              color: color,
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: `1px solid ${isPositive ? '#86efac' : isNegative ? '#fca5a5' : '#e2e8f0'}`,
              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {sign}
            {value}
            <span style={{ fontSize: '0.65rem', opacity: 0.7, fontWeight: '700' }}> DETAIL</span>
          </div>
        )
      },
    },
  ]

  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor: '#1e293b', // Sleek dark header
        color: 'white',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        minHeight: '52px',
      },
    },
    headCells: {
      style: {
        color: 'white',
        fontWeight: '700',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      },
    },
    rows: {
      style: {
        minHeight: '65px',
        '&:not(:last-of-type)': {
          borderBottom: '1px solid #f1f5f9',
        },
      },
    },
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* KPI Cards */}
      <CRow className="mb-4 g-4">
        <CCol lg={3} sm={6}>
          <KPICard
            title="SUPPORTING FACILITY"
            value={summary.total_asset}
            icon={cilLayers}
            color="#ef4444"
          />
        </CCol>
        <CCol lg={3} sm={6}>
          <KPICard
            title="DI CUSTOMER"
            value={summary.di_customer}
            badge={`Target: ${summary.di_customer_target || 80}`}
            icon={cilPeople}
            color="#6366f1"
          />
        </CCol>
        <CCol lg={3} sm={6}>
          <KPICard
            title="DI INTERNAL"
            value={summary.di_internal}
            icon={cilFactory}
            color="#22c55e"
          />
        </CCol>
        <CCol lg={3} sm={6}>
          <KPICard
            title="REPAIR"
            value={summary.repair}
            icon={cilSettings}
            color="#f59e0b"
          />
        </CCol>
      </CRow>

      {/* Main Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5
            style={{
              fontWeight: '800',
              color: '#1e293b',
              fontSize: '1.4rem',
              margin: 0,
            }}
          >
            ASSET IN / OUT STATUS
          </h5>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <DataTable
          columns={mainColumns}
          data={assetData}
          customStyles={customTableStyles}
          highlightOnHover
          pointerOnHover
          noDataComponent={
            <div className="p-5 text-center text-muted">
              Loading dashboard data...
            </div>
          }
        />
      </div>
    </div>
  )
}

export default Dashboard


