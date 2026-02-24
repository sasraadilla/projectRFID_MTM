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
import { getAssets, deleteAsset } from "../../api/assets";

const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");

  const loadAssets = async () => {
    try {
      const res = await getAssets();
      setAssets(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data asset", "error");
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Asset akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await deleteAsset(id);
      Swal.fire("Berhasil", "Asset berhasil dihapus", "success");
      loadAssets();
    }
  };

  const filtered = assets.filter((a) =>
    a.asset_code.toLowerCase().includes(search.toLowerCase()) ||
    a.rfid_tag.toLowerCase().includes(search.toLowerCase()) ||
    a.part_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "RFID", selector: (row) => row.rfid_tag },
    { name: "Kode Asset", selector: (row) => row.asset_code },
    { name: "Part", selector: (row) => row.part_name },
    { name: "Packaging", selector: (row) => row.packaging_name },
    { name: "Status", selector: (row) => row.status },
    {
      name: "Aksi",
      cell: (row) => (
        <>
          <CButton
            size="sm"
            color="warning"
            className="me-2"
            onClick={() => navigate(`/assets/edit/${row.id}`)}
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
            <strong>Data Assets</strong>
          </CCardHeader>
          <CCardBody>
            <CButton color="primary" onClick={() => navigate("/assets/add")}>
              + Tambah
            </CButton>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari asset..."
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

export default Assets;
