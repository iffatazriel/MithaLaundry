'use client'

import { useEffect } from 'react'

type SwaggerRequest = {
  headers: Record<string, string>
}

type SwaggerConfig = {
  url: string
  dom_id: string
  presets: unknown[]
  layout: string
  requestInterceptor: (request: SwaggerRequest) => SwaggerRequest
}

type SwaggerUIBundle = {
  (config: SwaggerConfig): unknown
  presets: {
    apis: unknown
  }
  SwaggerUIStandalonePreset: unknown
}

declare global {
  interface Window {
    SwaggerUIBundle?: SwaggerUIBundle
    ui?: unknown
  }
}

export default function SwaggerPage() {
  useEffect(() => {
    // Load Swagger UI dynamically
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.js'
    script.async = true
    script.onload = () => {
      const swagger = window.SwaggerUIBundle

      if (swagger) {
        window.ui = swagger({
          url: '/api/swagger.json',
          dom_id: '#swagger-ui',
          presets: [
            swagger.presets.apis,
            swagger.SwaggerUIStandalonePreset,
          ],
          layout: 'BaseLayout',
          requestInterceptor: (request) => {
            request.headers['X-API-Key'] = 'your-api-key'
            return request
          },
        })
      }
    }
    document.body.appendChild(script)

    // Load CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.css'
    document.head.appendChild(link)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  return (
    <div id="swagger-ui" style={{ margin: 0, padding: 0 }} />
  )
}
