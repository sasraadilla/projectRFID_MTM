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

const Reader = () => {
  const navigate = useNavigate();
  const [readers, setReaders] = useState([]);
  const [search, setSearch] = useState("");

  const loadReaders = async () => {
    try {
      const res = await api.get("/readers");
      setReaders(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data reader", "error");
    }
  };

  useEffect(() => {
    loadReaders();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Reader akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await api.delete(`/readers/${id}`);
      Swal.fire("Berhasil", "Reader dihapus", "success");
      loadReaders();
    }
  };

  const filtered = readers.filter(r =>
    r.reader_name.toLowerCase().includes(search.toLowerCase()) ||
    r.reader_code.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Kode Reader", selector: row => row.reader_code },
    { name: "Nama Reader", selector: row => row.reader_name },
    { name: "Lokasi", selector: row => row.location },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton
            size="sm"
            color="warning"
            className="me-2"
            onClick={() => navigate(`/reader/edit/${row.id}`)}
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
          <CCardHeader><strong>Data Reader</strong></CCardHeader>
          <CCardBody>

            <CButton color="primary" onClick={() => navigate("/reader/add")}>
              + Tambah
            </CButton>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari reader..."
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

export default Reader;
