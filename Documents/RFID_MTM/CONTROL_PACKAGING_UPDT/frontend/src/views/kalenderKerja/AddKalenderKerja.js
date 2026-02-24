import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddKalenderKerja = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bulan: "",
    tahun: "",
    hari_kerja: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/kalender-kerja", form);
      Swal.fire("Berhasil", "Data berhasil ditambahkan", "success")
        .then(() => navigate("/kalender-kerja"));
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah data",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader><strong>Tambah Kalender Kerja</strong></CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Bulan</CFormLabel>
                <CFormInput
                  name="bulan"
                  placeholder="Contoh: Januari"
                  value={form.bulan}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Tahun</CFormLabel>
                <CFormInput
                  type="number"
                  name="tahun"
                  placeholder="2025"
                  value={form.tahun}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Hari Kerja</CFormLabel>
                <CFormInput
                  type="number"
                  name="hari_kerja"
                  placeholder="21"
                  value={form.hari_kerja}
                  onChange={handleChange}
                />
              </div>

              <CButton type="submit" color="primary" className="me-2">
                Simpan
              </CButton>

              <CButton color="secondary" onClick={() => navigate("/kalender-kerja")}>
                Batal
              </CButton>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddKalenderKerja;
