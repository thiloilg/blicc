import React, { useMemo, useState } from 'react'
import {
  useArrangement,
  useModal,
  useSettings,
  usePublisher,
  useMobile,
} from '../../hooks'
import { SelectChartModal } from './SelectChartModal'
import { SelectDataSourceModal } from './SelectDataSourceModal'
import { Box } from './Box'
import { DRAG } from '../../context'

export function Arrangement({ edit }) {
  const isMobile = useMobile()
  const [arr, insertArr] = useArrangement()
  const [, insertSet] = useSettings()
  const [targetId, setTargetId] = useState('')
  const [action, setAction] = useState(0)
  const [, publishById] = usePublisher()

  const style = isMobile
    ? {}
    : {
        overflow: 'auto',
        width: '100%',
        height: '100%',
      }

  const [showChartModal, hideChartModal] = useModal(
    () => (
      <SelectChartModal
        cancel={hideChartModal}
        submit={slug => {
          const id = insertArr(targetId, action)
          insertSet(id, 'chart_type', slug)
          hideChartModal()
        }}
      />
    ),
    [targetId, action]
  )

  const [showDataSourceModal, hideDataSourceModal] = useModal(
    () => (
      <SelectDataSourceModal
        cancel={hideDataSourceModal}
        submit={dataSourceId => {
          insertSet(targetId, 'data_source', dataSourceId)
          publishById(dataSourceId)
          hideChartModal()
        }}
      />
    ),
    [targetId]
  )

  function onDrop(type, payload) {
    if (type === DRAG.CHART) {
      const { action, id = '' } = payload
      setTargetId(id)
      setAction(action)
      showChartModal()
    } else {
      const { id = '' } = payload
      setTargetId(id)
      showDataSourceModal()
    }
  }

  return useMemo(() => {
    return (
      <div style={style} onDragOver={evt => evt.preventDefault()}>
        <Box arr={arr} onDrop={onDrop} edit={edit} isMobile={isMobile} />
      </div>
    )
    // eslint-disable-next-line
  }, [edit, arr, isMobile])
}
