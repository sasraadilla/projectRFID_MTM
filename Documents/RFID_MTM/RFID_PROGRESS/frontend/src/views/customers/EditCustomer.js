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
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    customer_code: "",
    customer_name: "",
  });

  // ========================
  // GET DATA CUSTOMER
  // ========================
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get(`/customers/${id}`);
        setForm(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data customer", "error");
        navigate("/customers");
      }
    };

    fetchCustomer();
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
      await api.put(`/customers/${id}`, form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Customer berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/customers");
      });
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update customer",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Edit Customer</strong>
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

export default EditCustomer;
