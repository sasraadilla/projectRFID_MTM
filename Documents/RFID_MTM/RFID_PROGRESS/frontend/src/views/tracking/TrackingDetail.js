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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const pad = n => n.toString().padStart(2, '0')

    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

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
    if (status === 'out') return <CBadge color="danger">OUT</CBadge>
    return <CBadge color="secondary">{status}</CBadge>
  }

  const columns = [
    { 
      name: 'Waktu', 
      selector: r => formatDate(r.scan_time) 
    },
    { name: 'Status', cell: r => statusBadge(r.event_type), center: true },
    { name: 'Lokasi', selector: r => r.location, wrap: true },
    //{ name: 'Reader', selector: r => r.reader_name, wrap: true },
    { name: 'Scan By', selector: r => r.scanned_by_name, wrap: true },
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
