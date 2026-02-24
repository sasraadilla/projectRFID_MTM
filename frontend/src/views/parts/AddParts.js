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

const AddPart = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    part_number: "",
    part_name: "",
    customer_id: "",
    qty_per_pack: "",
    keterangan: "",
  });

  // 🔹 LOAD CUSTOMER UNTUK DROPDOWN
  const loadCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data customer", "error");
    }
  };

  useEffect(() => {
    loadCustomers();
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
      await api.post("/parts", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Part berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/parts"));

    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menambah part",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Tambah Part</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              {/* PART NUMBER */}
              <div className="mb-3">
                <CFormLabel>Part Number</CFormLabel>
                <CFormInput
                  name="part_number"
                  placeholder="Masukkan part number"
                  value={form.part_number}
                  onChange={handleChange}
                />
              </div>

              {/* PART NAME */}
              <div className="mb-3">
                <CFormLabel>Part Name</CFormLabel>
                <CFormInput
                  name="part_name"
                  placeholder="Masukkan nama part"
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
                  placeholder="Masukkan qty per pack"
                  value={form.qty_per_pack}
                  onChange={handleChange}
                />
              </div>

              {/* KETERANGAN */}
              <div className="mb-4">
                <CFormLabel>Keterangan</CFormLabel>
                <CFormInput
                  name="keterangan"
                  placeholder="Keterangan"
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

export default AddPart;
