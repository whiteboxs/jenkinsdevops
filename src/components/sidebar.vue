<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-sub-menu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                                v-permiss="item.permiss"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, subindex) in subItem.subs" :key="subindex" :index="threeItem.index">
                                    <el-icon>
                                    <component :is="threeItem.icon"></component>
                                    </el-icon>
                                    {{ threeItem.title }}
                                  
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                                <el-icon>
                                <component :is="subItem.icon"></component>
                                </el-icon>
                                {{ subItem.title }}
                                
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

const items = [
    {
        icon: 'Odometer',
        index: '/dashboard',
        title: '系统首页',
        permiss: '1',
    },
    {
        icon: 'Setting',
        index: '1',
        title: '系统管理',
        permiss: '2',
        subs: [
            {
                icon: 'User',
                index: '/usermanage',
                title: '用户管理',
                permiss: '2',
            },
            {
                icon: 'UserFilled',
                index: '/rolemanage',
                title: '角色管理',
                permiss: '2',
            },
            {
                icon: 'Upload',
                index: '/import',
                title: '导入Excel',
                permiss: '2',
            },
            {
                icon: 'Download',
                index: '/export',
                title: '导出Excel',
                permiss: '2',
            },
        ],
    },
    {
        icon: 'DocumentCopy',
        index: '/tabs',
        title: 'tab选项卡',
        permiss: '3',
    },
    {
        icon: 'Edit',
        index: '3',
        title: '表单相关',
        permiss: '4',
        subs: [
            {
                icon: 'Document',
                index: '/form',
                title: '基本表单',
                permiss: '5',
            },
            {
                icon: 'UploadFilled',
                index: '/upload',
                title: '文件上传',
                permiss: '6',
            },
            {
                icon: 'Operation',
                index: '4',
                title: '三级菜单',
                permiss: '7',
                subs: [
                    {
                        icon: 'Edit',
                        index: '/editor',
                        title: '富文本编辑器',
                        permiss: '8',
                    },
                    {
                        icon: 'Edit',
                        index: '/markdown',
                        title: 'markdown编辑器',
                        permiss: '9',
                    },
                ],
            },
        ],
    },
    {
        icon: 'Setting',
        index: '/icon',
        title: '自定义图标',
        permiss: '10',
    },
    {
        icon: 'PieChart',
        index: '/charts',
        title: 'schart图表',
        permiss: '11',
    },
    {
        icon: 'Warning',
        index: '/permission',
        title: '权限管理',
        permiss: '13',
    },
    {
        icon: 'Management',
        index: '4',
        title: '工单管理',
        permiss: '14',
        subs: [
            {   
                icon: 'DocumentAdd',
                index: '/user_tickets',
                title: '我的工单',
                permiss: '17',
            },
            { 
                icon: 'Ticket',
                index: '/ticket_processing',
                title: '工单处理',
                permiss: '17',
            },
        ],
    },
    {
        icon: 'Refresh',
        index: '5',
        title: '发布管理',
        permiss: '18',
        subs: [
            {
                icon: 'RefreshRight',
                index: '/publish_k8s',
                title: '发布k8s',
                permiss: '19',
            },
            {
                icon: 'RefreshRight',
                index: '/publish_java',
                title: '发布后端',
                permiss: '20',
            },
            {
                icon: 'RefreshRight',
                index: '/publish_h5',
                title: '发布前端',
                permiss: '21',
            },
        ],
    },
];

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
