import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 CON ESTE PUNTO, VITE REEMPLAZARÁ LA BARRA INTRUSA POR UN PUNTO EN EL SCRIPT AUTOMÁTICAMENTE
})