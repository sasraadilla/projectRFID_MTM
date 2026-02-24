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
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const Kebutuhan = () => {
  const navigate = useNavigate()

  // DATA STATIS
  const dataKebutuhan = [
    {
      id: 1,
      asset: 'Trolley',
      total_available: '120',
      total_needed: '150',
      gap: '-30',
      status: 'Kurang',
      tanggal: '21 Desember 2025',
    },
    {
      id: 2,
      asset: 'Dolley',
      total_available: '80',
      total_needed: '80',
      gap: '0',
      status: 'Pas',
      tanggal: '21 Desember 2025',
    },
    {
      id: 3,
      asset: 'Box',
      total_available: '200',
      total_needed: '180',
      gap: '+20',
      status: 'Lebih',
      tanggal: '21 Desember 2025',
    },
  ]

  const [search, setSearch] = useState('')

  // FILTER SEARCH
  const filteredKebutuhan = dataKebutuhan.filter((item) =>
    item.asset.toLowerCase().includes(search.toLowerCase()) ||
    item.status.toLowerCase().includes(search.toLowerCase())
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
      name: 'Asset',
      selector: (row) => row.asset,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Total Available',
      selector: (row) => row.total_available,
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Gap',
      selector: (row) => row.gap,
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Status',
      sortable: true,
      minWidth: '120px',
      center: true,
      cell: (row) => {
        let color = 'secondary'

        if (row.status === 'Pas') color = 'success'
        else if (row.status === 'Kurang') color = 'danger'
        else if (row.status === 'Lebih') color = 'warning'

        return <CBadge color={color}>{row.status}</CBadge>
      },
    },
    {
      name: 'Tanggal',
      selector: (row) => row.tanggal,
      sortable: true,
      minWidth: '190px',
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Data Aset Kebutuhan</strong>
          </CCardHeader>

          <CCardBody>
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
              data={filteredKebutuhan}
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

export default Kebutuhan
