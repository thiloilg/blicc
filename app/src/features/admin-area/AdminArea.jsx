import React, { useEffect, useState } from 'react'
import statusCode from 'http-status-codes'
import { MetaData } from '../../common/components/meta-data/MetaData'
import { useApiEndpoint } from '../../common/hooks'
import { Empty } from '../../common/components/ui'

export function AdminArea() {
  const [result, setResult] = useState({ total: 0, users: [] })
  const [, access, ,] = useApiEndpoint('/users')

  useEffect(() => {
    async function fetchData() {
      const [status, data] = await access()
      if (status === statusCode.OK) {
        setResult(data)
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <MetaData
        title={'Admin Area'}
        description={'Access admin tools'}
        path={'/admin-area'}
      />
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center my-3">
          <h2 className="my-0">Admin Area</h2>
        </div>
        <hr />
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center my-3">
          <h3 className="my-0">
            Users <span className="badge badge-secondary">{result.total}</span>
          </h3>
        </div>
        {result.total === 0 ? (
          <Empty>No charts fount.</Empty>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Register Date</th>
              </tr>
            </thead>
            <tbody>
              {result.users.map(
                ({ id, firstName, lastName, role, email, creationDate }) => (
                  <tr key={id}>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{role}</td>
                    <td>{email}</td>
                    <td>{creationDate.split('T')[0]}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
