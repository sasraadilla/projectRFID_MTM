import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import api from '../../../api/axios'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan pada server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <CCard style={{ borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              {/* Header */}
              <div
                style={{
                  background: 'white',
                  padding: '30px',
                  textAlign: 'center',
                  borderRadius: '12px 12px 0 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <img
                  src="/mtm-logo.png"
                  alt="MTM Logo"
                  style={{ maxWidth: '200px', height: 'auto', marginBottom: '15px' }}
                />
                <h5 style={{ color: '#1e3a8a', fontWeight: '600', margin: 0 }}>
                  RFID Packaging Control System
                </h5>
              </div>

              <CCardBody style={{ padding: '30px' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '25px', color: '#374151' }}>
                  Login
                </h4>

                <CForm onSubmit={handleLogin}>
                  {error && (
                    <div
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px',
                        color: '#dc2626',
                        textAlign: 'center',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                      Username
                    </label>
                    <CInputGroup>
                      <CInputGroupText style={{ background: '#1e3a8a', color: 'white', border: 'none' }}>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Masukkan username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ padding: '12px' }}
                      />
                    </CInputGroup>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                      Password
                    </label>
                    <CInputGroup>
                      <CInputGroupText style={{ background: '#1e3a8a', color: 'white', border: 'none' }}>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '12px' }}
                      />
                    </CInputGroup>
                  </div>

                  <CButton
                    type="submit"
                    color="primary"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      background: '#1e3a8a',
                      border: 'none',
                    }}
                  >
                    {loading ? 'Loading...' : 'Login'}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginTop: '20px' }}>
              © 2026 PT. Menara Terus Makmur
            </p>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
