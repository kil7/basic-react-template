import React from 'react'
import ReactDOM from 'react-dom/client'

const TestComponent = () => (
        <h1>Hi From React</h1>
    )

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TestComponent />
  </React.StrictMode>,
)