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

const AddAsset = () => {
  const navigate = useNavigate()

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Tambah Asset</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* TYPE BOX */}
              <div className="mb-3">
                <CFormLabel>Tag RFID</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Tag RFID"
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Asset Kode</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Asset Kode"
                />
              </div>

              {/* Packaging */}
              <div className="mb-3">
                <CFormLabel>Packaging</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Packaging-</option>
                  <option>Trolley AHM (Biru) - Trolley</option>
                  <option>Dolley CS (Biru) - Dolley</option>
                  <option>Pallet IGP (Abu-Abu) - Pallet</option>
                  <option>6644 (Cream) - Box</option>
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

export default AddAsset
