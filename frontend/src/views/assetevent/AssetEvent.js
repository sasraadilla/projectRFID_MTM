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
      rfid: 'RFID-1001',
      asset_code: 'TROL-AHM-001',
      reader_code: 'GATE_IN_01',
      packagingtype: 'Trolley',
      packaging: '6644',
      product: '123-ABC-XYZ',
      customer: 'PT ASTRA Otoparts',
      event_type: 'IN',
      location: 'Warehouse A',
      operator: 'Andi',
      kendaraan: 'B 9123 KJ',
      event_time: '25 Februari 2026 08:15:23',
    },
    {
      id: 2,
      rfid: 'RFID-1002',
      asset_code: 'BOX-DEN-001',
      reader_code: 'GATE_OUT_02',
      packagingtype: 'Box Plastik',
      packaging: '6645',
      product: '124-DEF-UVW',
      customer: 'PT Denso Indonesia',
      event_type: 'OUT',
      location: 'Customer Plant',
      operator: 'Budi',
      kendaraan: 'B 3474 L',
      event_time: '25 Februari 2026 09:30:10',
    },
    {
      id: 3,
      rfid: 'RFID-1003',
      asset_code: 'PAL-GSB-001',
      reader_code: 'GATE_IN_01',
      packagingtype: 'Pallet Kayu',
      packaging: '6646',
      product: '125-GHI-RST',
      customer: 'PT GS Battery',
      event_type: 'REPAIR',
      location: 'Workshop',
      operator: 'Rudi',
      kendaraan: 'AB 8756 KJ',
      event_time: '24 Februari 2026 15:12:01',
    },
    {
      id: 4,
      rfid: 'RFID-1004',
      asset_code: 'BSK-SHW-005',
      reader_code: 'GATE_IN_01',
      packagingtype: 'Keranjang',
      packaging: '6647',
      product: '126-JKL-MNO',
      customer: 'PT Showa Indonesia',
      event_type: 'IN',
      location: 'Warehouse B',
      operator: 'Citra',
      kendaraan: 'D 1234 A',
      event_time: '24 Februari 2026 10:45:00',
    },
    {
      id: 5,
      rfid: 'RFID-1005',
      asset_code: 'PAL-AKE-002',
      reader_code: 'GATE_OUT_02',
      packagingtype: 'Pallet Besi',
      packaging: '6648',
      product: '127-PQR-STU',
      customer: 'PT Akebono Brake',
      event_type: 'OUT',
      location: 'In Transit',
      operator: 'Dedi',
      kendaraan: 'F 5678 B',
      event_time: '23 Februari 2026 14:20:00',
    },
  ]

  const [search, setSearch] = useState('')

  // FILTER
  const filteredEvent = dataAssetEvent.filter(
    (item) =>
      item.asset_code.toLowerCase().includes(search.toLowerCase()) ||
      item.rfid.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase()),
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
      selector: (row) => row.event_time,
      minWidth: '180px',
      sortable: true,
    },
    {
      name: 'RFID',
      selector: (row) => row.rfid,
      minWidth: '150px',
    },
    {
      name: 'Asset Code',
      selector: (row) => row.asset_code,
      minWidth: '180px',
      sortable: true,
    },
    {
      name: 'Packaging',
      selector: (row) => row.packagingtype,
      minWidth: '120px',
    },
    {
      name: 'Product',
      selector: (row) => row.product,
      minWidth: '140px',
    },
    {
      name: 'Customer',
      selector: (row) => row.customer,
      minWidth: '180px',
    },
    {
      name: 'Lokasi',
      selector: (row) => row.location,
      minWidth: '140px',
    },
    {
      name: 'Driver',
      selector: (row) => row.operator,
      minWidth: '120px',
    },
    {
      name: 'Kendaraan',
      selector: (row) => row.kendaraan,
      minWidth: '120px',
    },
    {
      name: 'Status',
      cell: (row) => statusBadge(row.event_type),
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
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AssetEvent
