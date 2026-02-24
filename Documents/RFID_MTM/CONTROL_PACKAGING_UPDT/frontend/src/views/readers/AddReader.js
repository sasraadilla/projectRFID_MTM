import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddReader = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reader_code: "",
    reader_name: "",
    location: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/readers", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Reader berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/reader");
      });

    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah reader",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader>
            <strong className="fs-5">Tambah Reader</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Kode Reader</CFormLabel>
                <CFormInput
                  name="reader_code"
                  placeholder="Contoh: RD-07"
                  value={form.reader_code}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Nama Reader</CFormLabel>
                <CFormInput
                  name="reader_name"
                  placeholder="Contoh: Gate Warehouse"
                  value={form.reader_name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Lokasi</CFormLabel>
                <CFormInput
                  name="location"
                  placeholder="Contoh: Warehouse IN"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate("/reader")}
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

export default AddReader;
