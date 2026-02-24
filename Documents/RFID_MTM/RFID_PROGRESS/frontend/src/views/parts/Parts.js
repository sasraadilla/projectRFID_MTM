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
import Swal from "sweetalert2";
import api from "../../api/axios";

const Part = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");

  const loadParts = async () => {
    try {
      const res = await api.get("/parts");
      setParts(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data part", "error");
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Part akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/parts/${id}`);
        Swal.fire("Berhasil", "Part berhasil dihapus", "success");
        loadParts();
      } catch {
        Swal.fire("Error", "Gagal menghapus part", "error");
      }
    }
  };

  const filtered = parts.filter(
    (p) =>
      p.part_number.toLowerCase().includes(search.toLowerCase()) ||
      p.part_name.toLowerCase().includes(search.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Part Number", selector: (row) => row.part_number },
    { name: "Part Name", selector: (row) => row.part_name },
    { name: "Customer", selector: (row) => row.customer_name },
    { name: "Qty / Pack", selector: (row) => row.qty_per_pack },
    { name: "Keterangan", selector: (row) => row.keterangan },
    {
      name: "Aksi",
      cell: (row) => (
        <>
          <CButton
            size="sm"
            color="warning"
            className="me-2"
            onClick={() => navigate(`/parts/edit/${row.id}`)}
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
            <strong>Data Part</strong>
          </CCardHeader>

          <CCardBody>
            <CButton color="primary" onClick={() => navigate("/parts/add")}>
              + Tambah
            </CButton>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari part..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

export default Part;
