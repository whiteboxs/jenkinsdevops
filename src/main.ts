import { createApp } from 'vue';
import pinia from './store/index.ts'
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import { ElLoading } from 'element-plus'
//全局密码加密
// import { AES_Encrypt, AES_Decrypt } from './utils/aes.ts';


const app = createApp(App);
app.use(pinia)
app.use(router)

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        console.log('binding',binding)
        if (!permiss.button_accesspermiss.includes(binding.value)) {
            //el['hidden'] = true;
            el.remove();
        }
    },
});
app.directive('loading',ElLoading.directive)//【新增】

// app.config.globalProperties.$AES_Encrypt = AES_Encrypt //全局加密
// app.config.globalProperties.$AES_Decrypt = AES_Decrypt //全局解密

app.mount('#app');
