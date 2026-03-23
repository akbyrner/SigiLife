import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['ec2-18-223-34-170.us-east-2.compute.amazonaws.com'],
  },
  plugins: [react(), tailwindcss(),],
});
