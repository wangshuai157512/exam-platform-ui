<template>
  <div
    style="background-color: #001529; position: relative"
    :style="{
      border: examInfo
        ? `2px ${getExamStatusColor(examInfo.kszt)} solid`
        : '2px solid #808080'
    }"
    ref="container"
  >
    <div v-if="warningDialogVisible" class="warning-mask">
      <iframe
        style="border-radius: 4px"
        ref="videoIframe"
        :src="waringHref"
        frameborder="0"
      ></iframe>
    </div>
    <iframe
      style="width: 0; height: 0; float: left"
      ref="audioIframe"
      v-if="audioSrc"
      :src="audioSrc"
      frameborder="0"
    ></iframe>
    <div v-show="!dialogVisible">
      <el-row :style="{ height: clientHeight + 'px' }" class="top-row">
        <el-col :span="14">
          <div ref="video" class="video">
            <iframe
              ref="videoIframe"
              v-if="videoSrc"
              :src="videoSrc"
              frameborder="0"
            ></iframe>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="sidebar">
            <div ref="warnKC" class="warnKC">
              <ul ref="msgSideBar">
                <li v-for="(item, index) in msgQueue" :key="index">
                  <em>{{ item.time }}</em>
                  <span>{{ item.msg }}</span>
                </li>
              </ul>
            </div>
            <div id="sidebar-tool" class="sidebar-tool">
              <div @click="screen">
                <i
                  :class="[isScreen ? 'actv' : '']"
                  title="全屏"
                  class="el-icon-full-screen"
                ></i>
              </div>
              <div @click="evaluation">
                <i title="人工评判" class="el-icon-s-custom"></i>
              </div>
              <div @click="sound">
                <i
                  :class="[isOpenSound ? 'actv' : '']"
                  title="声音"
                  class="el-icon-bell"
                ></i>
              </div>
              <div @click="voice">
                <i
                  :class="[isOpenVoice ? 'actv' : '']"
                  title="对讲"
                  class="el-icon-microphone"
                ></i>
              </div>
              <div @click="warning">
                <i title="预警" class="el-icon-warning-outline"></i>
              </div>
              <div>
                <i
                  v-if="
                    isStartExam ||
                    (examInfo && ['考试中', '考试结束'].includes(examInfo.kszt))
                  "
                  title="考试中"
                  class="el-icon-video-pause actv"
                ></i>
                <i
                  v-else
                  @click="startExam"
                  title="开始考试"
                  class="el-icon-video-play"
                ></i>
              </div>
              <!-- <div><i title="录入" class="el-icon-edit"></i></div> -->
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row ref="botRow" id="botRow">
        <el-col :span="24">
          <div class="table">
            <p
              v-if="
                examInfo &&
                (examInfo.kszt == '考试中' || examInfo.kszt == '考试结束')
              "
              :style="{ background: getRightExamStatusColor(examInfo.kszt) }"
              class="minute"
            >
              {{ examInfo.kscj }}分
            </p>
            <p
              v-if="isShowMark"
              :style="{
                'border-color': getRightExamReslutStatusColor(examInfo.hgbj),
                color: getRightExamReslutStatusColor(examInfo.hgbj)
              }"
              class="tip"
            >
              {{ hgbj[examInfo.hgbj] }}
            </p>
            <table>
              <tbody>
                <tr>
                  <td style="width: 160px" rowspan="3">
                    <el-image :src="reportPhoto">
                      <div slot="error" class="el-image__error">暂无图片</div>
                    </el-image>
                    <el-image :src="controlPhoto">
                      <div slot="error" class="el-image__error">暂无图片</div>
                    </el-image>
                  </td>
                  <td class="lable">姓名</td>
                  <td>{{ examInfo && examInfo.xm }}</td>
                  <td class="lable">车辆信息</td>
                  <td>{{ examInfo && examInfo.kcbh+'-'+examInfo.kscx+'-'+examInfo.kchp }}</td>
                </tr>
                <tr>
                  <td class="lable">考试原因</td>
                  <td>{{ examInfo && examInfo.ksyy }}</td>
                  <td class="lable">考试次数</td>
                  <td >{{ examInfo && examInfo.kscs }}</td>
                </tr>
                <tr>
                  <td class="lable">流水号</td>
                  <td>{{ examInfo && examInfo.lsh }}</td>
                  <td class="lable" >考试状态</td>
                  <td style="padding-right: 46px;box-sizing: border-box;">
                    {{ examInfo && examInfo.kszt }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col :span="24">
          <ul class="bottom-bar">
            <li
              :style="{ 'background-color': getStatusColor(item.xmdm) }"
              v-for="item in botBarList"
              :key="item.xmdm"
            >
              {{ item.xmmc }}
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogVisible"
      width="100%"
      :modal="false"
    >
      <div>
        <div ref="handerBar" class="hander-bar">
          <div class="bar-left">
            <div
              :class="examPoint == null ? 'actvPoint' : ''"
              @click="getCommExamPointItem"
            >
              通用评判
            </div>
            <div
              @click="getExamPointItem({ ksxmdm: item.xmdm }, index)"
              :class="examPoint == index ? 'actvPoint' : ''"
              v-for="(item, index) in barList"
              :key="index"
            >
              {{ item.xmmc }}
            </div>
          </div>
        </div>
        <div class="dialog-table">
          <ul>
            <li
              :class="points == null ? 'actvPoint' : ''"
              @click="handleSetPoints(null)"
            >
              全部
            </li>
            <li
              :class="points == 5 ? 'actvPoint' : ''"
              @click="handleSetPoints(5)"
            >
              5分
            </li>
            <li
              :class="points == 10 ? 'actvPoint' : ''"
              @click="handleSetPoints(10)"
            >
              10分
            </li>
            <li
              :class="points == 100 ? 'actvPoint' : ''"
              @click="handleSetPoints(100)"
            >
              100分
            </li>
          </ul>
          <el-table
            :style="{
              height: tableHeight + 'px',
              width: '100%',
              'overflow-y': 'scroll'
            }"
            ref="singleTable"
            :data="dialogTableList"
            current-row-key="xmdm"
            row-key="xmdm"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column property="xmdm" label="代码" width="120">
            </el-table-column>
            <el-table-column property="kfz" label="扣分" width="120">
            </el-table-column>
            <el-table-column property="xmmc" label="扣分内容">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleJuge"
          >扣分</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamInfo,
  getExamPhoto,
  getExamProcInfo,
  getVideoInfo,
  getAudioInfo,
  addJuge,
  beginExam,
  getExamItem,
  getExamPointItem,
  getCommExamPointItem
} from "@/api/exam/invigilate";
import { applyPhoto, entrancePhoto } from "@/api/exam/examSubject";
import { addWaring } from "@/api/exam/invigilate";
import { initWebVideoCtrl } from "@/utils/webVideoCtrl";

