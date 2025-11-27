import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ IMPORTANTE: Substitua 'LevelDay' pelo nome EXATO do seu repositório no GitHub
// Exemplo: se a URL do seu site é https://usuario.github.io/meu-app/
// então o nome do repositório é 'meu-app'
const REPO_NAME = 'LevelDay'

export default defineConfig(({ mode }) => {
  // Em produção, usa o nome do repositório como base path
  // Em desenvolvimento, usa '/' para funcionar localmente
  const base = mode === 'production' ? `/${REPO_NAME}/` : '/'

  console.log(`🔧 Vite config - Mode: ${mode}, Base: ${base}`)

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
