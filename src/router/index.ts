import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import { useAuthStore } from '../store/login.ts';
import { useallroleStore } from '../store/role'
import { getrole } from '../http/api'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
           {
                path: '/usercenter',
                name: 'usercenter',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "usercenter" */ '../views/usercenter.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
    {
      
        path: '/:pathMatch(.*)*',// 此写法解决动态路由页面刷新的 warning 警告
        component: () => import('../views/404.vue'),
    },
];

// const asyncRoutes = []

const router = createRouter({
    history: createWebHashHistory(),
    routes
});


//全局获取路径不然带路径的匹配不到
let modules = import.meta.glob('../views/**/**/*.vue')
// 添加一个标志来标记是否已经添加过路由
let isRoutesAdded = false; 

let routerGuardCallCount = 0;
router.beforeEach((to, from, next) => {
    if (to.path === '/login' || to.path === '/403'||to.path === '/:pathMatch(.*)*') {  
        return next();  
    } 
    routerGuardCallCount++;
    console.log('trouterGuardCallCount',routerGuardCallCount)

    document.title = `${to.meta.title} | devops平台`;
    const usestore = useAuthStore();
    const permiss = usePermissStore()
    const role = useallroleStore()
    if (!usestore.userinfo.access_token && to.path !== '/login') {  
        return next('/login');  
     }  
    
    if(usestore.userinfo.access_token){
        if(!isRoutesAdded) {
        //console.log('isRoutesAdded',isRoutesAdded)
        getrole(usestore.userinfo.role_id).then(res => {
            //将服务端返回的数据转换为路由配置数据
            role.updateoneroleinfo(res.data)
            const dynamicRoute = addDynamicRoute(role.oneroleinfo.menus)
            router.addRoute(dynamicRoute);

            isRoutesAdded = true;
            console.log('查看现有路由',router.getRoutes());
            // console.log('router.hasRoutedashboard',router.hasRoute('dashboard'))
            // console.log('permiss',to.path,to.meta.permiss,to.meta.title)
            next({ ...to, replace: true });
        });
      } else { 
             //console.log('isPermisssAdded',permiss.isPermisssAdded)
            if(!permiss.isPermisssAdded) {
                //console.log('permiss.accesspermiss前',permiss.accesspermiss);
                if (permiss.accesspermiss.length == 0) {
                    permiss.getPremission(usestore.userinfo.role_id).then(() => { 
                    //console.log('permiss.accesspermiss后',permiss.accesspermiss);
                    permiss.isPermisssAdded = true
                    next({ ...to, replace: true });
                    })
                }  
            } else 
                    {
                    //console.log('中断2次后开始比对')
                    //console.log('router.hasRoutedashboard',router.hasRoute(to.name!),to.meta.permiss)
                    if (permiss.accesspermiss.includes(to.meta.permiss as string) || to.path === '/usercenter'){ 
                           
                            //console.log(' 比对通过放行', to.meta.permiss);
                            next()
                            return
                    
                    } else {
                           if (router.hasRoute(to.name!)){
                            //console.log(' 403403')
                            next('/403');  
                           } else {
                            //console.log('404')
                            next({path:'/:pathMatch(.*)*',replace:true})
                                  }
                           
                           }
                    }
            }            
    } else {    
     next()
    } 
});


function addDynamicRoute(dynamicRoutes:any){
    const homeRoute = routes.filter(v=>v.name==='Home')[0];
    //homeRoute.children = [];
    dynamicRoutes.forEach((item: { path: any; title: any; permiss: any; route_name: any; route_component: any; menu_type:any}) => {
        if (item.menu_type === 'menu') {
            homeRoute.children?.push({
                path: item.path,
                meta: { title: item.title, 
                        permiss: item.permiss },
                name: item.route_name,
                component: modules[`../views/${item.route_component}.vue`]
                //component: () => import(`../views/system/usermanage.vue`)
            }) 
        }  
    });
    return homeRoute
}
 


    //获取角色权限持久化
    // console.log('permiss.accesspermiss',permiss.accesspermiss);
    // if (!permiss.accesspermiss) {
    //     permiss.getPremission(usestore.userinfo.role_id).then((res1) => { 
    //     next({ ...to, replace: true });
    //     }).catch((error) => {  
    //         // 处理错误情况  
    //         console.error('获取权限失败:', error);  
    //         next('/:pathMatch(.*)*'); // 导航到错误页面  
    //     });  

    // }
        
    // else {
    //     if (!permiss.accesspermiss.includes(to.meta.permiss)){ 
    //     console.log(' 403403');
    //     next('/403')  

    //     } else {
    //         console.log(' 比对后通过', to.meta.permiss);
    //         //isRoutesAdded = false;
    //         next();  
    //     }   
    //} 


// 这么写追加到根目录
// function adderouteData(){
//     getallroute().then(res => {
//         const dynamicRoutes = res.data.data;
//         dynamicRoutes.forEach((item: { path: any; title: any; permiss: any; route_name: any; route_component: any; }) => {
//             //routes[1].children?.push({
//                 const route = {
//                     path: item.path,
//                     meta: { title: item.title, 
//                             permiss: item.permiss },
//                     name: item.route_name,
//                     component: modules[`../views/${item.route_component}.vue`]
//                     //component: () => import(`../views/system/usermanage.vue`)
//                 }    
//                     //这样加入也可以虽然打印出来都不在Home的子路由中，但是实际好像是生效了
//                 router.addRoute('Home', route);
                
//         });
//         // routestore.updaterouteinfo(router.getRoutes())
//         // console.log('updatepiniaroute',routestore.routeinfo)
//             //console.log('push路由',router.getRoutes());    
//         //routes.forEach((route) => router.addRoute(route))
//         isRoutesAdded = true;
//         console.log('查看现有路由',router.getRoutes());
//         console.log('router.hasRoutedashboard',router.hasRoute('dashboard'))
// })
// }




    //if(useallroleStore().menutree && useallroleStore().menutree.length == 0){
    //     useallroleStore().getonerole(usestore.userinfo.role_id).then(()=>{
    //         console.log('menutree11',useallroleStore().menutree)
    //     useallroleStore().oneroleinfo.menus.forEach((p) => {
    //         router.addRoute({
    //             path: p.path,
    //             meta: { title: p.title, isAsync: true, permiss: p.permiss },
    //             name: p.route_name,
    //             component: () => import(`../views/${p.route_component}.vue`),
    //             children: p.children.map((item)=> ({
    //                 path: item.path,
    //                 component:()=>import(`../views/${p.route_component}.vue`),
    //             })),
    //         });
    //     console.log(router.getRoutes(), '循环现有路由');
    //     })
    //     console.log(router.getRoutes(), '查看现有路由');
    //         next({ ...to, replace: true }); // 如果已经添加过路由，则直接放行
    //     })
    // //} else
    // {
    //     next();
    //       } 

//     //获取数据，拼接数据
// function routesData(result:any){
//     //根据数据动态生成路由
//     const routesdata:any = [];
//     result.forEach((item)=>{
//       routes.push({
//         path: item.path,
//         name: item.route_name,
//         meta: {
//             title: item.title,
//             permiss: item.permiss,
//         },
//         component:()=>import(`../views/${item.route_component}.vue`)
//         })
//     })
//     console.log('routesdata',routes);
//     return routesdata;
// }









export default router;
