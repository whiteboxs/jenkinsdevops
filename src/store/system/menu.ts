import { defineStore } from "pinia";
import { getallmenus } from '@/http/api'
import { ref } from 'vue'
export const useallmenuStore = defineStore('allmenu', () => {
  // 定义数据state

  
  const allmenuinfo = ref<any>([]);

   
  const menutree = ref<any[]>([]);
 // 递归方法，根据parentid组成层级结构
 const generateMenuTree = (menus:any, parentId = null) => {
  const result:any = [];
  menus
  .filter((menu: { parentid: any; id: any; children: any; }) => menu.parentid === parentId)
  .sort((a: { menu_order: number; }, b: { menu_order: number; }) => a.menu_order - b.menu_order) // 根据 menu_order 字段进行升序排序
  .forEach((menu: { parentid: any; id: any; children: any; }) => {
          const children = generateMenuTree(menus, menu.id);
          if (children.length) {
              menu.children = children;
          }
          result.push(menu);
  });
  return result;
};
 
 // 在getonerole后调用生成菜单树
 const generateMenuTreeFromMenus = () => {
   if (allmenuinfo.value) {
       menutree.value  = generateMenuTree(allmenuinfo.value);
       //console.log('角色菜单',menutree.value);
       // 这里可以将生成的菜单树赋值给一个新的变量存储或者直接使用
   }
 };
 
 
  const getallmenu = async () => {
    const res = await getallmenus()
    allmenuinfo.value= res.data.data
    generateMenuTreeFromMenus()
  }

  return {
    allmenuinfo,
    getallmenu,
    menutree
  }
},
);