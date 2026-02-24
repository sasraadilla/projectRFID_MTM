import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel, CFormSelect
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddLeadTime = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);

  const [form, setForm] = useState({
    part_id: "",
    lt_production: "",
    lt_store: "",
    lt_customer: ""
  });

  useEffect(() => {
    api.get("/parts").then(res => setParts(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/lead-time", form);
      Swal.fire("Berhasil", "Lead time ditambahkan", "success");
      navigate("/lead-time");
    } catch (err) {
      Swal.fire("Gagal", err.response?.data?.message, "error");
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader><strong>Tambah Lead Time</strong></CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Part</CFormLabel>
                <CFormSelect
                  name="part_id"
                  value={form.part_id}
                  onChange={handleChange}
                >
                  <option value="">-- Pilih Part --</option>
                  {parts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.part_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel>LT Produksi</CFormLabel>
                <CFormInput
                  type="number"
                  name="lt_production"
                  value={form.lt_production}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>LT Store</CFormLabel>
                <CFormInput
                  type="number"
                  name="lt_store"
                  value={form.lt_store}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>LT Customer</CFormLabel>
                <CFormInput
                  type="number"
                  name="lt_customer"
                  value={form.lt_customer}
                  onChange={handleChange}
                />
              </div>

              <CButton type="submit" color="primary" className="me-2">
                Simpan
              </CButton>
              <CButton color="secondary" onClick={() => navigate("/lead-time")}>
                Batal
              </CButton>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddLeadTime;
