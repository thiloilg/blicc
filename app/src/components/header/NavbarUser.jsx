import React from 'react'
import { Link } from 'react-router-dom'
import { User } from 'react-feather'
import './NavbarUser.scss'

export function NavbarUser({ firstName, lastName, loggedIn, logout }) {
  return (
    <ul className="navbar-nav ml-auto">
      {!loggedIn ? (
        <li className="nav-item text-nowrap">
          <Link className="nav-link" to="/login">
            Sign in
          </Link>
        </li>
      ) : (
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="/"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <User size={24} className="user"></User>
          </a>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbarDropdown"
          >
            <h6 className="dropdown-header">{`Welcome ${firstName} ${lastName}`}</h6>
            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/profile">
              Profile
            </Link>
            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/" onClick={logout}>
              Logout
            </Link>
          </div>
        </li>
      )}
    </ul>
  )
}
