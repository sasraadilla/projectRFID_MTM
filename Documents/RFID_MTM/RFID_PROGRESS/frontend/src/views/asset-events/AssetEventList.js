import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CBadge } from '@coreui/react'
import DataTable from 'react-data-table-component'
import api from '../../api/axios'
import Swal from 'sweetalert2'

const AssetEventList = () => {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const dummyData = [
          {
            rfid_tag: 'RFID-1001',
            asset_code: 'TROL-AHM-001',
            part_number: 'AHM-001',
            part_name: 'Engine Cover',
            packaging_name: 'Trolley',
            reader_code: 'GATE-01',
            reader_name: 'Gate Inbound',
            location: 'Warehouse A',
            event_type: 'in',
            scanned_by_name: 'Admin',
            scan_time: new Date().toISOString(),
          },
          {
            rfid_tag: 'RFID-1002',
            asset_code: 'BOX-DEN-001',
            part_number: 'DEN-002',
            part_name: 'Sensor Body',
            packaging_name: 'Box Plastik',
            reader_code: 'GATE-02',
            reader_name: 'Gate Outbound',
            location: 'Customer Plant',
            event_type: 'out',
            scanned_by_name: 'Supervisi',
            scan_time: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            rfid_tag: 'RFID-1003',
            asset_code: 'PAL-GSB-001',
            part_number: 'GSB-050',
            part_name: 'Battery Case',
            packaging_name: 'Pallet Kayu',
            reader_code: 'GATE-01',
            reader_name: 'Gate Inbound',
            location: 'Repair Shop',
            event_type: 'in',
            scanned_by_name: 'Operator 1',
            scan_time: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            rfid_tag: 'RFID-1004',
            asset_code: 'BSK-SHW-005',
            part_number: 'SHW-100',
            part_name: 'Shock Absorber',
            packaging_name: 'Keranjang',
            reader_code: 'GATE-03',
            reader_name: 'Station 1',
            location: 'Warehouse B',
            event_type: 'in',
            scanned_by_name: 'Admin',
            scan_time: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            rfid_tag: 'RFID-1005',
            asset_code: 'PAL-AKE-002',
            part_number: 'AKE-200',
            part_name: 'Brake Pad',
            packaging_name: 'Pallet Besi',
            reader_code: 'GATE-02',
            reader_name: 'Gate Outbound',
            location: 'In Transit',
            event_type: 'out',
            scanned_by_name: 'System',
            scan_time: new Date(Date.now() - 172800000).toISOString(),
          },
        ]
        setEvents(dummyData)
      } catch {
        Swal.fire('Error', 'Gagal mengambil data asset event', 'error')
      }
    }
    fetchEvents()
  }, [])

  const filtered = search
    ? events.filter(
        (e) =>
          (e.asset_code || '').toLowerCase().includes(search.toLowerCase()) ||
          (e.rfid_tag || '').toLowerCase().includes(search.toLowerCase()) ||
          (e.part_name || '').toLowerCase().includes(search.toLowerCase()) ||
          (e.reader_name || '').toLowerCase().includes(search.toLowerCase()),
      )
    : events

  const formatDateTime = (val) => (val ? val.replace('T', ' ').substring(0, 16) : '-')

  const columns = [
    { name: 'No', cell: (_, i) => i + 1, width: '70px' },

    {
      name: 'Waktu Scan',
      selector: (row) => formatDateTime(row.scan_time),
      width: '150px',
    },

    { name: 'RFID', selector: (row) => row.rfid_tag, wrap: true },

    { name: 'Kode Asset', selector: (row) => row.asset_code, wrap: true },

    {
      name: 'Part',
      selector: (row) => `${row.part_number} - ${row.part_name}`,
      wrap: true,
      grow: 2,
    },

    {
      name: 'Packaging',
      selector: (row) => row.packaging_name,
      wrap: true,
    },

    {
      name: 'Reader',
      selector: (row) => `${row.reader_code} - ${row.reader_name}`,
      wrap: true,
      grow: 2,
    },

    {
      name: 'Lokasi',
      selector: (row) => row.location,
      wrap: true,
    },

    {
      name: 'Status',
      cell: (row) => (
        <CBadge color={row.event_type === 'in' ? 'success' : 'danger'}>
          {row.event_type.toUpperCase()}
        </CBadge>
      ),
      width: '110px',
    },

    {
      name: 'Scan By',
      selector: (row) => row.scanned_by_name,
      wrap: true,
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>History Asset IN / OUT</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol xs={12} md={4} className="ms-auto">
                <CFormInput
                  className="my-3"
                  placeholder="Cari RFID / asset / part / reader..."
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
              dense={false}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AssetEventList
