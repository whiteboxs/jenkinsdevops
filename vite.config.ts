import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'

export default defineConfig({
	base: './',
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
});
