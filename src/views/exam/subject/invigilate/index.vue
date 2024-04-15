<template>
  <div class="container">
    <nav-top @review="handleSwitch" @checkedChange="handleCheckedChange" />
    <ul>
      <li
        v-for="(item, index) in data"
        :key="item.kchp"
        :id="item.kchp"
        :class="[
          clickModeuleIndex == index
            ? 'screen'
            : clickModeuleIndex != null
            ? 'noscreen'
            : ''
        ]"
      >
        <view-module
          :ref="item.kchp"
          :key="item.kchp"
          :carType="carType"
          :id="item.kchp"
          @setScreen="handleScreen"
          @open="handleOpen"
          @close="handleClose"
          :index="index"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import NavTop from "@/views/exam/components/navtop";
import ViewModule from "./components/viewmodule.vue";
document.title = "考试监考";
export default {
  name: "invigilate",
  components: { NavTop, ViewModule },
  data() {
    return {
      clickModeuleIndex: null,
      isOpenAudio: false,
      isOpenSound: false,
      openedId: null,
      data: []
    };
  },
  mounted() {},
  methods: {
    handleSwitch() {
      // this.data = [];
    },

    handleScreen(e) {
      this.clickModeuleIndex = e;
    },

    handleCheckedChange({ checkList, carType }) {
      this.data = checkList;
      this.carType = carType;
    },

    handleOpen({ status, type, id }) {
      if (status) {
        this.openedId = id;
        if (type == "sound") {
          this.isOpenSound = status;
        } else {
          this.isOpenSound = status;
          this.isOpenAudio = status;
        }
      } else {
        if (type == "sound") {
          this.isOpenSound = status;
          this.isOpenAudio = status;
          this.openedId = null;
        } else {
          this.isOpenAudio = status;
        }
      }
    },

    handleClose({ type, id }) {
      if (this.openedId == id || !this.openedId) return;
      if (type == "sound") {
        this.$refs[this.openedId][0].sound();
      } else {
        this.$refs[this.openedId][0].voice();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
body,
html,
.container {
  min-height: 100%;
}
.container {
  background-color: #001529;
}
ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 15px;
  li {
    width: 50%;
    display: inline-block;
    box-sizing: border-box;
  }
  .screen {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .noscreen {
    display: none;
  }
}
</style>
