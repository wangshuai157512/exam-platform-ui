<template>
  <div ref="bar" class="bar" id="bar"></div>
</template>

<script>
export default {
  name: "JayaEcharBar",
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
    drawBar({
      textTitle = "",
      nameArray = [],
      dataArray = [],
      options = {},
    } = {}) {
      const barBox = this.$echarts.init(this.$refs.bar);
      const option = {
        title: {
          text: textTitle,
          right: "center",
        },
        legend: {},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: [
          {
            type: "category",
            data: nameArray,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            type: "bar",
            data: [],
            color: "#5470c6",
            showBackground: true,
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      };

      Object.assign(option, options);
      if (typeof dataArray[0] == "number") {
        option.series[0].data = dataArray;
      } else {
        option.series = dataArray.map((item) => {
          return {
            ...option.series[0],
            data: item.data,
            name: item.name,
          };
        });
      }

      barBox.setOption(option, true);
    },
  },
};
</script>
<style scoped>
.bar {
  height: 500px;
}
</style>
