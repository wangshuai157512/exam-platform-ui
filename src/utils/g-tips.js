import {
    getVoice,
    handleVoice,
    getVoiceStaus,
    getAudioInfo
} from "@/api/exam/invigilate";
import { initWebVideoCtrl, loginWebVideoCtrl } from "@/utils/webVideoCtrl";
import { getToken } from "./auth";
var szDeviceId = null;

function setVoice(d, n) {
    return new Promise(function(resolve, reject) {
        handleVoice(d).then((res) => {
            if (d.status === "2" || d.status === "4") {
                removeNode(n);
            }
            resolve();
        });
    });
}

function createTips(x) {
    const rightTips = document.createElement("iframe");
    rightTips.setAttribute("class", "g-tips");
    rightTips.setAttribute("frameborder", 0);
    rightTips.setAttribute("src", "/webVideoCtrl.html");
    document.querySelector(".g-container").appendChild(rightTips);

    return rightTips;
}

function removeNode(child) {
    const parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
    clearIframe();
}

function clearIframe() {
    if (
        document.querySelector(".g-tips") &&
        document
        .querySelector(".g-tips")
        .contentDocument.querySelector("#container").childNodes.length === 0
    ) {
        removeNode(document.querySelector(".g-tips"));
    }
}

// 被动挂断语音
function hangup(id, WebVideoCtrl, node, szDeviceIdentify) {
    getVoiceStaus({ id }).then((res) => {
        const { status } = res.data;
        console.log(WebVideoCtrl, status);
        if (status === "3") {
            stopPlugin(WebVideoCtrl, szDeviceIdentify).then(() => {
                szDeviceId = null;
                removeNode(node);
            });
        } else if (status === "1") {
            setTimeout(() => {
                hangup(id, WebVideoCtrl, node, szDeviceIdentify);
            }, 2000);
        }
    });
}

function stopPlugin(WebVideoCtrl, szDeviceIdentify) {
    return new Promise(function(resolve, reject) {
        if (WebVideoCtrl.I_StopVoiceTalk() === -1) {
            alert("关闭语音失败");
        } else if (WebVideoCtrl.I_CloseSound() === -1) {
            alert("关闭声音失败");
        } else {
            WebVideoCtrl.I_Stop({
                error: function() {
                    alert("关闭播放失败");
                },
                success: function() {
                    if (WebVideoCtrl.I_Logout(szDeviceIdentify) === 0) {
                        resolve();
                    } else {
                        alert("退出设备失败");
                    }
                }
            });
        }
    });
}

function rendered(data) {
    return data.filter((item) => {
        if (item.status === "0" || szDeviceId === item.id) {
            return item;
        }
    });
}

function render(data) {
    const { document } = this;
    document.getElementById("container").innerHTML = data.reduce(
            (a, { id, hphm, status }) => {
                return (
                        a +
                        `<div id="voice-${id}" class="item-voice">
<div>${hphm} 请求语音对讲</div>
<div> ${
          status !== "0"
            ? ""
            : `<button  onclick="accept('${id}','${hphm}')" class="accept">接受</button>`
        }
  <button onclick="refuse('${id}','${hphm}')" class="refuse">${
          status === "0" ? "拒绝" : "挂断"
        }</button>
</div>
</div>`
      );
    },
    ""
  );
}

function initContainer() {
  getNode.call(this, "body").innerHTML =
    "<div class='title'>语音消息 <text onclick='packup()'>关闭</text> </div>" +
    getNode.call(this, "body").innerHTML; //  增加title及容器
  getNode.call(this, "#divPlugin").style.height = 0; //  隐藏插件节点
  getNode.call(this, "#container").style.display = "block";
}

function getVoiceList() {
  if (!getToken()) return;
  getVoice().then(({ data }) => {
    const rendData = rendered(data);
    const tipsNode = getNode.call(this, ".g-tips");
    if (rendData.length && !tipsNode) {
      const tipsNode = createTips(data.length);
      const tipsWindow = tipsNode.contentWindow;
      tipsWindow.onload = function () {
        initContainer.call(this);
        tipsNode.classList.add("g-tips-actv");
        initWebVideoCtrl.call(this);
        render.call(this, rendData);
        this.refuse = function (id, hphm) {
          // 拒绝语音事件
          getAudioInfo(hphm).then((res) => {
            if (szDeviceId === id) {
              const { wldz, dk, tdh } = res.data;
              // 挂断
              stopPlugin(this.WebVideoCtrl, `${wldz}_${dk}`).then(() => {
                szDeviceId = null;
                setVoice(
                  { id, status: "4" },
                  getNode.call(tipsWindow, `#voice-${id}`)
                );
              });
            } else {
              // 拒绝
              setVoice(
                { id, status: "2" },
                getNode.call(tipsWindow, `#voice-${id}`)
              );
            }
          });
        };
        this.accept = function (id, hphm) {
          // 接受语音事件
          if (!szDeviceId) {
            getAudioInfo(hphm).then((res) => {
              if (!res.data) return alert("没有查询到信息");
              const { wldz, dk, tdh } = res.data;
              loginWebVideoCtrl.call(this, res.data).then((WebVideoCtrl) => {
                if (
                  WebVideoCtrl.I_StartVoiceTalk(`${wldz}_${dk}`, tdh) === -1
                ) {
                  alert("打开语音失败");
                } else if (WebVideoCtrl.I_OpenSound() === -1) {
                  alert("打开声音失败");
                } else {
                  szDeviceId = id;
                  removeNode(
                    getNode(".accept", getNode.call(this, `#voice-${id}`))
                  );
                  getNode(
                    ".refuse",
                    getNode.call(this, `#voice-${id}`)
                  ).innerText = "挂断";
                  setVoice({ id, status: "1" }).then(() => {
                    hangup(
                      id,
                      WebVideoCtrl,
                      getNode.call(this, `#voice-${id}`),
                      `${wldz}_${dk}`
                    );
                  });
                }
              });
            });
          } else {
            alert("请先关闭其他语音");
          }
        };
        this.packup = function () {
          const node = tipsWindow.document.querySelector(
            "body > div.title > text"
          );
          if (node.innerText == "关闭") {
            tipsNode.classList.add("g-tips-show");
            node.innerText = "打开";
          } else {
            tipsNode.classList.remove("g-tips-show");
            node.innerText = "关闭";
          }
        };
      };
    } else if (rendData.length && tipsNode) {
      render.call(tipsNode.contentWindow, rendData);
    } else if (tipsNode && szDeviceId === null) {
      removeNode(tipsNode);
    }
  });
}

function getNode(tagName, target) {
  return (target || this.document).querySelector(tagName);
}

export default function handleNotice() {
  // window.onbeforeunload = function (event) {
  //   return "asdasdas";
  // };
  if (top === window) setInterval(getVoiceList, 1000);
}