var timeExamProc = null,
  timeExamInfo = null,
  dialogTableList = null,
  initClientHeight = 0;

export default {
  name: "viewModule",
  props: {
    index: Number,
    id: String | Number,
    carType: String
  },
  data() {
    return {
      hgbj: ["未判定", "合格", "不合格"],
      examInfo: null,
      msgQueue: [],
      isScreen: false,
      isOpenSound: false,
      isOpenVoice: false,
      szDeviceIdentify: "",
      clientHeight: 0,
      tableHeight: 0,
      title: null,
      dialogVisible: false,
      points: null,
      reportPhoto: null,
      controlPhoto: null,
      kskm: null,
      ksxh: null,
      barList: [],
      botBarList: [],
      dialogTableList: [],
      examPoint: null,
      currentRow: null,
      videoSrc: null,
      audioSrc: null,
      audioChannel: null,
      audioSzDevice: null,
      sfzmhm: null,
      hgbjk: null,
      waringHref: null,
      isShowMark: false,
      warningDialogVisible: false,
      isStartExam: false
    };
  },
  watch: {
    msgQueue() {
      this.$nextTick(() => {
        const msgSideBar = this.$refs.msgSideBar;
        const warnKC = this.$refs.warnKC;

        if (msgSideBar.offsetHeight > warnKC.offsetHeight) {
          warnKC.scrollTop = msgSideBar.offsetHeight - warnKC.offsetHeight;
        }
      });
    }
  },
  updated() {},
  methods: {
    // 开始考试
    startExam() {
      const { kskm, sfzmhm } = this;
      if (!sfzmhm) return this.msgWarn("考生未上车");
      beginExam(kskm, sfzmhm).then((res) => {
        this.isStartExam = true;
        this.msgSuccess("开始考试成功！");
      });
    },
    handleJuge() {
      const { ksxh, currentRow } = this;
      if (!currentRow) return this.msgWarn("请选择扣分项目");

      addJuge({ ksxh, kfdm: currentRow.xmdm }).then((res) => {
        this.dialogVisible = false;
        this.msgSuccess(res.msg);
      });
    },

    screen() {
      this.isScreen = !this.isScreen;
      this.clientHeight = this.isScreen
        ? document.body.clientHeight -
          document.getElementById("botRow").clientHeight
        : initClientHeight;
      this.$emit("setScreen", this.isScreen ? this.index : null);
    },

    pushMsgQueue(msg, time) {
      const msgQueue = this.msgQueue;
      msgQueue.push({
        time: time || this.parseTime(new Date(), "{h}:{i}:{s}"),
        msg: msg
      });
      this.msgQueue = msgQueue;
    },

    // 声音
    sound() {
      const { id } = this;
      const WebVideoCtrl = this.$refs.audioIframe.contentWindow.WebVideoCtrl;

      if (!this.isOpenSound) {
        // 打开声音
        this.$emit("close", { id, type: "sound" });
        const iRet = WebVideoCtrl.I_OpenSound();
        if (iRet == 0) {
          this.$emit("open", { id, type: "sound", status: true });
          this.msgSuccess("打开声音成功！");
          this.isOpenSound = true;
        } else {
          this.msgWarn("打开声音失败！");
        }
        return;
      }
      // 关闭声音
      const iRet = WebVideoCtrl.I_CloseSound();
      if (this.isOpenVoice) this.voice();
      if (iRet == 0) {
        this.$emit("open", { id, type: "sound", status: false });
        this.msgSuccess("关闭声音成功！");
        this.isOpenSound = false;
      } else {
        this.msgWarn("关闭声音失败！");
      }
    },

    // 对讲
    voice() {
      if (!this.audioSrc) return this.msgWarn("未获取到对讲设备");
      const { id } = this;
      const WebVideoCtrl = this.$refs.audioIframe.contentWindow.WebVideoCtrl;

      if (!this.isOpenVoice) {
        this.$emit("close", { id, type: "audio" });
        if (!this.audioSzDevice && !this.audioChannel)
          return this.msgWarn("未获取到对讲设备");
        if (!this.isOpenSound) this.sound();
        const startVoice = WebVideoCtrl.I_StartVoiceTalk(
          this.audioSzDevice,
          this.audioChannel
        );
        if (startVoice == 0) {
          this.isOpenVoice = true;
          this.msgSuccess("打开对讲成功！");
          this.$emit("open", { id, type: "audio", status: true });
        } else this.msgWarn("打开对讲失败");
      } else {
        const stopVoice = WebVideoCtrl.I_StopVoiceTalk();
        if (stopVoice == 0) {
          this.isOpenVoice = false;
          this.msgSuccess("关闭对讲成功！");
          this.$emit("open", { id, type: "audio", status: false });
        } else this.msgWarn("关闭对讲失败");
      }
    },

    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 人工评判
    evaluation() {
      const { kskm, ksxh } = this;
      if (!ksxh) return this.msgWarn("考生不在考试中,无法评判");
      getExamItem({ kscx: this.carType, kskm, ksxh }).then((res) => {
        this.barList = res.data;
        this.$nextTick(() => {
          this.tableHeight =
            this.$refs.botRow.$el.clientHeight + this.clientHeight - 140;
          this.dialogVisible = true;
          this.$refs.singleTable?.setCurrentRow((this.currentRow = null));
        });
      });
      // 查询通用评判项
      this.getCommExamPointItem();
    },
    // 查询科目专项评判扣分项目
    getExamPointItem(p, index) {
      this.examPoint = index;
      getExamPointItem({ ...p, kscx: this.carType, kskm: this.kskm }).then(
        (res) => {
          dialogTableList = res.data;
          this.dialogTableList =
            this.points == null
              ? res.data
              : res.data.filter((item) => item.kfz == this.points);
        }
      );
    },
    // 查询通用评判专项评判扣分项目
    getCommExamPointItem() {
      this.examPoint = null;
      getCommExamPointItem({ kscx: this.carType, kskm: this.kskm }).then(
        (res) => {
          dialogTableList = res.data;
          this.dialogTableList =
            this.points == null
              ? res.data
              : res.data.filter((item) => item.kfz == this.points);
        }
      );
    },

    getRightExamStatusColor(status) {
      if (status == "考试中") return "chartreuse";
      else if (status == "结束考试") return "#b4f8ff";
      else return "#ff8218";
    },

    getRightExamReslutStatusColor(status) {
      if (status == 1) return "chartreuse";
      else if (status == 2) return "#ff2020";
    },

    getExamStatusColor(status) {
      if (status == "考试中") return "#52c41a";
      else if (status == "结束考试") return "#9fa2aa";
      else return "#808080";
    },
    // 扣分项根据分数过滤
    handleSetPoints(point) {
      this.$refs.singleTable.setCurrentRow(this.currentRow);
      this.points = point;
      this.dialogTableList = point
        ? dialogTableList.filter((item) => item.kfz == point)
        : dialogTableList;
    },

    getStatusColor(status) {
      if (this.examInfo.dqxm && this.examInfo.dqxm.includes(status))
        return "#ff8218";
      else if (
        this.examInfo.kfxm &&
        this.examInfo.kfxm.substr(0, 3).includes(status.substr(0, 3))
      )
        return "#fb1818";
      else if (this.examInfo.ykxm && this.examInfo.ykxm.includes(status))
        return "#52c41a";
    },

    getExamPhoto({ kcxh, sfzmhm, ksrq }) {
      // 查询报名照片
      applyPhoto(sfzmhm).then((res) => {
        if (res.data)
          this.reportPhoto = `data:image/png;base64,${decodeURIComponent(
            res.data.zp
          )}`;
      });

      // 查询门禁照片
      entrancePhoto(`${kcxh}/${sfzmhm}/${ksrq}`).then((res) => {
        if (res.data)
          this.controlPhoto = `data:image/png;base64,${decodeURIComponent(
            res.data.zp
          )}`;
      });
    },

    handleMessage({ data }) {
      if (!data) return;
      const { id, yjxx, isClose } = JSON.parse(data);
      const { ksxh, kcxh, examInfo } = this;

      if (decodeURI(id) !== this.id) return;
      if (isClose) return (this.warningDialogVisible = false);
      if (!ksxh) return this.msgWarn("考生不在考试中,无法预警");
      addWaring({
        ksxh,
        zt: "1",
        yjfl: "2",
        kcxh,
        yjxx,
        kchp: examInfo.kchp
      }).then((res) => {
        if (res.code == 200) {
          this.msgSuccess(res.msg);
          this.warningDialogVisible = false;
        }
      });
    },

    warning() {
      const { ksxh } = this;

      if (!ksxh) return this.msgWarn("考生不在考试中,无法预警");
      this.warningDialogVisible = true;
    }
  },

  mounted() {
    window.addEventListener("message", this.handleMessage);

    // 计算video高度
    const videoHeight =
      (document.body.clientHeight - 164) / 2 -
      this.$refs.botRow.$el.clientHeight;

    const sideBarToolHeight = 200;

    // 低于最低高度按最低高度
    this.clientHeight = initClientHeight =
      videoHeight > sideBarToolHeight ? videoHeight : sideBarToolHeight;

    // 获取考生信息
    const examInfo = () => {
      getExamInfo({ kchp: this.id, sfzmhm: this.sfzmhm || undefined }).then(
        (res) => {
          const {
            ksxh,
            sfzmhm,
            ksrq,
            kcxh,
            kskm,
            ksxms,
            kchp,
            kszt,
            kscs,
            kcjc,
            hgbj
          } = res.data;
          this.isShowMark = false;

          // 没获取到考生信息时定时轮询
          if (!this.sfzmhm && !sfzmhm) {
            this.examInfo = null;
            this.isStartExam = false;
            timeExamInfo = setTimeout(examInfo, 2000);
            return;
          }
          // 车上换人
          if (sfzmhm && this.sfzmhm != sfzmhm) {
            this.isStartExam = false;
            this.getExamPhoto({ kcxh, sfzmhm, ksrq });
          }
          // 第一次考试结束保留状态
          // if (this.sfzmhm == sfzmhm && this.hgbjk != hgbj) {
          //   timeExamInfo = setTimeout(examInfo, 5000);
          //   this.hgbjk = hgbj;
          //   this.examInfo = { ...this.examInfo, hgbj: 2 };
          //   this.isShowMark = true;
          //   return;
          // }
          if (hgbj != 0) {
            this.isShowMark = true;
          }
          this.sfzmhm = sfzmhm;
          this.kcxh = kcxh;
          this.ksxh = ksxh;
          this.kskm = kskm;
          this.hgbjk = hgbj;
          this.examInfo = res.data;
          this.waringHref = `/addwaring.html?kskm=${kskm}&ksxh=${ksxh}&kchp=${kchp}&id=${this.id}&kcjc=${kcjc}`;
          this.botBarList = ksxms;
          // timeExamProc && clearTimeout(timeExamProc);
          // 获取考试过程信息(3s轮询)
          const getExamProcInfoList = () => {
            getExamProcInfo(ksxh).then((result) => {
              this.msgQueue = [];
              if (result.data) {
                result.data.forEach((item) => {
                  this.pushMsgQueue(item.cznr, item.gxsj.split(" ")[1]);
                });
              }

              // timeExamProc = setTimeout(getExamProcInfoList, 3000);
            });
          };
          getExamProcInfoList();
          if (hgbj != 0) {
            this.sfzmhm = null;
            timeExamInfo = setTimeout(examInfo, 5000);
            return;
          } else if (kszt == "取消考试") {
            this.sfzmhm = null;
          }
          timeExamInfo = setTimeout(examInfo, 2000);
        }
      );
    };

    examInfo();

    // 获取对讲通道
    getAudioInfo(this.id).then((res) => {
      if (!res.data) return;
      const { dk, mm, tdh, wldz, yhm } = res.data;

      this.audioSrc = `/webVideoCtrl.html`;
      this.audioSzDevice = `${wldz}_${dk}`;
      this.audioChannel = tdh;
      this.$nextTick(() => {
        this.$refs.audioIframe.contentWindow.onload = function () {
          initWebVideoCtrl.call(this).then((login) =>
            login(res.data)
              .then((payWebVideoCtrl) => {
                payWebVideoCtrl().catch(() => {
                  console.log(`音频播放失败`);
                });
              })
              .catch(() => {
                console.log(`音频登录失败`);
              })
          );
        };
      });
    });

    // 获取视频信息
    getVideoInfo(this.id).then((res) => {
      if (!res.data) return;

      this.videoSrc = `/webVideoCtrl.html`;

      this.$nextTick(() => {
        this.$refs.videoIframe.contentWindow.onload = function () {
          initWebVideoCtrl.call(this).then((login) =>
            login(res.data)
              .then((payWebVideoCtrl) => {
                payWebVideoCtrl().catch(() => {
                  console.log(`视频播放失败`);
                });
              })
              .catch(() => {
                console.log(`视频登录失败`);
              })
          );
        };
      });
      // 检查插件是否已经安装过
      const iRet = WebVideoCtrl.I_CheckPluginInstall();
      if (-1 == iRet) {
        this.$alert(
          "<div>您还未安装过插件，请用ie浏览器<a style='color: blue;'  href='/plugins/WebComponentsKit.exe'>下载</a>插件后使用</div>",
          "提示",
          {
            dangerouslyUseHTMLString: true,
            showConfirmButton: false
          }
        );
        return;
      }
    });
  },
  destroyed() {
    clearTimeout(timeExamProc);
    clearInterval(timeExamInfo);
    removeEventListener("message", this.handleMessage);
  }
};
</script>
<style lang="scss" scoped>
/deep/.app-container,
.app-main {
  height: 100%;
}

