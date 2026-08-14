import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // <-- ¡ESENCIAL para que procese las clases CSS!
    ],
    build: {
        outDir: path.resolve(__dirname, '../src/main/resources/static'),
        emptyOutDir: true,
    },
})