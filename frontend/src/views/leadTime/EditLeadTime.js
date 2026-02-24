import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel, CFormSelect
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const EditLeadTime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);

  const [form, setForm] = useState({
    part_id: "",
    lt_production: "",
    lt_store: "",
    lt_customer: ""
  });

  /* ========================
     LOAD DATA
  ======================== */
  useEffect(() => {
    // load list part
    api.get("/parts").then(res => {
      setParts(res.data);
    });

    // load data lead time by id
    api.get(`/lead-time/${id}`).then(res => {
      setForm({
        part_id: res.data.part_id,
        lt_production: res.data.lt_production,
        lt_store: res.data.lt_store,
        lt_customer: res.data.lt_customer
      });
    });
  }, [id]);

  /* ========================
     HANDLE CHANGE
  ======================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ========================
     SUBMIT
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/lead-time/${id}`, form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Lead time berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/lead-time");
      });

    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update lead time",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader>
            <strong className="fs-5">Edit Lead Time</strong>
          </CCardHeader>

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
                  placeholder="Contoh: 5"
                  value={form.lt_production}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>LT Store</CFormLabel>
                <CFormInput
                  type="number"
                  name="lt_store"
                  placeholder="Contoh: 10"
                  value={form.lt_store}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>LT Customer</CFormLabel>
                <CFormInput
                  type="number"
                  name="lt_customer"
                  placeholder="Contoh: 15"
                  value={form.lt_customer}
                  onChange={handleChange}
                />
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate("/lead-time")}
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

export default EditLeadTime;
