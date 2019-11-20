import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Rss, PieChart, Database } from 'react-feather'
import { AppContext, SidebarContext } from '../../context'
import { sidebarWidth } from '../../../config'
import { useMobile, useLanguage, useClickAway } from '../../hooks'
import { Selector } from '../dashboard-view/Selector'
import { TYPE } from '../charts/Chart'
import { Footer } from '../footer/Footer'
import './Sidebar.scss'

function SidebarHeader({ name }) {
  return (
    <h6 className="sidebar-heading d-flex align-items-center p-3 my-0 text-muted">
      <span>{name}</span>
    </h6>
  )
}

export function Sidebar({ open }) {
  const content = useLanguage()
  const [appState] = useContext(AppContext)
  const { loggedIn } = appState
  const [, setSidebarState] = useContext(SidebarContext)
  const [sidebarStyle, setSidebarStyle] = useState({})
  const [blackoutStyle, setBlackoutStyle] = useState({})
  const isMobile = useMobile()
  const ref = useRef()
  useClickAway(ref, () => close(), 'prevent-sidebar-click-away')

  function close() {
    if (open && isMobile) {
      setSidebarState(prev => {
        return { ...prev, open: false }
      })
    }
  }

  useEffect(() => {
    setSidebarStyle({
      width: sidebarWidth,
      left: open ? 0 : -sidebarWidth,
    })
    setBlackoutStyle({
      width: open && isMobile ? '100%' : 0,
    })
  }, [open, isMobile])
  return (
    <>
      <nav className="sidebar" style={sidebarStyle} ref={ref}>
        {loggedIn ? (
          <>
            <SidebarHeader name="Categories" />
            <ul className="nav flex-column px-2">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="/dashboards"
                  onClick={close}
                >
                  <Layout className="feather" /> Dashboards
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/charts" onClick={close}>
                  <PieChart className="feather" /> Charts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/data-sources" onClick={close}>
                  <Database className="feather" /> Data Sources
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/websocket-test" onClick={close}>
                  <Rss className="feather" /> Websocket Test
                </Link>
              </li>
            </ul>
            <SidebarHeader name="Charts" />
            <ul className="nav flex-column px-2">
              <li className="nav-item">
                <Selector type={TYPE.LINE_CHART} closeSidebar={close} />
              </li>
              <li className="nav-item">
                <Selector type={TYPE.BAR_CHART} closeSidebar={close} />
              </li>
              <li className="nav-item">
                <Selector type={TYPE.PIE_CHART} closeSidebar={close} />
              </li>
            </ul>
            <SidebarHeader name="Data" />
            <ul className="nav flex-column px-2">
              <li className="nav-item">
                <Selector type={TYPE.LINE_CHART} closeSidebar={close} />
              </li>
              <li className="nav-item">
                <Selector type={TYPE.BAR_CHART} closeSidebar={close} />
              </li>
              <li className="nav-item">
                <Selector type={TYPE.PIE_CHART} closeSidebar={close} />
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul className="nav flex-column px-3 pt-4">
              <li className="nav-item">
                <p className="text-muted">
                  <Link to="/register" onClick={close}>
                    {content.sidebar.registerNow}
                  </Link>
                  {` ${content.sidebar.registerNowFollowUp}`}
                </p>
              </li>
            </ul>
          </>
        )}
        <hr className="mx-3" />
        <Footer close={close} />
      </nav>
      <div className="blackout" style={blackoutStyle}></div>
    </>
  )
}
