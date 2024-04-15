<template>
  <div class="container">
    <div v-if="data">
      <h2>{{ getHostTitle(data.kskm) }}</h2>
      <img
        id="barcode"
        style="width: 200px; margin-bottom: 2px; float: right"
      />
      <table>
        <tbody>
          <tr>
            <td class="left">姓名</td>
            <td class="right">{{ data.xm }}</td>
            <td class="left">学习驾驶证明</td>
            <td class="right">{{ data.xxjszm }}</td>
            <td rowspan="4">
              <div class="photo">
                <el-image :src="parsUrl(data.bmzp)">
                  <span slot="error" class="image-slot"> 暂无图片 </span>
                </el-image>
                <p style="width: 2px"></p>
                <el-image :src="parsUrl(data.mjzp)">
                  <span slot="error" class="image-slot"> 暂无图片 </span>
                </el-image>
              </div>
            </td>
          </tr>
          <tr>
            <td class="left">身份证明号码</td>
            <td class="right">{{ data.sfzmhm }}</td>
            <td class="left">报考车型</td>
            <td class="right">{{ data.kscx }}</td>
          </tr>
          <tr>
            <td class="left">业务类型</td>
            <td colspan="3">{{ data.ywlx }}({{ data.jxmc }})</td>
          </tr>
          <tr>
            <td class="left">考试日期</td>
            <td class="right">{{ data.ksrq }}</td>
            <td class="left">预约次数</td>
            <td class="right">{{ data.yycs }}</td>
          </tr>
          <tr>
            <td style="border-bottom: none" class="left">考试地点</td>
            <td style="border-bottom: none" colspan="4">{{ data.ksddmc }}</td>
          </tr>
        </tbody>
      </table>
      <table v-for="(item, i) in data.ksinfo" v-show="i < 2" :key="i">
        <tr>
          <td style="text-align: center; font-size: 16px" colspan="5">
            {{ getTitle(i, data.kskm) }}
          </td>
        </tr>
        <tr>
          <td class="g-left">考试时间</td>
          <td class="g-right">
            <span>{{ item.kssj.split(" ")[1] }}</span
            ><span v-if="item.kssj">—</span>
            <span>{{ item.jssj.split(" ")[1] }}</span>
          </td>
          <td style="width: 16%; text-align: center">考试成绩</td>
          <td class="g-right">
            <p v-if="item.kscj !== ''" style="width: 100px">
              {{ item.kscj }}分,{{ getScoreRemark(data.kskm, item.kscj) }}
            </p>
          </td>
        </tr>
        <tr>
          <td class="g-left">扣分项</td>
          <td style="font-size: 10px; max-height: 40px" colspan="3">
            <div style="height: 45px">
              <p v-for="(jtem, j) in item.kfxx" :key="j">
                {{ jtem.kfsj.split(" ")[1] }}, {{ jtem.kfdm }},{{
                  jtem.kfsm
                }},扣分分值{{ jtem.kfz }}
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td class="g-left">考试员签名</td>
          <td class="g-rights">
            <img
              v-if="item.kssj && data.kgqm"
              style="display: block; margin: auto"
              height="30"
              :src="parsUrl(data.kgqm)"
            />
          </td>
          <td style="width: 16%; text-align: center">考生签名</td>
          <td class="g-rights">
            <img
              v-if="item.kssj && data.ksqm"
              style="display: block; margin: auto"
              height="30"
              :src="parsUrl(data.ksqm)"
            />
          </td>
        </tr>
        <tr style="height: 100px">
          <td :style="i == 0 ? 'border-bottom: none;' : ''" class="g-left">
            <p style="width: 30px; margin: auto">考试视频照片(3张)</p>
          </td>
          <td
            :style="i == 0 ? 'border-bottom: none;' : ''"
            style="text-align: left"
            colspan="3"
            class="v-node-l"
          >
            <img
              class="v-node"
              v-for="(img, m) in sortImg(item.zpxx)"
              :key="m"
              :src="parsUrl(img.zp)"
              @load="loadImg(data.zp)"
            />
            <div v-if="item.zpxx.length == 0">
              <img
                style="visibility: hidden"
                class="v-node"
                :src="parsUrl(data.mjzp)"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div id="tran-loading" style="height: 500px" v-else></div>
  </div>
</template>
<script>
document.title = "";
import { orderBy } from "lodash";
import JsBarcode from "jsbarcode";
import { getExamView } from "@/api/exam/record";
export default {
  name: "TranScript",
  data() {
    return {
      data: null,
      src: "",
      hasImgLoad: {},
      imgHeight: 0,
    };
  },
  mounted: function () {
    getExamView(location.href.split("?")[1]).then((res) => {
      this.data =
        res.data.ksinfo.length > 1
          ? res.data
          : {
              ...res.data,
              ksinfo: [
                ...res.data.ksinfo,
                { jssj: "", kfxx: [], kscj: "", kssj: "", zpxx: [] },
              ],
            };
      // 生成身份证条形码
      this.$nextTick(function () {
        JsBarcode(`#barcode`, res.data.sfzmhm, {
          lineColor: "#000",
          background: "#ffffff",
          fontSize: 16,
          width: 2,
          height: 40,
          displayValue: true,
        });
      });
    });
  },
  methods: {
    getScoreRemark(km, cj) {
      return km == "3"
        ? cj >= 90
          ? "合格"
          : "不合格"
        : cj >= 80
        ? "合格"
        : "不合格";
    },

    getTitle(index, km) {
      return index == 0
        ? km == "3"
          ? "科目三道路驾驶技能考试"
          : "科目二考试"
        : km == "3"
        ? "科目三道路驾驶技能补考"
        : "科目二补考";
    },

    getHostTitle(km) {
      if (km == "2") return `科目二考试成绩单`;
      return `科目三道路驾驶技能考试成绩单`;
    },

    loadImg(src) {
      this.$set(this.hasImgLoad, src, true);
    },

    parsUrl(str) {
      return `data:image/png;base64,${decodeURIComponent(str)}`;
    },

    sortImg(imgArr) {
      const orderImgArr = orderBy(imgArr, ["xh"], ["asc"]);
      return orderImgArr.slice(0, 3);
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  width: 700px;
  height: 1016px;
  // height: 100%;
  background-color: white;
  margin: auto;
  box-sizing: border-box;
  padding: 10px;
  h2 {
    text-align: center;
    margin: 5px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }

  .v-node-l img:last-child {
    margin-right: 0;
  }

  table td {
    height: 44px;
    padding: 2px;
    border: 1px solid black;
    box-sizing: border-box;
    text-align: left;
    font-size: 12px;
    p {
      margin: 0;
      padding: 0;
    }
    .v-node {
      margin-right: 2%;
      width: 32%;
      height: 147px;
    }
  }
  .left {
    width: 13%;
    text-align: center;
  }
  .right {
    width: 21%;
  }
  .g-right {
    width: 25%;
  }
  .g-left {
    width: 13%;
    text-align: center;
  }
  .g-rights {
    padding: 0 5px;
  }
}

.photo {
  height: 154px;
  display: flex;
  .el-image {
    flex: 1;
    height: 100%;
    text-align: center;
    line-height: 145px;
    background: #f5f7fa;
  }
}
</style>
