import React, { useState, useEffect } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol,
  CForm, CFormInput, CFormLabel, CFormSelect
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddRepair = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    asset_id: "",
    repair_type: "",
    location: "",
    notes: "",
  });

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const res = await api.get("/assets");
        setAssets(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data asset", "error");
      }
    };
    loadAssets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/repairs", form);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Repair berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/repair"));
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah repair",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader><strong>Tambah Repair</strong></CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Asset</CFormLabel>
                <CFormSelect
                  name="asset_id"
                  value={form.asset_id}
                  onChange={handleChange}
                >
                  <option value="">-- Pilih Asset --</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.asset_code}</option>
                  ))}
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel>Repair Type</CFormLabel>
                <CFormInput
                  name="repair_type"
                  placeholder="Contoh: Maintenance"
                  value={form.repair_type}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Location</CFormLabel>
                <CFormInput
                  name="location"
                  placeholder="Contoh: Warehouse"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Notes</CFormLabel>
                <CFormInput
                  name="notes"
                  placeholder="Optional"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">Simpan</CButton>
                <CButton color="secondary" onClick={() => navigate("/repair")}>Batal</CButton>
              </div>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddRepair;
