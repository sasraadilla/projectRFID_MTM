import React, { useState } from "react";
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
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_code: "",
    customer_name: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/customers", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Customer berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/customers");
      });

    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah customer",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Tambah Customer</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Kode Customer</CFormLabel>
                <CFormInput
                  name="customer_code"
                  placeholder="Masukkan kode customer"
                  value={form.customer_code}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Nama Customer</CFormLabel>
                <CFormInput
                  name="customer_name"
                  placeholder="Masukkan nama customer"
                  value={form.customer_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate("/customers")}
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

export default AddCustomer;
