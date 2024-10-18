import { defineConfig, loadEnv } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

dotenv.config()

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
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
      'process.env': process.env,
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, '../packages/shared')
      }
    },
    build: {
      commonjsOptions: { transformMixedEsModules: true } // Change
    },
    ssr: {
      noExternal: ['dotenv'],
    }
  })
}
// https://vitejs.dev/config/