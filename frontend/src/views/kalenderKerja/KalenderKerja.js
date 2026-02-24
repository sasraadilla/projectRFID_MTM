import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader, CButton,
  CRow, CCol, CFormInput
} from "@coreui/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import api from "../../api/axios";
import Swal from "sweetalert2";

const KalenderKerja = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const res = await api.get("/kalender-kerja");
      setData(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data kalender kerja", "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data kalender kerja akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await api.delete(`/kalender-kerja/${id}`);
      Swal.fire("Berhasil", "Data dihapus", "success");
      loadData();
    }
  };

  const filtered = data.filter(d =>
    d.bulan.toLowerCase().includes(search.toLowerCase()) ||
    d.tahun.toString().includes(search)
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Bulan", selector: row => row.bulan },
    { name: "Tahun", selector: row => row.tahun },
    { name: "Hari Kerja", selector: row => row.hari_kerja },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton
            size="sm"
            color="warning"
            className="me-2"
            onClick={() => navigate(`/kalender-kerja/edit/${row.id}`)}
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
      )
    }
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader><strong>Kalender Kerja</strong></CCardHeader>
          <CCardBody>

            <CButton color="primary" onClick={() => navigate("/kalender-kerja/add")}>
              + Tambah
            </CButton>

            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari bulan / tahun..."
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

export default KalenderKerja;
