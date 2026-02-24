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
     LOAD TRACKING DATA (DUMMY)
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dummyData = [
          { rfid_tag: 'RFID-000001', asset_code: 'TROL-AHM-001', packaging_name: 'Trolley', customer_name: 'PT ASTRA Otoparts', status: 'in', location: 'Warehouse A', scan_time: new Date().toISOString() },
          { rfid_tag: 'RFID-000002', asset_code: 'BOX-DEN-001', packaging_name: 'Box Plastik', customer_name: 'PT Denso Indonesia', status: 'out', location: 'Customer Plant', scan_time: new Date(Date.now() - 3600000).toISOString() },
          { rfid_tag: 'RFID-000003', asset_code: 'PAL-GSB-001', packaging_name: 'Pallet Kayu', customer_name: 'PT GS Battery', status: 'maintenance', location: 'Repair Shop', scan_time: new Date(Date.now() - 7200000).toISOString() },
          { rfid_tag: 'RFID-000004', asset_code: 'BSK-SHW-005', packaging_name: 'Keranjang', customer_name: 'PT Showa Indonesia', status: 'in', location: 'Warehouse B', scan_time: new Date(Date.now() - 86400000).toISOString() },
          { rfid_tag: 'RFID-000005', asset_code: 'PAL-AKE-002', packaging_name: 'Pallet Besi', customer_name: 'PT Akebono Brake', status: 'out', location: 'In Transit', scan_time: new Date(Date.now() - 172800000).toISOString() },
          { rfid_tag: 'RFID-000006', asset_code: 'TROL-AHM-002', packaging_name: 'Trolley', customer_name: 'PT ASTRA Otoparts', status: 'in', location: 'Warehouse A', scan_time: new Date(Date.now() - 250000000).toISOString() },
        ];
        setData(dummyData);
      } catch (err) {
        Swal.fire('Error', 'Gagal memuat data tracking', 'error')
      }
    }
    fetchData()
  }, [])

  const filteredData = data.filter(item =>
    item.asset_code.toLowerCase().includes(search.toLowerCase()) ||
    item.customer_name.toLowerCase().includes(search.toLowerCase())
  )

  const statusBadge = (status) => {
    if (status === 'in') return <CBadge color="success">IN</CBadge>
    if (status === 'out') return <CBadge color="danger">OUT</CBadge>
    return <CBadge color="secondary">{status}</CBadge>
  }

  // helper format datetime
  const formatDateTime = (val) => {
    if (!val) return '-'
    const d = new Date(val)
    const date = d.toISOString().split("T")[0]
    const time = d.toTimeString().split(" ")[0]
    return `${date} ${time}`
  }

  const columns = [
    { name: 'RFID', selector: r => r.rfid_tag, wrap: true },
    { name: 'Asset Code', selector: r => r.asset_code, sortable: true, wrap: true },
    { name: 'Packaging', selector: r => r.packaging_name, wrap: true },
    { name: 'Customer', selector: r => r.customer_name, wrap: true },
    { name: 'Status', cell: r => statusBadge(r.status), center: true },
    { name: 'Lokasi Terakhir', selector: r => r.location, wrap: true },
    {
      name: 'Last Scan',
      selector: r => formatDateTime(r.scan_time),
      sortable: true,
      wrap: true
    },
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
            />

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tracking