.container {
  height: 100%;
  /*火狐下隐藏滚动条*/
  overflow: -moz-scrollbars-none;
  table {
    width: 100%;
    border-collapse: collapse;
  }
}

.top-row {
  .el-col,
  .video,
  .plugin {
    height: 100%;
  }
}

.sidebar {
  height: 100%;
  .sidebar-tool {
    width: 75px;
    height: 100%;
    float: right;
    // background: royalblue;
    div {
      height: 40px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      .actv {
        color: rgb(24, 144, 255);
      }
      i {
        font-size: 25px;
        color: #97aebe;
        &:hover {
          color: rgb(24, 144, 255);
        }
      }
    }
  }

  .warnKC {
    width: calc(100% - 80px);
    height: 100%;
    float: left;
    border: 1px solid #203657;
    overflow-y: scroll;
    font-size: 12px;
    -ms-overflow-style: none;
    /*火狐下隐藏滚动条*/
    overflow: -moz-scrollbars-none;

    li:nth-child(2n) {
      background-color: #14273a;
    }
    li em {
      float: left;
      width: 70px;
      padding-left: 10px;
      font-style: normal;
      cursor: pointer;
      color: #9eb6c6;
    }
    li span {
      color: #9eb6c6;
      display: block;
      margin-left: 80px;
      cursor: pointer;
      // white-space: nowrap;
    }
  }
}

