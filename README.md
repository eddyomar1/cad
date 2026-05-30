P3W — Bocetos 3D para Cuartos Eléctricos

Scaffold inicial: React + Vite + Three.js (via @react-three/fiber).

Rápido inicio:

```bash
# instalar dependencias
npm install

# desarrollo
npm run dev

# build para producción
npm run build
```

Despliegue en GitHub Pages (opciones):

- Opción 1 (manual): Construye (`npm run build`) y publica la carpeta `dist/` como la fuente de Pages (`gh-pages` branch o carpeta `docs/`).
- Opción 2 (automática): añadir el paquete `gh-pages` y un script `deploy` que suba `dist/` a la rama `gh-pages`.

Notas:
- La configuración de Vite usa `base: './'` para compatibilidad con GitHub Pages.
- Las unidades soportadas inicialmente son `mm`, `cm` y `m`.
