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

const Product = () => {
  // NAVIGATE (WAJIB DI DALAM COMPONENT)
  const navigate = useNavigate()

  // DATA STATIS
  const dataProduct = [
    { id: 1, nama_product: 'MFMSTR-FHFD14N000', product_desc: 'HUB FRONT, AXLE D14N'},
    { id: 2, nama_product: 'MFMSTR-FHFD34T000', product_desc: 'HUB SUB-ASSY, FRONT AXLE D34T'},
  ]

  const [search, setSearch] = useState('')

  const filteredProduct = dataProduct.filter((item) =>
    item.nama_product.toLowerCase().includes(search.toLowerCase()) ||
    item.product_desc.toLowerCase().includes(search.toLowerCase())
    )


  const columns = [
    {
      name: 'No',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Nama Product',
      selector: (row) => row.nama_product,
      sortable: true,
    },
    {
      name: 'Product Desc',
      selector: (row) => row.product_desc,
      sortable: true,
    },
    {
      name: 'Aksi',
      cell: () => (
        <>
          <CButton color="warning" size="sm" className="me-2" onClick={() => navigate('/product/edit/1')}>
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
            <strong className="fs-5">Data Product</strong>
          </CCardHeader>

          <CCardBody>

            {/* TOMBOL TAMBAH */}
            <div className="mb-3">
              <CButton
                color="primary"
                onClick={() => navigate('/product/add')}
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
              data={filteredProduct}
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

export default Product
