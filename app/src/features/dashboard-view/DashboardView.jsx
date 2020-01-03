import React, { useEffect, useState, useContext } from 'react'
import statusCode from 'http-status-codes'
import { DashboardHeader } from './DashboardHeader'
import { Arrangement } from '../../common/components/arrangement/Arrangement'
import { useApiEndpoint } from '../../common/hooks'
import { ArrangementContext, SettingsContext } from '../../common/context'
import { MetaData } from '../../common/components/meta-data/MetaData'
import { DashboardDetails } from './DashboardDetails'
import { Toolbox } from '../../common/components/toolbox/Toolbox'
import './DashboardView.scss'

export function DashboardView({ match, location }) {
  const [arrangement, setArrangement] = useContext(ArrangementContext)
  const [settings, setSettings] = useContext(SettingsContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const path = `/dashboards/${match.params.id}`
  const [, access, update] = useApiEndpoint(path)
  const [dashboard, setDashboard] = useState({})
  const { userId, creationDate } = dashboard
  const [edit, setEdit] = useState(
    location.search && location.search === '?edit'
  )

  const tabs = ['Dashboard', 'Details']
  const [currentTab, setCurrentTab] = useState(tabs[0])

  useEffect(() => {
    async function fetchData() {
      const [status, data] = await access()
      if (status === statusCode.OK) {
        setDashboard(data)
        setArrangement(data.data.arrangement)
        setSettings(data.data.settings)
        setTitle(data.title)
        setDescription(data.description)
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [match])

  async function onSubmit(event) {
    event.target.blur()
    if (edit) {
      const [status] = await update({
        ...dashboard,
        title,
        description,
        data: { arrangement, settings },
      })
      if (status === statusCode.OK) {
        console.log('update was successful!')
      }
      setEdit(false)
    } else {
      setEdit(true)
    }
  }

  return (
    <>
      <MetaData title={title} description={description} path={path} />
      <div className="container-fluid dashboard">
        <DashboardHeader
          edit={edit}
          onSubmit={onSubmit}
          title={title}
          tabs={tabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        {currentTab === tabs[0] ? (
          <>
            {edit && <Toolbox />}
            {dashboard.data && <Arrangement edit={edit} />}
          </>
        ) : (
          <DashboardDetails
            edit={edit}
            title={title}
            setTitle={setTitle}
            userId={userId}
            creationDate={creationDate}
            description={description}
            setDescription={setDescription}
          />
        )}
      </div>
    </>
  )
}
