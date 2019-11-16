import React, { useEffect } from 'react'
import { useDeliveryEndpoint } from '../../common/hooks'

const WebSocketState = {
  [WebSocket.CONNECTING]: 'connecting',
  [WebSocket.OPEN]: 'open',
  [WebSocket.CLOSING]: 'closing',
  [WebSocket.CLOSED]: 'closed',
}

export function WebSocketTest() {
  const [publish, subscribe, state] = useDeliveryEndpoint()

  useEffect(() => {
    subscribe('example', data => console.log(data))
  }, [subscribe])

  return (
    <div className="col-md-5 mx-auto py-5 my-5 text-center">
      <p>
        {`WebSocket connection state: ${WebSocketState[state]}, click to test: `}
        <button onClick={() => publish('Hello World!!!')}>Say Hallo!</button>
      </p>
    </div>
  )
}
