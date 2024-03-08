import { defineStore } from "pinia";
import { getallroles,getrole } from '../http/api'
import { ref } from 'vue'
export const useallroleStore = defineStore('allrole', () => {
  // 定义数据state


  const allroleinfo = ref<any>([]);
  const oneroleinfo = ref<any>([]);


 const menus = ref<any>([]);

 const menutree = ref<any[]>([]);
// 递归方法，根据parentid组成层级结构
const generateMenuTree = (menus:any, parentId = null) => {
  const result:any = [];

  menus.forEach((menu: { parentid: any; id: any; children: any; }) => {
      if (menu.parentid === parentId) {
          const children = generateMenuTree(menus, menu.id);
          if (children.length) {
              menu.children = children;
          }
          result.push(menu);
      }
  });
  return result;
};

// 在getonerole后调用生成菜单树
const generateMenuTreeFromMenus = () => {
  if (menus.value) {
      menutree.value  = generateMenuTree(menus.value);
      //console.log('zuizong',menutree.value);
      // 这里可以将生成的菜单树赋值给一个新的变量存储或者直接使用
  }
};

 
  const getallrole = async () => {
    const res = await getallroles()
    allroleinfo.value= res.data.data
    // console.log('allroleinfo.value',allroleinfo.value)
  }

  const getonerole = async (id:number) => {
    const res = await getrole(id)
    oneroleinfo.value= res.data
    menus.value= res.data.menus
    generateMenuTreeFromMenus()
  }


  return {
    allroleinfo,
    getallrole,
    oneroleinfo,
    getonerole,
    menutree
  }
},
);