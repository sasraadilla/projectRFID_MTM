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

import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

import logoMtm from '../assets/images/logomtmfix (2).png'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      className="border-end"
      style={{
        '--cui-sidebar-bg': '#1e3a8a',
        '--cui-sidebar-color': '#ffffff',
        '--cui-sidebar-nav-link-font-weight': '500',
        '--cui-sidebar-nav-link-active-font-weight': '700',
        '--cui-sidebar-nav-link-color': 'rgba(255, 255, 255, 0.8)',
        '--cui-sidebar-nav-link-hover-bg': 'rgba(255, 255, 255, 0.1)',
        '--cui-sidebar-nav-link-hover-color': '#ffffff',
        '--cui-sidebar-nav-link-active-bg': 'rgba(255, 255, 255, 0.15)',
        '--cui-sidebar-nav-link-active-color': '#ffffff',
        '--cui-sidebar-nav-title-color': 'rgba(255, 255, 255, 0.5)',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        borderRight: 'none',
      }}
    >
      {/* Sidebar Header dengan Gradient */}
      <CSidebarHeader
        className="d-flex align-items-center justify-content-between"
        style={{
          background: '#ffffff',
          minHeight: '80px',
          padding: '0 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <CSidebarBrand
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logoMtm}
            alt="MTM Logo"
            style={{
              maxWidth: '150px',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Navigation */}
      <div style={{
        padding: '10px 0',
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        <AppSidebarNav items={navigation} />
      </div>

      {/* Footer */}
      <CSidebarFooter
        className="d-none d-lg-flex justify-content-center"
        style={{
          background: '#15296a',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 0',
        }}
      >
        <CSidebarToggler
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
          }}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

