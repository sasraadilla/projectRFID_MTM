import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CWidgetStatsA,
  CWidgetStatsF,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLayers,
  cilPeople,
  cilFactory,
  cilSettings,
  cilCalendar,
  cilArrowRight,
  cilCheckCircle,
} from '@coreui/icons'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'

/* ===================== DUMMY DATA ===================== */
const assetData = [
  { customer: 'AHM 1', asset: 'Trolley', in: 40, out: 55, daily: -15, weekly: 10, mtd: 25 },
  { customer: 'ADM', asset: 'Box', in: 20, out: 10, daily: 10, weekly: 18, mtd: 40 },
  { customer: 'IGP', asset: 'Pallet', in: 5, out: 25, daily: -20, weekly: -30, mtd: -45 },
]

const flowData = [
  { day: 'Mon', in: 40, out: 60 },
  { day: 'Tue', in: 50, out: 45 },
  { day: 'Wed', in: 40, out: 35 },
  { day: 'Thu', in: 30, out: 65 },
  { day: 'Fri', in: 60, out: 75 },
]

/* ===================== HELPERS ===================== */
const diffView = (value) => {
  const v = Number(value)
  if (v > 0) return <span style={{ color: '#198754', fontWeight: 600 }}>▲ +{v}</span>
  if (v < 0) return <span style={{ color: '#dc3545', fontWeight: 600 }}>▼ {v}</span>
  return <span style={{ color: '#6c757d' }}>● 0</span>
}

const statusBadge = (weekly) => {
  if (weekly >= 10) return <CBadge color="success">AMAN</CBadge>
  if (weekly >= 0) return <CBadge color="warning">MENIPIS</CBadge>
  return <CBadge color="danger">KRITIS</CBadge>
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
      cell: row => (
        <span
          style={{
            color: '#0d6efd',
            cursor: 'pointer',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
          onClick={() => navigate(`/dashboard/grafik`)}
        >
          {row.mtd}
        </span>
      ),
    },
    { name: 'Status', cell: row => statusBadge(row.weekly), center: true },
  ]

  return (
    <>
      {/* ===== WELCOME ===== */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader><strong>Selamat Datang</strong></CCardHeader>
            <CCardBody>
              <p>
                Hai <b>Admin</b>, selamat datang di Halaman Administrator Industrial RFID Assets Control.
              <br />
                Silakan pilih menu di sebelah kiri untuk mengelola sistem.
              </p>
              <div className="text-end text-muted">
                Login : 10 Januari 2026 08:00
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== INFO BOX ===== */}
      <CRow className="mb-4">
                    <CCol lg={3} xs={6}>
                      <CCard color="danger" textColor="white" className="shadow">
                        <CCardBody>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fs-6 opacity-75">Total Fasilitas</div>
                              <div className="fs-3 fw-bold">150</div>
                            </div>
                            <CIcon icon={cilLayers} size="xxl" className="opacity-50" />
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
            
                    <CCol lg={3} xs={6}>
                      <CCard color="info" textColor="white" className="shadow">
                        <CCardBody>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fs-6 opacity-75">Di Customer</div>
                              <div className="fs-3 fw-bold">120/80</div>
                            </div>
                            <CIcon icon={cilPeople} size="xxl" className="opacity-50" />
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
            
                    <CCol lg={3} xs={6}>
                      <CCard color="success" textColor="white" className="shadow">
                        <CCardBody>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fs-6 opacity-75">Di Internal</div>
                              <div className="fs-3 fw-bold">65</div>
                            </div>
                            <CIcon icon={cilFactory} size="xxl" className="opacity-50" />
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
            
                    <CCol lg={3} xs={6}>
                      <CCard color="warning" textColor="white" className="shadow">
                        <CCardBody>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fs-6 opacity-75">Repair</div>
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
                striped
                highlightOnHover
                customStyles={{
                  headRow: { style: { backgroundColor: '#1c2a4a' } },
                  headCells: { style: { color: '#fff', fontWeight: '600' } },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
            {/* ===== ASSET SELECTOR (OPERATIONAL STRIP) ===== */}
        <CRow className="mt-4">
          {[
            { name: 'Trolley', color: '#3399ff' },
            { name: 'Dolley', color: '#3399ff' },
            { name: 'Box', color: '#3399ff' },
            { name: 'Pallet', color: '#3399ff' },
          ].map((item) => (
            <CCol xs={12} md={6} lg={3} key={item.name}>
              <CCard
                className="mb-3 shadow-sm"
                style={{
                  cursor: 'pointer',
                  borderLeft: `6px solid ${item.color}`,
                }}
                onClick={() => navigate(`/dashboard/detail/${item.name}`)}
              >
                <CCardBody className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">{item.name}</div>
                    <div className="text-muted small">Asset Detail</div>
                  </div>

                  <CIcon
                    icon={cilArrowRight}
                    size="lg"
                    style={{ color: item.color }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>

    </>
  )
}

export default Dashboard
