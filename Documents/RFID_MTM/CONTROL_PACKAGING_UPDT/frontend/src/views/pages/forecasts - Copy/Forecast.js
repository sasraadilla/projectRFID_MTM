import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader, CButton,
  CRow, CCol, CFormInput
} from "@coreui/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilSearch, cilList } from "@coreui/icons";
import api from "../../api/axios";
import Swal from "sweetalert2";

const Forecast = () => {
  const navigate = useNavigate();
  const [forecasts, setForecasts] = useState([]);
  const [search, setSearch] = useState("");

  // Load data forecast
  const loadForecasts = async () => {
    try {
      const res = await api.get("/forecasts");
      setForecasts(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data forecast", "error");
    }
  };

  useEffect(() => {
    loadForecasts();
  }, []);

  // Hapus forecast
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Forecast dan hasil perhitungannya akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/forecasts/${id}`);
        Swal.fire("Berhasil", "Forecast dihapus", "success");
        loadForecasts();
      } catch (err) {
        Swal.fire("Gagal", "Tidak bisa menghapus forecast", "error");
      }
    }
  };

  // Filter search
  const filtered = forecasts.filter(f =>
    f.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    `${f.month}-${f.year}`.includes(search)
  );

  // Kolom DataTable
  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "60px" },
    { name: "Customer", selector: row => row.customer_name },
    { name: "Bulan", selector: row => row.month, center: true },
    { name: "Tahun", selector: row => row.year, center: true },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton
            size="sm"
            color="info"
            className="me-2"
            onClick={() => navigate(`/forecast/detail/${row.id}`)}
          >
            <CIcon icon={cilList} /> Detail
          </CButton>

          <CButton
            size="sm"
            color="warning"
            className="me-2"
            onClick={() => navigate(`/forecast/edit/${row.id}`)}
          >
            <CIcon icon={cilPencil} />
          </CButton>

          <CButton
            size="sm"
            color="danger"
            onClick={() => handleDelete(row.id)}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </>
      ),
    },
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Data Forecast</strong>
            <CButton
              color="primary"
              className="float-end"
              onClick={() => navigate("/forecast/add")}
            >
              + Tambah
            </CButton>
          </CCardHeader>

          <CCardBody>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  placeholder="Cari customer atau bulan..."
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
                rows: { style: { minHeight: '56px' } },
                cells: { style: { paddingTop: '12px', paddingBottom: '12px', fontSize: '14px' } },
                headRow: { style: { backgroundColor: '#007bff' } },
                headCells: { style: { color: 'white', fontWeight: '600', fontSize: '14px' } },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Forecast;
