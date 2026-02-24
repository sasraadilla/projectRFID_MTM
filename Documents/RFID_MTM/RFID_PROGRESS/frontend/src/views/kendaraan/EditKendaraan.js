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

const EditBox = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // DATA DUMMY (SIMULASI DATA DARI BACKEND)
  const [form, setForm] = useState({
    type_box: '',
  })

  useEffect(() => {
    // SIMULASI FETCH DATA BERDASARKAN ID
    if (id === '1') {
      setForm({
        type_box: '6644',
      })
    }
  }, [id])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.type_box]: e.target.value,
    })
  }

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">

          {/* JUDUL */}
          <CCardHeader>
            <strong className="fs-5">Edit Type Box</strong>
          </CCardHeader>

          <CCardBody>
            <CForm>

              {/* TYPE BOX */}
              <div className="mb-3">
                <CFormLabel>Nama Type Box</CFormLabel>
                <CFormInput
                  name="type_box"
                  value={form.type_box}
                  onChange={handleChange}
                />
              </div>

              {/* BUTTON */}
              <div>
                <CButton color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate('/box')}
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

export default EditBox
