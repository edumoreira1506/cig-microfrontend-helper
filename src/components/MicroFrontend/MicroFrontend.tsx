import React, { useEffect } from 'react'

export interface MicroFrontendProps {
  name: string;
  host: string;
  containerId: string;
  params: Record<string, string>;
  callbacks?: Record<string, () => void>;
}

export default function MicroFrontend({
  name,
  host,
  containerId,
  params,
  callbacks
}: MicroFrontendProps) {
  useEffect(() => {
    const renderMicroFrontend = () => {
      const windowRender = (window as any)?.[`render${name}`]

      if (windowRender) {
        windowRender(containerId, params, callbacks)
      }
    }

    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const script = document.createElement('script')

        script.id = `script-${containerId}`
        script.crossOrigin = ''
        script.src = `${host}${manifest.files['main.js']}`
        script.onload = () => {
          renderMicroFrontend()
        }
        document.head.appendChild(script)
      })

    return () => {
      (window as any)[`unmount${name}`] && (window as any)[`unmount${name}`](`${name}-container`)
    }
  }, [name, host, containerId, callbacks])

  return <main id={`${name}-container`} />
}