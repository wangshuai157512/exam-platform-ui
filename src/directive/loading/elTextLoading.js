import { addClass, getStyle, setStyle } from "@/utils/index";
/**
 * v-elTextLoading 文本loading
 * Copyright (c) 2021 jaya
 */

export default {
  inserted(el) {
    const loadingVnode = document.createElement("p");
    const innerHeight = getStyle(
      el.getElementsByClassName("el-input__inner")[0],
      "height"
    );
    // const innerWidth = el.clientWidth;

    addClass(loadingVnode, "el-text-loading");
    setStyle(loadingVnode, "height", innerHeight);
    // setStyle(loadingVnode, "width", innerWidth);
    setStyle(loadingVnode, "line-height", innerHeight);
    loadingVnode.innerHTML = "<i class='el-icon-loading'></i>加载中";
    el.insertBefore(loadingVnode, el.children[0]);
  },

  update(el, binding, vnode) {
    const { value } = binding;
    const loadingVnode = el.getElementsByClassName("el-text-loading")[0];
    const innerInput = el.getElementsByClassName("el-input")[0];

    if (loadingVnode) {
      setStyle(loadingVnode, "display", value ? "block" : "none");
      setStyle(innerInput, "display", value ? "none" : "block");
    }
  },
};
