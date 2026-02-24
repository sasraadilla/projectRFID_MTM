import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CFormInput,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const Asset = () => {
  const navigate = useNavigate()

  // DATA STATIS
  const dataAsset = [
    {
      id: 1,
      rfid: 'RFID-000001',
      asset_code: 'TROL-AHM-001',
      packagingtype: 'Trolley',
      warna: 'Biru',
      packaging: '6644',
      product: '123-ABC-XYZ',
      customer: 'PT. AAA Indonesia',
      status: 'IN', // IN, OUT, REPAIR
      location: 'Warehouse A',
      last_scan: '21 Desember 2025 08:10:12',
    },
    {
      id: 2,
      rfid: 'RFID-000002',
      asset_code: 'TROL-AHM-002',
      packagingtype: 'Trolley',
      warna: 'Biru',
      packaging: '6644',
      product: '123-ABC-XYZ',
      customer: 'PT. AAA Indonesia',
      status: 'OUT',
      location: 'Customer',
      last_scan: '21 Desember 2025 09:30:44',
    },
    {
      id: 3,
      rfid: 'RFID-000003',
      asset_code: 'TROL-AHM-003',
      packagingtype: 'Trolley',
      warna: 'Biru',
      packaging: '6644',
      product: '123-ABC-XYZ',
      customer: 'PT. AAA Indonesia',
      status: 'REPAIR',
      location: 'Workshop',
      last_scan: '20 Desember 2025 15:12:01',
    },
  ]


  const [search, setSearch] = useState('')

  // FILTER SEARCH
  const filteredAsset = dataAsset.filter((item) =>
    item.asset_code.toLowerCase().includes(search.toLowerCase()) ||
    item.packaging.toLowerCase().includes(search.toLowerCase()) ||
    item.customer.toLowerCase().includes(search.toLowerCase())
  )

  // DEFINISI KOLOM
  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Tag RFID',
      selector: (row) => row.rfid,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Asset Code',
      selector: (row) => row.asset_code,
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Jenis Packaging',
      selector: (row) => row.packagingtype,
      sortable: true,
      minWidth: '120px',
      wrap: true,
    },
    {
      name: 'Warna',
      selector: (row) => row.warna,
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Product',
      selector: (row) => row.product,
      sortable: true,
      width: '120px',
      center: true,
    },
    {
      name: 'Customer',
      selector: (row) => row.customer,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Last Scan',
      selector: (row) => row.last_scan,
      sortable: true,
      width: '210px',
    },
    {
      name: 'Aksi',
      cell: () => (
        <>
          <CButton color="warning" size="sm" className="me-2" onClick={() => navigate('/asset/edit/1')}>
            <CIcon icon={cilPencil} /> 
          </CButton>
          <CButton color="danger" size="sm">
            <CIcon icon={cilTrash} /> 
          </CButton>
        </>
      ),
      center: true,
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Data Asset</strong>
          </CCardHeader>

          <CCardBody>
            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton
                color="primary"
                onClick={() => navigate('/asset/add')}
              >
                + Tambah
              </CButton>
            </div>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari data..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            {/* TABLE */}
            <DataTable
              columns={columns}
              data={filteredAsset}
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

export default Asset
