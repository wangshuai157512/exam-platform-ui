import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
/* Layout */
import Layout from "@/layout";

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

// 公共路由
export const constantRoutes = [{
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [{
            path: "/redirect/:path(.*)",
            component: (resolve) => require(["@/views/redirect"], resolve),
        }, ],
    },
    {
        path: "/login",
        component: (resolve) => require(["@/views/login"], resolve),
        hidden: true,
    },
    {
        path: "/404",
        component: (resolve) => require(["@/views/error/404"], resolve),
        hidden: true,
    },
    {
        path: "/401",
        component: (resolve) => require(["@/views/error/401"], resolve),
        hidden: true,
    },
    {
        path: "/config/network",
        component: (resolve) => require(["@/views/config/network"], resolve),
        hidden: true,
    },
    {
        path: "",
        component: Layout,
        redirect: "index",
        children: [{
            path: "index",
            component: (resolve) => require(["@/views/index"], resolve),
            name: "Index",
            meta: { title: "首页", icon: "dashboard", affix: true },
        }, ],
    },
    {
        path: "/dict",
        component: Layout,
        hidden: true,
        children: [{
            path: "type/data/:dictId(\\d+)",
            component: (resolve) => require(["@/views/system/dict/data"], resolve),
            name: "Data",
            meta: { title: "字典数据", icon: "" },
        }, ],
    },
    {
        path: "/dicts",
        component: Layout,
        hidden: true,
        children: [{
            path: "type/data/:dictId(\\d+)",
            component: (resolve) => require(["@/views/exam/dict/data"], resolve),
            name: "Data",
            meta: { title: "字典数据", icon: "" },
        }, ],
    },
    {
        path: "/system/role-auth",
        component: Layout,
        hidden: true,
        children: [{
            path: "user/:roleId(\\d+)",
            component: (resolve) =>
                require(["@/views/system/role/authUser"], resolve),
            name: "AuthUser",
            meta: { title: "分配用户", activeMenu: "/system/role" },
        }, ],
    },
    {
        path: "/exam/invigilate",
        component: (resolve) =>
            require(["@/views/exam/subject/invigilate/index"], resolve),
        hidden: true,
    },
    {
        path: "/exam/map",
        component: (resolve) =>
            require(["@/views/exam/subject/map/index"], resolve),
        hidden: true,
    },
    {
        path: "/exam/record/transcript",
        name: "TranScript",
        component: (resolve) =>
            require(["@/views/exam/subject/record/transcript"], resolve),
        hidden: true,
    },
    {
        path: "/exam/record/videoplay",
        name: "VideoPlay",
        component: (resolve) =>
            require(["@/views/exam/subject/record/videoplay"], resolve),
        hidden: true,
    },
    {
        path: "/exam/iframe",
        name: "IframeView",
        component: (resolve) =>
            require(["@/views/exam/subject/statistics/iframeview"], resolve),
        hidden: true,
    },
    {
        path: "/addwaring",
        name: "Addwaring",
        component: (resolve) =>
            require([
                "@/views/exam/subject/invigilate/components/addwaring",
            ], resolve),
        hidden: true,
    },
    {
        path: "/exam/accesscontrol/fullscreen",
        name: "fullscreen",
        component: (resolve) =>
            require(["@/views/exam/subject/accesscontrol/fullscreen"], resolve),
        hidden: true,
    },
];

export default new Router({
    mode: "history", // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
});