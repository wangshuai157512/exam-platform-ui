const oPlugin = {
  iWidth: "100%", // plugin width
  iHeight: "100%" // plugin height
};

export function loginWebVideoCtrl(param) {
  const { WebVideoCtrl } = this;
  const { wldz, dk, yhm, mm, tdh } = param;

  const oLiveView = {
    iProtocol: 1, // protocol 1：http, 2:https
    szIP: wldz, // protocol ip
    szPort: dk, // protocol port
    szUsername: yhm, // device username
    szPassword: mm, // device password
    iStreamType: 1, // stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
    iChannelID: tdh, // channel no
    bZeroChannel: false // zero channel
  };
  // 登录设备
  return new Promise(function (loginResolve, loginReject) {
    WebVideoCtrl.I_Login(
      oLiveView.szIP,
      oLiveView.iProtocol,
      oLiveView.szPort,
      oLiveView.szUsername,
      oLiveView.szPassword,
      {
        success: function (xmlDoc) {
          // 开始预览
          const szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
          console.log("登录成功", szDeviceIdentify);
          loginResolve(function () {
            return new Promise(function (playResolve, playReject) {
              setTimeout(function () {
                console.log(szDeviceIdentify);
                WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                  iStreamType: oLiveView.iStreamType,
                  iChannelID: oLiveView.iChannelID,
                  bZeroChannel: oLiveView.bZeroChannel,
                  success: function () {
                    playResolve(WebVideoCtrl);
                  },
                  error: function () {
                    console.log("错误码:" + WebVideoCtrl.I_GetLastError());
                    playReject();
                    alert("预览失败");
                  }
                });
              }, 500);
            });
          });
        },
        error: function () {
          console.log("错误码:" + WebVideoCtrl.I_GetLastError());
          loginReject();
          alert("登录失败");
        }
      }
    );
  });
}

export function initWebVideoCtrl() {
  const { WebVideoCtrl } = this;

  return new Promise((resolve, reject) => {
    // 初始化插件参数及插入插件
    console.log("初始化插件");
    WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
      bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
      iWndowType: 1,
      cbInitPluginComplete: () => {
        console.log("初始化插件成功");
        WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
        // 检查插件是否最新
        if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
          alert("检测到新的插件版本！");
          return;
        }
        resolve((data) => loginWebVideoCtrl.call(this, data));
      }
    });
  });
}
