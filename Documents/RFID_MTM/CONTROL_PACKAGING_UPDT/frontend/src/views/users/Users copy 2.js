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

const Users = () => {
  // NAVIGATE (WAJIB DI DALAM COMPONENT)
  const navigate = useNavigate()

  // DATA STATIS
  const dataUsers = [
    { id: 1, name: 'Ara', email: 'ara@gmail.com', role: 'Admin' },
    { id: 2, name: 'Budi', email: 'budi@gmail.com', role: 'Driver' },
    { id: 3, name: 'Citra', email: 'citra@gmail.com', role: 'Driver' },
    { id: 4, name: 'Doni', email: 'doni@gmail.com', role: 'Operator' },
  ]

  const [search, setSearch] = useState('')

  const filteredUsers = dataUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  )

  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Nama',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      cell: (row) => (
        <CBadge color={row.role === 'Admin' ? 'primary' : 'secondary'}>
          {row.role}
        </CBadge>
      ),
      center: true,
    },
    {
      name: 'Aksi',
      cell: () => (
        <>
          <CButton color="warning" size="sm" className="me-2" onClick={() => navigate('/users/edit/1')}>
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
            <strong className="fs-5">Data Users</strong>
          </CCardHeader>

          <CCardBody>

            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton
                color="primary"
                onClick={() => navigate('/users/add')}
              >
                + Tambah
              </CButton>
            </div>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            {/* TABLE */}
            <DataTable
              columns={columns}
              data={filteredUsers}
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

export default Users
