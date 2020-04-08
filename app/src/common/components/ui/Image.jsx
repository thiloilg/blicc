import React, { useState } from 'react'
import { Image as Placeholder } from 'react-feather'
import { Loading } from './Loading'
import { lightgray } from '../../../Theme.scss'

const State = {
  LOADING: 0,
  SUCCESS: 1,
  ERROR: 2,
}

export function Image({ width, height, src }) {
  const iconSize = 48
  const [state, setState] = useState(State.LOADING)
  const onLoad = () => setState(State.SUCCESS)
  const onError = () => setState(State.ERROR)

  const style = {
    width,
    height,
    display: 'flex',
    outlineStyle: 'solid',
    outlineWidth: '1px',
    outlineColor: lightgray,
  }

  return (
    <div style={style}>
      {state === State.LOADING && <Loading />}
      {state === State.ERROR && (
        <Placeholder
          size={iconSize}
          color={lightgray}
          style={{
            alignSelf: 'center',
            margin: 'auto',
          }}
        />
      )}
      {(state === State.LOADING || state === State.SUCCESS) && (
        <img
          width={width}
          height={height}
          src={src}
          onLoad={onLoad}
          onError={onError}
          style={{ display: state === State.LOADING ? 'none' : 'flex' }}
        />
      )}
    </div>
  )
}
