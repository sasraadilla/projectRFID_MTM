// EditKalenderKerja.js
import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const EditKalenderKerja = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bulan: "",
    tahun: "",
    hari_kerja: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get(`/kalender-kerja/${id}`);
      setForm(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data", "error");
      navigate("/kalender-kerja");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/kalender-kerja/${id}`, form);
      Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
      navigate("/kalender-kerja");
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update data",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader>
            <strong>Edit Kalender Kerja</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Bulan</CFormLabel>
                <CFormInput
                  type="text"
                  name="bulan"
                  value={form.bulan}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Tahun</CFormLabel>
                <CFormInput
                  type="number"
                  name="tahun"
                  value={form.tahun}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Hari Kerja</CFormLabel>
                <CFormInput
                  type="number"
                  name="hari_kerja"
                  value={form.hari_kerja}
                  onChange={handleChange}
                />
              </div>

              <CButton type="submit" color="primary" className="me-2">
                Update
              </CButton>

              <CButton
                color="secondary"
                onClick={() => navigate("/kalender-kerja")}
              >
                Batal
              </CButton>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EditKalenderKerja;
