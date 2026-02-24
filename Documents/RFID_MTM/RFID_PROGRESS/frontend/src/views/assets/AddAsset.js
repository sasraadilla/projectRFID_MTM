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

const AddAsset = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rfid_tag: "",
    asset_code: "",
    packaging_id: "",
    part_id: "",
    status: "in",
  });

  const [packagings, setPackagings] = useState([]);
  const [parts, setParts] = useState([]);

  // LOAD PACKAGING & PART
  useEffect(() => {
    const loadData = async () => {
      try {
        const resPack = await api.get("/packagings");
        const resPart = await api.get("/parts");

        setPackagings(resPack.data);
        setParts(resPart.data);
      } catch (err) {
        Swal.fire("Error", "Gagal memuat data master", "error");
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/assets", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Asset berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/assets");
      });
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah asset",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Tambah Asset</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <CFormLabel>RFID Tag</CFormLabel>
                <CFormInput
                  name="rfid_tag"
                  placeholder="Masukkan RFID Tag"
                  value={form.rfid_tag}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Kode Asset</CFormLabel>
                <CFormInput
                  name="asset_code"
                  placeholder="Masukkan kode asset"
                  value={form.asset_code}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Part</CFormLabel>
                <CFormSelect
                  name="part_id"
                  value={form.part_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih Part</option>
                  {parts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.part_number} - {p.part_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel>Packaging</CFormLabel>
                <CFormSelect
                  name="packaging_id"
                  value={form.packaging_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih Packaging</option>
                  {packagings.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.packaging_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <div className="mb-4">
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="in">IN</option>
                  <option value="out">OUT</option>
                </CFormSelect>
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate("/assets")}
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

export default AddAsset;
