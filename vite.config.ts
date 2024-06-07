import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'

export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd())
     // 根据不同的构建命令和环境变量加载不同的配置
	const {VITE_APP_ENV} = env
	return {
	base: VITE_APP_ENV === 'production' ? '/' : '/',
	plugins: [
		vue(),
		AutoImport({
			imports:
			[
			'vue',
			'vue-router'
		    ],
		}),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	css: {
		preprocessorOptions: {
		  less: {
			javascriptEnabled: true,
		  },
		},
	  },
	  resolve: {
		// 配置路径别名
		alias: {
		  '@': path.resolve(__dirname, './src'),
		},
	  },

	server: {
		port: 5173,
		host: true,
		proxy: {
			'/dev-api': {
				target: 'http://127.0.0.1:9002',
				changeOrigin: true,
				rewrite: (p) => p.replace(/^\/dev-api/, '')
			}
		}
	},
	build: {
		outDir: 'dist', // 生成输出的根目录。如果该目录存在，则会在生成之前将其删除。 默认文件夹名称为dist
		target: 'esnext',
		terserOptions: {
		  compress: {
			drop_console: true, // 生产环境去掉控制台 console
			drop_debugger: true, // 生产环境去掉控制台 debugger 默认就是true
			dead_code: true, // 删除无法访问的代码 默认就是true
		  }
		},
		chunkSizeWarningLimit: 2000, // 调整区块大小警告限制
	  }
}
})




