import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AddPackaging = () => {
  const navigate = useNavigate()

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Tambah Packaging Customer</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* CUSTOMER */}
              <div className="mb-3">
                <CFormLabel>Customer</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Customer-</option>
                  <option>PT AHM</option>
                  <option>PT ADM</option>
                  <option>PT HPM</option>
                </CFormSelect>
              </div>

              {/* PACKAGING */}
              <div className="mb-3">
                <CFormLabel>Packaging</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Packaging-</option>
                  <option>Trolley AHM (Cream)</option>
                  <option>Dolley HPM (Biru)</option>
                  <option>Mesh Pallet (Abu-Abu)</option>
                  <option>Poylbox (Abu-Abu)</option>
                </CFormSelect>
              </div>

              

              {/* BUTTON */}
              <div>
                <CButton color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate('/packagingcustomer')}
                >
                  Batal
                </CButton>
              </div>

            </CForm>
          </CCardBody>

        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddPackaging
