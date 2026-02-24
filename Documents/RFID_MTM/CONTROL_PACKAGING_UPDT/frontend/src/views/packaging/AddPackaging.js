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
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddPackaging = () => {
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    packaging_name: "",
    packaging_type_id: "",
    warna: "",
  });

  // 🔹 Ambil data packaging type
  const loadTypes = async () => {
    try {
      const res = await api.get("/packaging-types");
      setTypes(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data packaging type", "error");
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.packaging_name || !form.packaging_type_id || !form.warna) {
      Swal.fire("Warning", "Semua field wajib diisi", "warning");
      return;
    }

    try {
      await api.post("/packagings", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Packaging berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/packaging"));
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah packaging",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Tambah Packaging</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              {/* NAMA PACKAGING */}
              <div className="mb-3">
                <CFormLabel>Nama Packaging</CFormLabel>
                <CFormInput
                  name="packaging_name"
                  placeholder="Masukkan nama packaging"
                  value={form.packaging_name}
                  onChange={handleChange}
                />
              </div>

              {/* TYPE PACKAGING */}
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
                  placeholder="Masukkan warna packaging"
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

export default AddPackaging;
