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

const Reader = () => {
  // NAVIGATE (WAJIB DI DALAM COMPONENT)
  const navigate = useNavigate()

  // DATA STATIS
  const dataReader = [
    { id: 1, reader_code: 'GATE_IN_01', location:'Gate 1'},
    { id: 2, reader_code: 'GATE_OUT_02', location:'Gate 2'},
  ]

  const [search, setSearch] = useState('')

  const filteredReader = dataReader.filter((item) =>
    item.reader_code.toLowerCase().includes(search.toLowerCase())
    )


  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Reader Code',
      selector: (row) => row.reader_code,
      sortable: true,
    },
    {
      name: 'Lokasi',
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: 'Aksi',
      cell: () => (
        <>
          <CButton color="warning" size="sm" className="me-2" onClick={() => navigate('/reader/edit/1')}>
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
            <strong className="fs-5">Data Reader</strong>
          </CCardHeader>

          <CCardBody>

            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton
                color="primary"
                onClick={() => navigate('/reader/add')}
              >
                + Tambah
              </CButton>
            </div>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari nama..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            {/* TABLE */}
            <DataTable
              columns={columns}
              data={filteredReader}
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

export default Reader
