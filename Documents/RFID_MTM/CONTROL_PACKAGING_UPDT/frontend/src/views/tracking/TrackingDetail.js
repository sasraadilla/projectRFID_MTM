import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'
import Swal from 'sweetalert2'

const TrackingDetail = () => {
  const { asset_code } = useParams()
  const [data, setData] = useState([])

  /* =========================
     LOAD HISTORY
  ========================= */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/tracking/${asset_code}`)
        setData(res.data)
      } catch (err) {
        Swal.fire('Error', 'Gagal mengambil history asset', 'error')
      }
    }
    fetchHistory()
  }, [asset_code])

  const statusBadge = (status) => {
    if (status === 'in') return <CBadge color="success">IN</CBadge>
    if (status === 'out') return <CBadge color="primary">OUT</CBadge>
    if (status === 'repair') return <CBadge color="warning">REPAIR</CBadge>
    return <CBadge color="secondary">{status || '-'}</CBadge>
  }

  const fmtTime = (t) => {
    if (!t) return '-'
    return new Date(t).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  }

  const columns = [
    { name: 'Waktu', selector: r => fmtTime(r.scan_time), sortable: true, grow: 2 },
    { name: 'Status', cell: r => statusBadge(r.event_type), center: true },
    { name: 'Lokasi', selector: r => r.location || '-' },
    { name: 'Customer', selector: r => r.customer_name || 'INTERNAL' },
    { name: 'Reader', selector: r => r.reader_name || '-' },
    { name: 'Scan By', selector: r => r.scanned_by || '-' },
  ]

  return (
    <>
      <CRow className="mb-3">
        <CCol>
          <h4>Detail Tracking</h4>
          <div className="text-muted">
            Asset: <strong>{asset_code}</strong>
          </div>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader>
          <strong>History Pergerakan Asset</strong>
        </CCardHeader>
        <CCardBody>
          <DataTable
            columns={columns}
            data={data}
            dense
            striped
            highlightOnHover
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default TrackingDetail
