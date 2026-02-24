import React, { useState, useEffect } from "react";
import {
  CRow, CCol, CCard, CCardBody, CCardHeader,
  CFormSelect, CFormInput, CButton
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AddForecast = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load list customer
  const loadCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil daftar customer", "error");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Tambah baris detail forecast
  const addDetailRow = () => {
    setDetails([...details, { part_number: "", forecast_qty: "", lt_production: 1, lt_store: 1, lt_customer: 1 }]);
  };

  // Hapus baris detail
  const removeDetailRow = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  // Update field detail
  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!customer || !month || !year) {
      return Swal.fire("Error", "Customer, Bulan, dan Tahun harus diisi", "error");
    }
    if (details.length === 0) {
      return Swal.fire("Error", "Tambahkan minimal 1 part", "error");
    }

    setLoading(true);
    try {
      await api.post("/forecasts", {
        customer_id: customer,
        month,
        year,
        details
      });
      Swal.fire("Berhasil", "Forecast berhasil ditambahkan", "success");
      navigate("/forecast");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Tidak bisa menambahkan forecast", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Tambah Forecast</strong>
          </CCardHeader>
          <CCardBody>

            <CRow className="mb-3">
              <CCol md={4}>
                <label>Customer</label>
                <CFormSelect value={customer} onChange={e => setCustomer(e.target.value)}>
                  <option value="">Pilih Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.customer_name}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <label>Bulan</label>
                <CFormSelect value={month} onChange={e => setMonth(e.target.value)}>
                  <option value="">Pilih Bulan</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <label>Tahun</label>
                <CFormSelect value={year} onChange={e => setYear(e.target.value)}>
                  <option value="">Pilih Tahun</option>
                  {Array.from({ length: 5 }, (_, i) => 2025 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <hr />

            <h5>Detail Forecast</h5>
            {details.map((d, i) => (
              <CRow className="mb-2" key={i}>
                <CCol md={3}>
                  <CFormInput
                    placeholder="Part Number"
                    value={d.part_number}
                    onChange={e => handleDetailChange(i, "part_number", e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="number"
                    placeholder="Forecast Qty"
                    value={d.forecast_qty}
                    onChange={e => handleDetailChange(i, "forecast_qty", e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="number"
                    placeholder="LT Produksi"
                    value={d.lt_production}
                    onChange={e => handleDetailChange(i, "lt_production", e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="number"
                    placeholder="LT Store"
                    value={d.lt_store}
                    onChange={e => handleDetailChange(i, "lt_store", e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="number"
                    placeholder="LT Customer"
                    value={d.lt_customer}
                    onChange={e => handleDetailChange(i, "lt_customer", e.target.value)}
                  />
                </CCol>
                <CCol md={1}>
                  <CButton color="danger" onClick={() => removeDetailRow(i)}>X</CButton>
                </CCol>
              </CRow>
            ))}

            <CButton color="secondary" onClick={addDetailRow} className="me-2">
              + Tambah Part
            </CButton>
            <CButton color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Forecast"}
            </CButton>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddForecast;
