<template>
  <div class="app-container">
    <div v-if="notHomeName == ''">
      <div>
        <p style="color: #868585">{{ date }}</p>
        <h2>考试系统查询统计</h2>
      </div>
      <span
        v-for="(menu, index) in menuList"
        :key="index"
        @click="jump(menu.menuPath)"
        class="tag"
        ><el-button type="primary" plain>{{ menu.menuName }}</el-button></span
      >
    </div>
    <iframe
      v-show="notHomeName"
      id="bdIframe"
      @load="loading"
      style="width: 100%; height: 100%;margin: auto;"
      :src="'/exam/iframe?' + notHomeName"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "statistics",
  data() {
    return {
      notHomeName: "",
      date: this.parseTime(new Date(), "{y}年{m}月{d}日 星期{a}"),
      menuList: [
        { menuName: "考场合格率统计", menuPath: "ExamRoom" },
        { menuName: "考车合格率统计", menuPath: "ExamCar" },
        { menuName: "考场合格率按天统计", menuPath: "ExamRoomDays" },
        { menuName: "考试车型合格率统计", menuPath: "examcartype" },
        { menuName: "驾校合格率统计", menuPath: "ExamSchool" },
        { menuName: "扣分项统计", menuPath: "Deduction" },
        { menuName: "考试项目统计", menuPath: "ExamItem" },
        { menuName: "考试员扣分项统计", menuPath: "ExamInerDeduction" },
        { menuName: "考试员合格率统计", menuPath: "ExamIner" },
        { menuName: "人工评判次数统计", menuPath: "Manual" },
        { menuName: "考试线路合格率统计", menuPath: "ExamLine" },
        { menuName: "人工评判率统计", menuPath: "Manuals" }
      ]
    };
  },
  mounted() {
    window.addEventListener("message", this.messageCallBack, false);
  },
  destroyed() {
    window.removeEventListener("message", this.messageCallBack, false);
  },
  methods: {
    messageCallBack() {
      this.notHomeName = "";
    },

    jump(path) {
      this.notHomeName = path;
    },

    loading() {
      const oIframe = document.getElementById("bdIframe");
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.height = Number(deviceHeight) - 120 + "px";
      if ("ActiveXObject" in window) {
        if (
          oIframe.contentWindow.location.href.split("?").length == 1 ||
          oIframe.contentWindow.location.href.split("?")[1] == ""
        ) {
          this.notHomeName = "";
        }
      }
    }
  }
};
</script>
<style scoped>
.t-container {
  margin-bottom: 10px;
}

.tag {
  margin: 8px;
  display: inline-block;
}

.app-container .el-form {
  padding: 0;
}

.app-container {
  height: 100%;
}
</style>
