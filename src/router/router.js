import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/group',
        icon: 'ios-folder',
        name: 'group',
        title: '人员管理',
        access: 1,
        component: Main,
        children: [
            {
                path: 'usermanage',
                icon: 'ios-paper-outline',
                name: 'usermanage',
                title: '用户管理',
                access: 1,
                component: resolve => { require(['@/views/group/usermanage/usermanage.vue'], resolve); }
            },
            {
                path: 'pendingmanage',
                icon: 'ios-list-outline',
                name: 'pendingmanage',
                title: '审核人员管理',
                access: 1,
                component: resolve => { require(['@/views/group/pendingmanage/pendingmanage.vue'], resolve); }
            }
        ]
    },
    {
        path: '/video',
        icon: 'ios-paper',
        title: '视频管理',
        name: 'video',
        component: Main,
        children: [
            {
                path: 'checkPending',
                icon: 'ios-paper-outline',
                name: 'checkPending',
                title: '待审核',
                component: resolve => { require(['@/views/video/checkpending/checkpending.vue'], resolve); }
            },
            {
                path: 'chenked',
                icon: 'ios-list-outline',
                name: 'chenked',
                title: '已审核记录',
                component: resolve => { require(['@/views/video/checked/checked.vue'], resolve); }
            },
            {
                path: 'videpList',
                icon: 'ios-list-outline',
                name: 'videpList',
                title: '视频管理',
                component: resolve => { require(['@/views/video/videolist/videolist.vue'], resolve); }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];
