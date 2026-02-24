import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CButton, CRow, CCol, CFormInput
} from "@coreui/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import Swal from "sweetalert2";
import {
  getPackagingTypes,
  deletePackagingType
} from "../../api/packagingType";

const PackagingType = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const res = await getPackagingTypes();
      setData(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data", "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await deletePackagingType(id);
      Swal.fire("Berhasil", "Data dihapus", "success");
      loadData();
    }
  };

  const filtered = data.filter(d =>
    d.type_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Type Packaging", selector: row => row.type_name },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton
            size="sm"
            color="warning"
            className="me-2"
            onClick={() => navigate(`/packaging-type/edit/${row.id}`)}
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
            <strong>Packaging Type</strong>
          </CCardHeader>
          <CCardBody>

            <CButton
              color="primary"
              onClick={() => navigate("/packaging-type/add")}
            >
              + Tambah
            </CButton>

            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari type..."
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

export default PackagingType;
