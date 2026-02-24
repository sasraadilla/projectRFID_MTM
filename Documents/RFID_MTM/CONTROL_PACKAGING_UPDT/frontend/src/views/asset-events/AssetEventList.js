import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AssetEventList = () => {
  const [events, setEvents] = useState([]);

  // ========================
  // LOAD ASSET EVENTS
  // ========================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/asset-events");
        setEvents(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data asset event", "error");
      }
    };

    fetchEvents();
  }, []);

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong className="fs-5">History Asset IN / OUT</strong>
          </CCardHeader>

          <CCardBody>
            <CTable bordered hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Waktu Scan</CTableHeaderCell>
                  <CTableHeaderCell>RFID</CTableHeaderCell>
                  <CTableHeaderCell>Kode Asset</CTableHeaderCell>
                  <CTableHeaderCell>Part</CTableHeaderCell>
                  <CTableHeaderCell>Packaging</CTableHeaderCell>
                  <CTableHeaderCell>Reader</CTableHeaderCell>
                  <CTableHeaderCell>Lokasi</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Scan By</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {events.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center">
                      Tidak ada data
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  events.map((e, index) => (
                    <CTableRow key={e.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{e.scan_time}</CTableDataCell>
                      <CTableDataCell>{e.rfid_tag}</CTableDataCell>
                      <CTableDataCell>{e.asset_code}</CTableDataCell>
                      <CTableDataCell>
                        {e.part_number} - {e.part_name}
                      </CTableDataCell>
                      <CTableDataCell>{e.packaging_name}</CTableDataCell>
                      <CTableDataCell>
                        {e.reader_code} - {e.reader_name}
                      </CTableDataCell>
                      <CTableDataCell>{e.location}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={e.event_type === "in" ? "success" : "danger"}>
                          {e.event_type.toUpperCase()}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{e.scanned_by_name}</CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AssetEventList;
