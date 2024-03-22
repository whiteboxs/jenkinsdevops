const routes = [
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
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            // {
            //     path: '/usermanage',
            //     name: 'usermanage',
            //     meta: {
            //         title: '用户管理',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "usermanage" */ '../views/system/usermanage.vue'),
            // },
            // {
            //     path: '/rolemanage',
            //     name: 'rolemanage',
            //     meta: {
            //         title: '角色管理',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "rolemanage" */ '../views/system/rolemanage.vue'),
            // },
            // {
            //     path: '/charts',
            //     name: 'basecharts',
            //     meta: {
            //         title: '图表',
            //         permiss: '11',
            //     },
            //     component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            // },
            // {
            //     path: '/form',
            //     name: 'baseform',
            //     meta: {
            //         title: '表单',
            //         permiss: '5',
            //     },
            //     component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            // },
            // {
            //     path: '/tabs',
            //     name: 'tabs',
            //     meta: {
            //         title: 'tab标签',
            //         permiss: '3',
            //     },
            //     component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            // },
            // {
            //     path: '/user_tickets',
            //     name: 'myticket',
            //     meta: {  
            //         title: '我的工单',
            //         permiss: '17',
            //     },
            //     component: () => import(/* webpackChunkName: "myticket" */ '../views/ticket/myticket.vue'),
            // },
            // {
            //     path: '/ticket_processing',
            //     name: 'ticket_processing',
            //     meta: {  
            //         title: '工单处理',
            //         permiss: '17',
            //     },
            //     component: () => import(/* webpackChunkName: "ticket_processing" */ '../views/ticket/ticket_processing.vue'),
            // },
            // {
            //     path: '/publish_k8s',
            //     name: 'publish_k8s',
            //     meta: {  
            //         title: '发布k8s',
            //         permiss: '19',
            //     },
            //     component: () => import(/* webpackChunkName: "publish_k8s" */ '../views/publish/publish_k8s.vue'),
            // },
            // {
            //     path: '/publish_java',
            //     name: 'publish_java',
            //     meta: {  
            //         title: '发布后端',
            //         permiss: '20',
            //     },
            //     component: () => import(/* webpackChunkName: "publish_java" */ '../views/publish/publish_java.vue'),
            // },
            // {
            //     path: '/publish_h5',
            //     name: 'publish_h5',
            //     meta: {  
            //         title: '发布前端',
            //         permiss: '21',
            //     },
            //     component: () => import(/* webpackChunkName: "publish_h5" */ '../views/publish/publish_h5.vue'),
            // },
            // {
            //     path: '/permission',
            //     name: 'permission',
            //     meta: {
            //         title: '权限管理',
            //         permiss: '13',
            //     },
            //     component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            // },
            // {
            //     path: '/upload',
            //     name: 'upload',
            //     meta: {
            //         title: '上传插件',
            //         permiss: '6',
            //     },
            //     component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            // },
            // {
            //     path: '/icon',
            //     name: 'icon',
            //     meta: {
            //         title: '自定义图标',
            //         permiss: '10',
            //     },
            //     component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            // },
            // {
            //     path: '/user',
            //     name: 'user',
            //     meta: {
            //         title: '个人中心',
            //     },
            //     component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            // },
            // {
            //     path: '/editor',
            //     name: 'editor',
            //     meta: {
            //         title: '富文本编辑器',
            //         permiss: '8',
            //     },
            //     component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            // },
            // {
            //     path: '/markdown',
            //     name: 'markdown',
            //     meta: {
            //         title: 'markdown编辑器',
            //         permiss: '9',
            //     },
            //     component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            // },
            // {
            //     path: '/export',
            //     name: 'export',
            //     meta: {
            //         title: '导出Excel',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "export" */ '../views/system/export.vue'),
            // },
            // {
            //     path: '/import',
            //     name: 'import',
            //     meta: {
            //         title: '导入Excel',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "import" */ '../views/system/import.vue'),
            // },
            // {
            //     path: '/menu',
            //     name: 'menu',
            //     meta: {
            //         title: '菜单管理',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "menumanage" */ '../views/system/menu.vue'),
            // },
            // {
            //     path: '/ecs',
            //     name: 'ecs',
            //     meta: {
            //         title: '创建ecs',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "ecs" */ '../views/aliyun/ecs.vue'),
            // },
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