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

const EditAsset = () => {
  const navigate = useNavigate()

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Edit Asset</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* TYPE BOX */}
              <div className="mb-3">
                <CFormLabel>Tag RFID</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Tag RFID"
                  value="RFID-000001"
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Asset Kode</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Asset Kode"
                  value="TROL-AHM-001"
                />
              </div>

              {/* Packaging */}
              <div className="mb-3">
                <CFormLabel>Packaging</CFormLabel>
                <CFormSelect>
                  <option>Trolley AHM (Biru) - Trolley</option>
                  <option>Dolley CS (Biru) - Dolley</option>
                  <option>Pallet IGP (Abu-Abu) - Pallet</option>
                  <option>6644 (Cream) - Box</option>
                </CFormSelect>
              </div>

              {/* Status */}
              <div className="mb-3">
                <CFormLabel>Status</CFormLabel>
                <CFormSelect>
                  <option>In</option>
                  <option>Out</option>
                  <option>Repair</option>
                </CFormSelect>
              </div>

              {/* Lokasi */}
              <div className="mb-3">
                <CFormLabel>Lokasi</CFormLabel>
                <CFormSelect>
                  <option>Warehouse A</option>
                  <option>Customer</option>
                  <option>Workshop</option>
                </CFormSelect>
              </div>

              {/* BUTTON */}
              <div>
                <CButton color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate('/asset')}
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

export default EditAsset
