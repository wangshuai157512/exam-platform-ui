<template >
  <div class="app-container">
    <!-- 配置弹窗 -->
    <el-dialog
      title="配置后台服务地址"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="420px"
      append-to-body
      class="center-dialog"
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        class="dialogForm"
      >
        <el-form-item label="后台服务地址" prop="uri" style="width: 100%">
          <el-input
            v-model="form.uri"
            placeholder="请输入"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 数据库弹窗 -->
    <el-dialog
      class="custum-loading"
      v-loading="loading"
      element-loading-text="服务启动中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      title="配置数据库"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dbVisible"
      width="680px"
      append-to-body
    >
      <el-form
        :model="dbForm"
        ref="dbForm"
        :inline="true"
        :rules="dbRules"
        class="dialogForm"
      >
        <el-form-item label="数据库_服务名" prop="datasourceDbName">
          <el-input
            v-model="dbForm.datasourceDbName"
            placeholder="请输入"
            size="small"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库_ip" prop="datasourceIp">
          <el-input
            v-model="dbForm.datasourceIp"
            placeholder="请输入"
            size="small"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库_密码" prop="datasourcePassword">
          <el-input
            v-model="dbForm.datasourcePassword"
            placeholder="请输入"
            size="small"
            type="password"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库_端口" prop="datasourcePort">
          <el-input
            v-model="dbForm.datasourcePort"
            placeholder="请输入"
            size="small"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库_用户名" prop="datasourceUsername">
          <el-input
            v-model="dbForm.datasourceUsername"
            placeholder="请输入"
            size="small"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="认证服务_ip" prop="oauthIp">
          <el-input
            v-model="dbForm.oauthIp"
            placeholder="请输入"
            size="small"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="redis_ip" prop="redisIp">
          <el-input
            v-model="dbForm.redisIp"
            placeholder="请输入"
            size="small"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
        <el-form-item label="redis_密码" prop="redisPassword">
          <el-input
            v-model="dbForm.redisPassword"
            placeholder="请输入"
            size="small"
            type="password"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
        <el-form-item label="redis_端口" prop="redisPort">
          <el-input
            v-model="dbForm.redisPort"
            placeholder="请输入"
            size="small"
            @input="$forceUpdate()"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleTextDb">测试数据库连接</el-button>
        <el-button @click="handleTextRed">测试redis连接</el-button>
        <el-button type="primary" @click="handleSaveDb('dbForm')"
          >保存配置</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import axios from "axios";
import {
  configGetIp,
  configGetInfo,
  testDb,
  testRedis,
  configAdd,
  serverStart,
} from "@/api/config/network";
export default {
  name: "network",
  data() {
    return {
      visible: true,
      form: {},
      rules: {
        uri: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern:
              /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确的ip地址",
            trigger: "change",
          },
        ],
      },
      dbForm: {
        datasourceDbName: "ORCL",
        datasourcePort: 1521,
        redisPort: 6379,
      },
      dbVisible: false,
      dbData: false,
      redisData: false,
      loading: false,
      dbRules: {
        datasourceDbName: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        datasourceIp: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        datasourcePassword: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        datasourcePort: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        datasourceUsername: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        oauthIp: [{ required: true, message: "必填项", trigger: "change" }],
        redisIp: [{ required: true, message: "必填项", trigger: "change" }],
        redisPassword: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        redisPort: [{ required: true, message: "必填项", trigger: "change" }],
      },
    };
  },
  mounted() {
    if (localStorage.getItem("status")) {
      localStorage.setItem("status", "");
    }
    // 获取本机ip
    const nativeIp = location.host;
    if (nativeIp != "localhost" && nativeIp != "127.0.0.1") {
      this.$set(this.form, "uri", location.hostname);
    }
  },
  methods: {
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios
            .post(`http://${this.form.uri}:9022/config/web/add`, this.form)
            .then((res) => {
              setTimeout(() => {
                this.visible = false;
                this.getIp();
                this.getConfig();
                this.dbVisible = true;
              }, 300);
            });
        }
      });
    },
    // 获取ip
    getIp() {
      configGetIp().then((res) => {
        this.$set(this.dbForm, "datasourceIp", res.data);
        this.$set(this.dbForm, "oauthIp", res.data); //认证ip不显示
        this.$set(this.dbForm, "redisIp", res.data);
      });
    },
    // 查询配置
    getConfig() {
      configGetInfo().then(({ data }) => {
        data.datasourcePassword = data.datasourcePassword
          ? Base64.decode(data.datasourcePassword)
          : data.datasourcePassword;
        data.redisPassword = data.redisPassword
          ? Base64.decode(data.redisPassword)
          : data.redisPassword;
        let configData = {};
        for (let key in data) {
          if (data[key]) {
            configData[key] = data[key];
          }
        }

        this.dbForm = Object.assign(this.dbForm, configData);
      });
    },

    // 测试数据库连接
    async handleTextDb() {
      let {
        datasourceDbName,
        datasourceIp,
        datasourcePassword,
        datasourcePort,
        datasourceUsername,
      } = this.dbForm;
      let queryDb = {
        datasourceDbName,
        datasourceIp,
        datasourcePassword: Base64.encode(datasourcePassword),
        datasourcePort,
        datasourceUsername,
      };
      const { data } = await testDb(queryDb);
      data
        ? this.msgSuccess("数据库连接成功")
        : this.msgError("数据库连接失败");
      this.dbData = data;
    },
    // 测试redis连接
    async handleTextRed() {
      let { redisIp, redisPassword, redisPort } = this.dbForm;
      let queryRed = {
        redisIp,
        redisPassword: Base64.encode(redisPassword),
        redisPort,
      };
      const { data } = await testRedis(queryRed);
      data ? this.msgSuccess("redis连接成功") : this.msgError("redis连接失败");
      this.redisData = data;
    },
    handleSaveDb(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.handleTextDb();
          await this.handleTextRed();
          if (!this.dbData || !this.redisData) return;
          this.dbForm.url = undefined;
          configAdd({
            ...this.dbForm,
            datasourcePassword: Base64.encode(this.dbForm.datasourcePassword),
            redisPassword: Base64.encode(this.dbForm.redisPassword),
          }).then((res) => {
            this.$nextTick(() => {
              this.loading = true;
            });
            serverStart().then((respon) => {
              this.loading = false;
              this.dbVisible = false;
              this.$router.push({ path: "/login" });
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.center-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .el-dialog__body .el-form-item__label {
    font-size: 14px;
  }
  /deep/.el-form-item--medium .el-form-item__content {
    width: 100% !important;
    .el-input__inner {
      width: 100% !important;
      height: 40px;
    }
  }
}
.custum-loading {
  /deep/.el-loading-spinner {
    i {
      font-size: 50px;
    }
    .el-loading-text {
      font-size: 28px;
    }
  }
}
</style>