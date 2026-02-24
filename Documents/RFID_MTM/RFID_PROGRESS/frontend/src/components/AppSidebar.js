import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilQrCode } from '@coreui/icons'

import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      className="sidebar-modern"
      style={{
        borderRight: 'none',
        '--cui-sidebar-color': '#ffffff',
        '--cui-sidebar-nav-link-icon-color': 'rgba(255, 255, 255, 0.75)',
        '--cui-sidebar-nav-title-color': 'rgba(255, 255, 255, 0.5)',
      }}
    >
      {/* ===== HEADER SIDEBAR ===== */}
      <CSidebarHeader
        className="d-flex align-items-center justify-content-center px-3"
        style={{
          minHeight: '60px',
        }}
      >
        <CSidebarBrand
          to="/"
          className="d-flex align-items-center gap-2 text-decoration-none w-100 justify-content-center"
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '50px',
            }}
          >
            <img
              src="/logo-mtm.png"
              alt="MTM Logo"
              style={{
                height: '40px',
                objectFit: 'contain',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                backgroundColor: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
              }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />

            {/* Fallback styling */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span
                style={{
                  color: '#29b6f6',
                  WebkitTextStroke: '1px #ffffff',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '1px',
                  marginRight: '8px',
                }}
              >
                MTM
              </span>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  borderLeft: '2px solid rgba(255,255,255,0.3)',
                  paddingLeft: '8px',
                }}
              >
                RFID
              </span>
            </div>
          </div>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          style={{ position: 'absolute', right: '10px' }}
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* ===== NAV ===== */}
      <AppSidebarNav items={navigation} className="sidebar-nav mt-3" />

      {/* ===== FOOTER ===== */}
      <CSidebarFooter
        className="d-none d-lg-flex justify-content-center"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '10px 0',
        }}
      >
        <CSidebarToggler style={{ color: '#ffffff', opacity: 0.8 }} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
