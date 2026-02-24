import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import logoMtm from '../assets/images/logomtmfix (2).png'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0"
      ref={headerRef}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: 'none',
      }}
    >
      {/* Header dengan Gradient */}
      <CContainer
        className="px-4 text-white"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          minHeight: '56px',
          display: 'flex',
          alignItems: 'center',
        }}
        fluid
      >
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{
            marginInlineStart: '-14px',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
          }}
          className="text-white"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* Title */}
        <span
          style={{
            marginLeft: '15px',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '0.5px',
          }}
        >
          Controling Packaging - IoT RFID
        </span>

        <CHeaderNav className="ms-auto align-items-center">
          {/* Brand Logo Container */}
          <div
            style={{
              background: '#ffffff',
              padding: '6px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              marginRight: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              height: '42px',
            }}
          >
            <img src={logoMtm} alt="MTM" style={{ height: '32px', objectFit: 'contain' }} />
          </div>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      {/* Breadcrumb dengan background subtle */}
      <CContainer
        className="px-4"
        fluid
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

