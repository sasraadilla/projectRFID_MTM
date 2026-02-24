import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CFormInput,
} from "@coreui/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilCalculator, cilPlus, cilTrash } from "@coreui/icons";
import api from "../../api/axios";
import Swal from "sweetalert2";

const Forecast = () => {
  const navigate = useNavigate();
  const [forecasts, setForecasts] = useState([]);
  const [search, setSearch] = useState("");

  const loadForecasts = async () => {
    try {
      const res = await api.get("/forecast");
      setForecasts(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data forecast", "error");
    }
  };

  useEffect(() => {
    loadForecasts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus forecast?",
      text: "Semua input forecast bulan ini akan ikut terhapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/forecast/${id}`);
        Swal.fire("Berhasil", "Forecast dihapus", "success");
        loadForecasts();
      } catch (err) {
        Swal.fire("Error", "Gagal menghapus forecast", "error");
      }
    }
  };


  const filtered = forecasts.filter(f =>
    f.part_name.toLowerCase().includes(search.toLowerCase()) ||
    f.bulan.toLowerCase().includes(search.toLowerCase()) ||
    f.tahun.toString().includes(search)
  );

  const columns = [
    {
      name: "No",
      cell: (_, i) => i + 1,
      width: "70px",
    },
    {
      name: "Part",
      selector: row => row.part_name,
      sortable: true,
    },
    {
      name: "Bulan",
      selector: row => row.bulan,
      sortable: true,
    },
    {
      name: "Tahun",
      selector: row => row.tahun,
      sortable: true,
      width: "100px",
    },
    {
      name: "Forecast / Month",
      selector: row => row.forecast_month,
      sortable: true,
      right: true,
    },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton
            size="sm"
            color="danger"
            onClick={() => handleDelete(row.id)}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </>
      ),
      center: true
    },
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Data Forecast Bulanan</strong>
          </CCardHeader>
          <CCardBody>
          {/* Tombol atas */}
            <CRow className="mb-3">
              <CCol>
                <CButton
                  color="primary"
                  onClick={() => navigate("/forecast/add")}
                >
                  + Tambah Forecast
                </CButton>
              </CCol>

              <CCol className="text-end">
                <CButton
                  color="success"
                  onClick={() => navigate("/forecast/hitung")}
                >
                  Hitung
                </CButton>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari part / bulan / tahun..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </CCol>
            </CRow>

            <DataTable
              columns={columns}
              data={filtered}
              pagination
              striped
              highlightOnHover
              responsive
              customStyles={{
                rows: {
                  style: {
                    minHeight: "56px",
                  },
                },
                cells: {
                  style: {
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    fontSize: "14px",
                  },
                },
                headRow: {
                  style: {
                    backgroundColor: "#007bff",
                  },
                },
                headCells: {
                  style: {
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                  },
                },
              }}
            />

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Forecast;
