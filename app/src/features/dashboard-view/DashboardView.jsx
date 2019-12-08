import React, { useEffect, useState } from 'react'
import statusCode from 'http-status-codes'
import { DashboardHeader } from './DashboardHeader'
import { DashboardContainer } from '../../common/components/dashboard-container/DashboardContainer'
import { useApiEndpoint, useDashboard } from '../../common/hooks'
import { MetaData } from '../../common/components/meta-data/MetaData'
import { DashboardDetails } from './DashboardDetails'
import { Toolbox } from '../../common/components/toolbox/Toolbox'
import './DashboardView.scss'

export function DashboardView({ match }) {
  const [data, setData, setDashboard] = useDashboard()
  const path = `/dashboards/${match.params.id}`
  const [, access, update] = useApiEndpoint(path)
  const { title } = data

  const tabs = ['Dashboard', 'Details']
  const [currentTab, setCurrentTab] = useState(tabs[0])

  useEffect(() => {
    async function fetchData() {
      const [status, data] = await access()
      if (status === statusCode.OK) {
        setData(data)
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [match])

  async function updateDashboard() {
    const [status] = await update(data)
    if (status === statusCode.OK) {
      console.log('update was successful!')
    }
  }

  return (
    <>
      <MetaData title={title} description={title} path={path} />
      <Toolbox />
      <div className="container-fluid dashboard">
        <DashboardHeader
          title={title}
          onSave={updateDashboard}
          tabs={tabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        {currentTab === tabs[0] ? (
          <DashboardContainer data={data} update={setDashboard} />
        ) : (
          <DashboardDetails data={data} />
        )}
      </div>
    </>
  )
}
