import React, { useEffect, useState, useCallback } from "react";
import {
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CSpinner,
} from "@coreui/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilPlus, cilSearch, cilLayers } from "@coreui/icons";
import Swal from "sweetalert2";
import api from "../../api/axios";

const Part = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadParts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/parts");
      setParts(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data part", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Inject custom font
    const font = document.createElement('link');
    font.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    font.rel = 'stylesheet';
    document.head.appendChild(font);

    const style = document.createElement('style');
    style.innerHTML = `* { font-family: 'Plus Jakarta Sans', sans-serif !important; }`;
    document.head.appendChild(style);

    loadParts();

    return () => {
      document.head.removeChild(font);
      document.head.removeChild(style);
    };
  }, [loadParts]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data part ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      borderRadius: '15px'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/parts/${id}`);
        Swal.fire({
          title: "Berhasil!",
          text: "Data part telah dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          borderRadius: '15px'
        });
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
    {
      name: "NO",
      cell: (_, i) => i + 1,
      width: "70px",
      center: true,
      style: { fontWeight: '700', color: '#64748b' }
    },
    {
      name: "PART NUMBER",
      selector: (row) => row.part_number,
      sortable: true,
      cell: (row) => (
        <span style={{ fontWeight: '800', color: '#1e293b', letterSpacing: '-0.3px' }}>
          {row.part_number}
        </span>
      )
    },
    {
      name: "PART NAME",
      selector: (row) => row.part_name,
      sortable: true,
      cell: (row) => (
        <span style={{ fontWeight: '600', color: '#475569' }}>
          {row.part_name}
        </span>
      )
    },
    {
      name: "CUSTOMER",
      selector: (row) => row.customer_name,
      sortable: true,
      cell: (row) => (
        <span style={{
          backgroundColor: '#eff6ff',
          color: '#1d4ed8',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          {row.customer_name}
        </span>
      )
    },
    {
      name: "PACKING TYPE",
      selector: (row) => row.packing_type,
      sortable: true,
      cell: (row) => <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{row.packing_type || '-'}</span>
    },
    {
      name: "ISI",
      selector: (row) => row.qty_per_pack,
      width: "60px",
      center: true,
      cell: (row) => <span style={{ fontWeight: '700' }}>{row.qty_per_pack}</span>
    },
    {
      name: "OCT-25",
      selector: (row) => row.oct_25,
      width: "80px",
      center: true,
      cell: (row) => <span style={{ color: '#475569', fontWeight: '600' }}>{row.oct_25.toLocaleString()}</span>
    },
    {
      name: "NOV-25",
      selector: (row) => row.nov_25,
      width: "80px",
      center: true,
      cell: (row) => <span style={{ color: '#475569', fontWeight: '600' }}>{row.nov_25.toLocaleString()}</span>
    },
    {
      name: "DEC-25",
      selector: (row) => row.dec_25,
      width: "80px",
      center: true,
      cell: (row) => <span style={{ color: '#475569', fontWeight: '600' }}>{row.dec_25.toLocaleString()}</span>
    },
    {
      name: "JAN-26",
      selector: (row) => row.jan_26,
      width: "80px",
      center: true,
      cell: (row) => <span style={{ color: '#475569', fontWeight: '600' }}>{row.jan_26.toLocaleString()}</span>
    },
    {
      name: "FEB-26",
      selector: (row) => row.feb_26,
      width: "80px",
      center: true,
      cell: (row) => <span style={{ color: '#475569', fontWeight: '600' }}>{row.feb_26.toLocaleString()}</span>
    },
    {
      name: "L/T",
      selector: (row) => row.lead_time,
      width: "60px",
      center: true,
      cell: (row) => <span style={{ fontWeight: '700', color: '#059669' }}>{row.lead_time}</span>
    },
    {
      name: "ACTUAL",
      selector: (row) => row.actual,
      width: "80px",
      center: true,
      cell: (row) => <span style={{ fontWeight: '700', color: '#dc2626' }}>{row.actual}</span>
    },
    {
      name: "AKSI",
      width: "100px",
      center: true,
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <CButton
            size="sm"
            color="warning"
            style={{
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              padding: 0,
              boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)'
            }}
            onClick={() => navigate(`/parts/edit/${row.id}`)}
          >
            <CIcon icon={cilPencil} size="sm" />
          </CButton>
          <CButton
            size="sm"
            color="danger"
            style={{
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              padding: 0,
              boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)'
            }}
            onClick={() => handleDelete(row.id)}
          >
            <CIcon icon={cilTrash} size="sm" />
          </CButton>
        </div>
      ),
    },
  ];

  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        minHeight: '50px',
      },
    },
    headCells: {
      style: {
        color: 'white',
        fontWeight: '800',
        fontSize: '0.8rem',
        letterSpacing: '0.5px',
      },
    },
    rows: {
      style: {
        minHeight: '60px',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#f1f5f9',
        },
      },
    },
    pagination: {
      style: {
        borderRadius: '0 0 12px 12px',
        borderTop: '1px solid #f1f5f9',
      }
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CIcon icon={cilLayers} size="xl" style={{ color: '#3b82f6' }} /> MASTER DATA PART
          </h4>
          <p style={{ color: '#64748b', margin: '5px 0 0 0', fontWeight: '500' }}>Manajemen daftar Part Number dan Part Name</p>
        </div>
        <CButton
          color="primary"
          onClick={() => navigate("/parts/add")}
          style={{
            borderRadius: '12px',
            padding: '10px 24px',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CIcon icon={cilPlus} /> TAMBAH PART BARU
        </CButton>
      </div>

      <CCard style={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <CCardBody style={{ padding: '25px' }}>
          {/* Search Section */}
          <div style={{ position: 'relative', marginBottom: '25px', maxWidth: '400px' }}>
            <CIcon icon={cilSearch} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <CFormInput
              style={{
                padding: '12px 12px 12px 45px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              placeholder="Cari berdasarkan Part Number, Name, atau Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            pagination
            striped
            highlightOnHover
            responsive
            progressPending={loading}
            progressComponent={<CSpinner color="primary" />}
            customStyles={customTableStyles}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Part;
