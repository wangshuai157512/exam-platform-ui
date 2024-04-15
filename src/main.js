import Vue from "vue";

import Cookies from "js-cookie";

import Element from "element-ui";
import "./assets/styles/element-variables.scss";

import echarts from "echarts";

import handleNotice from "@/utils/g-tips";
import handleWaring from "@/utils/g-Waring";

// import VueAMap from "vue-amap";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/jaya.scss"; // jaya css
import "nprogress/nprogress.css";
import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; //directive
import jayaComponents from "./components"; //全局组件

import "./assets/icons"; // icon
import "./permission"; // permission control

import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree
} from "@/utils/jaya";
// 头部标签组件
import VueMeta from "vue-meta";

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.$event = new Vue();
Vue.prototype.$echarts = echarts;

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgWarn = function (msg) {
  this.$message({ showClose: true, message: msg, type: "warning" });
};

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
};

Vue.prototype.diffLog = function (obj, obj1, name) {
  const log = [];
  Object.keys(obj1).forEach(function (key) {
    if (typeof obj[key] != null && typeof obj[key] === "object") {
      if (JSON.stringify(obj[key]) != JSON.stringify(obj1[key])) {
        log.push(`${name[key] || key}：由${obj[key]}改为${obj1[key]}`);
      }
    } else if (obj[key] != obj1[key]) {
      log.push(`${name[key] || key}：由${obj[key]}改为${obj1[key]}`);
    }
  });
  return log.join() || null;
};

// 全局组件挂载
Vue.use(directive);
Vue.use(VueMeta);

// 地图
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   key: "9fe0507459f508944760d27eac45c2f4", // 高德开放平台key
//   // 地图插件
//   plugin: [
//     "AMap.Marker",
//     "AMap.Polyline",
//     "AMap.Autocomplete",
//     "AMap.PlaceSearch",
//     "AMap.Scale",
//     "AMap.OverView",
//     "AMap.ToolBar",
//     "AMap.MapType",
//     "AMap.PolyEditor",
//     "AMap.CircleEditor",
//     "AMapUI.loadUI",
//   ],
// });

Vue.use(Element, {
  size: Cookies.get("size") || "medium" // set element-ui default size
});
Vue.use(jayaComponents);

Vue.config.productionTip = false;

handleNotice();
// handleWaring();
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App)
});
