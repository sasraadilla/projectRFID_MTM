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

const ActualPackaging = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const res = await api.get("/actual-packaging");
      setData(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data actual packaging", "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data actual akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await api.delete(`/actual-packaging/${id}`);
      Swal.fire("Berhasil", "Data dihapus", "success");
      loadData();
    }
  };

  const filtered = data.filter(d =>
    d.part_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Part", selector: row => row.part_name },
    { name: "Qty Actual", selector: row => row.qty_actual },
    { name: "Tanggal", selector: row => row.tanggal },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton
            size="sm"
            color="warning"
            className="me-2"
            onClick={() => navigate(`/actual-packaging/edit/${row.id}`)}
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
          <CCardHeader><strong>Actual Packaging</strong></CCardHeader>
          <CCardBody>

            <CButton
              color="primary"
              onClick={() => navigate("/actual-packaging/add")}
            >
              + Tambah
            </CButton>

            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari part..."
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

export default ActualPackaging;
