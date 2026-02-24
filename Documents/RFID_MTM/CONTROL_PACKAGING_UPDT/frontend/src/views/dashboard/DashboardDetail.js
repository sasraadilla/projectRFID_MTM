import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'

const DashboardDetail = () => {
  const { asset } = useParams()
  const navigate = useNavigate()

  const assetName = decodeURIComponent(asset)

  // ===== DUMMY DATA =====
  const customer = 'PT. AAA Indonesia'
  const bulan = 'Januari 2026'

  const standardData = {
    produksi: 120,
    storeFG: 80,
    customer: 50,
  }

  const totalStandard =
    standardData.produksi +
    standardData.storeFG +
    standardData.customer

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Detail Asset – {assetName}</strong>
            <CButton color="secondary" size="sm" onClick={() => navigate(-1)}>
              ⬅ Kembali
            </CButton>
          </CCardHeader>

          <CCardBody>
            {/* INFO */}
            <CRow className="mb-4">
              <CCol md={4}>
                <strong>Di Customer</strong>
                <div>{customer}</div>
              </CCol>
              <CCol md={4}>
                <strong>Bulan</strong>
                <div>{bulan}</div>
              </CCol>
              <CCol md={4}>
                <strong>Total Standard</strong>
                <div>{totalStandard}</div>
              </CCol>
            </CRow>

            {/* STANDARD BREAKDOWN */}
            <CTable bordered>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Produksi</CTableHeaderCell>
                  <CTableDataCell>{standardData.produksi}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Di Store FG</CTableHeaderCell>
                  <CTableDataCell>{standardData.storeFG}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Di Customer</CTableHeaderCell>
                  <CTableDataCell>{standardData.customer}</CTableDataCell>
                </CTableRow>
                <CTableRow className="fw-bold table-success">
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableDataCell>{totalStandard}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DashboardDetail
