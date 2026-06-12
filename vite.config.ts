import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração otimizada para o GitHub Pages ler a raiz do repositório de forma estável
export default defineConfig({
  plugins: [react()],
  base: '/cartao-amor/',
})
