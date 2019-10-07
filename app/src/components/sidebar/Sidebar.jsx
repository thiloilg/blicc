import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  File,
  ShoppingCart,
  Users,
  BarChart2,
  Layers,
  PlusCircle,
  FileText,
} from 'react-feather'
import theme from '../../config/Theme.scss'
import './Sidebar.scss'

export function Sidebar({ open }) {
  const [left, setLeft] = useState(0)

  const style = {
    width: theme.sidebarSize,
    left,
  }

  useEffect(() => {
    setLeft(open ? 0 : `-${theme.sidebarSize}`)
  }, [open])

  return (
    <>
      <div className="sidebar" style={style}>
        <ul className="nav flex-column px-2 pt-3">
          <li className="nav-item">
            <Link className="nav-link active" to="/dashboards">
              <Home className="feather" /> Dashboard
              <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <File className="feather" /> Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <ShoppingCart className="feather" /> Products
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <Users className="feather" /> Customers
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <BarChart2 className="feather" /> Reports
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <Layers className="feather" /> Integrations
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Saved reports</span>
          <Link className="text-muted pl-3" to="/">
            <PlusCircle className="feather" />
          </Link>
        </h6>
        <ul className="nav flex-column mb-2 px-2 py-3">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <FileText className="feather" /> Current month
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <FileText className="feather" /> Last quarter
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <FileText className="feather" /> Social engagement
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <FileText className="feather" /> Year-end sale
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
