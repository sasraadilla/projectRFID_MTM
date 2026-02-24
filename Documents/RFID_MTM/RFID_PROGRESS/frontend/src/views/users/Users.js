import React, { useEffect, useState } from 'react'
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
import api from '../../api/axios'
import Swal from "sweetalert2";

const Users = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  /* =====================
     LOAD DATA USERS
  ===================== */
  const loadUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil data user')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  /* =====================
     DELETE USER
  ===================== */
  const handleDelete = async (id) => {
    // Tampilkan konfirmasi dengan SweetAlert2
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "User akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        
        // Notifikasi berhasil
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "User berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });

        // Refresh data
        loadUsers();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", "Gagal menghapus user", "error");
      }
    }
  };


  /* =====================
     FILTER SEARCH
  ===================== */
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()),
  )

  /* =====================
     COLUMNS
  ===================== */
  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Username',
      selector: (row) => row.username,
      sortable: true,
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
        <CBadge color={row.role === 'admin' ? 'primary' : 'secondary'}>
          {row.role}
        </CBadge>
      ),
      center: true,
    },
    {
      name: 'Aksi',
      cell: (row) => (
        <>
          <CButton
            color="warning"
            size="sm"
            className="me-2"
            onClick={() => navigate(`/users/edit/${row.id}`)}
          >
            <CIcon icon={cilPencil} /> Ubah
          </CButton>
          <CButton
            color="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
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
          <CCardHeader>
            <strong className="fs-5">Data Users</strong>
          </CCardHeader>

          <CCardBody>
            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton color="primary" onClick={() => navigate('/users/add')}>
                + Tambah
              </CButton>
            </div>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari nama atau username..."
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
