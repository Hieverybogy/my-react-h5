import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import progress from 'vite-plugin-progress'

const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as Record<string, string>
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv(process.argv[3] === '--mode' ? process.argv[4] : process.argv[3], root)
  } else {
    env = loadEnv(mode, root)
  }
  return {
    plugins: [react(), Unocss(), progress()],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      alias: [
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`,
        },
      ],
    },
    esbuild: {
      pure: env.VITE_DROP_CONSOLE === 'true' ? ['console.log'] : undefined,
      drop: env.VITE_DROP_DEBUGGER === 'true' ? ['debugger'] : undefined,
    },
    build: {
      target: 'es2015',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true',
      // brotliSize: false,
      rollupOptions: {
        plugins: env.VITE_USE_BUNDLE_ANALYZER === 'true' ? [visualizer()] : [],
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-lib': ['antd-mobile'], // 或 'material-ui', 'tailwindcss' 等
            // 其他按需添加的第三方包
          },
        },
      },
      cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === 'false'),
    },
    server: {
      host: '0.0.0.0', // 可用 IP 访问
      port: 5173,
      open: true, // 自动打开浏览器
      proxy: {
        [env.VITE_API_PROXY_PRVE]: {
          target: env.VITE_API_PROXY_BASE_PATH,
          changeOrigin: true,
          // rewrite: path => path.replace(new RegExp(`^${env.VITE_API_PROXY_PRVE}`, 'g'), ''),
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'dayjs',
        'qs',
        // 其他常用的库
      ],
    },
  }
}
