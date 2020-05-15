import { useEffect, useState, useContext, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { AppContext } from '../context'
import { DELIVERY } from '../../config'

export let socket: any = null
export const cache: any = []

export const WebSocketState = {
  [WebSocket.CONNECTING]: 'connecting',
  [WebSocket.OPEN]: 'open',
  [WebSocket.CLOSING]: 'closing',
  [WebSocket.CLOSED]: 'closed',
}

type Data = any
type Callback = (data: Data) => void
type Publish = (channel: string, data?: Data) => void
type Subscribe = (channel: string, callback: Callback) => Data

interface Stack<T> {
  [key: string]: T
}

export function useEndpointWebSocket(): [Publish, Subscribe] {
  const [queryStack, setQueryStack] = useState<Stack<any>>([])
  const [subscriberStack, setSubscriberStack] = useState<Stack<any>>([])
  const [appState] = useContext(AppContext)
  const { loggedIn } = appState
  const initialState = socket !== null ? socket.readyState : WebSocket.CLOSED
  const [state, setState] = useState(initialState)

  useEffect(() => {
    if (loggedIn && socket === null) {
      setState(WebSocket.CONNECTING)
      socket = new WebSocket(`${DELIVERY.ORIGIN_WEBSOCKET}/connection`)

      socket.onopen = (): void => {
        Object.keys(queryStack).forEach((channel) => {
          const payload = JSON.stringify({ channel, data: queryStack[channel] })
          socket.send(payload)
        })
        setState(WebSocket.OPEN)
        setQueryStack([])
      }

      socket.onclose = (): void => {
        socket = null
        setState(WebSocket.CLOSED)
      }

      socket.onerror = (err: any): void => {
        console.log(
          `An websocket error occured: ${JSON.stringify(err, [
            'message',
            'arguments',
            'type',
            'name',
          ])}`
        )
      }
    }

    if (loggedIn && socket !== null) {
      socket.onmessage = (evt: any): void => {
        const { channel, data } = JSON.parse(evt.data)
        cache[channel] = data
        if (channel && data && subscriberStack) {
          for (const key of Object.keys(subscriberStack)) {
            if (key.includes(channel)) subscriberStack[key](data)
          }
        }
      }
    }

    if (!loggedIn && socket !== null) {
      socket.close()
      setState(WebSocket.CLOSING)

      return (): void => {
        socket = null
      }
    }
  }, [loggedIn, subscriberStack, state, queryStack, setQueryStack])

  useEffect(() => {
    return (): void => {
      if (socket) {
        socket.close()
        setState(WebSocket.CLOSED)
        socket = null
      }
    }
  }, [])

  const publish: Publish = (channel: string, data: any = null): void => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data ? { channel, data } : { channel }))
    } else {
      setQueryStack((prev: any): any => {
        prev[channel] = data
        return prev
      })
    }
  }

  const subscribe: Subscribe = useCallback(
    (channel, callback) => {
      if (typeof callback !== 'function') {
        return
      }
      const id = channel + uuid()
      setSubscriberStack((stack: any) => ({
        ...stack,
        [id]: callback,
      }))
      return cache[channel] ? cache[channel] : null
    },
    [setSubscriberStack]
  )

  return [publish, subscribe]
}
