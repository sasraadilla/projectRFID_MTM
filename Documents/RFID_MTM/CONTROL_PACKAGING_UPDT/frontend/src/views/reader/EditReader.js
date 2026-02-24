import React, { useState, useEffect } from 'react'
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
import { useNavigate, useParams } from 'react-router-dom'

const EditReader = () => {
  const navigate = useNavigate()


  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Edit Reader</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* Code */}
              <div className="mb-3">
                <CFormLabel>Reader Code</CFormLabel>
                <CFormInput
                  name="reader_code"
                  value='GATE_IN_01'
                />
              </div>

              {/* Lokasi */}
              <div className="mb-3">
                <CFormLabel>Lokasi</CFormLabel>
                <CFormInput
                  name="location"
                  value='GATE 1'
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

export default EditReader
