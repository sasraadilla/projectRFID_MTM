import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CBadge,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Swal from 'sweetalert2'

const Tracking = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])

  /* =========================
     LOAD TRACKING DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/tracking')
        setData(res.data)
      } catch (err) {
        Swal.fire('Error', 'Gagal mengambil data tracking', 'error')
      }
    }
    fetchData()
  }, [])

  const filteredData = data.filter(item => {
    const code = (item.asset_code || '').toLowerCase()
    const cust = (item.customer_name || '').toLowerCase()
    const term = search.toLowerCase()
    return code.includes(term) || cust.includes(term)
  })

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
    { name: 'Asset Code', selector: r => r.asset_code || '-', sortable: true },
    { name: 'RFID Tag', selector: r => r.rfid_tag || '-' },
    { name: 'Tipe Packaging', selector: r => r.packaging_type || '-' },
    { name: 'Packaging', selector: r => r.packaging_name || '-' },
    { name: 'Customer', selector: r => r.customer_name || 'INTERNAL' },
    { name: 'Status', cell: r => statusBadge(r.status), center: true },
    { name: 'Lokasi', selector: r => r.last_location || r.last_scan_location || '-' },
    { name: 'Last Scan', selector: r => fmtTime(r.last_scan), sortable: true },
    {
      name: 'Aksi',
      cell: r => (
        <CButton
          size="sm"
          color="info"
          onClick={() => navigate(`/tracking/${r.asset_code}`)}
        >
          Detail
        </CButton>
      ),
      center: true,
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Tracking Asset</strong>
          </CCardHeader>
          <CCardBody>

            <CRow className="mb-3">
              <CCol md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari asset / customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              striped
              highlightOnHover
              responsive
              customStyles={{
                rows: {
                  style: {
                    minHeight: "56px",
                  },
                },
                cells: {
                  style: {
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    fontSize: "14px",
                  },
                },
                headRow: {
                  style: {
                    backgroundColor: "#007bff",
                  },
                },
                headCells: {
                  style: {
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                  },
                },
              }}
            />

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tracking
