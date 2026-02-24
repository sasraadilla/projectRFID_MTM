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

const ScanAsset = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rfid_tag: "",
    reader_id: "",
  });

  const [readers, setReaders] = useState([]);

  // =========================
  // LOAD READERS
  // =========================
  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const res = await api.get("/readers");
        setReaders(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data reader", "error");
      }
    };

    fetchReaders();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT SCAN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/asset-events/scan", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: res.data.message,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/asset-events");
      });

    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal scan asset",
        "error"
      );
    }
  };

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">Scan Asset (IN / OUT)</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>

              <div className="mb-3">
                <CFormLabel>RFID Tag</CFormLabel>
                <CFormInput
                  name="rfid_tag"
                  placeholder="Tempel / input RFID"
                  value={form.rfid_tag}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <CFormLabel>Reader</CFormLabel>
                <CFormSelect
                  name="reader_id"
                  value={form.reader_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih Reader</option>
                  {readers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.reader_code} - {r.reader_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <div>
                <CButton type="submit" color="primary" className="me-2">
                  Scan
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() => navigate("/asset-events")}
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

export default ScanAsset;
