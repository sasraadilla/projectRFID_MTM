import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CHeader, CHeaderNav, CHeaderToggler, useColorModes } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('glassmorphism', document.documentElement.scrollTop > 10)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0 border-0 shadow-sm header"
      ref={headerRef}
      style={{
        zIndex: 1020,
        backgroundColor: '#ffffff',
      }}
    >
      <CContainer
        className="px-4"
        style={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}
        fluid
      >
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px', border: 'none', background: 'transparent' }}
        >
          <CIcon icon={cilMenu} size="lg" style={{ color: 'var(--brand-blue)' }} />
        </CHeaderToggler>

        <div
          style={{
            color: 'var(--brand-blue)',
            fontWeight: 600,
            fontSize: '1.1rem',
            marginLeft: '12px',
          }}
        >
          Controling Packaging - IoT RFID
        </div>

        <CHeaderNav
          className="ms-auto"
          style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '6px 16px',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src="/logo-mtm.png"
              alt="MTM Logo"
              style={{
                height: '35px',
                objectFit: 'contain',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                backgroundColor: 'white',
              }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            {/* Fallback styling inspired by new logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  color: '#29b6f6',
                  WebkitTextStroke: '1px #111',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  marginRight: '12px',
                  letterSpacing: '1px',
                }}
              >
                MTM
              </span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    color: '#111827',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '1px',
                  }}
                >
                  MENARA TERUS MAKMUR
                </span>
                <span
                  style={{
                    color: '#111827',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    fontStyle: 'italic',
                  }}
                >
                  A Member of <span style={{ color: '#dc2626' }}>ASTRA</span> Otoparts Group
                </span>
              </div>
            </div>
          </div>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      <CContainer
        className="px-4 py-2"
        fluid
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}
      >
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
