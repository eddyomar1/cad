import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'

function toUnitStr(valMeters, unit){
  if(unit === 'mm') return `${Math.round(valMeters*1000)} mm`
  if(unit === 'cm') return `${Math.round(valMeters*100)} cm`
  return `${Number(valMeters.toFixed(3))} m`
}

export default function ItemMesh({ item }){
  const selectItem = useStore(s=>s.selectItem)
  const selectedId = useStore(s=>s.selectedId)
  const updateItem = useStore(s=>s.updateItem)
  const unit = useStore(s=>s.unit)
  const isSelected = selectedId === item.id

  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const controlsRef = useRef()
  const groupRef = useRef()
  const leftDoorRef = useRef()
  const rightDoorRef = useRef()

  const color = item.type === 'cabinet' ? (isSelected? '#3b82f6' : '#9ca3af') : (isSelected? '#f97316' : '#efefef')

  useFrame(() => {
    // animate doors toward target angle
    if(item.type === 'cabinet'){
      const target = item.doorOpen ? Math.PI / 2 : 0
      if(leftDoorRef.current){
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, -target, 0.2)
      }
      if(rightDoorRef.current){
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, target, 0.2)
      }
    }
  })

  useEffect(() => {
    if(!groupRef.current) return
    groupRef.current.position.set(item.x, item.y + item.h/2, item.z)
  }, [item.x, item.y, item.h, item.z])

  useEffect(() => {
    if(controlsRef.current && groupRef.current){
      controlsRef.current.attach(groupRef.current)
    }
  }, [controlsRef.current, groupRef.current])

  const onTransformEnd = () => {
    const g = groupRef.current
    if(!g) return
    const pos = g.position.clone()

    // ensure bottom (y - h/2) is not below 0
    const minCenterY = item.h / 2
    if(pos.y < minCenterY) pos.y = minCenterY

    const step = unit === 'mm' ? 0.001 : unit === 'cm' ? 0.01 : 0.01
    const snap = v => Math.round(v / step) * step
    const newBottom = snap(pos.y - item.h/2)
    let newX = snap(pos.x)
    let newZ = snap(pos.z)
    const newY = Math.max(0, newBottom)

    // clamp to grid bounds (same logic as FloorGrid)
    let gridSize = 10
    if(unit === 'mm') gridSize = 10000
    else if(unit === 'cm') gridSize = 1000
    else if(unit === 'm') gridSize = 10
    const half = gridSize / 2
    // ensure newX/newZ inside [-half, half]
    newX = Math.max(-half, Math.min(half, newX))
    newZ = Math.max(-half, Math.min(half, newZ))

    updateItem(item.id, { x: newX, y: newY, z: newZ })
    g.position.set(newX, newY + item.h/2, newZ)
  }

  return (
    <>
      <group
        ref={groupRef}
        onClick={(e)=>{ e.stopPropagation(); selectItem(item.id) }}
        onPointerOver={(e)=>{ e.stopPropagation(); setHovered(true) }}
        onPointerOut={(e)=>{ e.stopPropagation(); setHovered(false) }}
      >
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[item.w, item.h, item.d]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
        </mesh>

        {item.type === 'cabinet' && (
          <>
            {/* Left door group - pivot at left edge */}
            <group position={[-item.w/2, 0, item.d/2 + 0.01]} onClick={(e)=>{ e.stopPropagation(); updateItem(item.id, { doorOpen: !item.doorOpen }) }}>
              <group ref={leftDoorRef}>
                <mesh position={[ (item.w/4), 0, 0 ]}>
                  <boxGeometry args={[Math.max(0.02,item.w/2 - 0.02), Math.max(0.02,item.h - 0.02), 0.02]} />
                  <meshStandardMaterial color={'#f3f4f6'} metalness={0.1} roughness={0.7} />
                </mesh>
              </group>
            </group>

            {/* Right door group - pivot at right edge */}
            <group position={[item.w/2, 0, item.d/2 + 0.01]} onClick={(e)=>{ e.stopPropagation(); updateItem(item.id, { doorOpen: !item.doorOpen }) }}>
              <group ref={rightDoorRef}>
                <mesh position={[ -(item.w/4), 0, 0 ]}>
                  <boxGeometry args={[Math.max(0.02,item.w/2 - 0.02), Math.max(0.02,item.h - 0.02), 0.02]} />
                  <meshStandardMaterial color={'#e5e7eb'} metalness={0.1} roughness={0.7} />
                </mesh>
              </group>
            </group>
          </>
        )}

        {hovered && (
          <Html distanceFactor={8} position={[0, item.h/2 + 0.05, 0]} center>
            <div style={{padding:'6px 8px',background:'rgba(0,0,0,0.6)',color:'#fff',borderRadius:4,fontSize:12}}>
              <div>W: {toUnitStr(item.w, unit)}</div>
              <div>H: {toUnitStr(item.h, unit)}</div>
              <div>D: {toUnitStr(item.d, unit)}</div>
            </div>
          </Html>
        )}
      </group>

      {isSelected && (
        <TransformControls ref={controlsRef} object={groupRef.current} mode="translate" onMouseUp={onTransformEnd} onTouchEnd={onTransformEnd} showX showY showZ />
      )}
    </>
  )
}
