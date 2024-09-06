import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import { CLIENT_ENV } from '@sve/env'

export default ({ mode } : { mode: any }) => {
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
      'process.env': CLIENT_ENV,
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, '../packages/shared')
      }
    },
    build: {
      commonjsOptions: { transformMixedEsModules: true } // Change
    }
  })
}
// https://vitejs.dev/config/