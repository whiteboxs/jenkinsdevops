<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
            :default-active="$route.path"
        >
            <template v-for="item in role.menutree">
                <template v-if="item.children">
                    <el-sub-menu  :index="item.path" :key="item.path" >
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-sub-menu v-if="subItem.children" :index="subItem.path" :key="subItem.path" >
                                    <template #title>
                                        <el-icon>
                                            <component :is="subItem.icon"></component>
                                        </el-icon>
                                        {{ subItem.title }}
                                    </template>
                                <el-menu-item v-for="(threeItem, subindex) in subItem.children" :key="subindex" :index="threeItem.path">
                                        <el-icon>
                                            <component :is="threeItem.icon"></component>
                                        </el-icon>
                                        {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu> 
                            <el-menu-item v-else :index="subItem.path">
                                <el-icon>
                                <component :is="subItem.icon"></component>
                                </el-icon>
                                {{ subItem.title }} 
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.path" >
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
import { computed,onMounted,ref} from 'vue';
import { useSidebarStore } from '@/store/sidebar';
import { useRoute } from 'vue-router';
import { useallroleStore } from '@/store/role';





const role = useallroleStore();

//default-active="$route.path" 刷新保持在当前位置，element带的不然就需要使用sessionstore



// const route = useRoute();
// const onRoutes = computed(() => {
//     return route.path;
// });

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
