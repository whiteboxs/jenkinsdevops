import { defineStore } from 'pinia';
import {getrolemenupermiss} from '../http/api';
import { ref } from 'vue'

export const usePermissStore = defineStore('permiss', () => {

// 登录获取当前权限
const accesspermiss = ref<string[]>([]);


// 登录路由守卫获取权限
const getPremission =  async (id:number) => {
	const res= await getrolemenupermiss(id)
    accesspermiss.value = res.data.access
	
};


//角色分配获取不同角色的权限存储ref
const rolepermiss = ref<string[]>([]);


// 用户role分配权限修改的时候更新
const updatepermiss = (newaccess:any) => {
	rolepermiss.value = newaccess;
	console.log('权限更新',rolepermiss.value);
};

// 角色分配获取不同角色的权限存储ref get
const getrolePremission =  async (id:number) => {
	const res= await getrolemenupermiss(id)
    rolepermiss.value = res.data.access
	
};



//退出的时候也会设置为flase
const  isPermisssAdded = ref(false);

const cleanaccesspermiss  = () => {  
	// 在这里可以进行登出逻辑，清除token并执行其他操作
	accesspermiss.value = [];
	// 同样要清除本地存储的token
	sessionStorage.removeItem('accesspermiss');
	isPermisssAdded.value = false
  };


return {
accesspermiss,
getPremission,
updatepermiss,
cleanaccesspermiss,
isPermisssAdded,
getrolePremission,
rolepermiss

}
},

    //开启数据缓存
    // { persist: {
	// 	enabled: true,
	// 	strategies: [{
	// 	  key: 'accesspermiss',
	// 	  storage: sessionStorage,
	// 	}]
	//   }
	// }
);

