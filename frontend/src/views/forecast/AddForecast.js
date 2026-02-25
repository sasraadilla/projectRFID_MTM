import React, { useEffect, useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilCalculator } from '@coreui/icons'
import api from '../../api/axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import './ForecastGrid.css'

const AddForecast = () => {
  const navigate = useNavigate()

  const [bulan, setBulan] = useState('')
  const [tahun, setTahun] = useState(new Date().getFullYear().toString())
  const [customerId, setCustomerId] = useState('')

  const [customers, setCustomers] = useState([])
  const [parts, setParts] = useState([])
  const [packagings, setPackagings] = useState([])

  const [hariKerja, setHariKerja] = useState('')
  const fileInputRef = useRef(null)

  /* LOAD CUSTOMER & PACKAGINGS */
  useEffect(() => {
    api
      .get('/customers')
      .then((res) => setCustomers(res.data))
      .catch(console.error)

    api
      .get('/packagings')
      .then((res) => setPackagings(res.data))
      .catch(console.error)
  }, [])

  /* LOAD PART BY CUSTOMER */
  useEffect(() => {
    if (!customerId) {
      setParts([])
      return
    }

    api
      .get(`/parts/by-customer/${customerId}`)
      .then((res) => {
        const data = res.data.map((p) => ({
          id: p.id,
          part_number: p.part_number || '-', // Fallback if API hasn't mapped part_number yet
          part_name: p.part_name,
          packaging_id: p.packaging_id || '',
          forecast_month: '',
          actual_packaging: 0,
          lead_time: 0,
        }))
        setParts(data)
      })
      .catch(console.error)
  }, [customerId])

  const handleChange = (index, field, value) => {
    const updated = [...parts]
    updated[index][field] = value
    setParts(updated)
  }

  // Handle CSV Upload for easy input
  const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target.result
      const rows = text.split('\n').map(r => r.split(','))

      if (rows.length < 2) {
        Swal.fire('Error', 'Format CSV tidak valid atau kosong', 'error')
        return
      }

      // Very simple parsing: assuming Column 0 is Part Number/Name and Column 1 is Forecast QTY
      let updatedParts = [...parts]
      let matchCount = 0

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        if (row.length >= 2) {
          const identifier = row[0].trim()
          const qty = parseInt(row[1].trim(), 10)

          if (identifier && !isNaN(qty) && qty > 0) {
            // Try to match identifier with part_number or part_name (case insensitive)
            const pIndex = updatedParts.findIndex(p =>
              p.part_name.toLowerCase() === identifier.toLowerCase() ||
              p.part_number.toLowerCase() === identifier.toLowerCase()
            )

            if (pIndex !== -1) {
              updatedParts[pIndex].forecast_month = qty.toString()
              matchCount++
            }
          }
        }
      }

      setParts(updatedParts)
      Swal.fire('Berhasil', `${matchCount} part berhasil diisi dari CSV`, 'success')

      // Clear input so same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const triggerCSVUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!bulan || !tahun || !customerId) {
      Swal.fire('Warning', 'Bulan, Tahun, dan Customer wajib diisi', 'warning')
      return
    }

    if (!hariKerja || isNaN(hariKerja) || Number(hariKerja) <= 0) {
      Swal.fire('Warning', 'Jumlah Hari Kerja wajib diisi dengan angka valid', 'warning')
      return
    }

    let hasForecast = false

    // Validasi part
    for (const p of parts) {
      // Only require validation if they actually input a forecast
      if (p.forecast_month && Number(p.forecast_month) > 0) {
        hasForecast = true
        if (p.packaging_id === '' || p.packaging_id == null) {
          Swal.fire('Warning', `Part ${p.part_name} tidak punya packaging_id`, 'warning')
          return
        }
      }
    }

    if (!hasForecast) {
      Swal.fire('Warning', 'Harus ada minimal satu part yang diisi forecast-nya', 'warning')
      return
    }

    try {
      Swal.fire({
        title: 'Menyimpan...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      })

      const payload = {
        bulan,
        tahun,
        items: parts
          .filter(p => p.forecast_month && Number(p.forecast_month) > 0)
          .map((p) => ({
            part_id: p.id,
            packaging_id: p.packaging_id,
            forecast_month: Number(p.forecast_month),
            actual_packaging: Number(p.actual_packaging || 0),
            kalender_kerja: Number(hariKerja),
            lead_time: p.lead_time || 0,
          })),
      }

      await api.post('/forecast/bulk', payload)

      Swal.fire('Berhasil', 'Forecast berhasil disimpan', 'success')
      navigate('/forecast')
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Gagal menyimpan forecast', 'error')
    }
  }

  return (
    <div className="forecast-grid-container">
      <CCard className="premium-card mb-4 border-0 shadow-sm">
        <CCardBody className="p-4">

          <CRow className="mb-4 align-items-center">
            <CCol md={4} className="mb-3 mb-md-0">
              <h4 className="mb-0 fw-bold" style={{ color: '#0A3D7E' }}>Dashboard Kebutuhan</h4>
              <div className="text-muted small mt-1">Total {parts.length} Parts</div>
            </CCol>

            <CCol md={8}>
              <CRow className="g-2 justify-content-end">
                <CCol xs="auto">
                  <CFormSelect value={bulan} onChange={(e) => setBulan(e.target.value)} className="form-select-sm border-secondary shadow-sm">
                    <option value="">Pilih Bulan</option>
                    {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol xs="auto">
                  <CFormInput
                    placeholder="Tahun"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="form-control-sm border-secondary shadow-sm"
                    style={{ width: '80px' }}
                  />
                </CCol>

                <CCol xs="auto">
                  <CFormSelect value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-select-sm border-secondary shadow-sm" style={{ minWidth: '200px' }}>
                    <option value="">-- Pilih Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.customer_name}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol xs="auto" className="d-flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleCSVUpload} accept=".csv" style={{ display: 'none' }} />
                  <CButton color="primary" onClick={triggerCSVUpload} className="btn-sm px-3 d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#2563eb', border: 'none' }}>
                    <CIcon icon={cilCloudUpload} /> Input CSV
                  </CButton>
                  <CButton color="success" onClick={handleSubmit} className="btn-sm px-3 d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#10b981', border: 'none', color: '#fff' }}>
                    <CIcon icon={cilCalculator} /> Simpan Forecast
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
          </CRow>

          {customerId ? (
            <div className="table-responsive forecast-table-wrapper rounded" style={{ border: '1px solid #e2e8f0' }}>
              <table className="table table-bordered table-hover align-middle mb-0 forecast-table">
                <thead>
                  <tr>
                    <th rowSpan="2" className="text-start px-3" style={{ width: '150px' }}>PART NUMBER</th>
                    <th rowSpan="2" className="text-start px-3" style={{ width: '300px' }}>PART NAME</th>
                    <th colSpan="2" className="text-center col-packaging">PACKAGING</th>
                    <th className="text-center col-year">
                      {bulan ? bulan.toUpperCase() : 'BULAN'} {tahun}
                    </th>
                  </tr>

                  <tr>
                    <th className="text-center sub-header" style={{ width: '160px' }}>JENIS</th>
                    <th className="text-center sub-header" style={{ width: '80px' }}>QTY (Pack)</th>
                    <th className="text-center header-input-cell">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <span className="sub-header">HARI KERJA:</span>
                        <input
                          type="number"
                          className="form-control text-center days-input shadow-sm"
                          placeholder="0"
                          title="Hari Kerja"
                          value={hariKerja}
                          onChange={(e) => setHariKerja(e.target.value)}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">Aset Part tidak ditemukan untuk customer ini.</td>
                    </tr>
                  ) : (
                    parts.map((p, i) => {
                      // Find the selected packaging object to display its capacity (qty)
                      const selectedPkg = packagings.find(pkg => pkg.id.toString() === p.packaging_id?.toString())
                      const pkgCapacity = selectedPkg ? selectedPkg.kapasitas_packaging : '-'

                      return (
                        <tr key={p.id}>
                          <td className="text-start px-3 text-muted fw-bold">{p.part_number}</td>
                          <td className="text-start px-3 fw-medium text-dark">{p.part_name}</td>
                          <td className="text-center p-1">
                            <select
                              className="form-select form-select-sm border-0 bg-transparent text-muted small px-1"
                              value={p.packaging_id || ''}
                              onChange={(e) => handleChange(i, 'packaging_id', e.target.value)}
                              title="Pilih Packaging"
                              style={{ width: '100%', minWidth: '120px' }}
                            >
                              <option value="">--Pilih--</option>
                              {packagings.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.packaging_name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="text-center text-muted small fw-bold text-primary">{pkgCapacity}</td>
                          <td className="input-cell p-0">
                            <input
                              type="number"
                              className="w-100 h-100 text-center border-0 forecast-input m-0"
                              placeholder="0"
                              value={p.forecast_month}
                              onChange={(e) => handleChange(i, 'forecast_month', e.target.value)}
                            />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-5 rounded" style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <CIcon icon={cilCloudUpload} size="3xl" className="mb-3 text-secondary opacity-50" />
              <p className="mb-0 fs-5">Silakan pilih <strong>Customer</strong> terlebih dahulu <br /> untuk menampilkan form Kebutuhan Packaging.</p>
            </div>
          )}

        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddForecast
