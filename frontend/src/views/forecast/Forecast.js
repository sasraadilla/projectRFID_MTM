import React, { useEffect, useState, useMemo, useRef } from 'react'
import { CCard, CCardBody, CButton, CRow, CCol, CFormSelect, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilCalculator } from '@coreui/icons'
import api from '../../api/axios'
import Swal from 'sweetalert2'
import './ForecastGrid.css'

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const Forecast = () => {
  const [bulan, setBulan] = useState('')
  const [tahun, setTahun] = useState(new Date().getFullYear().toString())
  const [customerId, setCustomerId] = useState('')

  const [customers, setCustomers] = useState([])
  const [parts, setParts] = useState([])
  const [packagings, setPackagings] = useState([])

  const [workingDays, setWorkingDays] = useState({})
  const [forecastData, setForecastData] = useState({})

  // Results mapping for each part
  const [isCalculated, setIsCalculated] = useState(false)
  const [resultsByPart, setResultsByPart] = useState({})

  const fileInputRef = useRef(null)

  const loadData = async () => {
    try {
      const [custRes, packRes] = await Promise.all([api.get('/customers'), api.get('/packagings')])
      setCustomers(custRes.data)
      setPackagings(packRes.data)
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Gagal memuat data opsi dropdown', 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!customerId) {
      setParts([])
      setForecastData({})
      setIsCalculated(false)
      setResultsByPart({})
      return
    }

    api
      .get(`/parts/by-customer/${customerId}`)
      .then((res) => {
        const formattedParts = res.data.map((p) => ({
          id: p.id,
          part_number: p.part_number || '-',
          part_name: p.part_name,
          customer_name:
            customers.find((c) => c.id.toString() === customerId)?.customer_name || '-',
          packaging_id: p.packaging_id || null,
        }))
        setParts(formattedParts)
        setForecastData({})
        setIsCalculated(false)
        setResultsByPart({})
      })
      .catch(console.error)
  }, [customerId, customers])

  // Based on user feedback: "buat sampai desember"
  // We will generate the header columns from the selected month exactly up to December of that year.
  const months = useMemo(() => {
    const startMonthIndex = MONTH_NAMES.indexOf(bulan)
    if (startMonthIndex === -1 || !tahun) return []

    const result = []
    const startYear = parseInt(tahun, 10)

    // Generate months from startMonth up to December (index 11)
    const totalMonths = 12 - startMonthIndex

    for (let i = 0; i < totalMonths; i++) {
      let d = new Date(startYear, startMonthIndex + i, 1)
      result.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        monthString: MONTH_NAMES[d.getMonth()],
      })
    }
    return result
  }, [bulan, tahun])

  const yearsGroup = useMemo(() => {
    const groups = {}
    months.forEach((m) => {
      if (!groups[m.year]) groups[m.year] = 0
      groups[m.year]++
    })
    return groups
  }, [months])

  const handleWorkingDaysChange = (key, val) => {
    setWorkingDays((prev) => ({ ...prev, [key]: val }))
  }

  const handleForecastChange = (partId, key, val) => {
    setForecastData((prev) => ({ ...prev, [`${partId}_${key}`]: val }))
  }

  const handlePackagingChange = (partIndex, val) => {
    const updatedParts = [...parts]
    updatedParts[partIndex].packaging_id = val
    setParts(updatedParts)
  }

  const triggerCSVUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!bulan || !tahun || !customerId) {
      Swal.fire('Warning', 'Pilih Bulan, Tahun, dan Customer sebelum mengupload CSV', 'warning')
      e.target.value = ''
      return
    }

    if (months.length === 0) return

    const startMonthKey = months[0].key

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target.result
      const rows = text.split('\n').map((r) => r.split(','))

      if (rows.length < 2) {
        Swal.fire('Error', 'Format CSV tidak valid atau kosong', 'error')
        return
      }

      let matchCount = 0
      let newForecastData = { ...forecastData }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        if (row.length >= 2) {
          const identifier = row[0].trim()
          const qty = parseInt(row[1].trim(), 10)

          if (identifier && !isNaN(qty) && qty > 0) {
            const part = parts.find(
              (p) =>
                p.part_name.toLowerCase() === identifier.toLowerCase() ||
                p.part_number.toLowerCase() === identifier.toLowerCase(),
            )

            if (part) {
              const cellKey = `${part.id}_${startMonthKey}`
              newForecastData[cellKey] = qty.toString()
              matchCount++
            }
          }
        }
      }

      setForecastData(newForecastData)
      Swal.fire(
        'Berhasil',
        `${matchCount} part berhasil diisi start bulan ${bulan} ${tahun} dari CSV`,
        'success',
      )

      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  const fetchCalculation = async () => {
    try {
      let url = `/forecast/calc?month=${bulan}&year=${tahun}&customer_id=${customerId}`
      const res = await api.get(url)

      // Map the calculation results by part name
      // (because backend `/calc` endpoint maps via part_name right now)
      const mappedResults = {}
      if (res.data && res.data.finalResult) {
        res.data.finalResult.forEach((item) => {
          // Find matching part in parts array
          const matchingPart = parts.find((p) => p.part_name === item.part)
          if (matchingPart) {
            // Find LT values if available from the backend leadTime array
            const ltItem = res.data.leadTime.find((lt) => lt.part === item.part)

            mappedResults[matchingPart.id] = {
              calc: item.calc,
              actual: item.actual,
              diff: item.diff,
              ltProduksi: ltItem ? ltItem.ltProduksi : 0,
              ltStore: ltItem ? ltItem.ltStore : 0,
              ltCustomer: ltItem ? ltItem.ltCustomer : 0,
            }
          }
        })
      }

      setResultsByPart(mappedResults)
      setIsCalculated(true)
    } catch (err) {
      console.error('Gagal hitung forecast', err)
      Swal.fire('Error', 'Gagal memuat hasil kalkulasi', 'error')
    }
  }

  const handleHitung = async () => {
    if (!bulan || !tahun || !customerId) {
      Swal.fire('Warning', 'Bulan, Tahun, dan Customer wajib diisi', 'warning')
      return
    }

    const bulkItemsByMonth = {}
    let hasData = false

    for (const p of parts) {
      if (!p.packaging_id) continue

      for (const m of months) {
        const fKey = `${p.id}_${m.key}`
        const fValue = forecastData[fKey]

        if (fValue && fValue !== '' && Number(fValue) > 0) {
          hasData = true

          if (!bulkItemsByMonth[m.key]) {
            bulkItemsByMonth[m.key] = {
              bulan: m.monthString,
              tahun: m.year.toString(),
              items: [],
            }
          }

          bulkItemsByMonth[m.key].items.push({
            part_id: p.id,
            packaging_id: p.packaging_id,
            forecast_month: Number(fValue),
            kalender_kerja: workingDays[m.key] ? Number(workingDays[m.key]) : 20,
            actual_packaging: 0,
            lead_time: 0,
          })
        }
      }
    }

    // If no values > 0 were inputted, bypass saving and just fetch existing calculation
    try {
      Swal.fire({
        title: hasData ? 'Menyimpan & Menghitung...' : 'Menghitung...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      })

      if (hasData) {
        const payloadKeys = Object.keys(bulkItemsByMonth)
        const requests = payloadKeys.map((key) => {
          return api.post('/forecast/bulk', bulkItemsByMonth[key])
        })
        await Promise.all(requests)
      }

      await fetchCalculation()

      Swal.close()
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Gagal menyimpan kalkulasi.', 'error')
    }
  }

  const renderJudgment = (calcData) => {
    if (!calcData) return { label: '', colorClass: '', val: '' }

    // Backend diff calculation: (actual) - (totalNeed)
    // Excel logic: "Kurang" is positive missing value, "Lebih" is negative missing value.
    const displayDiff = -calcData.diff

    if (displayDiff > 0) {
      return {
        label: 'Kurang',
        colorClass: 'bg-danger text-white border-bottom-0',
        val: displayDiff,
      }
    } else if (displayDiff < 0) {
      return {
        label: 'Lebih',
        colorClass: 'bg-success text-white border-bottom-0',
        val: displayDiff,
      }
    }

    return { label: 'Pass', colorClass: 'bg-transparent text-dark border-bottom-0', val: 0 }
  }

  return (
    <div className="forecast-grid-container">
      <CCard className="premium-card mb-4 border-0 shadow-sm">
        <CCardBody className="p-4" style={{ overflowX: 'auto', paddingRight: '20px' }}>
          <CRow className="mb-4 align-items-center" style={{ minWidth: '1500px' }}>
            <CCol md={4} className="mb-3 mb-md-0">
              <h4 className="mb-0 fw-bold" style={{ color: '#0A3D7E' }}>
                Dashboard Kebutuhan
              </h4>
              <div className="text-muted small mt-1">Total {parts.length} Parts</div>
            </CCol>

            <CCol md={8}>
              <CRow className="g-2 justify-content-end align-items-center">
                <CCol xs="auto">
                  <CFormSelect
                    value={bulan}
                    onChange={(e) => {
                      setBulan(e.target.value)
                      setIsCalculated(false)
                    }}
                    className="form-select-sm border-secondary shadow-sm"
                    style={{ width: '130px' }}
                  >
                    <option value="">Pilih Bulan</option>
                    {MONTH_NAMES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol xs="auto">
                  <CFormInput
                    placeholder="Tahun"
                    value={tahun}
                    onChange={(e) => {
                      setTahun(e.target.value)
                      setIsCalculated(false)
                    }}
                    className="form-control-sm border-secondary shadow-sm"
                    style={{ width: '90px' }}
                  />
                </CCol>

                <CCol xs="auto">
                  <CFormSelect
                    value={customerId}
                    onChange={(e) => {
                      setCustomerId(e.target.value)
                      setIsCalculated(false)
                    }}
                    className="form-select-sm border-secondary shadow-sm"
                    style={{ minWidth: '220px' }}
                  >
                    <option value="">-- Pilih Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.customer_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol xs="auto" className="d-flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCSVUpload}
                    accept=".csv"
                    style={{ display: 'none' }}
                  />
                  <CButton
                    color="primary"
                    onClick={triggerCSVUpload}
                    className="btn-sm px-3 d-flex align-items-center gap-2 shadow-sm"
                    style={{ backgroundColor: '#2563eb', border: 'none' }}
                  >
                    <CIcon icon={cilCloudUpload} /> Input CSV
                  </CButton>
                  <CButton
                    color="success"
                    onClick={handleHitung}
                    className="btn-sm px-3 d-flex align-items-center gap-2 shadow-sm"
                    style={{ backgroundColor: '#10b981', border: 'none', color: '#fff' }}
                  >
                    <CIcon icon={cilCalculator} /> Hitung
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
          </CRow>

          {!bulan || !tahun || !customerId ? (
            <div
              className="text-center text-muted py-5 rounded mt-4"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                minWidth: '1500px',
              }}
            >
              <CIcon icon={cilCloudUpload} size="3xl" className="mb-3 text-secondary opacity-50" />
              <p className="mb-0 fs-5">
                Silakan pilih <strong>Bulan, Tahun, dan Customer</strong> terlebih dahulu <br />{' '}
                untuk menampilkan Dashboard Kebutuhan Packaging.
              </p>
            </div>
          ) : (
            <div
              className="table-responsive forecast-table-wrapper rounded"
              style={{ border: '1px solid #e2e8f0', display: 'inline-block', minWidth: '100%' }}
            >
              <table className="table table-bordered table-hover align-middle mb-0 forecast-table">
                <thead>
                  {/* ROW 1: Years and Calculation Headers */}
                  <tr>
                    <th rowSpan="3" className="col-part text-start px-3" style={{ width: '150px' }}>
                      PART NUMBER
                    </th>
                    <th rowSpan="3" className="col-name text-start px-3" style={{ width: '250px' }}>
                      PART NAME
                    </th>
                    <th
                      rowSpan="3"
                      className="col-customer text-start px-3"
                      style={{ width: '250px' }}
                    >
                      CUSTOMER
                    </th>
                    <th colSpan="2" className="col-packaging text-center">
                      PACKAGING
                    </th>

                    {Object.entries(yearsGroup).map(([year, span]) => (
                      <th
                        key={year}
                        colSpan={span}
                        className="col-year text-center text-warning"
                        style={{ backgroundColor: '#ffea00', color: '#000' }}
                      >
                        FORECAST (pcs)/month {year}
                      </th>
                    ))}

                    <th
                      colSpan="3"
                      className="text-center"
                      style={{ backgroundColor: '#ffea00', color: '#000' }}
                    >
                      LT
                    </th>
                    <th
                      rowSpan="3"
                      className="text-center"
                      style={{ backgroundColor: '#ffea00', color: '#000', width: '90px' }}
                    >
                      Total Kebutuhan
                    </th>
                    <th
                      rowSpan="3"
                      className="text-center"
                      style={{ backgroundColor: '#f8fafc', width: '80px' }}
                    >
                      Actual
                    </th>
                    <th
                      colSpan="2"
                      className="text-center"
                      style={{ backgroundColor: '#e2e8f0', width: '130px' }}
                    >
                      Judgment
                    </th>
                  </tr>

                  {/* ROW 2: Days Inputs & LT sub-headers */}
                  <tr>
                    <th rowSpan="2" className="text-center sub-header" style={{ width: '160px' }}>
                      JENIS
                    </th>
                    <th
                      rowSpan="2"
                      className="text-center sub-header"
                      style={{ width: '70px', lineHeight: '1.2' }}
                    >
                      Qty/Packaging
                    </th>

                    {months.map((m) => (
                      <th
                        key={`days_${m.key}`}
                        className="text-center header-input-cell position-relative"
                        style={{ backgroundColor: '#ffea00' }}
                      >
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                          <span className="small fw-bold">{m.label}</span>
                          <input
                            type="number"
                            className="form-control text-center days-input mx-auto shadow-sm mt-1"
                            style={{ width: '50px', height: '24px', fontSize: '12px' }}
                            placeholder="20"
                            title={`Hari Kerja ${m.label}`}
                            value={workingDays[m.key] || ''}
                            onChange={(e) => {
                              handleWorkingDaysChange(m.key, e.target.value)
                              setIsCalculated(false)
                            }}
                          />
                        </div>
                      </th>
                    ))}

                    <th rowSpan="2" className="text-center" style={{ backgroundColor: '#ffea00' }}>
                      1<br />
                      Produksi
                    </th>
                    <th rowSpan="2" className="text-center" style={{ backgroundColor: '#ffea00' }}>
                      2<br />
                      Store FG
                    </th>
                    <th rowSpan="2" className="text-center" style={{ backgroundColor: '#ffea00' }}>
                      3<br />
                      Customer
                    </th>
                    <th
                      rowSpan="2"
                      colSpan="2"
                      className="text-center border-bottom-0"
                      style={{ backgroundColor: '#e2e8f0' }}
                    ></th>
                  </tr>

                  {/* ROW 3: Filler row due to span overlaps */}
                  <tr>
                    {months.map((m) => (
                      <th key={`filler_${m.key}`} style={{ display: 'none' }}></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parts.length === 0 ? (
                    <tr>
                      <td colSpan={13 + months.length} className="text-center py-4 text-muted">
                        Aset Part tidak ditemukan untuk customer{' '}
                        {customers.find((c) => c.id.toString() === customerId)?.customer_name}
                      </td>
                    </tr>
                  ) : (
                    parts.map((p, pIndex) => {
                      const selectedPkg = packagings.find(
                        (pkg) => pkg.id.toString() === p.packaging_id?.toString(),
                      )
                      const pkgCapacity = selectedPkg ? selectedPkg.kapasitas_packaging : '-'

                      const cData = isCalculated ? resultsByPart[p.id] : null
                      const jInfo = renderJudgment(cData)

                      return (
                        <tr key={p.id}>
                          <td className="text-start px-3 text-muted fw-bold">{p.part_number}</td>
                          <td className="text-start px-3 fw-medium text-dark">{p.part_name}</td>
                          <td className="text-start px-3 text-muted small">{p.customer_name}</td>
                          <td className="text-center p-1">
                            <select
                              className="form-select form-select-sm border-0 bg-transparent text-muted small px-1"
                              value={p.packaging_id || ''}
                              onChange={(e) => {
                                handlePackagingChange(pIndex, e.target.value)
                                setIsCalculated(false)
                              }}
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
                          <td className="text-center text-muted small fw-bold">{pkgCapacity}</td>

                          {months.map((m) => {
                            const cellKey = `${p.id}_${m.key}`
                            return (
                              <td
                                key={cellKey}
                                className="input-cell p-0"
                                style={{ backgroundColor: '#fffbe6' }}
                              >
                                <input
                                  type="number"
                                  className="w-100 h-100 text-center border-0 forecast-input m-0"
                                  style={{ backgroundColor: 'transparent' }}
                                  placeholder="0"
                                  value={forecastData[cellKey] || ''}
                                  onChange={(e) => {
                                    handleForecastChange(p.id, m.key, e.target.value)
                                    setIsCalculated(false)
                                  }}
                                />
                              </td>
                            )
                          })}

                          {/* Calculations appended on the right */}
                          <td className="text-center text-muted">
                            {cData ? cData.ltProduksi : ''}
                          </td>
                          <td className="text-center text-muted">{cData ? cData.ltStore : ''}</td>
                          <td className="text-center text-muted">
                            {cData ? cData.ltCustomer : ''}
                          </td>
                          <td className="text-center fw-bold text-dark bg-light px-2">
                            {cData ? cData.calc : ''}
                          </td>
                          <td className="text-center text-muted px-2">
                            {cData ? cData.actual : ''}
                          </td>

                          {/* Judgment Colored Label */}
                          <td
                            className={`text-center fw-bold p-0 ${jInfo.colorClass}`}
                            style={{ width: '80px', verticalAlign: 'middle' }}
                          >
                            {jInfo.label}
                          </td>

                          {/* Judgment Value */}
                          <td
                            className="text-end pe-3 text-dark bg-light"
                            style={{ width: '60px', verticalAlign: 'middle', borderLeft: 'none' }}
                          >
                            {cData ? jInfo.val : ''}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Forecast
