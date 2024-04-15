<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <jaya-select
          type="UR"
          v-model="queryParams.roleId"
          placeholder="所属角色"
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.userType"
          placeholder="用户类型"
          size="small"
          clearable
        >
          <el-option
            v-for="item in userTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.status"
          placeholder="用户状态"
          size="small"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.invalid"
          placeholder="有效期状态"
          size="small"
          clearable
        >
          <el-option
            v-for="item in invalidList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.nameOrCard"
          placeholder="登录名/姓名/身份证号"
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['safety:auth:user:add']"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :tableHeaderList="column"
      :tableList="tableData"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>

    <!-- 添加编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="isEdit ? '编辑' : '添加'"
      :visible.sync="openAdd"
      width="680px"
      append-to-body
      :destroy-on-close="true"
      v-if="openAdd"
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        class="dialogForm"
      >
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item label="登录名" prop="userName">
          <el-input
            v-model="form.userName"
            placeholder="请输入"
            size="small"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="form.sex"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select
            v-model="form.userType"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in userTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleId">
          <jaya-select
            type="UR"
            v-model="form.roleId"
            :parameter="form.userType"
            @getOptions="getOptions"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="管理部门" prop="deptId">
          <jaya-select
            type="UB"
            v-model="form.deptId"
            :disabled="isEdit"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input v-model="form.userNum" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item label="用户有效期开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            value-format="yyyy-MM-dd"
            type="date"
            size="small"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户有效期结束日期" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            value-format="yyyy-MM-dd"
            type="date"
            size="small"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <div v-if="isEdit">
          <jaya-upload-file
            ref="upload"
            :http-request="handleImportBase"
            @getImageUrl="getImageUrl"
            accept="png,jpeg"
            type="images"
            fileTitle="签名照片"
            style="display: inline-block"
          >
            <div v-if="imageUrl">
              <img :src="imageUrl" class="avatar" />
              <div class="upPhoto">点击修改签名照片</div>
            </div>

            <div v-else class="">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div class="upPhoto">点击上传签名照片</div>
            </div>
          </jaya-upload-file>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPwd" v-if="isEdit">重置密码</el-button>
        <el-button type="primary" @click="handleUpload('form')"
          >确 定</el-button
        >
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配计算机 -->
    <el-dialog
      :close-on-click-modal="false"
      title="分配计算机"
      :visible.sync="openComputer"
      width="980px"
      append-to-body
    >
      <div class="show-msg-tit">
        <div>
          登录名：<span>{{ formComputer.userName }}</span>
        </div>
        <div>
          用户姓名：<span>{{ formComputer.realName }}</span>
        </div>
        <div>
          用户类型：<span>{{
            formComputer.userType === 0
              ? "普通用户"
              : formComputer.userType === 1
              ? "警员"
              : ""
          }}</span>
        </div>
        <div>
          所属角色：<span>{{ formComputer.roleName }}</span>
        </div>
        <div>
          管理部门：<span>{{ formComputer.deptName }}</span>
        </div>
      </div>
      <el-form
        :model="querySearchComputer"
        ref="querySearchComputer"
        :inline="true"
      >
        <el-form-item>
          <el-select
            v-model="querySearchComputer.type"
            placeholder="计算机类型"
            size="small"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="searchComputer"
            icon="el-icon-search"
            size="small"
            type="primary"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
      <div class="computer-type">
        <span v-for="item in typeList" :key="item.value" :class="item.icon">{{
          item.label
        }}</span>
      </div>
      <el-form
        :model="formComputer"
        ref="formComputer"
        :inline="true"
        class="dialogForm form-computer"
      >
        <el-form-item>
          <template>
            <div
              class="room-item"
              v-for="(item, index) in computerDate"
              :key="index"
            >
              <div class="all-check-box">
                <el-checkbox
                  class="all-check"
                  :indeterminate="isIndeterminate[index]"
                  v-model="checkAll[index]"
                  @change="handleCheckAllChange($event, item, index)"
                  >{{ item.deptName }}</el-checkbox
                >
              </div>
              <div style="width: 729px; padding-left: 20px">
                <el-checkbox-group
                  v-model="checkList"
                  @change="handleCheckedCitiesChange($event, item, index)"
                >
                  <el-checkbox
                    v-for="itemChildren in item.computerList"
                    :label="itemChildren.computerIp"
                    :key="itemChildren.computerIp"
                    ><i :class="itemChildren.icon"></i
                    >{{ itemChildren.computerIp }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlechenkedCom">确 定</el-button>
        <el-button @click="openComputer = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="详情"
      :visible.sync="openDetail"
      width="1080px"
      append-to-body
      :destroy-on-close="true"
    >
      <el-collapse v-model="activeNames" class="detail-item">
        <el-collapse-item title="基本信息" name="1">
          <el-form
            :model="form"
            ref="forms"
            :inline="true"
            :rules="rules"
            disabled
            class="dialogForm"
          >
            <el-form-item label="姓名">
              <el-input
                v-model="form.realName"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="登录名">
              <el-input
                v-model="form.userName"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input
                v-model="form.idCard"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="form.sex" placeholder="请选择" size="small">
                <el-option
                  v-for="item in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户类型">
              <el-select
                v-model="form.userType"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in userTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属角色">
              <jaya-select
                type="UR"
                v-model="form.roleId"
                :parameter="form.userType"
              ></jaya-select>
            </el-form-item>
            <el-form-item label="管理部门">
              <jaya-select type="UB" v-model="form.deptId"></jaya-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户编号">
              <el-input
                v-model="form.userNum"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="用户有效期开始日期">
              <el-date-picker
                v-model="form.startDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="用户有效期结束日期">
              <el-date-picker
                v-model="form.endDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="所属考场" name="2" v-if="false">
          <div
            class="room-item"
            v-for="(item, index) in computerDate"
            :key="index"
          >
            <div class="all-check-box">
              <span class="el-checkbox all-check">{{ item.deptName }}</span>
            </div>
            <div style="width: 829px; padding: 20px">
              <span
                v-for="itemChildren in item.computerList"
                :label="itemChildren.computerIp"
                :key="itemChildren.computerIp"
                style="margin-right: 30px"
                >{{ itemChildren.computerIp }}</span
              >
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="已授权计算机" name="3">
          <div
            class="room-item"
            v-for="(item, index) in computerDate"
            :key="index"
            v-show="item.showDetileSelected"
          >
            <template>
              <div class="all-check-box">
                <span class="el-checkbox all-check detail-check">{{
                  item.deptName
                }}</span>
              </div>
              <div style="width: 829px; padding: 20px">
                <span
                  v-for="itemChildren in item.computerList"
                  :label="itemChildren.computerIp"
                  :key="itemChildren.computerIp"
                >
                  <span style="margin-right: 30px" v-if="itemChildren.selected">
                    {{ itemChildren.computerIp }}
                  </span>
                </span>
              </div>
            </template>
          </div>
        </el-collapse-item>
        <el-collapse-item title="拥有的权限" name="4" class="authority">
          <template v-if="form.userMenuList">
            <el-collapse-item
              :title="item.menuName"
              v-for="item in form.userMenuList"
              :key="item.menuId"
            >
              <div v-if="item.children">
                <template v-for="itemChildren in item.children">
                  <el-collapse-item
                    :title="itemChildren.menuName"
                    v-if="itemChildren.children"
                    :key="itemChildren.menuId"
                  >
                    <span
                      style="margin-right: 30px"
                      v-for="itemSon in itemChildren.children"
                      :key="itemSon.menuId"
                    >
                      {{ itemSon.menuName }}
                    </span>
                  </el-collapse-item>
                  <span
                    style="margin-right: 30px"
                    v-else
                    :key="itemChildren.menuId"
                  >
                    {{ itemChildren.menuName }}
                  </span>
                </template>
              </div>
            </el-collapse-item>
          </template>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import {
  userAdd,
  userEdit,
  userList,
  userResetPwd,
  userInfo,
  computerList,
  upComputer,
  userLock
} from "@/api/exam/safety/user";
import { signatureUpload, signatureUser } from "@/api/exam/examSubject";
let beroreUpdate = {};
const name = {
  realName: "姓名",
  userName: "登录名",
  idCard: "身份证号",
  sex: "性别",
  userType: "用户类型",
  deptId: "管理部门",
  roleId: "所属角色",
  status: "用户状态",
  userNum: "用户编号",
  startDate: "用户有效期开始日期",
  endDate: "用户有效期结束日期"
};
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1
    },
    {
      title: "登录名",
      prop: "userName",
      width: "130"
    },
    {
      title: "姓名",
      prop: "realName"
    },
    {
      title: "性别",
      prop: "sex",
      status: () => {
        return this.sexList;
      }
    },
    {
      title: "身份证",
      prop: "idCard",
      width: "200"
    },
    {
      title: "管理部门",
      prop: "deptName"
    },
    {
      title: "所属角色",
      prop: "roleName"
    },
    {
      title: "用户类型",
      prop: "userType",
      status: () => {
        return this.userTypeList;
      }
    },
    {
      title: "用户编号",
      prop: "userNum"
    },
    {
      title: "有效期状态",
      prop: "invalid",
      width: "100",
      fixed: "right",
      status: () => {
        return this.invalidList;
      }
    },
    {
      title: "状态",
      prop: "status",
      width: "80",
      fixed: "right",
      status: () => {
        return this.statusList;
      }
    },
    {
      title: "操作",
      width: "240",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "编辑",
          size: "mini",
          onClick: this.edit,
          auth: ["safety:auth:user:edit"]
        },
        // {
        //   title: "分配考场",
        //   size: "mini",
        //   onClick: this.room,
        //   auth:['safety:auth:user:room']
        // },
        {
          title: "分配计算机",
          size: "mini",
          onClick: this.computer,
          auth: ["safety:auth:user:computer"]
        },
        {
          title: "详情",
          size: "mini",
          onClick: this.detail,
          auth: ["safety:auth:user:detail"]
        },
        {
          title: "解锁",
          size: "mini",
          onClick: this.lock,
          formatter: (row) => {
            return row.row.status !== "2";
          },
          auth: ["safety:auth:user:lock"]
        }
      ]
    }
  ];
};
export default {
  name: "examProject",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      statusList: [
        {
          label: "正常",
          value: "0"
        },
        {
          label: "停用",
          value: "1"
        },
        {
          label: "锁定",
          value: "2"
        },
        {
          label: "删除",
          value: "3"
        }
      ],
      invalidList: [
        {
          label: "过期",
          value: "1"
        },
        {
          label: "正常",
          value: "0"
        }
      ],
      column: column.call(this),
      tableData: [],
      form: {
        userType: null,
        roleId: ""
      },
      sexList: [
        {
          label: "男",
          value: "1"
        },
        {
          label: "女",
          value: "2"
        }
      ],
      userTypeList: [
        {
          label: "普通用户",
          value: 0
        },
        {
          label: "警员",
          value: 1
        }
      ],
      rules: {
        realName: [{ required: true, message: "必填项", trigger: "blur" }],
        userName: [{ required: true, message: "必填项", trigger: "blur" }],
        idCard: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
            trigger: "change"
          }
        ],
        sex: [{ required: true, message: "必填项", trigger: "change" }],
        roleId: [{ required: true, message: "必填项", trigger: "change" }],
        deptId: [{ required: true, message: "必填项", trigger: "change" }],
        status: [{ required: true, message: "必填项", trigger: "change" }],
        userType: [{ required: true, message: "必填项", trigger: "change" }],
        startDate: [{ required: true, message: "必填项", trigger: "change" }],
        endDate: [{ required: true, message: "必填项", trigger: "change" }]
      },
      openAdd: false,
      isEdit: false,
      imageUrl: "",
      baseImageUrl: "",
      importFileBase: null,
      openComputer: false,
      querySearchComputer: {
        deptId: null,
        userId: null
      },
      typeList: [
        {
          label: "考试辅助管理机",
          value: 0,
          icon: "el-icon-c-scale-to-original"
        },
        {
          label: "参数设置管理机",
          value: 1,
          icon: "el-icon-monitor"
        },
        {
          label: "自助签到机",
          value: 2,
          icon: "el-icon-printer"
        },
        {
          label: "自助报到机",
          value: 3,
          icon: "el-icon-takeaway-box"
        },
        {
          label: "排考叫号机",
          value: 4,
          icon: "el-icon-phone-outline"
        },
        {
          label: "自助查询机",
          value: 5,
          icon: "el-icon-chat-dot-square"
        },
        {
          label: "入候考室闸机",
          value: 6,
          icon: "el-icon-suitcase"
        },
        {
          label: "入考场闸机",
          value: 7,
          icon: "el-icon-suitcase-1"
        },
        {
          label: "自助签名机",
          value: 8,
          icon: "el-icon-edit"
        },
        {
          label: "信息采集机",
          value: 9,
          icon: "el-icon-aim"
        }
      ],
      formComputer: {},
      computerDate: [],
      showAllList: [],
      checkList: [],
      checkAll: [],
      isIndeterminate: [],
      openDetail: false,
      activeNames: ["1", "2", "3", "4"]
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      userList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.form = {
        userType: null,
        roleId: ""
      };
      this.resetForm("form");
      this.openAdd = true;
    },
    getOptions({ data }) {
      let roleIdFilter = data.filter((item) => item.value == this.form.roleId);
      if (roleIdFilter.length < 1) {
        this.form.roleId = "";
      }
    },
    // 编辑
    async edit(row) {
      this.imageUrl = "";
      this.clearState = false;
      this.isEdit = true;
      let {
        userId,
        realName,
        userName,
        idCard,
        sex,
        roleId,
        deptId,
        status,
        userType,
        userNum,
        startDate,
        endDate
      } = row;
      let queryForm = {
        userId,
        realName,
        userName,
        idCard,
        sex,
        roleId,
        deptId,
        status,
        userType,
        userNum,
        startDate,
        endDate
      };
      this.form = queryForm;
      // 获取签名照片
      let { data } = await signatureUser({ userId });
      if (data) {
        this.imageUrl = "data:image/jpeg;base64," + data.zp;
      }
      this.clearState = true;
      this.openAdd = true;
      beroreUpdate = Object.assign({}, queryForm);
    },
    // 提交新增编辑
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 编辑上传签名照片
          if (this.isEdit && this.importFileBase) {
            let formdata = new FormData();
            formdata.append("signatureFile", this.importFileBase);
            formdata.append("userId", this.form.userId);
            formdata.append("sfzmhm", this.form.idCard);
            signatureUpload(formdata).then(() => {
              // this.$message({
              //   message: "签名照片上传成功",
              //   type: "success",
              // });
            });
          }
          const log = this.diffLog(beroreUpdate, this.form, name);
          let { deptId, userName, ...editForm } = this.form;
          let { code } = this.isEdit
            ? await userEdit({ ...editForm, log })
            : await userAdd(this.form);
          if (code === 200) {
            this.$message({
              message: this.isEdit ? "编辑成功" : "添加成功",
              type: "success"
            });
            this.getTableList();
            this.openAdd = false;
          }
        }
      });
    },

    //重置密码
    resetPwd() {
      userResetPwd({ id: this.form.userId }).then((res) => {
        this.$message({
          message: "密码重置成功",
          type: "success"
        });
      });
    },
    // 上传签名照片回显
    getImageUrl(url) {
      this.imageUrl = url;
    },
    // 上传签名图片
    handleImportBase({ file }) {
      this.importFileBase = file;
    },
    // 分配计算机
    async computer(row) {
      this.formComputer = row;
      this.querySearchComputer.deptId = row.deptId;
      this.querySearchComputer.userId = row.userId;
      await this.searchComputer();
      this.openComputer = true;
    },
    // 查询计算机
    async searchComputer() {
      this.showAllList = [];
      this.checkList = [];
      this.isIndeterminate = [];
      this.checkAll = [];
      let { data } = await computerList(this.querySearchComputer);
      this.computerDate = data;
      this.computerDate.forEach((comItem, comIndex) => {
        comItem.num = 0; //当前项选中的数量
        if (comItem.computerList && comItem.computerList.length > 0) {
          comItem.computerList.forEach((item) => {
            this.showAllList.push(item.computerIp);
            // 样式回显
            if (item.selected) {
              // 处理详情，又一个为true，则展示
              comItem.showDetileSelected = true;

              comItem.num++;
              this.checkList.push(item.computerIp);
              if (comItem.num === comItem.computerList.length) {
                this.$set(this.checkAll, comIndex, true);
              }
              if (
                comItem.num > 0 &&
                comItem.num < comItem.computerList.length
              ) {
                this.$set(this.isIndeterminate, comIndex, true);
              } else {
                this.$set(this.isIndeterminate, comIndex, false);
              }
            }
            // 添加字体图标
            this.typeList.forEach((iconItem) => {
              if (item.type == iconItem.value) {
                item.icon = iconItem.icon;
              }
            });
          });
        }
      });
    },
    // 提交选择的计算机
    handlechenkedCom() {
      if (this.checkList.length < 1) {
        this.$alert("请选择计算机", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      let computerIdList = [];
      this.computerDate.forEach((comItem) => {
        comItem.computerList.forEach((item) => {
          this.checkList.forEach((itemSelect) => {
            if (item.computerIp === itemSelect) {
              computerIdList.push(item.computerId);
            }
          });
        });
      });
      upComputer({
        userId: this.formComputer.userId,
        computerIdList
      }).then((res) => {
        this.$message({
          message: "分配成功",
          type: "success"
        });
        this.getTableList();
        this.openComputer = false;
      });
    },
    handleCheckAllChange(val, item, index) {
      this.checkAll[index] = val;
      let stateList = item.computerList.map((ipItem) => {
        return ipItem.computerIp;
      });
      if (val) {
        this.checkList.push(...stateList);
      } else {
        // 求交集
        let samePart = this.checkList.filter((item) =>
          stateList.includes(item)
        );
        // 去除交集
        this.checkList = this.checkList.filter(
          (item) => !samePart.includes(item)
        );
      }
      this.$set(this.isIndeterminate, index, false);
    },
    handleCheckedCitiesChange(value, item, index) {
      let itemIpList = item.computerList.map((itemIp) => {
        return itemIp.computerIp;
      });
      // 求交集
      let samePart = value.filter((itemVal) => itemIpList.includes(itemVal));
      this.$set(this.checkAll, index, itemIpList.length === samePart.length);
      if (samePart.length > 0 && samePart.length < itemIpList.length) {
        this.$set(this.isIndeterminate, index, true);
      } else {
        this.$set(this.isIndeterminate, index, false);
      }
      this.checkList = value;
    },

    // 详情
    async detail(row) {
      this.formComputer = {};
      this.form = {};
      this.checkList = [];
      this.formComputer = row;
      this.querySearchComputer.deptId = row.deptId;
      this.querySearchComputer.userId = row.userId;
      await this.searchComputer();
      userInfo({ id: row.userId }).then((res) => {
        this.form = res.data;
        this.openDetail = true;
      });
    },
    // 用户解锁
    lock(row) {
      userLock({ id: row.userId }).then((res) => {
        this.$message({
          message: "解锁成功",
          type: "success"
        });
        this.getTableList();
      });
    }
  },
  mounted() {
    this.getTableList();
  }
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-input,
  .el-select {
    width: 194px;
  }
  .show-msg-tit {
    display: flex;
    margin-bottom: 20px;
    div {
      margin-right: 25px;
    }
  }
  .computer-type {
    background: #67767e;
    color: #fff;
    padding: 2px 0;
    margin-bottom: 10px;
    span {
      margin-left: 12px;
    }
  }
  .room-item {
    display: flex;
    border: 1px solid #b7e3fe;
    margin-bottom: 15px;
    .all-check-box {
      border-right: 1px solid #b7e3fe;
    }
    /deep/ .el-checkbox__label {
      min-width: 128px;
      i {
        color: #606266;
      }
    }
  }
  .all-check {
    width: 200px;
    white-space: pre-wrap;
    padding: 0 20px;
    margin-right: 8px;
    // /deep/ .el-checkbox__label {
    //   padding-left: 0;
    // }
  }
  .detail-check {
    margin-top: 20px;
  }
  .form-computer {
    .room-item {
      width: 940px;
    }
    .el-form-item {
      width: 100%;
      /deep/.el-form-item__content {
        width: 100%;
      }
    }
  }
  .detail-item {
    border: 0;
    .room-item {
      width: 1040px;
    }
    /deep/ .el-collapse-item__header {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .el-collapse > .is-active:last-child {
    /deep/.el-collapse-item__wrap {
      border: 0;
    }
  }
  .authority {
    /deep/.el-collapse-item__wrap .el-collapse-item__header {
      font-size: 14px !important;
    }
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 194px;
  height: 194px;
  line-height: 194px;
  text-align: center;
  border: 1px dashed #8c939d;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.upPhoto {
  margin-top: 10px;
  font-size: 16px;
}
.avatar {
  max-width: 600px;
  max-height: 340px;
  display: block;
}
</style>
