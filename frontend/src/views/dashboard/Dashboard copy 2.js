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

// ===== DUMMY DATA =====
const assetData = [
  { asset: 'Box 6644', in: 40, out: 55, daily: -15, weekly: 10 },
  { asset: 'Trolley', in: 20, out: 10, daily: 10, weekly: 18 },
  { asset: 'Dolley', in: 5, out: 25, daily: -20, weekly: -30 },
]

// ===== HELPER =====
const diffView = (v) => {
  if (v > 0) return <span style={{ color: 'green' }}>🔺 +{v}</span>
  if (v < 0) return <span style={{ color: 'red' }}>🔻 {v}</span>
  return <span style={{ color: 'gray' }}>➖ 0</span>
}

const statusBadge = (weekly) => {
  if (weekly >= 10) return <CBadge color="success">AMAN</CBadge>
  if (weekly >= 0) return <CBadge color="warning">MENIPIS</CBadge>
  return <CBadge color="danger">KRITIS</CBadge>
}

// ===== MAIN COMPONENT =====
const Dashboard = () => {
  // MAIN TABLE
  const mainColumns = [
    { name: 'Asset', selector: row => row.asset, sortable: true },
    { name: 'IN', selector: row => row.in, center: true },
    { name: 'OUT', selector: row => row.out, center: true },
    { name: 'Δ Harian', cell: row => diffView(row.daily), center: true },
    { name: 'Δ Mingguan', cell: row => diffView(row.weekly), center: true },
    { name: 'Status', cell: row => statusBadge(row.weekly), center: true },
    
  ]


  const assetStatusData = [
    { name: 'Customer', value: 160 },
    { name: 'Internal', value: 310 },
    { name: 'Repair', value: 480 },
  ]

  const packagingData = [
    { name: 'Trolley', total: 120 },
    { name: 'Dolley', total: 80 },
    { name: 'Box', total: 200 },
    { name: 'Pallet', total: 50 },
  ]

  const flowData = [
    { day: 'Mon', in: 40, out: 60 },
    { day: 'Tue', in: 50, out: 45 },
    { day: 'Wed', in: 40, out: 35 },
    { day: 'Thu', in: 30, out: 65 },
    { day: 'Fri', in: 60, out: 75 },
  ]

  const COLORS = ['#0dcaf0', '#198754', '#ffc107']

  return (
    <>
      
      {/* ===== SELAMAT DATANG ===== */}
            <CRow className="mb-4">
              <CCol xs={12}>
                <CCard>
                  <CCardHeader>
                    <strong>Selamat Datang</strong>
                  </CCardHeader>
                  <CCardBody>
                    <p>
                      Hai <b>Admin</b>, selamat datang di Halaman Administrator Industrial RFID Assets Control.
                      <br />
                      Silakan pilih menu di sebelah kiri untuk mengelola sistem.
                    </p>
                    <div className="text-end text-muted">
                      Login : 25 Desember 2025 08:00
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

            <CRow className="mb-4">
                    <CCol md={12}>
                      <CCard className="h-100">
                        <CCardHeader>Facility Flow (In/Out)</CCardHeader>
                        <CCardBody style={{ height: 300 }}>
                          <ResponsiveContainer>
                            <LineChart data={flowData}>
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="in"
                                stroke="#0d6efd"
                                strokeWidth={3}
                              />
                              <Line
                                type="monotone"
                                dataKey="out"
                                stroke="#adb5bd"
                                strokeWidth={3}
                              />
                            </LineChart>
                          </ResponsiveContainer>
            
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>

      {/* ===== TOP KPI ===== */}
      <CRow className="mb-3">
        <CCol md={3}>
          <CCard>
            <CCardBody>
              <div className="text-muted">TOTAL ASSET</div>
              <h3>3</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardBody>
              <div className="text-muted">IN TODAY</div>
              <h3 style={{ color: 'green' }}>+65</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardBody>
              <div className="text-muted">OUT TODAY</div>
              <h3 style={{ color: 'red' }}>-90</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardBody>
              <div className="text-muted">NET TODAY</div>
              <h3 style={{ color: 'orange' }}>-25</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== MAIN TRADING TABLE ===== */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>ASSET IN / OUT TRADING BOARD</strong>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={mainColumns}
                data={assetData}
                striped
                highlightOnHover
                dense
                customStyles={{
                  headRow: {
                    style: { backgroundColor: '#1c2a4a' },
                  },
                  headCells: {
                    style: { color: '#fff', fontWeight: '600' },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== BOTTOM PANELS ===== */}
      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardHeader>DAILY MOVEMENT</CCardHeader>
            <CCardBody>
              <DataTable
                columns={[
                  { name: 'Asset', selector: r => r.asset },
                  { name: 'Δ', cell: r => diffView(r.daily) },
                ]}
                data={assetData}
                dense
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard>
            <CCardHeader>WEEKLY TREND</CCardHeader>
            <CCardBody>
              <DataTable
                columns={[
                  { name: 'Asset', selector: r => r.asset },
                  { name: 'Δ', cell: r => diffView(r.weekly) },
                ]}
                data={assetData}
                dense
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
