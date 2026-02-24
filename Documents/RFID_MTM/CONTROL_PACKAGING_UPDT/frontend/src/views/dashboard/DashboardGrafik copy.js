import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CBadge,
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import DataTable from 'react-data-table-component'

/* ===================== DUMMY DATA MTD ===================== */
const mtdFlowData = [
  { day: '1', in: 10, out: 5 },
  { day: '5', in: 20, out: 15 },
  { day: '10', in: 30, out: 25 },
  { day: '15', in: 45, out: 30 },
  { day: '20', in: 60, out: 55 },
  { day: '25', in: 80, out: 65 },
  { day: '30', in: 100, out: 90 },
]

/* ===================== TRACEABILITY DATA ===================== */
const movementDetailData = [
  {
    asset: 'Trolley',
    tagId: 'RFID-TR-001',
    driver: 'Budi Santoso',
    vehicle: 'B 9123 KJ',
    from: 'Warehouse A',
    to: 'Customer AHM',
    time: '2026-01-12 09:12',
    status: 'OUT',
  },
  {
    asset: 'Trolley',
    tagId: 'RFID-TR-001',
    driver: 'Andi Wijaya',
    vehicle: 'B 7781 PL',
    from: 'Customer AHM',
    to: 'Warehouse A',
    time: '2026-01-12 13:45',
    status: 'IN',
  },
]

const movementColumns = [
  { name: 'Asset', selector: row => row.asset, sortable: true },
  { name: 'RFID Tag', selector: row => row.tagId },
  { name: 'Driver', selector: row => row.driver },
  { name: 'Kendaraan', selector: row => row.vehicle },
  { name: 'Dari', selector: row => row.from },
  { name: 'Ke', selector: row => row.to },
  { name: 'Waktu', selector: row => row.time },
  {
    name: 'Status',
    cell: row => (
      <CBadge
        color={row.status === 'OUT' ? 'danger' : 'success'}
      >
        {row.status}
      </CBadge>
    ),
  },
]

const DashboardGrafik = () => {
  const { assetName } = useParams()
  const navigate = useNavigate()

  return (
    <>
      {/* ===== HEADER ===== */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Akum MTD Detail – Trolley AHM 1</strong>
              <CButton color="secondary" size="sm" onClick={() => navigate(-1)}>
                ⬅ Kembali
              </CButton>
            </CCardHeader>
            <CCardBody>
              Grafik pergerakan aset dari awal bulan hingga hari ini
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== LINE CHART ===== */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Month To Date – In / Out Flow</CCardHeader>
            <CCardBody style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mtdFlowData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="in"
                    stroke="#198754"
                    strokeWidth={3}
                    name="IN"
                  />
                  <Line
                    type="monotone"
                    dataKey="out"
                    stroke="#dc3545"
                    strokeWidth={3}
                    name="OUT"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== TRACEABILITY TABLE ===== */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>Detail Pergerakan Asset (Traceability)</strong>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={movementColumns}
                data={movementDetailData}
                dense
                pagination
                highlightOnHover
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default DashboardGrafik
