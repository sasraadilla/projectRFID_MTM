// src/views/users/EditUser.js
import React, { useState, useEffect } from "react";
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

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    // Ambil data user berdasarkan ID
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setForm({
          ...res.data,
          password: "", // password dikosongkan
        });
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data user", "error");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${id}`, form);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil diperbarui",
        timer: 1500,
        showConfirmButton: true,
      }).then(() => navigate("/users"));
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update user",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Edit User</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Username</CFormLabel>
                <CFormInput
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Nama Lengkap</CFormLabel>
                <CFormInput
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Password (opsional)</CFormLabel>
                <CFormInput
                  type="password"
                  name="password"
                  placeholder="Kosongkan jika tidak diubah"
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
                  required
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

export default EditUser;
