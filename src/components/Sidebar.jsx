import React from 'react'
import useStore from '../store/useStore'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

function toUnit(valueMeters, unit){
  if(unit === 'mm') return Math.round(valueMeters * 1000)
  if(unit === 'cm') return Math.round(valueMeters * 100)
  return Number(valueMeters.toFixed(3))
}

function fromUnit(value, unit){
  if(unit === 'mm') return value / 1000
  if(unit === 'cm') return value / 100
  return value
}

export default function Sidebar(){
  const unit = useStore(s => s.unit)
  const addCabinet = useStore(s => s.addCabinet)
  const addCanaleta = useStore(s => s.addCanaleta)
  const items = useStore(s => s.items)
  const selectedId = useStore(s => s.selectedId)
  const selectItem = useStore(s => s.selectItem)
  const updateItem = useStore(s => s.updateItem)
  const removeItem = useStore(s => s.removeItem)

  const selected = items.find(i => i.id === selectedId)

  return (
    <aside className="sidebar">
      <div className="panel">
        <h3>Herramientas</h3>
        <button onClick={() => addCabinet({w:1.0,h:2.0,d:0.6})}>Añadir Gabinete</button>
        <button onClick={() => addCanaleta({w:1.0})}>Añadir Canaleta 15x15cm</button>
        <button onClick={() => {
          // Export current scene to GLTF (JSON)
          const exporter = new GLTFExporter()
          const scene = new THREE.Scene()
          items.forEach(it => {
            const geo = new THREE.BoxGeometry(it.w, it.h, it.d)
            const mat = new THREE.MeshStandardMaterial({ color: 0x999999 })
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(it.x, it.y + it.h/2, it.z)
            scene.add(mesh)
          })
          exporter.parse(scene, function(result){
            const output = JSON.stringify(result)
            const blob = new Blob([output], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'scene.gltf.json'
            a.click()
            URL.revokeObjectURL(url)
          }, { binary: false })
        }}>Exportar GLTF</button>
      </div>

      <div className="panel">
        <h3>Objetos</h3>
        <ul className="itemsList">
          {items.map(it => (
            <li key={it.id} className={it.id===selectedId? 'selected':''} onClick={()=>selectItem(it.id)}>
              {it.type} — {it.id.slice(-6)}
            </li>
          ))}
        </ul>
        {selected && (
          <div className="panel">
            <h4>Seleccionado: {selected.type}</h4>
            <label>Anchura ({unit}):
              <input type="number" value={toUnit(selected.w, unit)} onChange={e=>{
                const v = Number(e.target.value)
                if(Number.isFinite(v)) updateItem(selected.id, { w: fromUnit(v, unit) })
              }} />
            </label>
            <div style={{marginTop:8}}>
              <button onClick={()=>removeItem(selected.id)}>Eliminar</button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
