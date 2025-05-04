import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Utils from "./plugins";

/* 组件 */
import cardComponent from "@/components/carConponent";
Vue.component("card-box", cardComponent);

// moment处理时间
import moment from "moment";
// 引入样式
import "@/assets/css/index.less";
// api
import Apis from "@/axios/index.js";

// 图表
import * as echarts from "echarts";

Vue.config.productionTip = false;
Vue.prototype.$moment = moment;
Vue.prototype.$Apis = Apis;
Vue.prototype.$utils = Utils;
Vue.prototype.$echarts = echarts;

// 引入antd样式
import "ant-design-vue/dist/antd.less";
import Antd from "ant-design-vue";
Vue.use(Antd);

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
