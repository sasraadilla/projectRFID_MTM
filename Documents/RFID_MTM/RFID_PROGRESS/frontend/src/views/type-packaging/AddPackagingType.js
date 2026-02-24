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

const AddPackagingType = () => {
  const navigate = useNavigate();
  const [typeName, setTypeName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!typeName) {
      Swal.fire("Warning", "Type packaging wajib diisi", "warning");
      return;
    }

    try {
      await api.post("/packaging-types", {
        type_name: typeName,
      });

      Swal.fire("Berhasil", "Packaging type berhasil ditambahkan", "success");
      navigate("/packaging-type");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Gagal menambah packaging type",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard>
          <CCardHeader>
            <strong>Tambah Packaging Type</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Nama Packaging Type</CFormLabel>
                  <CFormInput
                    placeholder="Contoh: Box, Pallet, Trolley"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                  />
                </CCol>
              </CRow>

              <CButton type="submit" color="primary" className="me-2">
                Simpan
              </CButton>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate("/packaging-type")}
              >
                Batal
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddPackagingType;