.table {
  position: relative;
  .tip {
    position: absolute;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    right: 40px;
    bottom: 0;
    margin: 0;
    font-size: 24px;
    color: chartreuse;
    transform: rotate(-35deg);
    border: 2px chartreuse solid;
    border-radius: 4px;
  }
  .minute {
    padding: 0 2px;
    width: 60px;
    height: 54px;
    background: #57c22d;
    font-size: 20px;
    color: black;
    text-align: center;
    line-height: 54px;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 0;
    font-weight: 700;
  }
  table td {
    height: 30px;
    padding: 5px;
    border: 1px solid #30486a;
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }
  .lable {
    width: 100px;
    background: #183450;
  }
}

.bottom-bar {
  li {
    // width: 6.25%;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 3px;
    vertical-align: bottom;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
    margin-left: 2px;
    margin-bottom: 2px;
    padding: 0 2px;
    color: white;
    display: inline-block;
    background-color: #004e98;
  }
}

.hander-bar {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 10px 0;
  .bar-left {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background: #001529;

    div {
      padding: 0 4px;
      margin-left: 1%;
      margin-bottom: 1%;
      height: 23px;
      font-size: 12px;
      line-height: 23px;
      border-radius: 3px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      background-color: #304155;
      text-overflow: ellipsis;
    }
  }
}

