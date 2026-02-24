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

const Customer = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const loadCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data customer", "error");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Customer akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await api.delete(`/customers/${id}`);
      Swal.fire("Berhasil", "Customer dihapus", "success");
      loadCustomers();
    }
  };

  const filtered = customers.filter(c =>
    c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "No", cell: (_, i) => i + 1, width: "70px" },
    { name: "Kode", selector: row => row.customer_code },
    { name: "Nama Customer", selector: row => row.customer_name },
    {
      name: "Aksi",
      cell: row => (
        <>
          <CButton size="sm" color="warning" className="me-2"
            onClick={() => navigate(`/customer/edit/${row.id}`)}>
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
          <CCardHeader><strong>Data Customer</strong></CCardHeader>
          <CCardBody>

            <CButton color="primary" onClick={() => navigate("/customer/add")}>
              + Tambah
            </CButton>
            
            {/* SEARCH */}
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari customer..."
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
                    minHeight: '56px',
                  },
                },
                cells: {
                  style: {
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    fontSize: '14px',
                  },
                },
                headRow: {
                  style: {
                    backgroundColor: '#007bff',
                  },
                },
                headCells: {
                  style: {
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
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

export default Customer;
