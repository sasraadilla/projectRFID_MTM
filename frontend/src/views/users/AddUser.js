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
  CFormSelect,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "",
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
      await api.post("/users", form);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/users");
      });

    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah user",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Tambah User</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>Username</CFormLabel>
                <CFormInput
                  name="username"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Nama Lengkap</CFormLabel>
                <CFormInput
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Role</CFormLabel>
                <CFormSelect
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                </CFormSelect>
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Simpan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate("/users")}
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

export default AddUser;
