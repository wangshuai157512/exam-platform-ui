<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        settings.sideTheme === 'theme-dark'
          ? variables.menuBg
          : variables.menuLightBg,
    }"
  >
    <login-dialog v-if="logInfo" :data="logInfo" />
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-openeds="activeSubMenu"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuBg
            : variables.menuLightBg
        "
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuText
            : 'rgba(0,0,0,.65)'
        "
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <div class="logMsg" v-if="!isCollapse && logInfo">
      <p>上次登录信息：</p>
      <div v-if="logInfo.prevLog">
        <p>登录IP： {{ logInfo.prevLog.ip }}</p>
        <p>登录时间：{{ logInfo.prevLog.createTime }}</p>
        <p>登录详情：{{ logInfo.prevLog.logInfo }}</p>
      </div>
      <div>
        <p>有效时期：</p>
        <p>
          密码有效期至{{ logInfo.pwdExpireDate }}，剩余{{
            logInfo.pwdExpireDay
          }}天
        </p>
        <p>
          账号有效期至{{ logInfo.userEndDate }}，剩余{{ logInfo.expireDay }}天
        </p>
      </div>
      <div v-if="logInfo.thisLog">
        <p>本次登录成功信息：</p>
        <p>登录IP： {{ logInfo.thisLog.ip }}</p>
        <p>登录时间：{{ logInfo.thisLog.createTime }}</p>
        <p>登录详情：{{ logInfo.thisLog.logInfo }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getLoginLog } from "@/api/login";
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import LoginDialog from "./LoginDialog.vue";
import variables from "@/assets/styles/variables.scss";

export default {
  data() {
    return {
      isScroll: null,
      activeSubMenu: [],
      logInfo: null,
    };
  },
  components: { SidebarItem, Logo, LoginDialog },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set

      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },

    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  watch: {
    sidebarRouters(routers) {
      if (this.activeSubMenu == routers[0].path) return;
      if (routers[0].children) {
        this.activeSubMenu = [routers[0].path];
      } else {
        this.activeSubMenu = [];
      }
    },
  },
  mounted() {
    getLoginLog().then((res) => {
      this.logInfo = res.data;
    });
  },
  methods: {
    hasScrolled() {
      let menuH = document.querySelector(".el-scrollbar").clientHeight;
      let logMsgH = document.querySelector(".logMsg")?.clientHeight;
      let sidebarH = menuH + logMsgH + 50; // 内容总高度
      let windowH = document.body.clientHeight; // 浏览器窗口高度
      this.isScroll = sidebarH - windowH;
    },
  },

  updated() {
    let that = this;
    that.hasScrolled();
    window.onresize = function () {
      that.hasScrolled();
    };
  },
};
</script>
<style lang="scss" scope>
.logMsg {
  color: #fff;
  font-size: 12px;
  // position: absolute;
  // bottom: 0;
  opacity: 0.7;
  padding: 0 16px;
  box-sizing: border-box;
  width: 100%;
  h6 {
    margin-bottom: 25px;
    margin-top: 0;
  }
  p {
    margin-bottom: 10px;
  }
}
.logMsg > div {
  margin-bottom: 10px;
  border-bottom: 1px solid #fff;
}
</style>
