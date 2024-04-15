<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="ksy">
        <jaya-select :lable="true" v-model="queryParams.ksy" type="S" />
      </el-form-item>
      <el-form-item prop="ksrq">
        <el-date-picker
          value-format="yyyy-MM-dd"
          class="daterange"
          v-model="ksrq"
          size="small"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="">
        <el-select v-model="printStatus" placeholder="打印内容" size="small">
          <el-option
            v-for="item in print"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="handlePrint"
          icon="el-icon-finished"
          size="small"
          type="primary"
          >打印</el-button
        >
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="exelExport"
          icon="el-icon-download"
          size="small"
          type="primary"
          >导出</el-button
        ></el-form-item
      >
      <el-button class="fun-btn-right" @click="back" size="small" type="primary"
        >返回</el-button
      >
    </el-form>
    <jaya-table
      v-show="printStatus === 0 || printStatus === 1"
      v-if="!isShowTableLists"
      :tableList="tableList"
      :tableHeaderList="column"
    />
    <jaya-table
      v-show="printStatus === 0 || printStatus === 1"
      v-else
      :tableList="tableLists"
      :tableHeaderList="columns"
    />
    <div style="page-break-after: always"></div>
    <div v-show="printStatus === 0 || printStatus === 2">
      <div class="bar" id="bar"></div>
      <div class="pie" id="pie"></div>
      <div class="line" id="line"></div>
    </div>
  </div>
</template>

