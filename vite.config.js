import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['goceng.png'],
      manifest: {
        name: 'Goceng - Finance Tracker',
        short_name: 'Goceng',
        description: 'Aplikasi pelacak keuangan pribadi untuk mengelola pemasukan dan pengeluaran Anda.',
        theme_color: '#0A0F1A',
        background_color: '#0A0F1A',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'goceng.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'goceng.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'goceng.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
})
