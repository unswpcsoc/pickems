import { defineConfig } from 'vite'
import { config } from 'dotenv';
import react from '@vitejs/plugin-react'

config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  }
})
