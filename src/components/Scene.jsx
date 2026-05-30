import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Stats } from '@react-three/drei'
import useStore from '../store/useStore'
import ItemMesh from './ItemMesh'

function FloorGrid(){
  const unit = useStore(state => state.unit)
  let size = 10
  let divisions = 10
  if(unit === 'mm'){
    size = 10000
    divisions = 100
  } else if(unit === 'cm'){
    size = 1000
    divisions = 100
  } else if(unit === 'm'){
    size = 10
    divisions = 10
  }
  return <gridHelper args={[size, divisions, `#888`, `#444`]} />
}

export default function Scene(){
  const items = useStore(s => s.items)

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }} shadows>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10,10,5]} intensity={0.8} />
      <OrbitControls makeDefault />
      <FloorGrid />
      {items.map(it => (
        <ItemMesh key={it.id} item={it} />
      ))}
      <Stats />
    </Canvas>
  )
}
