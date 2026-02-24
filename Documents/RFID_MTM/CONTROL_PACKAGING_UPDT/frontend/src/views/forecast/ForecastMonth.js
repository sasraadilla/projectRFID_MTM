import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const ForecastMonth = () => {
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);
  const [form, setForm] = useState({
    part_id: "",
    bulan: "",
    tahun: "",
    forecast_month: "",
  });

  // Load parts (static atau via API)
  React.useEffect(() => {
    api.get("/parts")
      .then(res => setParts(res.data))
      .catch(() => Swal.fire("Error", "Gagal load part", "error"));
  }, []);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/forecast/month", form);
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Forecast bulanan tersimpan", timer: 1500, showConfirmButton: false })
        .then(() => navigate("/forecast/input"));
    } catch (err) {
      Swal.fire("Gagal", err.response?.data?.message || "Gagal simpan forecast bulanan", "error");
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader>Tambah Forecast Bulanan</CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Part</CFormLabel>
                <CFormSelect name="part_id" value={form.part_id} onChange={handleChange}>
                  <option value="">Pilih Part</option>
                  {parts.map(p => <option key={p.id} value={p.id}>{p.part_number} - {p.part_name}</option>)}
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel>Bulan</CFormLabel>
                <CFormInput type="text" name="bulan" value={form.bulan} onChange={handleChange} placeholder="Contoh: Nov" />
              </div>

              <div className="mb-3">
                <CFormLabel>Tahun</CFormLabel>
                <CFormInput type="text" name="tahun" value={form.tahun} onChange={handleChange} placeholder="Contoh: 2025" />
              </div>

              <div className="mb-3">
                <CFormLabel>Forecast Bulanan (pcs)</CFormLabel>
                <CFormInput type="number" name="forecast_month" value={form.forecast_month} onChange={handleChange} placeholder="Masukkan forecast" />
              </div>

              <CButton type="submit" color="primary" className="me-2">Simpan</CButton>
              <CButton color="secondary" onClick={() => navigate("/forecast")}>Batal</CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ForecastMonth;
