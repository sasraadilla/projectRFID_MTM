import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const EditReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reader_code: "",
    reader_name: "",
    location: ""
  });

  useEffect(() => {
    api.get(`/readers/${id}`).then(res => {
      setForm(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/readers/${id}`, form);
      Swal.fire("Berhasil", "Reader berhasil diperbarui", "success");
      navigate("/readers");
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update reader",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader>
            <strong className="fs-5">Edit Reader</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Kode Reader</CFormLabel>
                <CFormInput
                  name="reader_code"
                  value={form.reader_code}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Nama Reader</CFormLabel>
                <CFormInput
                  name="reader_name"
                  value={form.reader_name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Lokasi</CFormLabel>
                <CFormInput
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Update
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate("/readers")}
                >
                  Batal
                </CButton>
              </div>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EditReader;