.dialog-table {
  ul {
    display: flex;
    li {
      width: 40px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      margin-right: 30px;
      color: #a5bece;
      cursor: pointer;
    }
  }
}

.actvPoint {
  color: white !important;
  background-color: rgb(24, 144, 255) !important;
}

/deep/.el-dialog,
.el-table {
  background: #001529;
}

/deep/ .el-form-item__label {
  display: inline !important;
}

/deep/.el-table__body-wrapper {
  min-height: 200px;
}

/deep/ object {
  position: relative;
  z-index: 100;
}

/deep/ .v-modal {
  display: none !important;
}

/deep/ .el-dialog {
  margin-top: 0 !important;
}

/deep/ .el-dialog__wrapper {
  position: relative !important;
}

/deep/ .el-dialog__header {
  display: none;
}

/deep/ .el-image {
  width: 80px;
  height: 100px;
  display: table-cell;
  text-align: center;
  line-height: 100px;
  .el-image__inner {
    vertical-align: middle;
  }
}

/deep/ .el-image__error {
  background: none;
}

/deep/ .el-dialog__body {
  padding: 0 20px;
}

.image-slot {
  display: flex;
  align-items: center;
}

iframe {
  width: 100%;
  height: 100%;
}

/deep/ .el-table__body tr.current-row > td {
  background-color: #4da6f8;
}

.warning-mask {
  width: 350px;
  height: 250px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
}
</style>
