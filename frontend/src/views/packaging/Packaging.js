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
import { cilPencil, cilTrash } from "@coreui/icons";
import api from "../../api/axios";
import Swal from "sweetalert2";

const Packaging = () => {
  const navigate = useNavigate();
  const [packagings, setPackagings] = useState([]);
  const [search, setSearch] = useState("");

  const loadPackagings = async () => {
    try {
      const res = await api.get("/packagings");
      setPackagings(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data packaging", "error");
    }
  };

  useEffect(() => {
    loadPackagings();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data packaging akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await api.delete(`/packagings/${id}`);
      Swal.fire("Berhasil", "Packaging dihapus", "success");
      loadPackagings();
    }
  };

  const filtered = packagings.filter(p =>
    p.packaging_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Nama Packaging", selector: row => row.packaging_name },
     { name: "Kapasitas", selector: row => row.kapasitas_packaging },
    { name: "Tipe", selector: row => row.packaging_type },
    { name: "Warna", selector: row => row.warna },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton size="sm" color="warning" className="me-2"
            onClick={() => navigate(`/packaging/edit/${row.id}`)}>
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton size="sm" color="danger"
            onClick={() => handleDelete(row.id)}>
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
          <CCardHeader>
            <strong>Data Packaging</strong>
          </CCardHeader>
          <CCardBody>

            <CButton
              color="primary"
              onClick={() => navigate("/packaging/add")}
            >
              + Tambah
            </CButton>

            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari packaging..."
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

export default Packaging;
