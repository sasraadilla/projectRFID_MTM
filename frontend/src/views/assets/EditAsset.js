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

const EditAsset = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    rfid_tag: "",
    asset_code: "",
    packaging_id: "",
    part_id: "",
    status: "in",
  });

  const [packagings, setPackagings] = useState([]);
  const [parts, setParts] = useState([]);

  // ========================
  // LOAD MASTER + DATA ASSET
  // ========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const resPack = await api.get("/packagings");
        const resPart = await api.get("/parts");
        const resAsset = await api.get(`/assets/${id}`);

        setPackagings(resPack.data);
        setParts(resPart.data);

        setForm({
          rfid_tag: resAsset.data.rfid_tag,
          asset_code: resAsset.data.asset_code,
          packaging_id: resAsset.data.packaging_id,
          part_id: resAsset.data.part_id,
          status: resAsset.data.status,
        });
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data asset", "error");
        navigate("/assets");
      }
    };

    loadData();
  }, [id, navigate]);

  // ========================
  // HANDLE CHANGE
  // ========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ========================
  // SUBMIT UPDATE
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/assets/${id}`, form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Asset berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/assets");
      });
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update asset",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Edit Asset</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>RFID Tag</CFormLabel>
                <CFormInput
                  name="rfid_tag"
                  value={form.rfid_tag}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Kode Asset</CFormLabel>
                <CFormInput
                  name="asset_code"
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

export default EditAsset;
