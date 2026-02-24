import React, { useEffect, useState } from 'react'
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
import Swal from 'sweetalert2'
import api from '../../api/axios'

/* ===================== TABLE COLUMNS ===================== */
const movementColumns = [
  { name: 'Asset', selector: row => row.asset, sortable: true, wrap: true },
  { name: 'RFID Tag', selector: row => row.tagId, wrap: true },
  { name: 'Driver', selector: row => row.driver, wrap: true },
  { name: 'Kendaraan', selector: row => row.vehicle, wrap: true },
  { name: 'Dari', selector: row => row.from, wrap: true },
  { name: 'Ke', selector: row => row.to, wrap: true },
  { name: 'Waktu', selector: row => row.time, wrap: true },
  {
    name: 'Status',
    cell: row => (
      <CBadge color={row.status === 'OUT' ? 'danger' : 'success'}>
        {row.status}
      </CBadge>
    ),
  },
]

/* ===================== MAIN ===================== */
const DashboardGrafik = () => {
  const { customer, asset } = useParams()
  const navigate = useNavigate()

  const [mtdFlowData, setMtdFlowData] = useState([])
  const [movementDetailData, setMovementDetailData] = useState([])

  /* ===== FORMAT DATE ===== */
  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const pad = n => n.toString().padStart(2, '0')

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  /* ===== LOAD GRAFIK ===== */
  const loadGrafik = async () => {
    try {
      const res = await api.get(`/dashboard/grafik/${customer}/${asset}`)

      const formatted = res.data.map(r => ({
        day: Number(r.day),
        in: Number(r.in),
        out: Number(r.out),
      }))

      // isi 1–31 biar chart selalu penuh
      const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
      const filled = daysInMonth.map(d => {
        const found = formatted.find(r => r.day === d)
        return {
          day: d,
          in: found ? found.in : 0,
          out: found ? found.out : 0,
        }
      })

      setMtdFlowData(filled)
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Gagal mengambil data grafik', 'error')
    }
  }

  /* ===== LOAD TRACEABILITY ===== */
  const loadTraceability = async () => {
    try {
      const res = await api.get(`/dashboard/tabelgrafik/${customer}/${asset}`)

      const mapped = res.data.map(r => ({
        asset: asset,
        tagId: r.asset_code,
        driver: '-',
        vehicle: '-',
        from: r.location,
        to: r.event_type === 'out' ? customer : 'Internal',
        time: formatDate(r.scan_time),
        status: r.event_type.toUpperCase(),
      }))

      setMovementDetailData(mapped)
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Gagal mengambil detail pergerakan', 'error')
    }
  }

  useEffect(() => {
    loadGrafik()
    loadTraceability()
  }, [customer, asset])

  return (
    <>
      {/* ===== HEADER ===== */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Akum 30 Hari – {asset} ({customer})</strong>
              <CButton color="secondary" size="sm" onClick={() => navigate(-1)}>
                ⬅ Kembali
              </CButton>
            </CCardHeader>
            <CCardBody>
              Grafik pergerakan aset 30 hari terakhir
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ===== LINE CHART ===== */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>30 Days – In / Out Flow</CCardHeader>
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
                customStyles={{
                  cells: {
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
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

export default DashboardGrafik
