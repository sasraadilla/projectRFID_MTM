import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CBadge,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const AssetEvent = () => {

  // DATA STATIS (LOG SCAN RFID)
  const dataAssetEvent = [
    {
      id: 1,
      rfid: 'RFID-000001',
      asset_code: 'TROL-AHM-001',
      reader_code:'GATE_IN_01',
      packagingtype: 'Trolley',
      packaging: '6644',
      product: '123-ABC-XYZ',
      customer: 'PT. AAA Indonesia',
      event_type: 'OUT',
      location: 'Warehouse A',
      operator: 'Andi',
      kendaraan: 'B 9123 KJ',
      event_time: '21 Desember 2025 08:15:23',
    },
    {
      id: 2,
      rfid: 'RFID-000002',
      asset_code: 'TROL-AHM-002',
      reader_code:'GATE_IN_01',
      packagingtype: 'Trolley',
      packaging: '6644',
      product: '123-ABC-XYZ',
      customer: 'PT. AAA Indonesia',
      event_type: 'IN',
      location: 'Customer AHM',
      operator: 'Budi',
      kendaraan: 'B 3474 L',
      event_time: '21 Desember 2025 14:30:10',
    },
    {
      id: 3,
      rfid: 'RFID-000003',
      asset_code: 'TROL-AHM-003',
      reader_code:'GATE_IN_01',
      packagingtype: 'Trolley',
      packaging: '6644',
      product: '123-ABC-XYZ',
      customer: 'PT. AAA Indonesia',
      event_type: 'REPAIR',
      location: 'Workshop',
      operator: 'Rudi',
      kendaraan: 'AB 8756 KJ',
      event_time: '20 Desember 2025 15:12:01',
    },
  ]

  const [search, setSearch] = useState('')

  // FILTER
  const filteredEvent = dataAssetEvent.filter((item) =>
    item.asset_code.toLowerCase().includes(search.toLowerCase()) ||
    item.rfid.toLowerCase().includes(search.toLowerCase()) ||
    item.customer.toLowerCase().includes(search.toLowerCase())
  )

  // BADGE STATUS
  const statusBadge = (status) => {
    if (status === 'IN') return <CBadge color="success">IN</CBadge>
    if (status === 'OUT') return <CBadge color="danger">OUT</CBadge>
    if (status === 'REPAIR') return <CBadge color="warning">REPAIR</CBadge>
    return <CBadge color="secondary">{status}</CBadge>
  }

  // KOLOM
  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '60px',
      center: true,
    },
    {
      name: 'Waktu',
      selector: row => row.event_time,
      minWidth: '180px',
      sortable: true,
    },
    {
      name: 'RFID',
      selector: row => row.rfid,
      minWidth: '150px',
    },
    {
      name: 'Asset Code',
      selector: row => row.asset_code,
      minWidth: '180px',
      sortable: true,
    },
    {
      name: 'Packaging',
      selector: row => row.packagingtype,
      minWidth: '120px',
    },
    {
      name: 'Product',
      selector: row => row.product,
      minWidth: '140px',
    },
    {
      name: 'Customer',
      selector: row => row.customer,
      minWidth: '180px',
    },
    {
      name: 'Lokasi',
      selector: row => row.location,
      minWidth: '140px',
    },
    {
      name: 'Driver',
      selector: row => row.operator,
      minWidth: '120px',
    },
    {
      name: 'Kendaraan',
      selector: row => row.kendaraan,
      minWidth: '120px',
    },
    {
      name: 'Status',
      cell: row => statusBadge(row.event_type),
      width: '120px',
      center: true,
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Asset Event (RFID Log)</strong>
          </CCardHeader>

          <CCardBody>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari RFID / Asset / Customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            {/* TABLE */}
            <DataTable
              columns={columns}
              data={filteredEvent}
              pagination
              striped
              highlightOnHover
              responsive
              fixedHeader
              customStyles={{
                rows: {
                  style: {
                    minHeight: '56px',
                  },
                },
                cells: {
                  style: {
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    fontSize: '14px',
                  },
                },
                headRow: {
                  style: {
                    backgroundColor: '#007bff',
                  },
                },
                headCells: {
                  style: {
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
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

export default AssetEvent
