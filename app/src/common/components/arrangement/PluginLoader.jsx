import React, { useEffect, useState, useRef } from 'react'
import { Loading } from '../loading/Loading'
import { API } from '../../../config'
import { useSettings } from '../../hooks/settings/useSettings'

export function PluginLoader({ id, type }) {
  const [accessSet, insertSet] = useSettings()
  const [bundle, plugin] = type.split('/')
  const ref = useRef()
  const [loading, setLoading] = useState(true)

  const data = [213, 342, 23, 123, 23]

  function onDataUpdate() {}

  const key = 'plugin_settings'
  const settings = accessSet(id, key)

  function setSettings(value) {
    insertSet(id, key, value)
  }

  useEffect(() => {
    async function fetchPlugin() {
      await import(
        /*webpackIgnore: true*/ `${API.ORIGIN}/bundles/${bundle}`
      ).then(module => {
        setLoading(false)

        const node = module[plugin](data, onDataUpdate, settings, setSettings)

        if (typeof node === 'string') {
          ref.current.innerHTML = node
        } else {
          if (ref.current.hasChildNodes()) {
            ref.current.replaceChild(node, ref.current.firstChild)
          } else {
            ref.current.appendChild(node)
          }
        }
      })
    }

    if (type) fetchPlugin()
    // eslint-disable-next-line
  }, [type])

  return loading ? <Loading /> : <div ref={ref} />
}
