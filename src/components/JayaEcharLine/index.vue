<template>
  <div class="line" id="line"></div>
</template>

<script>
export default {
  name: "JayaEcharLine",
  //接收从父组件传回的值
  props: ["getData"],
  data() {
    return {};
  },
  //实时监听父组件传过来的值，进而执行drawBar方法，重绘柱状图
  watch: {
    getData: {
      handler(value) {
        this.drawBar(value);
      },
      deep: true,
    },
  },
  mounted() {
    this.drawBar(this.getData);
  },
  methods: {
    drawBar({ textTitle = "", nameArray = [], dataArray = [] } = {}) {
      const lineBox = this.$echarts.init(document.getElementById("line"));
      const option = {
        title: {
          text: textTitle,
          right: "center",
        },
        xAxis: {
          type: "category",
          data: nameArray,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: dataArray,
            type: "line",
            color: "#facc64",
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      };
      lineBox.setOption(option, true);
    },
  },
};
</script>
<style scoped>
.line {
  height: 500px;
}
</style>
