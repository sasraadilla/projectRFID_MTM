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

const Kendaraan = () => {
  // NAVIGATE (WAJIB DI DALAM COMPONENT)
  const navigate = useNavigate()

  // DATA STATIS
  const dataKendaraan = [
    { id: 1, kode: 'B 9123 KJ'},
    { id: 2, kode: 'B 3474 L'},
    { id: 3, kode: 'AB 8756 KJ'},
  ]

  const [search, setSearch] = useState('')

  const filteredKendaraan = dataKendaraan.filter((item) =>
    item.kode.toLowerCase().includes(search.toLowerCase())
    )


  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Kode Kendaraan',
      selector: (row) => row.kode,
      sortable: true,
    },
    {
      name: 'Aksi',
      cell: () => (
        <>
          <CButton color="warning" size="sm" className="me-2" onClick={() => navigate('/kendaraan/edit/1')}>
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
            <strong className="fs-5">Data Kendaraan</strong>
          </CCardHeader>

          <CCardBody>

            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton
                color="primary"
                onClick={() => navigate('/kendaraan/add')}
              >
                + Tambah
              </CButton>
            </div>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari kode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            {/* TABLE */}
            <DataTable
              columns={columns}
              data={filteredKendaraan}
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

export default Kendaraan
