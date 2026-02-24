import React, { useEffect, useState } from "react";
import {
  CCard, CCardBody, CCardHeader, CButton,
  CRow, CCol, CFormInput
} from "@coreui/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import api from "../../api/axios";
import Swal from "sweetalert2";

const Repair = () => {
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [search, setSearch] = useState("");

  const loadRepairs = async () => {
    try {
      const res = await api.get("/repairs");
      setRepairs(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data repair", "error");
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  const handleFinish = async (id) => {
    const result = await Swal.fire({
      title: "Selesaikan repair?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, selesai",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/repairs/${id}/finish`);
        Swal.fire("Berhasil", "Repair selesai", "success");
        loadRepairs();
      } catch (err) {
        Swal.fire(
          "Gagal",
          err.response?.data?.message || "Gagal menyelesaikan repair",
          "error"
        );
      }
    }
  };

  const filtered = repairs.filter(r =>
    r.asset_code.toLowerCase().includes(search.toLowerCase()) ||
    r.repair_type.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Asset Code", selector: row => row.asset_code, wrap: true },
    { name: "Repair Type", selector: row => row.repair_type, wrap: true },
    { name: "Location", selector: row => row.location, wrap: true },
    { name: "Notes", selector: row => row.notes, wrap: true },
    {
      name: "Status",
      cell: row => (
        row.status === "ongoing" ? (
          <span className="badge bg-warning text-dark">ONGOING</span>
        ) : (
          <span className="badge bg-success">FINISHED</span>
        )
      ),
      center: true
    },
    {
      name: "Repair Date",
      selector: row => {
        if (!row.repair_date) return "-";
        return row.repair_date.replace("T", " ").substring(0, 16);
      }
    },
    {
      name: "Finished At",
      selector: row =>
        row.finished_at
          ? row.finished_at.split("T")[0]
          : "-"
    },
    {
      name: "Aksi",
      cell: row => (
        row.status === "ongoing" ? (
          <CButton
            size="sm"
            color="success"
            onClick={() => handleFinish(row.id)}
          >
            <CIcon icon={cilCheck} /> Selesai
          </CButton>
        ) : "-"
      )
    }
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader><strong>Data Repair</strong></CCardHeader>
          <CCardBody>

            <CButton color="primary" onClick={() => navigate("/repair/add")}>
              + Tambah Repair
            </CButton>

            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari repair..."
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
                    whiteSpace: "normal",   
                    wordBreak: "break-word",
                    lineHeight: "1.4",
                    paddingTop: "10px",
                    paddingBottom: "10px",
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

export default Repair;
