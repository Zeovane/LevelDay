import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: Se você estiver usando GitHub Pages, substitua 'LevelDay' 
// pelo nome do seu repositório no GitHub
// Exemplo: se seu repositório é 'usuario/meu-app', use 'meu-app'
const REPO_NAME = 'LevelDay'

export default defineConfig(({ mode }) => {
  // Para GitHub Pages, o base deve ser '/nome-do-repositorio/'
  // Para desenvolvimento local ou domínio customizado, use '/'
  const base = mode === 'production' ? `/${REPO_NAME}/` : '/'

  return {
    plugins: [react()],
    base,
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    css: {
      postcss: './postcss.config.cjs'
    }
  }
})
