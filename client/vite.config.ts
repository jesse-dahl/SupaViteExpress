import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { CLIENT_ENV } from '@sve/env'

export default ({ mode }: { mode: string }) => {
  // const env = loadEnv(mode, process.cwd())
  return defineConfig({
    preview: {
      port: 3001,
    },
    // for dev
    server: {
      port: 3000,
    },
    // build:{
    //   outDir: "build"
    // },
    plugins: [react()],
    define: {
      'process.env': CLIENT_ENV,
    },
    // resolve: {
    //   alias: {
    //     '@shared': path.resolve(__dirname, '../packages/shared')
    //   }
    // },
    // ssr: {
    //   noExternal: ['dotenv'],
    // }
  })
}
// https://vitejs.dev/config/