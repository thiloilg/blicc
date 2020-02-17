import React, { useState, useEffect, useRef } from 'react'
import statusCode from 'http-status-codes'
import { useApiEndpoint } from '../../common/hooks'
import { MetaData } from '../../common/components/meta-data/MetaData'
import { API, EXAMPLE_DATA } from '../../config'
import './ChartView.scss'
import { ChartDetails } from './ChartDetails'

export function ChartView({ match }) {
  const path = `/charts/${match.params.id}`
  const ref = useRef()
  const [, access] = useApiEndpoint(path)
  const [chart, setChart] = useState({})
  const { title, description, bundle, creationDate, slug, key } = chart
  const style = {
    width: '100%',
    height: '500px',
  }

  const data = EXAMPLE_DATA

  useEffect(() => {
    async function fetchData() {
      const [status, chart] = await access()
      if (status === statusCode.OK) {
        setChart(chart)
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [match])

  useEffect(() => {
    console.log(slug)
    async function fetchPlugin() {
      await import(
        /*webpackIgnore: true*/ `${API.ORIGIN}/bundles/${slug}`
      ).then(module => {
        const node = module[key](
          data,
          () => {},
          {},
          () => {}
        )

        if (ref.current) {
          ref.current.innerHTML = ''
          if (typeof node === 'string') {
            ref.current.innerHTML = node
          } else {
            ref.current.appendChild(node)
          }
        }
      })
    }
    if (slug && key) {
      fetchPlugin()
    }
  }, [slug])

  return (
    <>
      <MetaData title={title} description={description} path={path} />
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center my-3">
          <h2 className="my-0">{title}</h2>
        </div>
        <div className="col px-0 pb-2">
          <div className="card">
            <h5 className="card-header">Preview</h5>
            <div className="card-body">
              <div style={style} ref={ref} />
            </div>
          </div>
        </div>
        <ChartDetails
          bundle={bundle}
          description={description}
          creationDate={creationDate}
        />
      </div>
    </>
  )
}
