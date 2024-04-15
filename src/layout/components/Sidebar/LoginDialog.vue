<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="登录信息"
      :visible.sync="visible"
      width="1000px"
      append-to-body
      :destroy-on-close="true"
    >
      <table>
        <tr>
          <td>登录账号：</td>
          <td>{{ data.userName }}</td>
        </tr>
        <tr>
          <td>用户有效期：</td>
          <td>{{ data.userEndDate }}，剩余{{ data.expireDay }}天</td>
        </tr>
        <tr>
          <td>密码有效期：</td>
          <td>{{ data.pwdExpireDate }}，剩余{{ data.pwdExpireDay }}天</td>
        </tr>
        <tr>
          <td>上次登录成功信息：</td>
          <td>
            IP:{{ data.prevSuccessLog.ip }}，登录时间:{{
              data.prevSuccessLog.createTime
            }}，登录详情:{{ data.prevSuccessLog.logInfo }}
          </td>
        </tr>
        <tr>
          <td>登录失败信息：</td>
          <td style="padding: 0">
            <div style="height: 100px; overflow-y: scroll">
              <p
                v-show="data.errorLog"
                v-for="(log, index) in data.errorLog"
                :key="index"
              >
                ip:{{ log.ip }}, 登录时间:{{ log.createTime }}, 登录详情:{{
                  log.logInfo
                }}
              </p>
              <div
                style="height: 100%; line-height: 100px"
                v-show="!data.errorLog"
              >
                无
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>本次登录信息：</td>
          <td>
            IP:{{ data.thisLog.ip }},登录时间:{{
              data.thisLog.createTime
            }},登录详情:{{ data.thisLog.logInfo }}
          </td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    data: Object,
  },
  data() {
    return {
      visible: true,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

tr td:nth-child(1) {
  width: 200px;
}

td {
  border: 1px #03a9f4 solid;
  padding: 12px 4px;
  text-align: center;
}

.amap-demo {
  height: 120vh;
}

.amap-page-container {
  height: 300px;
  position: relative;
}

#info-window {
  width: 211px;
  height: 146px;
  margin-left: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.detail {
  width: 100%;
  height: 24px;
  color: #fff;
  background-color: #1a73e8;
  position: absolute;
  bottom: 0;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
}
</style>
