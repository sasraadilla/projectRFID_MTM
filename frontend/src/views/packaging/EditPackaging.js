import React, { useEffect, useState } from "react";
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
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const EditPackaging = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    packaging_name: "",
    kapasitas_packaging: "",
    packaging_type_id: "",
    warna: "",
  });

  /* =====================
     LOAD PACKAGING TYPE
  ===================== */
  const loadTypes = async () => {
    try {
      const res = await api.get("/packaging-types");
      setTypes(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data packaging type", "error");
    }
  };

  /* =====================
     LOAD DATA PACKAGING
  ===================== */
  const loadPackaging = async () => {
    try {
      const res = await api.get(`/packagings/${id}`);
      setForm({
        packaging_name: res.data.packaging_name,
        kapasitas_packaging: res.data.kapasitas_packaging,
        packaging_type_id: res.data.packaging_type_id,
        warna: res.data.warna,
      });
    } catch {
      Swal.fire("Error", "Gagal mengambil data packaging", "error");
    }
  };

  useEffect(() => {
    loadTypes();
    loadPackaging();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.packaging_name || !form.kapasitas_packaging || !form.packaging_type_id || !form.warna) {
      Swal.fire("Warning", "Semua field wajib diisi", "warning");
      return;
    }

    try {
      await api.put(`/packagings/${id}`, form);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Packaging berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/packaging"));
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update packaging",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Edit Packaging</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              {/* NAMA */}
              <div className="mb-3">
                <CFormLabel>Nama Packaging</CFormLabel>
                <CFormInput
                  name="packaging_name"
                  value={form.packaging_name}
                  onChange={handleChange}
                />
              </div>

              {/* KAPASITAS */}
              <div className="mb-3">
                <CFormLabel>Kapasitas Packaging</CFormLabel>
                <CFormInput
                  name="kapasitas_packaging"
                  value={form.kapasitas_packaging}
                  onChange={handleChange}
                />
              </div>

              {/* TYPE */}
              <div className="mb-3">
                <CFormLabel>Type Packaging</CFormLabel>
                <CFormSelect
                  name="packaging_type_id"
                  value={form.packaging_type_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih Type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.type_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              {/* WARNA */}
              <div className="mb-4">
                <CFormLabel>Warna</CFormLabel>
                <CFormInput
                  name="warna"
                  value={form.warna}
                  onChange={handleChange}
                />
              </div>

              {/* BUTTON */}
              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Simpan
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => navigate("/packaging")}
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

export default EditPackaging;
