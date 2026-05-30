import React from 'react'
import Scene from './components/Scene'
import Sidebar from './components/Sidebar'
import useStore from './store/useStore'

export default function App(){
  const unit = useStore(state => state.unit)
  const setUnit = useStore(state => state.setUnit)

  return (
    <div className="app">
      <header className="topbar">
        <h1>P3W — Bocetos 3D (Cuartos Eléctricos)</h1>
        <div className="controls">
          <label>Unidad:
            <select value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="m">m</option>
            </select>
          </label>
        </div>
      </header>
      <main className="content">
        <Sidebar />
        <div className="canvasWrap">
          <Scene />
        </div>
      </main>
    </div>
  )
}
