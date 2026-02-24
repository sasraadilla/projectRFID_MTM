import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddForecast = () => {
  const navigate = useNavigate();

  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [customerId, setCustomerId] = useState("");

  const [customers, setCustomers] = useState([]);
  const [parts, setParts] = useState([]);

  /* LOAD CUSTOMER */
  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(console.error);
  }, []);

  /* LOAD PART BY CUSTOMER */
  useEffect(() => {
    if (!customerId) {
      setParts([]);
      return;
    }

    api.get(`/parts/by-customer/${customerId}`)
      .then(res => {
        const data = res.data.map(p => ({
          id: p.id,
          part_name: p.part_name,
          packaging_id: p.packaging_id,
          forecast_month: "",
          actual_packaging: 0,
          kalender_kerja: 0,
          lead_time: 0,
        }));
        setParts(data);
      })
      .catch(console.error);
  }, [customerId]);

  const handleChange = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    setParts(updated);
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!bulan || !tahun || !customerId) {
      Swal.fire("Warning", "Bulan, Tahun, dan Customer wajib diisi", "warning");
      return;
    }

    // Validasi semua part
    for (const p of parts) {
      if (!p.forecast_month) {
        Swal.fire(
          "Warning",
          "Forecast per month wajib diisi untuk semua part",
          "warning"
        );
        return;
      }
      if (p.packaging_id == null) { // <= aman untuk 0
        Swal.fire(
          "Warning",
          `Part ${p.part_name} tidak punya packaging_id`,
          "warning"
        );
        return;
      }
    }

    try {
      const payload = {
        bulan,
        tahun,
        items: parts.map(p => ({
          part_id: p.id,
          packaging_id: p.packaging_id,
          forecast_month: Number(p.forecast_month),
          actual_packaging: Number(p.actual_packaging || 0),
          kalender_kerja: p.kalender_kerja || 0,
          lead_time: p.lead_time || 0,
        })),
      };

      await api.post("/forecast/bulk", payload);

      Swal.fire("Berhasil", "Forecast berhasil disimpan", "success");
      navigate("/forecast");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan forecast", "error");
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Tambah Forecast Bulanan</strong>
          </CCardHeader>

          <CCardBody>
            <CRow className="mb-4">
              <CCol md={4}>
                <CFormSelect value={bulan} onChange={e => setBulan(e.target.value)}>
                  <option value="">Pilih Bulan</option>
                  {[
                    "Januari","Februari","Maret","April","Mei","Juni",
                    "Juli","Agustus","September","Oktober","November","Desember"
                  ].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={4}>
                <CFormInput
                  placeholder="Tahun"
                  value={tahun}
                  onChange={e => setTahun(e.target.value)}
                />
              </CCol>

              <CCol md={4}>
                <CFormSelect
                  value={customerId}
                  onChange={e => setCustomerId(e.target.value)}
                >
                  <option value="">Pilih Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.customer_name}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {parts.length > 0 && (
              <table className="table table-bordered">
                <thead className="table-primary">
                  <tr>
                    <th>Part</th>
                    <th>Forecast / Month</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p, i) => (
                    <tr key={p.id}>
                      <td>{p.part_name}</td>
                      <td>
                        <CFormInput
                          type="number"
                          min="0"
                          value={p.forecast_month}
                          onChange={e => handleChange(i, "forecast_month", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <CButton color="success" onClick={handleSubmit}>
              Simpan Forecast
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddForecast;
