import { create } from 'zustand'

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`

const useStore = create((set) => ({
  unit: 'mm',
  setUnit: (u) => set({ unit: u }),

  // Scene objects
  items: [], // { id, type: 'cabinet'|'canaleta', w, h, d, x,y,z }
  selectedId: null,

  addCabinet: (opts = {}) => set(state => {
    const item = {
      id: uid(),
      type: 'cabinet',
      w: opts.w ?? 1.0, // meters
      h: opts.h ?? 2.0,
      d: opts.d ?? 0.6,
      x: opts.x ?? 0,
      y: opts.y ?? 0,
      z: opts.z ?? 0
      ,
      doorOpen: false
    }
    return { items: [...state.items, item], selectedId: item.id }
  }),

  addCanaleta: (opts = {}) => set(state => {
    const item = {
      id: uid(),
      type: 'canaleta',
      w: opts.w ?? 1.0, // meters (interactive width)
      h: 0.15, // 15 cm
      d: 0.15, // 15 cm
      x: opts.x ?? 0,
      y: opts.y ?? 0,
      z: opts.z ?? 0
    }
    return { items: [...state.items, item], selectedId: item.id }
  }),

  selectItem: (id) => set({ selectedId: id }),

  updateItem: (id, patch) => set(state => ({
    items: state.items.map(it => it.id === id ? { ...it, ...patch } : it)
  })),

  removeItem: (id) => set(state => ({ items: state.items.filter(it => it.id !== id), selectedId: state.selectedId === id ? null : state.selectedId }))
}))

export default useStore
