import React, { useContext } from 'react'
import { X } from 'react-feather'
import { PluginLoader } from './PluginLoader'
import { Positioning } from '../positioning/Positioning'
import { useSettings } from '../../hooks/settings/useSettings'
import { DragContext, DRAG } from '../../context'
import { useArrangement } from '../../hooks'
import './Plugin.scss'

export function Plugin({ id, onDrop, mask }) {
  const [accessSet, , removeSet] = useSettings()
  const type = accessSet(id, 'type')
  const [, , removeArr] = useArrangement()
  const [dragging] = useContext(DragContext)

  return (
    <div className="spread plugin">
      <div className="row text-muted px-2">
        <div className="col col-8">
          <p>{type}</p>
        </div>
        <div className="col col-4 text-right">
          <X
            size={18}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              removeArr(id)
              removeSet(id)
            }}
          />
        </div>
      </div>
      <hr />
      <PluginLoader id={id} type={type} />
      {dragging !== DRAG.NONE && (
        <Positioning
          type={dragging}
          onDrop={action => onDrop(action, id)}
          mask={mask}
        />
      )}
    </div>
  )
}
