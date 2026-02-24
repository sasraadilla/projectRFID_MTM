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

const EditPackagingType = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [typeName, setTypeName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPackagingType = async () => {
    try {
      const res = await api.get(`/packaging-types/${id}`);
      setTypeName(res.data.type_name);
      setLoading(false);
    } catch {
      Swal.fire("Error", "Gagal mengambil data packaging type", "error");
      navigate("/packaging-type");
    }
  };

  useEffect(() => {
    loadPackagingType();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!typeName) {
      Swal.fire("Warning", "Nama packaging type wajib diisi", "warning");
      return;
    }

    try {
      await api.put(`/packaging-types/${id}`, {
        type_name: typeName,
      });

      Swal.fire("Berhasil", "Packaging type berhasil diperbarui", "success");
      navigate("/packaging-type");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Gagal memperbarui packaging type",
        "error"
      );
    }
  };

  if (loading) return null;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Edit Packaging Type</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Nama Packaging Type</CFormLabel>
                  <CFormInput
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                  />
                </CCol>
              </CRow>

              <CButton type="submit" color="primary" className="me-2">
                Update
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

export default EditPackagingType;
