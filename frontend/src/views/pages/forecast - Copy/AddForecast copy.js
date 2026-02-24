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

const AddForecast = () => {
  const navigate = useNavigate()

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Tambah Aset Forecast</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* PART */}
              <div className="mb-3">
                <CFormLabel>Part</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Part-</option>
                  <option>ABC</option>
                  <option>DEF</option>
                </CFormSelect>
              </div>

              {/* CUSTOMER */}
              <div className="mb-3">
                <CFormLabel>Customer</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Customer-</option>
                  <option>PT. AAA</option>
                  <option>PT. BBB</option>
                </CFormSelect>
              </div>

              {/* PACKAGING */}
              <div className="mb-3">
                <CFormLabel>Jenis Packaging</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Jenis Packaging-</option>
                  <option>Trolley</option>
                  <option>Dolley</option>
                  <option>Box</option>
                  <option>Pallet</option>
                </CFormSelect>
              </div>

              {/* BOX */}
              <div className="mb-3">
                <CFormLabel>Type Box</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Type Box-</option>
                  <option>6644</option>
                  <option>6055</option>
                  <option>6653</option>
                </CFormSelect>
              </div>

              {/* WARNA BOX */}
              <div className="mb-3">
                <CFormLabel>Warna Box</CFormLabel>
                <CFormSelect>
                  <option value="">-Pilih Warna Box-</option>
                  <option>Biru</option>
                  <option>Abu-Abu</option>
                  <option>Hitam</option>
                </CFormSelect>
              </div>

              {/* QTY */}
              <div className="mb-3">
                <CFormLabel>Qty/Pack</CFormLabel>
                <CFormInput
                  placeholder="Masukkan Jumlah"
                />
              </div>

              {/* Tanggal */}
              <div className="mb-3">
                <CFormLabel>Tanggal</CFormLabel>
                <CFormInput
                  type="date"
                  placeholder="Masukkan Tanggal"
                />
              </div>

              {/* BUTTON */}
              <div>
                <CButton color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate('/forecast')}
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

export default AddForecast
