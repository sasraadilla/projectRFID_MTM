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

const ForecastInput = () => {
  const navigate = useNavigate();

  const [forecastMonthList, setForecastMonthList] = useState([]);
  const [packagingList, setPackagingList] = useState([]);
  const [form, setForm] = useState({
    forecast_month_id: "",
    kalender_kerja: "",
    packaging_id: "",
    lead_time: "",
    actual_packaging: "",
  });

  // 🔹 LOAD FORECAST BULAN
  const loadForecastMonth = async () => {
    try {
      const res = await api.get("/forecast/month");
      setForecastMonthList(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal load forecast bulan", "error");
    }
  };

  // 🔹 LOAD PACKAGING
  const loadPackaging = async () => {
    try {
      const res = await api.get("/packagings");
      setPackagingList(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal load packaging", "error");
    }
  };

  useEffect(() => {
    loadForecastMonth();
    loadPackaging();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!form.forecast_month_id || !form.kalender_kerja || !form.packaging_id) {
      Swal.fire("Peringatan", "Semua field wajib diisi", "warning");
      return;
    }

    try {
      await api.post("/forecast/input", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data forecast berhasil disimpan",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/forecast"));
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal menyimpan data forecast",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Input Forecast Harian / Packaging</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              {/* FORECAST BULAN */}
              <div className="mb-3">
                <CFormLabel>Forecast Bulan</CFormLabel>
                <CFormSelect
                  name="forecast_month_id"
                  value={form.forecast_month_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih Forecast Bulan</option>
                  {forecastMonthList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.part_number} - {f.part_name} ({f.bulan} {f.tahun})
                    </option>
                  ))}
                </CFormSelect>
              </div>

              {/* KALENDER KERJA */}
              <div className="mb-3">
                <CFormLabel>Hari Kerja</CFormLabel>
                <CFormInput
                  type="number"
                  name="kalender_kerja"
                  placeholder="Masukkan jumlah hari kerja"
                  value={form.kalender_kerja}
                  onChange={handleChange}
                />
              </div>

              {/* PACKAGING */}
              <div className="mb-3">
                <CFormLabel>Packaging</CFormLabel>
                <CFormSelect
                  name="packaging_id"
                  value={form.packaging_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih Packaging</option>
                  {packagingList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.packaging_name} ({p.kapasitas_packaging} pcs)
                    </option>
                  ))}
                </CFormSelect>
              </div>

              {/* LEAD TIME */}
              <div className="mb-3">
                <CFormLabel>Lead Time (hari)</CFormLabel>
                <CFormInput
                  type="number"
                  name="lead_time"
                  placeholder="Masukkan total lead time"
                  value={form.lead_time}
                  onChange={handleChange}
                />
              </div>

              {/* ACTUAL PACKAGING */}
              <div className="mb-4">
                <CFormLabel>Actual Packaging</CFormLabel>
                <CFormInput
                  type="number"
                  name="actual_packaging"
                  placeholder="Masukkan jumlah fisik yang tersedia"
                  value={form.actual_packaging}
                  onChange={handleChange}
                />
              </div>

              {/* BUTTON */}
              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Simpan
                </CButton>
                <CButton color="secondary" onClick={() => navigate("/forecast")}>
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

export default ForecastInput;
