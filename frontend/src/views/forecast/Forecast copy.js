import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const Forecast = () => {
  const navigate = useNavigate()

  // DATA STATIS
  const dataForecast = [
    {
      id: 1,
      part_number: '123-ABC-XYZ',
      part_name: 'Bracket Assembly',
      customer: 'PT. AAA Indonesia',
      packaging: 'Trolley',
      qty: '100',
      type_box: '6644',
      warna_box: 'Biru',
      keterangan: 'Sekat 2',
      waktu: '21 Desember 2025 08:00:05',
    },
    {
      id: 2,
      part_number: '456-DEF-QWE',
      part_name: 'Cover Panel',
      customer: 'PT. BBB Manufacturing',
      packaging: 'Dolley',
      qty: '50',
      type_box: '6055',
      warna_box: 'Biru',
      keterangan: 'Sekat 4',
      waktu: '21 Desember 2025 08:00:05',
    },
    {
      id: 3,
      part_number: '789-GHI-ASD',
      part_name: 'Support Frame',
      customer: 'PT. AAA Indonesia',
      packaging: 'Box',
      qty: '75',
      type_box: '7788',
      warna_box: 'Merah',
      keterangan: 'Sekat 1',
      waktu: '21 Desember 2025 08:00:05',
    },
  ]

  // STATE
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')

  // LIST CUSTOMER UNIK
  const customerOptions = [...new Set(dataForecast.map((item) => item.customer))]

  // FILTER DATA
  const filteredForecast = dataForecast.filter((item) => {
    const matchSearch =
      item.part_number.toLowerCase().includes(search.toLowerCase()) ||
      item.part_name.toLowerCase().includes(search.toLowerCase())

    const matchCustomer =
      selectedCustomer === '' || item.customer === selectedCustomer

    return matchSearch && matchCustomer
  })

  // DEFINISI KOLOM
  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Part Number',
      selector: (row) => row.part_number,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Part Name',
      selector: (row) => row.part_name,
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Customer',
      selector: (row) => row.customer,
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Packaging',
      selector: (row) => row.packaging,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Qty / Pack',
      selector: (row) => row.qty,
      sortable: true,
      width: '120px',
      center: true,
    },
    {
      name: 'Type Box',
      selector: (row) => row.type_box,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Warna Box',
      selector: (row) => row.warna_box,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Keterangan',
      selector: (row) => row.keterangan,
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'Waktu',
      selector: (row) => row.waktu,
      sortable: true,
      minWidth: '190px',
    },
    {
      name: 'Aksi',
      center: true,
      width: '170px',
      cell: (row) => (
        <>
          <CButton
            color="warning"
            size="sm"
            className="me-2"
            onClick={() => navigate(`/forecast/edit/${row.id}`)}
          >
            <CIcon icon={cilPencil} /> Ubah
          </CButton>
          <CButton color="danger" size="sm">
            <CIcon icon={cilTrash} /> Hapus
          </CButton>
        </>
      ),
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Data Aset Forecast</strong>
          </CCardHeader>

          <CCardBody>
            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton color="primary" onClick={() => navigate('/forecast/add')}>
                + Tambah
              </CButton>
            </div>

            {/* FILTER */}
            <CRow className="mb-3">
              <CCol xs={12} md={4}>
                <CFormSelect
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Semua Customer</option>
                  {customerOptions.map((customer, index) => (
                    <option key={index} value={customer}>
                      {customer}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari Part Number / Part Name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            {/* TABLE */}
            <DataTable
              columns={columns}
              data={filteredForecast}
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

export default Forecast
