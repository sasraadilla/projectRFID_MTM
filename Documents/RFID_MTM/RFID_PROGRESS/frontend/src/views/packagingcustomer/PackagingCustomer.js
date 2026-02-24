import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CBadge,
  CFormInput,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const PackagingCustomer = () => {
  // NAVIGATE (WAJIB DI DALAM COMPONENT)
  const navigate = useNavigate()

  // DATA STATIS
  const dataPackagingCustomer = [
    { id: 1, nama_customer:'PT AHM', nama_jenis_packaging: 'Trolley', nama_packaging: 'Trolley AHM', warna: 'Cream'},
    { id: 2, nama_customer:'PT ADM', nama_jenis_packaging: 'Pallet', nama_packaging: 'Mesh Pallet', warna: 'Abu-Abu'},
    { id: 3, nama_customer:'PT ADM', nama_jenis_packaging: 'Box', nama_packaging: 'Polybox', warna: 'Abu-Abu'},
    { id: 4, nama_customer:'PT HPM', nama_jenis_packaging: 'Dolley', nama_packaging: 'Dolley HPM', warna: 'Biru'},
  ]

  const [search, setSearch] = useState('')

  const filteredPackagingCustomer = dataPackagingCustomer.filter((item) =>
    item.nama_customer.toLowerCase().includes(search.toLowerCase())
    )


  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Nama Customer',
      selector: (row) => row.nama_customer,
      sortable: true,
    },
    {
      name: 'Nama Packaging',
      selector: (row) => row.nama_packaging,
      sortable: true,
    },
    {
      name: 'Warna',
      selector: (row) => row.warna,
      sortable: true,
    },
    {
      name: 'Jenis Packaging',
      selector: (row) => row.nama_jenis_packaging,
      sortable: true,
    },
    {
      name: 'Aksi',
      cell: () => (
        <>
          <CButton color="warning" size="sm" className="me-2" onClick={() => navigate('/packagingcustomer/edit/1')}>
            <CIcon icon={cilPencil} /> Ubah
          </CButton>
          <CButton color="danger" size="sm">
            <CIcon icon={cilTrash} /> Hapus
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

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Data Packaging Customer</strong>
          </CCardHeader>

          <CCardBody>

            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton
                color="primary"
                onClick={() => navigate('/packagingcustomer/add')}
              >
                + Tambah
              </CButton>
            </div>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari Nama Customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            {/* TABLE */}
            <DataTable
              columns={columns}
              data={filteredPackagingCustomer}
              pagination
              striped
              highlightOnHover
              responsive
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

export default PackagingCustomer
