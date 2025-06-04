import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  worker : {
    format : 'es'
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/core"],
  },
  envDir : '../',
  plugins: [react()],
})
