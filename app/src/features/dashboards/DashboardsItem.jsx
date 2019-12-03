import React from 'react'
import { Link } from 'react-router-dom'

export function DashboardsItem({ dashboard }) {
  const { id, title, description, creationDate } = dashboard
  return (
    <tr>
      <td>
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {creationDate.split('T')[0]}
        </h6>
        <p className="card-text">{description}</p>
        <Link className="card-link" to={`/dashboards/${id}`}>
          View Dashboard
        </Link>
      </td>
    </tr>
  )
}
