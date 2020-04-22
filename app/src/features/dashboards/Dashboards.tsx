import React, { useState, useEffect, ReactElement } from 'react'
import statusCode from 'http-status-codes'
import { Redirect } from 'react-router-dom'
import { useApiEndpoint, useDateFormatter } from '../../common/hooks'
import { MetaData } from '../../common/components/meta-data/MetaData'
import { useModal, useLanguage } from '../../common/hooks'
import { CreateDashboardModal } from './CreateDashboardModal'
import {
  Pagination,
  Listing,
  Item,
  Heading,
  Button,
  ButtonType,
} from '../../common/components/ui'
import { Dashboard, List } from '../../common/interfaces'
import { API } from '../../config'

export const INITIAL_DASHBOARD = {
  title: '',
  description: '',
  data: {
    arrangement: {},
    settings: {},
  },
}

export function Dashboards(): ReactElement {
  const [list, setList] = useState<List<Dashboard>>()
  const { dashboards: text } = useLanguage()
  const itemsPerPage = 10
  const [page, setPage] = useState(0)
  const [create, access, ,] = useApiEndpoint('/dashboards')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [redirect, setRedirect] = useState('')
  const format = useDateFormatter()

  const [showModal, hideModal] = useModal(
    () => (
      <CreateDashboardModal
        setTitle={setTitle}
        setDescription={setDescription}
        cancel={hideModal}
        submit={submit}
      />
    ),
    [title, description]
  )

  async function submit(): Promise<void> {
    const [status, data] = await create({
      ...INITIAL_DASHBOARD,
      title,
      description,
    })
    if (status === statusCode.CREATED) {
      setRedirect(`/dashboards/${data.id}?edit`)
    }
    hideModal()
  }

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      const [status, data] = await access({
        params: {
          fields: 'id,title,description,creationDate',
          skip: itemsPerPage * page,
          take: itemsPerPage,
        },
      })
      if (status === statusCode.OK) {
        setList({ total: data.total, list: data.dashboards })
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [page])

  return (
    <>
      {redirect && <Redirect to={redirect} />}
      <MetaData
        title={text.title}
        description={text.description}
        path={'/dashboards'}
      />
      <div className="container">
        <Heading title={text.title}>
          <Button type={ButtonType.Primary} onClick={showModal}>
            {text.create}
          </Button>
        </Heading>
        <Listing<Dashboard> list={list} emptyText={text.empty}>
          {(item): ReactElement => (
            <Item
              key={item.id}
              thumbnail={`${API.ORIGIN}/dashboard-thumbnails/${item.id}.jpg`}
              title={item.title}
              subtitle={format(item.creationDate)}
              description={item.description}
              link={`/dashboards/${item.id}`}
              linkLabel={text.view}
            />
          )}
        </Listing>
        <Pagination
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          total={list ? list.total : 0}
        />
      </div>
    </>
  )
}
