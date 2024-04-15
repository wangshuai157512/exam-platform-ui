<template>
  <div class="app-container">
    <div id="divPlugin" class="plugin" @click="handleScreen"></div>
    <div style="height: 20px" class="videoBat">
      <span>{{ formatDate(videoTime) + "/" + formatDate(maxValue - 1) }}</span>
    </div>
    <div class="block videoBat">
      <el-slider
        :format-tooltip="formatDate"
        :show-tooltip="false"
        @input="input"
        :max="maxValue - 1"
        v-model="videoTime"
      ></el-slider>
    </div>
    <div class="tool-bar">
      <button
        @click="play"
        :class="isPlay ? 'playto' : ''"
        class="play"
      ></button>
    </div>
    <div class="down-progress" v-if="progress != 0 && progress != 100">
      {{ progress }}%
    </div>
    <i class="el-icon-download down-icon" @click="clickOpenFileDlg" v-else></i>
  </div>
</template>

<script>
import { getExamVideoPlay } from "@/api/exam/record";
import { formatDate, getQueryObject } from "@/utils/index";
import { parseTime } from "@/utils/jaya";
import $ from "jquery";
var timer, currentTime, kssjt, firstkssj, debounceTimer;
function getTimes(time) {
  return time.replace(/-/g, "/");
}
export default {
  name: "VideoPlay",
  data() {
    return {
      isPlay: false,
      info: null,
      videoTime: 0,
      maxValue: 100,
      playOption: {},
      progress: 0,
      bFull:false
    };
  },
  methods: {
    formatDate(val) {
      return parseTime(val * 1000 - 8 * 3600000, "{h}:{i}:{s}");
    },
    play() {
      if (this.maxValue == this.videoTime + 1) {
        return this.startPlayback(firstkssj);
      }
      if (this.isPlay) {
        WebVideoCtrl.I_Pause({
          success: () => {
            this.isPlay = false;
          },
        });
      } else {
        WebVideoCtrl.I_Resume({
          success: () => {
            this.isPlay = true;
          },
        });
      }
    },
    input(val) {
      if (currentTime !== val) {
        clearInterval(timer);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          WebVideoCtrl.I_Stop({
            success: () => {
              this.startPlayback(
                formatDate(new Date(getTimes(kssjt)).getTime() + val * 1000)
              );
            },
          });
        }, 180);
      }
    },
    startPlayback(kssj) {
      const { szDeviceIdentify, jssj, iStreamType, iChannelID } =
        this.playOption;
      WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
        szStartTime: kssj,
        szEndTime: jssj,
        iStreamType,
        iChannelID,
        success: () => {
          // 打开声音
          WebVideoCtrl.I_OpenSound()
          this.isPlay = true;
          timer = setInterval(() => {
            WebVideoCtrl.I_GetOSDTime({
              success: (t) => {
                if (
                  new Date(getTimes(t)).getTime() + 1000 >=
                  new Date(getTimes(jssj)).getTime()
                ) {
                  clearInterval(timer);
                  WebVideoCtrl.I_Stop({
                    success: () => {
                      this.isPlay = false;
                    },
                    error: () => {
                      alert("停止失败");
                    },
                  });
                }
                this.videoTime = currentTime =
                  (new Date(getTimes(t)).getTime() -
                    new Date(getTimes(firstkssj)).getTime()) /
                  1000;
              },
            });
          }, 1000);
        },
        error: () => {
          alert("回放失败");
          console.log("回放失败");
        },
      });
    },
    // 0文件夹 1文件
    clickOpenFileDlg() {
      var szDirPath = WebVideoCtrl.I_OpenFileDlg(0);
      WebVideoCtrl.I_SetLocalCfg(
        "<DownloadPath>" + szDirPath + "</DownloadPath>"
      );
      if (szDirPath) {
        const { szDeviceIdentify, jssj, iChannelID } = this.playOption;
        let szStartTime = firstkssj;
        let szEndTime = jssj;
        // 搜索
        WebVideoCtrl.I_RecordSearch(
          szDeviceIdentify,
          iChannelID,
          szStartTime,
          szEndTime,
          {
            // iStreamType: iStreamType,
            // iSearchPos: g_iSearchTimes * 40,
            success: (xmlDoc) => {
              const szPlaybackURI = `rtsp:${
                $(xmlDoc)
                  .find("searchMatchItem")[0]
                  .textContent.match(/rtsp:(\S*)timing/)[1]
              }`;
              const { name } = getQueryObject(szPlaybackURI);
              // 下载
              let g_iDownloadID = WebVideoCtrl.I_StartDownloadRecord(
                szDeviceIdentify,
                szPlaybackURI,
                name,
                {
                  bDateDir: true, //是否生成日期文件
                }
              );
              if (g_iDownloadID < 0) {
                var iErrorValue = WebVideoCtrl.I_GetLastError();
                if (34 == iErrorValue) {
                  alert(szDeviceIdentify + " 已下载！");
                } else if (33 == iErrorValue) {
                  alert(szDeviceIdentify + " 空间不足！");
                } else {
                  alert(szDeviceIdentify + " 下载失败！");
                }
              } else {
                // 下载进度
                let progressTimer = setInterval(() => {
                  if (this.progress == 100) {
                    WebVideoCtrl.I_StopDownloadRecord(g_iDownloadID);
                    clearInterval(progressTimer);
                  }
                  this.progress =
                    WebVideoCtrl.I_GetDownloadProgress(g_iDownloadID);
                }, 500);
              }
              // // 下载状态
              // var iStatus = WebVideoCtrl.I_GetDownloadStatus(g_iDownloadID);
              // console.log(iStatus,222)
            },
            error: function (status, xmlDoc) {
              showOPInfo(
                szDeviceIdentify + " 搜索录像文件失败！",
                status,
                xmlDoc
              );
            },
          }
        );
      }
    },
    // 点击视频全屏放大
    handleScreen() {
      WebVideoCtrl.I_FullScreen(!this.bFull) 
    },
  },
  created() {
    // 获取视频信息
    getExamVideoPlay(location.href.split("?")[1]).then((res) => {
      if (!res.data) return alert("未查到视频信息");
      const { dk, mm, tdh, wldz, yhm, kssj, jssj } = res.data;
      firstkssj = kssj;
      this.maxValue =
        (new Date(getTimes(jssj)).getTime() -
          new Date(getTimes(kssj)).getTime()) /
        1000;
      // 检查插件是否已经安装过
      const iRet = WebVideoCtrl.I_CheckPluginInstall();
      if (-1 == iRet) {
        alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        return;
      }
      const oPlugin = {
        iWidth: "100%", // plugin width
        iHeight: "100%", // plugin height
      };

      const oLiveView = {
        iProtocol: 1, // protocol 1：http, 2:https
        szIP: wldz, // protocol ip
        szPort: dk, // protocol port
        szUsername: yhm, // device username
        szPassword: mm, // device password
        iStreamType: 1, // stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
        iChannelID: tdh, // channel no
        bZeroChannel: false, // zero channel
      };

      // 初始化插件参数及插入插件
      WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
        bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iWndowType: 1,
        cbInitPluginComplete: () => {
          WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
          console.log("初始化插件完成！");
          // 检查插件是否最新
          if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
            alert(
              "检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！"
            );
            return;
          }

          // 登录设备
          WebVideoCtrl.I_Login(
            oLiveView.szIP,
            oLiveView.iProtocol,
            oLiveView.szPort,
            oLiveView.szUsername,
            oLiveView.szPassword,
            {
              success: (xmlDoc) => {
                console.log("登录成功");
                
                // 开始回放
                const szDeviceIdentify =
                  oLiveView.szIP + "_" + oLiveView.szPort;
                this.playOption = {
                  kssj,
                  jssj,
                  szDeviceIdentify,
                  iStreamType: oLiveView.iStreamType,
                  iChannelID: oLiveView.iChannelID,
                };
                kssjt = kssj;
                setTimeout(() => {
                  this.startPlayback(kssj);
                }, 0);
              },
              error: () => {
                alert("登录失败");
                console.log("登录失败");
              },
            }
          );
        },
      });
    });
  },
};
</script>
<style lang="scss" scoped>
.plugin {
  width: 500px;
  height: 500px;
  margin: auto;
}

.tool-bar {
  width: 500px;
  margin: auto;
  text-align: center;
  margin-top: 4px;
}

button {
  padding: 0;
  background-color: white;
  box-sizing: border-box;
}

.play {
  height: 37px;
  border-style: solid;
  border-width: 20px 0 20px 30px;
  border-color: transparent transparent transparent black;
  transition: all 0.5s ease;
  cursor: pointer;
}

.playto {
  border-style: double;
  border-width: 0px 0px 0px 30px;
}

.videoBat {
  width: 500px;
  margin: auto;
}
.down-icon {
  font-size: 35px;
  position: absolute;
  right: 150px;
  top: 578px;
  cursor: pointer;
}
.down-progress {
  font-size: 18px;
  position: absolute;
  right: 150px;
  top: 570px;
  width: 48px;
  height: 48px;
  line-height: 48px;
  border-radius: 50%;
  border: 1px solid;
  text-align: center;
}
</style>
