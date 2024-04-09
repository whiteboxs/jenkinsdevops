import { defineStore } from "pinia";
import { getallroles,getrole } from '../http/api'
import { ref } from 'vue'
export const useallroleStore = defineStore('allrole', () => {
  // 定义数据state


  const allroleinfo = ref<any>([]);
  const oneroleinfo = ref<any>([]);




 const menutree = ref<any[]>([]);


 // 路由守卫里执行了获取当前角色的menus信息 更新到onrole和roletree
const updateoneroleinfo = (newroleinfo:any) => {
	oneroleinfo.value = newroleinfo;
  if (oneroleinfo.value.menus) {
    menutree.value  = generateMenuTree(oneroleinfo.value.menus);
    //console.log('zuizong',menutree.value);
    // 这里可以将生成的菜单树赋值给一个新的变量存储或者直接使用
  }
	console.log('当前角色信息更新',oneroleinfo.value);
};

// 退出的时候要清理oneroleinfo 不然不刷新页面登录其他账号显示的是上个账号的导航
const cleanoneroleinfo  = () => {  
	// 在这里可以进行登出逻辑，清除持久化并执行其他操作
  oneroleinfo.value = [];
  };


// 递归方法，根据parentid组成层级结构
const generateMenuTree = (menus:any, parentId = null) => {
  const result:any = [];

  menus
  .filter((menu: { parentid: any; id: any; children: any; menu_type:any }) => menu.parentid === parentId && menu.menu_type !== 'button')  
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
  if (oneroleinfo.value.menus) {
      menutree.value  = generateMenuTree(oneroleinfo.value.menus);
      //console.log('zuizong',menutree.value);
      // 这里可以将生成的菜单树赋值给一个新的变量存储或者直接使用
  }
};

 
  const getallrole = async () => {
    const res = await getallroles()
    allroleinfo.value= res.data.data
    //console.log('allroleinfo.value',allroleinfo.value)
  }

  const getonerole = async (id:number) => {
    const res = await getrole(id)
    oneroleinfo.value= res.data
    //menus.value= res.data.menus
    generateMenuTreeFromMenus()
  }


  return {
    allroleinfo,
    getallrole,
    oneroleinfo,
    getonerole,
    menutree,
    updateoneroleinfo,
    cleanoneroleinfo
  }
},
);