import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode } : { mode: any }) => {
  const envPath = require('path').resolve(process.cwd() + '/../')
  const env = loadEnv(mode, envPath, '');
  return defineConfig({
    preview: {
      port: 3001,
    },
    // for dev
    server: {
      port: 3000,
    },
    plugins: [react()],
    envDir: '../',
    define: {
      'process.env': env,
    },
  })
}
// https://vitejs.dev/config/