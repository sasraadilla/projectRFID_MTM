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

const AddReader = () => {
  const navigate = useNavigate()

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Tambah Reader</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* Code */}
              <div className="mb-3">
                <CFormLabel>Reader Code</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Reader Code"
                />
              </div>

              {/* Code */}
              <div className="mb-3">
                <CFormLabel>Lokasi</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Location"
                />
              </div>

              {/* BUTTON */}
              <div>
                <CButton color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate('/reader')}
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

export default AddReader
