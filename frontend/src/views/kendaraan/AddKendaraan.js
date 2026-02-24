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

const AddOperator = () => {
  const navigate = useNavigate()

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Tambah Operator</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* NAMA */}
              <div className="mb-3">
                <CFormLabel>Nama</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Nama"
                />
              </div>

              {/* BUTTON */}
              <div>
                <CButton color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate('/operator')}
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

export default AddOperator
