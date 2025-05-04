import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		redirect: {
			name: "login",
		},
	},
	{
		path: "/login",
		name: "login",
		component: () => import("../views/Login.vue"),
	},
	{
		path: "/register",
		name: "register",
		component: () => import("../views/Register.vue"),
	},
	/* 前台首页 */
	{
		path: "/fontHome",
		name: "fontHome",
		component: () => import("../views/Font"),
		meta: {
			type: "admin",
		},
	},
	/* 首页 */
	{
		path: "/home",
		name: "home",
		component: () => import("../views/Home"),
		meta: {
			type: "admin",
		},
	},
	/* 用户管理 */
	{
		path: "/users",
		name: "users",
		component: () => import("../views/User"),
		meta: {
			type: "admin",
		},
	},
	/* 药品类别管理 */
	{
		path: "/types",
		name: "types",
		component: () => import("../views/Type"),
		meta: {
			type: "admin",
		},
	},
	/* 商品管理 */
	{
		path: "/communities",
		name: "communities",
		component: () => import("../views/Community"),
		meta: {
			type: "admin",
		},
	},
	/* 订单管理 */
	{
		path: "/purchases",
		name: "purchases",
		component: () => import("../views/Purchases"),
		meta: {
			type: "admin",
		},
	},
	/* 工单管理 */
	{
		path: "/orderList",
		name: "orderList",
		component: () => import("../views/OrderList"),
		meta: {
			type: "admin",
		},
	},
	/* 咨询管理 */
	{
		path: "/consultation",
		name: "consultation",
		component: () => import("../views/Consultation"),
		meta: {
			type: "admin",
		},
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

// 解决导航栏中重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};

export default router;
