import React, { useEffect, useState } from 'react'
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
import api from '../../api/axios'
import Swal from 'sweetalert2'

const DashboardDetail = () => {
  const { asset } = useParams()
  const navigate = useNavigate()
  const assetName = decodeURIComponent(asset)

  const [info, setInfo] = useState({
    customer: '-',
    bulan: '-',
    produksi: 0,
    storeFG: 0,
    customerQty: 0,
  })

  const loadDetail = async () => {
    try {
      const res = await api.get(`/dashboard/detail/${assetName}`)
      const rows = res.data

      const customer = rows[0]?.customer_name || '-'

      const produksi = rows.filter(
        r => r.logical_location === 'PRODUKSI'
      ).length

      const storeFG = rows.filter(
        r => r.logical_location === 'STORE_FG'
      ).length

      const customerQty = rows.filter(
        r => r.logical_location === 'CUSTOMER'
      ).length

      const bulan = new Date().toLocaleString('id-ID', {
        month: 'long',
        year: 'numeric',
      })

      setInfo({
        customer,
        bulan,
        produksi,
        storeFG,
        customerQty,
      })
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Gagal mengambil detail asset', 'error')
    }
  }

  useEffect(() => {
    loadDetail()
  }, [assetName])

  const totalStandard =
    info.produksi +
    info.storeFG +
    info.customerQty

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
            <CRow className="mb-4">
              <CCol md={4}>
                <strong>Di Customer</strong>
                <div>{info.customer}</div>
              </CCol>
              <CCol md={4}>
                <strong>Bulan</strong>
                <div>{info.bulan}</div>
              </CCol>
              <CCol md={4}>
                <strong>Total Standard</strong>
                <div>{totalStandard}</div>
              </CCol>
            </CRow>

            <CTable bordered>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Produksi</CTableHeaderCell>
                  <CTableDataCell>{info.produksi}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Di Store FG</CTableHeaderCell>
                  <CTableDataCell>{info.storeFG}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Di Customer</CTableHeaderCell>
                  <CTableDataCell>{info.customerQty}</CTableDataCell>
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
