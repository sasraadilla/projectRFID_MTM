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


const Dashboard = () => {
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
    { day: 'Wed', in: 60, out: 55 },
    { day: 'Thu', in: 70, out: 65 },
    { day: 'Fri', in: 80, out: 75 },
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
                  <div className="fs-6 opacity-75">Total Support Fasilitas</div>
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

    {/* ===== GRAFIK ===== */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard className="h-100">
            <CCardHeader>Assets Status</CCardHeader>
            <CCardBody style={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={assetStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {assetStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard className="h-100">
            <CCardHeader>Packaging Assets Distribution</CCardHeader>
            <CCardBody style={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={packagingData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol md={8}>
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

        <CCol md={4}>
          <CCard className="h-100">
            <CCardHeader>Customer Load</CCardHeader>
            <CCardBody style={{ height: 300 }}>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Customer</span>
                  <strong>160</strong>
                </div>
                <CProgress value={20} color="info" />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Internal</span>
                  <strong>310</strong>
                </div>
                <CProgress value={70} color="success" />
              </div>

              <div>
                <div className="d-flex justify-content-between">
                  <span>Repair</span>
                  <strong>480</strong>
                </div>
                <CProgress value={80} color="warning" />
              </div>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== BOX ===== */}              
      <CRow className="mt-4">
        {/* PLANT 1 */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-white mb-3" style={{ backgroundColor: '#2eb85c' }}>
            <CCardBody>
              <h6 className="mb-2">
                <CIcon icon={cilCheckCircle} className="me-2" />
                AHM PLANT 1
              </h6>

              <div className="small mb-3">
                <CIcon icon={cilCalendar} className="me-2" />
                25 Desember 2025
              </div>

              <a href="#" className="text-white text-decoration-none">
                Detail <CIcon icon={cilArrowRight} />
              </a>
            </CCardBody>
          </CCard>
        </CCol>

        {/* PLANT 2 */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-white mb-3" style={{ backgroundColor: '#e5533d' }}>
            <CCardBody>
              <h6 className="mb-2">
                <CIcon icon={cilCheckCircle} className="me-2" />
                AHM PLANT 2
              </h6>

              <div className="small mb-3">
                <CIcon icon={cilCalendar} className="me-2" />
                25 Desember 2025
              </div>

              <a href="#" className="text-white text-decoration-none">
                Detail <CIcon icon={cilArrowRight} />
              </a>
            </CCardBody>
          </CCard>
        </CCol>

        {/* PLANT 3 */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-white mb-3" style={{ backgroundColor: '#2eb85c' }}>
            <CCardBody>
              <h6 className="mb-2">
                <CIcon icon={cilCheckCircle} className="me-2" />
                AHM PLANT 3
              </h6>

              <div className="small mb-3">
                <CIcon icon={cilCalendar} className="me-2" />
                25 Desember 2025
              </div>

              <a href="#" className="text-white text-decoration-none">
                Detail <CIcon icon={cilArrowRight} />
              </a>
            </CCardBody>
          </CCard>
        </CCol>

        {/* PLANT 4 */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-white mb-3" style={{ backgroundColor: '#2eb85c' }}>
            <CCardBody>
              <h6 className="mb-2">
                <CIcon icon={cilCheckCircle} className="me-2" />
                AHM PLANT 4
              </h6>

              <div className="small mb-3">
                <CIcon icon={cilCalendar} className="me-2" />
                25 Desember 2025
              </div>

              <a href="#" className="text-white text-decoration-none">
                Detail <CIcon icon={cilArrowRight} />
              </a>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>




      {/* ===== TOTAL KEBUTUHAN ASET ===== */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>Total Kebutuhan Aset</strong>
            </CCardHeader>
            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Asset</CTableHeaderCell>
                    <CTableHeaderCell>Available</CTableHeaderCell>
                    <CTableHeaderCell>Needed</CTableHeaderCell>
                    <CTableHeaderCell>Gap</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Trolley</CTableDataCell>
                    <CTableDataCell>120</CTableDataCell>
                    <CTableDataCell>150</CTableDataCell>
                    <CTableDataCell className="text-danger">-30</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="danger">Kurang</CBadge>
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>Dolley</CTableDataCell>
                    <CTableDataCell>80</CTableDataCell>
                    <CTableDataCell>80</CTableDataCell>
                    <CTableDataCell className="text-success">0</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">Pas</CBadge>
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>Box</CTableDataCell>
                    <CTableDataCell>200</CTableDataCell>
                    <CTableDataCell>180</CTableDataCell>
                    <CTableDataCell className="text-success">+20</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="primary">Lebih</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== LIVE RFID ===== */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>Live RFID Activity</strong>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>RFID</CTableHeaderCell>
                    <CTableHeaderCell>Asset</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell>Time</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>RF-0902</CTableDataCell>
                    <CTableDataCell>Dolley</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="primary">Customer</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>AHM Plant 1</CTableDataCell>
                    <CTableDataCell>08:00</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>RF-7744</CTableDataCell>
                    <CTableDataCell>Trolley</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">Internal</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>Warehouse</CTableDataCell>
                    <CTableDataCell>08:05</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>RF-3301</CTableDataCell>
                    <CTableDataCell>Box</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="warning">Repair</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>Repair Zone</CTableDataCell>
                    <CTableDataCell>08:05</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
