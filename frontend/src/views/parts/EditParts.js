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

const EditPart = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    part_number: "",
    part_name: "",
    customer_id: "",
    qty_per_pack: "",
    keterangan: "",
  });

  /* ======================
     LOAD CUSTOMER
  ====================== */
  const loadCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data customer", "error");
    }
  };

  /* ======================
     LOAD PART BY ID
  ====================== */
  const loadPart = async () => {
    try {
      const res = await api.get(`/parts/${id}`);
      setForm({
        part_number: res.data.part_number,
        part_name: res.data.part_name,
        customer_id: res.data.customer_id,
        qty_per_pack: res.data.qty_per_pack,
        keterangan: res.data.keterangan,
      });
    } catch {
      Swal.fire("Error", "Gagal mengambil data part", "error");
    }
  };

  useEffect(() => {
    loadCustomers();
    loadPart();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/parts/${id}`, form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Part berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/parts"));

    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal update part",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Edit Part</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              {/* PART NUMBER */}
              <div className="mb-3">
                <CFormLabel>Part Number</CFormLabel>
                <CFormInput
                  name="part_number"
                  value={form.part_number}
                  onChange={handleChange}
                />
              </div>

              {/* PART NAME */}
              <div className="mb-3">
                <CFormLabel>Part Name</CFormLabel>
                <CFormInput
                  name="part_name"
                  value={form.part_name}
                  onChange={handleChange}
                />
              </div>

              {/* CUSTOMER */}
              <div className="mb-3">
                <CFormLabel>Customer</CFormLabel>
                <CFormSelect
                  name="customer_id"
                  value={form.customer_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customer_code} - {c.customer_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              {/* QTY PER PACK */}
              <div className="mb-3">
                <CFormLabel>Qty per Pack</CFormLabel>
                <CFormInput
                  type="number"
                  name="qty_per_pack"
                  value={form.qty_per_pack}
                  onChange={handleChange}
                />
              </div>

              {/* KETERANGAN */}
              <div className="mb-4">
                <CFormLabel>Keterangan</CFormLabel>
                <CFormInput
                  name="keterangan"
                  value={form.keterangan}
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
                  onClick={() => navigate("/parts")}
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

export default EditPart;
