import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const EditActualPackaging = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);
  const [form, setForm] = useState({
    part_id: "",
    qty_actual: "",
    tanggal: ""
  });

  useEffect(() => {
    api.get("/parts").then(res => setParts(res.data));
    api.get(`/actual-packaging/${id}`).then(res => {
      setForm(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/actual-packaging/${id}`, form);
      Swal.fire("Berhasil", "Data diperbarui", "success")
        .then(() => navigate("/actual-packaging"));
    } catch (err) {
      Swal.fire("Gagal", err.response?.data?.message || "Error", "error");
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader><strong>Edit Actual Packaging</strong></CCardHeader>
          <CCardBody>

            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Part</CFormLabel>
                <select
                  className="form-control"
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
                </select>
              </div>

              <div className="mb-3">
                <CFormLabel>Qty Actual</CFormLabel>
                <CFormInput
                  type="number"
                  name="qty_actual"
                  value={form.qty_actual}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Tanggal</CFormLabel>
                <CFormInput
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                />
              </div>

              <CButton type="submit" color="primary" className="me-2">
                Update
              </CButton>
              <CButton color="secondary" onClick={() => navigate("/actual-packaging")}>
                Batal
              </CButton>

            </CForm>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EditActualPackaging;
