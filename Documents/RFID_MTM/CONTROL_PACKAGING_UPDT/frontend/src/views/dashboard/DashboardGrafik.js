import React, { useEffect, useState, useCallback } from 'react'
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
  CartesianGrid,
} from 'recharts'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import api from '../../api/axios'

/* ===================== TABLE COLUMNS ===================== */
const movementColumns = [
  { name: 'Asset', selector: (row) => row.asset, sortable: true },
  { name: 'RFID Tag', selector: (row) => row.tagId },
  { name: 'Driver', selector: (row) => row.driver },
  { name: 'Kendaraan', selector: (row) => row.vehicle },
  { name: 'Dari', selector: (row) => row.from },
  { name: 'Ke', selector: (row) => row.to },
  { name: 'Waktu', selector: (row) => row.time },
  {
    name: 'Status',
    cell: (row) => (
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

  /* ===== LOAD GRAFIK ===== */
  const loadGrafik = useCallback(async () => {
    try {
      const res = await api.get(`/dashboard/grafik/${customer}/${asset}`)
      const rawData = res.data || []

      // Get current date info
      const today = new Date()
      const currentDay = today.getDate()

      // Fill gaps: Create an array for all days up to today
      const filledData = []
      for (let d = 1; d <= currentDay; d++) {
        const found = rawData.find((r) => Number(r.day) === d)
        filledData.push({
          day: `Tgl ${d}`,
          in: found ? Number(found.in) : 0,
          out: found ? Number(found.out) : 0,
        })
      }

      setMtdFlowData(filledData)
    } catch (err) {
      console.error(err)
      // Fallback dummy
      setMtdFlowData(Array.from({ length: 7 }, (_, i) => ({ day: `Tgl ${i + 1}`, in: 0, out: 0 })))
    }
  }, [customer, asset])

  /* ===== LOAD TRACEABILITY ===== */
  const loadTraceability = useCallback(async () => {
    try {
      const res = await api.get(`/dashboard/detail/${customer}/${asset}`)

      if (res.data && res.data.length > 0) {
        const mapped = res.data.map((r) => ({
          asset: asset,
          tagId: r.asset_code,
          driver: r.driver || '-',
          vehicle: r.vehicle || '-',
          from: r.event_type === 'in' ? customer : 'Internal',
          to: r.event_type === 'out' ? customer : 'Internal',
          time: new Date(r.scan_time).toLocaleString('id-ID'),
          status: r.event_type ? r.event_type.toUpperCase() : 'UNKNOWN',
        }))
        setMovementDetailData(mapped)
      } else {
        setMovementDetailData([])
      }
    } catch (err) {
      console.error(err)
    }
  }, [customer, asset])

  useEffect(() => {
    loadGrafik()
    loadTraceability()
  }, [loadGrafik, loadTraceability])

  return (
    <>
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard style={{ border: 'none', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <CCardHeader className="d-flex justify-content-between align-items-center" style={{ background: 'white', padding: '15px 20px' }}>
              <strong style={{ fontSize: '1.2rem', color: '#334155' }}>Analisis MTD – {asset} ({customer})</strong>
              <CButton color="info" variant="outline" size="sm" onClick={() => navigate(-1)} style={{ fontWeight: '600' }}>
                ⬅ KEMBALI
              </CButton>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard style={{ border: 'none', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <CCardHeader style={{ backgroundColor: 'white', borderBottom: '1px solid #f1f5f9', padding: '20px' }}>
              <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>Grafik Pergerakan In / Out Bulanan</strong>
            </CCardHeader>
            <CCardBody style={{ height: 400, padding: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mtdFlowData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    interval={0} // Show all days
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      fontSize: '13px',
                      fontWeight: '700',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={40}
                    align="right"
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="in"
                    name="MASUK (IN)"
                    stroke="#22c55e"
                    strokeWidth={4}
                    dot={{ r: 3, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="out"
                    name="KELUAR (OUT)"
                    stroke="#ef4444"
                    strokeWidth={4}
                    dot={{ r: 3, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard style={{ border: 'none', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <CCardHeader style={{ backgroundColor: 'white', padding: '20px' }}>
              <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>Log Pergerakan Terakhir</strong>
            </CCardHeader>
            <CCardBody style={{ padding: '0' }}>
              <DataTable
                columns={movementColumns}
                data={movementDetailData}
                pagination
                highlightOnHover
                responsive
                customStyles={{
                  headRow: { style: { backgroundColor: '#f8fafc', minHeight: '50px' } },
                  headCells: { style: { fontWeight: '700', color: '#475569', fontSize: '13px' } },
                  rows: { style: { minHeight: '55px' } }
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