<script>
import {
  getExamInerPointQualifiedPage,
  getExamInerProjectQualifiedPage
} from "@/api/exam/statistics";
import { exce, print } from "../mixin";
const column = function () {
  return [
    {
      title: "考试员",
      prop: "ksy",
      width: "180"
    },
    {
      title: "扣分项目次数（次）",
      prop: "kfcs"
    }
  ];
};
const columns = function () {
  return [
    {
      title: "扣分项目编号",
      prop: "xmxh",
      width: "180"
    },
    {
      title: "扣分项目名称",
      prop: "xmmc"
    },
    {
      title: "扣分项目次数（次）",
      prop: "kfcs",
      width: "180"
    }
  ];
};
export default {
  name: "ExamInerDeduction",
  mixins: [exce, print],
  data() {
    return {
      queryParams: {},
      tableList: [],
      tableLists: [],
      isShowTableLists: false,
      ksrq: [],
      barData: {
        textTitle: "考试员扣分统计"
      },
      pieData: null,
      lineData: null,
      column: column.call(this),
      columns: columns.call(this),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    document.title = "考试员扣分项";
    // this.getTableList();
  },
  methods: {
    drawBar({ textTitle = "", nameArray = [], dataArray = [] } = {}) {
      const barBox = this.$echarts.init(document.getElementById("bar"));
      const option = {
        title: {
          text: textTitle,
          right: "right"
        },
        xAxis: {
          data: nameArray
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} 次"
            }
          }
        ],
        dataGroupId: "",
        animationDurationUpdate: 500,
        series: {
          type: "bar",
          id: "sales",
          data: dataArray,
          color: "#5470c6",
          showBackground: true,
          label: {
            show: true,
            position: "top",
            formatter: "{c} 次"
          }
        }
      };
      barBox.setOption(option, true);
      barBox.on("click", (event) => {
        if (event.data) {
          getExamInerProjectQualifiedPage({
            ksy: event.data.groupId,
            ...this.queryParams,
            kskssj: this.ksrq ? this.ksrq[0] : "",
            ksjssj: this.ksrq ? this.ksrq[1] : ""
          }).then((res) => {
            if (!res.data.length) return;
            this.tableLists = res.data;
            this.isShowTableLists = true;
            barBox.setOption({
              xAxis: {
                data: res.data.map((item) => item.xmxh)
              },
              series: {
                type: "bar",
                id: "sales",
                data: res.data.map((item) => Number(item.kfcs)),
                universalTransition: {
                  enabled: true,
                  divideShape: "clone"
                }
              },
              graphic: [
                {
                  type: "text",
                  right: 50,
                  top: 20,
                  style: {
                    text: "返回",
                    fontSize: 18
                  },
                  onclick: () => {
                    this.isShowTableLists = false;
                    barBox.setOption(option);
                  }
                }
              ]
            });
          });
        }
      });
    },
    drawPie({ textTitle = "", nameArray = [], dataArray = [] } = {}) {
      const barBox = this.$echarts.init(document.getElementById("pie"));
      const data = dataArray.map((item, index) => ({
        value: item.value,
        name: nameArray[index]
      }));
      const option = {
        title: {
          text: textTitle,
          right: "right"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)" //{a} <br/>{b} : {c} ({d}%)
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        animationDurationUpdate: 500,
        series: [
          {
            type: "pie",
            radius: "80%",
            data,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c} 次"
                }
              }
            }
          }
        ]
      };
      barBox.setOption(option, true);
      barBox.on("click", (event) => {
        if (event.data) {
          getExamInerProjectQualifiedPage({
            ksy: event.data.groupId,
            ...this.queryParams,
            kskssj: this.ksrq ? this.ksrq[0] : "",
            ksjssj: this.ksrq ? this.ksrq[1] : ""
          }).then((res) => {
            if (!res.data.length) return;
            this.tableLists = res.data;
            this.isShowTableLists = true;
            barBox.setOption({
              series: [
                {
                  type: "pie",
                  radius: "80%",
                  data: res.data.map((item) => ({
                    name: item.xmxh,
                    value: Number(item.kfcs)
                  })),
                  universalTransition: {
                    enabled: true,
                    divideShape: "clone"
                  },
                  itemStyle: {
                    normal: {
                      label: {
                        show: true,
                        formatter: "{c} 次"
                      }
                    }
                  }
                }
              ],
              graphic: [
                {
                  type: "text",
                  right: 50,
                  top: 20,
                  style: {
                    text: "返回",
                    fontSize: 18
                  },
                  onclick: () => {
                    this.isShowTableLists = false;
                    barBox.setOption(option);
                  }
                }
              ]
            });
          });
        }
      });
    },
    drawLine({ textTitle = "", nameArray = [], dataArray = [] } = {}) {
      const barBox = this.$echarts.init(document.getElementById("line"));
      const option = {
        title: {
          text: textTitle,
          right: "right"
        },
        xAxis: {
          type: "category",
          data: nameArray
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: dataArray,
            type: "line",
            color: "#facc64",
            label: {
              show: true,
              position: "top"
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c} 次"
                }
              }
            }
          }
        ],
        animationDurationUpdate: 500
      };
      barBox.setOption(option, true);
      barBox.on("click", (event) => {
        if (event.data) {
          getExamInerProjectQualifiedPage({
            ksy: event.data.groupId,
            ...this.queryParams,
            kskssj: this.ksrq ? this.ksrq[0] : "",
            ksjssj: this.ksrq ? this.ksrq[1] : ""
          }).then((res) => {
            if (!res.data.length) return;
            this.tableLists = res.data;
            this.isShowTableLists = true;
            barBox.setOption({
              xAxis: {
                type: "category",
                data: res.data.map((item) => item.xmxh)
              },
              series: [
                {
                  data: res.data.map((item) => Number(item.kfcs)),
                  type: "line",
                  color: "#facc64",
                  label: {
                    show: true,
                    position: "top"
                  },
                  itemStyle: {
                    normal: {
                      label: {
                        show: true,
                        formatter: "{c} 次"
                      }
                    }
                  }
                }
              ],
              graphic: [
                {
                  type: "text",
                  right: 50,
                  top: 20,
                  style: {
                    text: "返回",
                    fontSize: 18
                  },
                  onclick: () => {
                    this.isShowTableLists = false;
                    barBox.setOption(option);
                  }
                }
              ]
            });
          });
        }
      });
    },
    getTableList(num) {
      getExamInerPointQualifiedPage({
        ...this.queryParams,
        kskssj: this.ksrq ? this.ksrq[0] : "",
        ksjssj: this.ksrq ? this.ksrq[1] : ""
      }).then((res) => {
        this.tableList = res.data;
        const nameArray = res.data.map((item) => item.ksy);
        const dataArray = res.data.map((item) => ({
          value: Number(item.kfcs),
          groupId: item.ksy
        }));
        this.drawBar({ textTitle: "考试员扣分项统计", nameArray, dataArray });
        this.drawPie({ textTitle: "考试员扣分项统计", nameArray, dataArray });
        this.drawLine({ textTitle: "考试员扣分项统计", nameArray, dataArray });
      });
    },
    back() {
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped>
.daterange {
  width: 240px !important;
}

.bar,
.pie,
.line {
  height: 500px;
}
</style>
