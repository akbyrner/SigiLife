import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['ec2-18-223-34-170.us-east-2.compute.amazonaws.com'],
  },
  plugins: [react()],
});
