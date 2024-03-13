import { defineStore } from 'pinia';
import {getrolemenupermiss} from '../http/api';
import { ref } from 'vue'

export const usePermissStore = defineStore('permiss', () => {

// 获取当前权限
const accesspermiss = ref<string[]>([]);

const updatepermiss = (newaccess:any) => {
	accesspermiss.value = newaccess;
	console.log('权限更新',accesspermiss.value);
};

// 更新权限tree
const getPremission =  async (id:number) => {
	const res= await getrolemenupermiss(id)
    accesspermiss.value = res.data.access
	//console.log('权限接口返回',accesspermiss.value);
};



return {
accesspermiss,
getPremission,
updatepermiss,
}
},
);

