<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="clzt">
        <jaya-select
          v-model="queryParams.clzt"
          placeholder="状态"
          @getOptions="getOptions"
          othername="car_status"
        />
      </el-form-item>
      <el-form-item prop="syzt">
        <jaya-select
          v-model="queryParams.syzt"
          placeholder="使用状态"
          @getOptions="getOptions"
          othername="exam_room_status"
        />
      </el-form-item>
      <el-form-item prop="syzjcx">
        <jaya-select
          multiple
          collapse-tags
          v-model="queryParams.syzjcx"
          placeholder="考试车型"
          @getOptions="getOptions"
          othername="exam_car_type"
        />
      </el-form-item>
      <el-form-item prop="hphmOrKcbh">
        <el-input
          size="small"
          v-model="queryParams.hphmOrKcbh"
          style="width: 180px"
          placeholder="考车号牌/考车编号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right" prop="">
        <el-button
          @click="handleAddVisible"
          v-hasPermi="['record:examcar:add']"
          icon="el-icon-plus"
          size="small"
          type="primary"
          >添加</el-button
        >
        <el-button
          @click="handleDownload"
          icon="el-icon-download"
          size="small"
          type="primary"
          >下载</el-button
        >
          <el-button
          class="exportAuth"
          @click="exelExport"
          icon="el-icon-download"
          size="small"
          type="primary"
          v-hasPermi="['record:examcar:export']"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :tableList="tableList"
      :tableHeaderList="column"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="visible"
      width="680px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :disabled="operating == 3"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="车辆序号" prop="clxh">
          <el-input
            :disabled="operating == 2"
            v-model="form.clxh"
            placeholder="车辆序号"
            size="small"
          />
        </el-form-item>
        <!-- <el-form-item label="发证机关" prop="fzjg">
          <jaya-select type="F" v-model="form.fzjg" />
        </el-form-item> -->
        <el-form-item label="所属考场" prop="kcxh">
          <jaya-select type="K" v-model="form.kcxh" />
        </el-form-item>
        <el-form-item label="考车编号" prop="kcbh">
          <el-input
            v-model="form.kcbh"
            placeholder="请输入考车编号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="车辆名称" prop="clmc">
          <el-input
            v-model="form.clmc"
            placeholder="请输入车辆名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="准驾车型" prop="syzjcx">
          <jaya-select
            v-model="form.syzjcx"
            placeholder="准驾车型"
            @getOptions="getOptions"
            othername="exam_car_type"
          />
        </el-form-item>
        <el-form-item label="车辆型号" prop="cllx">
          <el-input
            v-model="form.cllx"
            placeholder="请输入车辆型号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="载员" prop="zy">
          <el-input v-model="form.zy" placeholder="请输入载员" size="small" />
        </el-form-item>
        <el-form-item label="车辆状态" prop="clzt">
          <el-select
            clearable
            style="width: 194px"
            v-model="form.clzt"
            placeholder="车辆状态"
            size="small"
          >
            <el-option
              v-for="carstatus in statusOption"
              :key="carstatus.value"
              :label="carstatus.label"
              :value="carstatus.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="车辆类型" prop="cllx">
          <el-input
            v-model="form.cllx"
            placeholder="请输入车辆类型"
            size="small"
          />
        </el-form-item>
        <el-form-item label="车辆品牌(如：奔驰、宝马)" prop="clpp">
          <el-input
            v-model="form.clpp"
            placeholder="请输入车辆品牌"
            size="small"
          />
        </el-form-item> -->
        <el-form-item label="车辆品牌(如：普桑、皮卡)" prop="clpplx">
          <el-input
            v-model="form.clpplx"
            placeholder="请输入车辆品牌类型 "
            size="small"
          />
        </el-form-item>
        <el-form-item label="考车号牌 " prop="hphm">
          <el-input
            :disabled="operating != 1"
            v-model="form.hphm"
            placeholder="请输入考车号牌 "
            size="small"
          />
        </el-form-item>
        <el-form-item label="初次登记日期" prop="ccdjrq">
          <el-date-picker
            size="small"
            value-format="yyyy-MM-dd"
            v-model="form.ccdjrq"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="强制报废日期" prop="qzbfqz">
          <el-date-picker
            size="small"
            value-format="yyyy-MM-dd"
            v-model="form.qzbfqz"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="使用状态" prop="syzt">
          <jaya-select
            v-model="form.syzt"
            placeholder="使用状态"
            @getOptions="getOptions"
            othername="exam_room_status"
          />
        </el-form-item>
        <el-form-item label="审核人" prop="reviewer">
          <el-input
            v-model="form.reviewer"
            placeholder="请输入审核人"
            size="small"
          />
        </el-form-item>
        <el-form-item label="车载电脑IP" prop="dnip">
          <el-input
            v-model="form.dnip"
            placeholder="请输入车载电脑IP"
            size="small"
          />
        </el-form-item>
        <el-form-item label="车载电脑mac地址" prop="dnMac">
          <el-input
            v-model="form.dnMac"
            placeholder="请输入车载电脑mac地址"
            size="small"
          />
        </el-form-item>
        <el-form-item label="网关" prop="gateway">
          <el-input v-model="form.gateway" placeholder="请输入网关" size="small" />
        </el-form-item>
        <el-form-item label="车架号" prop="vin">
          <el-input v-model="form.vin" placeholder="请输入车架号" size="small" />
        </el-form-item>
        <el-form-item v-if="operating != 1" label="更新时间" prop="gxsj">
          <el-date-picker
            :disabled="operating == 2"
            size="small"
            value-format="yyyy-MM-dd"
            v-model="form.gxsj"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
         <el-form-item label="初次登记信息" prop="remark">
          <el-input
            style="width: 602px"
            type="textarea"
            show-word-limit
            maxlength="128"
            rows="3"
            placeholder="请输入内容"
            v-model="form.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :title="title"
      :visible.sync="videoOpen"
      width="1200px"
      append-to-body
    >
      <div class="xxShow">
        <span>所属考场：{{ formVideo.kcjc }}</span>
        <span>考试车型：{{ formVideo.syzjcx }}</span>
        <span>考车编号：{{ formVideo.kcbh }}</span>
        <span>考车号牌：{{ formVideo.hphm }}</span>
        <span>IP：{{ formVideo.dnip }}</span>
        <span>使用状态：{{ getUseLabel(formVideo.syzt) }}</span>
      </div>
      <el-form
        class="dialogForm"
        :inline="true"
        :model="forms"
        ref="forms"
        :rules="rules"
      >
        <div style="display: flex">
          <div style="width: 480px">
            <el-form-item label="车内视频设备" prop="C">
              <el-select
                clearable
                v-model="forms.C"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in [...spfw, ...yplxj, ...wl]"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="车内视频通道" prop="C">
              <el-input
                v-model="tdh.C"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
            <el-button
              @click="previewView('C', [...spfw, ...yplxj, ...wl])"
              size="small"
              type="primary"
              style="margin-top: 32px"
              >预览</el-button
            >

            <el-form-item label="车外视频设备" prop="W">
              <el-select
                clearable
                v-model="forms.W"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in [...spfw, ...yplxj, ...wl]"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="车外视频通道" prop="W">
              <el-input
                v-model="tdh.W"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
            <el-button
              @click="previewView('W', [...spfw, ...yplxj, ...wl])"
              size="small"
              type="primary"
              style="margin-top: 32px"
              >预览</el-button
            >

            <el-form-item label="解码器视频设备" prop="M">
              <el-select
                clearable
                v-model="forms.M"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in jmq"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="解码器通道" prop="M" class="jmyStyle">
              <el-input
                v-model="tdh.M"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="解码器视频设备" prop="Q">
              <el-select
                clearable
                v-model="forms.Q"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in jmq"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item
              label="解码器视频通道"
              prop="jmqsptd"
              class="jmyStyle"
            >
              <el-input
                clearable
                v-model="tdh.Q"
                placeholder="请输入通道号"
                size="small"
              />
            </el-form-item>
            <el-form-item label="身份认证视频设备" prop="E">
              <el-select
                clearable
                v-model="forms.E"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in [...spfw, ...yplxj, ...wl]"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="身份认证视频通道" prop="E">
              <el-input
                v-model="tdh.E"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
            <el-button
              @click="previewView('E', [...spfw, ...yplxj, ...wl])"
              size="small"
              type="primary"
              style="margin-top: 32px"
              >预览</el-button
            >
            <el-form-item label="四画面视频设备" prop="S">
              <el-select
                clearable
                v-model="forms.S"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in [...yplxj]"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="四画面通道" prop="S">
              <el-input
                v-model="tdh.S"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
            <el-form-item label="">
              <el-button
                @click="previewView('S', [...yplxj])"
                size="small"
                type="primary"
                style="margin-top: 32px"
                >预览</el-button
              >
            </el-form-item>
            <el-form-item label="车内录像视频设备" prop="K">
              <el-select
                clearable
                v-model="forms.K"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in [...yplxj]"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="车内录像视频通道" prop="K">
              <el-input
                v-model="tdh.K"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
            <el-form-item label="">
              <el-button
                @click="previewView('K', [...yplxj])"
                size="small"
                type="primary"
                style="margin-top: 32px"
                >预览</el-button
              >
            </el-form-item>
            <el-form-item label="车外录像视频设备" prop="L">
              <el-select
                clearable
                v-model="forms.L"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in [...yplxj]"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="车外录像视频通道" prop="L">
              <el-input
                v-model="tdh.L"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
            <el-form-item label="">
              <el-button
                @click="previewView('L', [...yplxj])"
                size="small"
                type="primary"
                style="margin-top: 32px"
                >预览</el-button
              >
            </el-form-item>
            <el-form-item label="语音对讲设备" prop="J">
              <el-select
                clearable
                v-model="forms.J"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in spfw"
                  :key="item.sbxh"
                  :label="item.sbmc"
                  :value="item.sbxh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="语音对讲通道" prop="J">
              <el-input
                v-model="tdh.J"
                placeholder="请输入通道号"
                size="small"
                clearable
              />
            </el-form-item>
          </div>
          <div style="flex: 1; margin-top: 30px">
            <div id="divPlugin" class="plugin"></div>
          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="yspShow()">保存</el-button>
        <el-button @click="videoOpen = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOtherSelect } from "@/api/param/select";
import {
  examCarPageList,
  examCarExport,
  examCarDownLoad,
  examCarNewAdd,
  examCarUpdate,
  examCarInfo,
  vehicleInfo,
  getVideoInfo,
} from "@/api/param/record";
import { monitorlist } from "@/api/param/rediomanger";
import { exce } from "@/views/exam/subject/statistics/mixin";
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1,
    },
    {
      title: "考场简称",
      width: "150",
      prop: "kcjc",
    },
    {
      title: "车辆序号",
      width: "120",
      prop: "clxh",
    },
    {
      title: "考车编号",
      width: "150",
      prop: "kcbh",
    },
    {
      title: "准驾车型",
      width: "150",
      prop: "syzjcx",
    },
    {
      title: "车辆型号",
      width: "150",
      prop: "cllx",
    },
    {
      title: "考车号牌",
      width: "150",
      prop: "hphm",
    },
    {
      title: "车辆品牌",
      width: "150",
      prop: "clpplx",
    },
    {
      title: "车载电脑IP",
      prop: "dnip",
    },
    {
      title: "车载电脑mac地址",
      prop: "dnMac",
    },
    {
      title: "网关",
      prop: "gateway",
    },
    {
      title: "车架号",
      prop: "vin",
    },
    {
      title: "车辆状态",
      width: "100",
      prop: "clzt",
      status: () => "car_status",
    },
    {
      title: "使用状态",
      width: "100",
      prop: "syzt",
      status: () => "exam_room_status",
    },
    {
      title: "初次登记信息",
      prop: "remark",
    },
    {
      title: "操作",
      width: "200",
      type: "buttons",
      prop: "roleId",
      butList: [
        {
          title: "详情",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleDetail,
          auth: ["record:examcar:detail"],
        },
        {
          title: "修改",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleUpdate,
          auth: ["record:examcar:edit"],
        },
        {
          title: "音视频配置",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.videoConfigure,
          auth: ["record:examcar:audioVideoSetting"],
        },
      ],
    },
  ];
};
const exelColumn = function () {
  return [
    {
      title: "考场简称",
      width: "150",
      prop: "kcjc",
    },
    {
      title: "车辆序号",
      width: "120",
      prop: "clxh",
    },
    {
      title: "考车编号",
      width: "150",
      prop: "kcbh",
    },
    {
      title: "准驾车型",
      width: "150",
      prop: "syzjcx",
    },
    {
      title: "考车号牌",
      width: "150",
      prop: "hphm",
    },
    {
      title: "车辆品牌",
      width: "150",
      prop: "clpplx",
    },
    {
      title: "车载电脑IP",
      prop: "dnip",
    },
    {
      title: "车载电脑mac地址",
      prop: "dnMac",
    },
    {
      title: "网关",
      prop: "gateway",
    },
    {
      title: "车架号",
      prop: "vin",
    },
    {
      title: "车辆型号",
      width: "150",
      prop: "cllx",
    },
    {
      title: "车载视频ip",
      width: "150",
      prop: "videoIp",
    },
    {
      title: "采集评判软件版本号",
      width: "150",
      prop: "softwareVersion",
    },
    {
      title: "车辆状态",
      width: "100",
      prop: "excelClzt",
    },
    {
      title: "使用状态",
      width: "100",
      prop: "excelSyzt",
    },
    {
      title: "初次登记信息",
      prop: "remark",
    },
  ];
};
export default {
  name: "ExamCar",
  mixins: [exce],
  data() {
    return {
      exelColumn: exelColumn.call(this),
      exelTableList: [],
      barData: {
        textTitle: "考试车"
      },
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      statusOption: [
        { value: "A", label: "可用" },
        { value: "B", label: "停用" },
      ],
      useStatusOption: [],
      spsbOption: [{ value: "", label: "" }],
      yplxj: [],
      jmq: [],
      spfw: [],
      wl: [],
      forms: {},
      tdh: {},

      rules: {
        clzt: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        zy: [
          { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "change" },
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        syzt: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        clxh: [
          { pattern: /^\d{8}$/, message: "请输入8位数字", trigger: "change" },
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // fzjg: [
        //   {
        //     required: true,
        //     message: "必填项",
        //     trigger: "change",
        //   },
        // ],
        kcxh: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // 号牌号码
        hphm: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // 车辆型号
        // cllx: [
        //   {
        //     required: true,
        //     message: "必填项",
        //     trigger: "change",
        //   },
        // ],
        // 考车编号
        kcbh: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // 车辆名称
        clmc: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // 准驾车型
        syzjcx: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // 车辆类型
        // cllx: [
        //   {
        //     required: true,
        //     message: "必填项",
        //     trigger: "change",
        //   },
        // ],
        // // 车辆品牌
        // clpp: [
        //   {
        //     required: true,
        //     message: "必填项",
        //     trigger: "change",
        //   },
        // ],
        // 车辆品牌类型
        // clpplx: [
        //   {
        //     required: true,
        //     message: "必填项",
        //     trigger: "change",
        //   },
        // ],
        // 车载电脑IP
        dnip: [
          { required: true, trigger: "change", message: "必填项" },
          {
            pattern:
              /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: "请输入正确ip地址",
            trigger: "change",
          },
        ],
        dnMac: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern: /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/,
            message: "请输入正确的mac地址",
            trigger: "change",
          },
        ],
        // gateway: [{ required: true, trigger: "change", message: "必填项" }],
      },
      car_status: [],
      exam_car_type: [],
      form: {},
      formVideo: {},
      visible: false,
      videoOpen: false,
      tableList: [],
      operating: 1, // 新增 1 修改 2 详情3
      title: "",
      clxh: null,
      szDeviceIdentify: null,
      iChannelID: null,
    };
  },
  mounted() {
    getOtherSelect("exam_room_status").then((res) => {
      this.useStatusOption = res.data;
    });
    this.getTableList();

    //检查插件是否已经安装过
    const iRet = WebVideoCtrl.I_CheckPluginInstall();
    if (-1 == iRet) {
      this.$alert(
        "<div>您还未安装过插件，请用ie浏览器<a style='color: blue;'  href='/plugins/WebComponentsKit.exe'>下载</a>插件后使用</div>",
        "提示",
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
        }
      );
      return;
    }
  },
  methods: {
    getUseLabel(s) {
      return this.useStatusOption.find((status) => status.value == s)?.label;
    },
    getOptions({ data, type }) {
      this[type] = data;
      if (type == "exam_room_status") {
      }
    },
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      examCarPageList({
        ...this.queryParams,
        syzjcx: this.queryParams.syzjcx ? this.queryParams.syzjcx.join() : "",
      }).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
      if(!document.querySelector('.exportAuth')) return
      let { pageNum, pageSize, ...excelQuery } = this.queryParams;
      examCarExport({
        ...excelQuery,
        syzjcx: this.queryParams.syzjcx ? this.queryParams.syzjcx.join() : "",
      }).then(res=> {
        res.data.forEach(item=> {
          if(item.syzt === 'A') {
            item.excelSyzt = '正常'
          }else if(item.syzt === 'B') {
            item.excelSyzt = '暂停考试'
          }else if(item.syzt === 'C') {
            item.excelSyzt = '取消考试'
          }
          if(item.clzt === 'A') {
            item.excelClzt = '可用'
          }else if(item.clzt === 'B') {
            item.excelClzt = '停用'
          }
          
        })
        this.exelTableList = res.data
      })
    },

    // 新增
    handleAddVisible() {
      this.operating = 1;
      this.form = {};
      this.resetForm("form");
      this.title = "新增";
      this.visible = true;
    },

    getDetail({ clxh }) {
      this.form = {};
      examCarInfo({ id: clxh }).then((res) => {
        this.form = res.data;
        this.visible = true;
      });
    },

    // 修改
    handleUpdate(rows) {
      this.operating = 2;
      this.getDetail(rows);
      this.title = "修改";
    },

    // 详情
    handleDetail(rows) {
      this.operating = 3;
      this.getDetail(rows);
      this.title = "详情";
    },

    // 下载
    handleDownload() {
      const { kcxh } = this.queryParams;
      if (!kcxh) {
        return this.msgWarn("请先选择考场");
      }
      examCarDownLoad({ kcxh }).then((res) => {
        this.msgSuccess(res.msg);
      });
    },
    //音视频配置
    videoConfigure(row) {
      this.formVideo = row;
      let { clxh, kcxh } = row;
      const queryParams = { pageNum: 1, pageSize: 100 };
      //硬盘录像机
      monitorlist({ ...queryParams, sblx: "Y", kcxh }).then((res) => {
        res.rows.forEach((item) => {
          if (item.dk === 8000) {
            item.dk = 80;
          }
        });
        this.yplxj = res.rows;
      });
      //解码器
      monitorlist({ ...queryParams, sblx: "J", kcxh }).then((res) => {
        res.rows.forEach((item) => {
          if (item.dk === 8000) {
            item.dk = 80;
          }
        });
        this.jmq = res.rows;
      });
      //视频服务器
      monitorlist({ ...queryParams, sblx: "S", kcxh }).then((res) => {
        res.rows.forEach((item) => {
          if (item.dk === 8000) {
            item.dk = 80;
          }
        });
        this.spfw = res.rows;
      });
      //网络摄像头
      monitorlist({ ...queryParams, sblx: "W", kcxh }).then((res) => {
        res.rows.forEach((item) => {
          if (item.dk === 8000) {
            item.dk = 80;
          }
        });
        this.wl = res.rows;
      });
      this.title = "配置视频信息";
      this.clxh = clxh;
      getVideoInfo(clxh).then((res) => {
        const form = {};
        const tdh = {};
        res.data.vidChannelList.forEach((item) => {
          form[item.splx] = item.sbxh;
          tdh[item.splx] = item.tdh;
        });
        this.forms = form;
        this.tdh = tdh;
        this.videoOpen = true;
        // 初始化插件参数及插入插件
        setTimeout(() => {
          const oPlugin = {
            iWidth: "100%", // plugin width
            iHeight: "100%", // plugin height
          };
          WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
            bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
            iWndowType: 1,
            cbInitPluginComplete: () => {
              WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            },
          });
        }, 500);
      });
    },
    //预览
    previewView(T, D) {
      // debugger;
      let tdh = this.tdh[T];
      const forms = this.forms[T];
      const { dk, mm, wldz, yhm, sblx } = D.find(
        (item) => item.sbxh == this.forms[T]
      );
      if (!tdh) return this.msgWarn("通道号不可为空");
      if (!forms) return this.msgWarn("视频设备不可为空");
      if (sblx == "Y") {
        if (tdh <= 32) {
          return this.msgWarn("请输入正确的通道号");
        }
        tdh -= 32;
      }

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

      const szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;

      // 登出设备
      if (
        this.szDeviceIdentify != null &&
        this.szDeviceIdentify != szDeviceIdentify
      ) {
        WebVideoCtrl.I_Stop({
          success: () => {
            if (WebVideoCtrl.I_Logout(this.szDeviceIdentify) == 1) {
              alert("登出设备失败");
            }
          },
          error: () => {
            alert("停止预览失败");
          },
        });
      } else if (
        this.szDeviceIdentify == szDeviceIdentify &&
        tdh != this.iChannelID
      ) {
        WebVideoCtrl.I_Stop({
          success: () => {
            WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
              iStreamType: oLiveView.iStreamType,
              iChannelID: oLiveView.iChannelID,
              bZeroChannel: oLiveView.bZeroChannel,
              success: () => {
                this.iChannelID = tdh;
              },
              error: () => {
                this.iChannelID = tdh;
                alert("预览失败");
              },
            });
          },
          error: function () {
            alert("停止预览失败");
          },
        });
        return;
      } else if (
        this.szDeviceIdentify == szDeviceIdentify &&
        tdh == this.iChannelID
      )
        return;

      this.szDeviceIdentify = szDeviceIdentify;
      // 登录设备
      WebVideoCtrl.I_Login(
        oLiveView.szIP,
        oLiveView.iProtocol,
        oLiveView.szPort,
        oLiveView.szUsername,
        oLiveView.szPassword,
        {
          success: (xmlDoc) => {
            setTimeout(() => {
              WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                iStreamType: oLiveView.iStreamType,
                iChannelID: oLiveView.iChannelID,
                bZeroChannel: oLiveView.bZeroChannel,
                success: () => {
                  this.iChannelID = tdh;
                },
                error: () => {
                  this.iChannelID = tdh;
                  alert("预览失败");
                },
              });
            }, 500);
          },
          error: () => {
            alert("登录失败");
          },
        }
      );
    },

    yspShow() {
      //输入框无值向后端传0
      const tdhShow = ["C", "W", "M", "Q", "E", "S", "J", "K", "L"];
      let vidChannelCarVideoDTOList = [];
      tdhShow.forEach((key) => {
        if (this.forms[key]) {
          vidChannelCarVideoDTOList.push({
            splx: key,
            sbxh: this.forms[key],
            tdh: this.tdh[key] ? Number(this.tdh[key]) : 0,
          });
        } else if (key == "Q") {
          vidChannelCarVideoDTOList.push({
            splx: key,
            sbxh: this.forms["M"],
            tdh: this.tdh[key] ? Number(this.tdh[key]) : 0,
          });
        }
      });
      //保存判断
      vehicleInfo({
        clxh: this.clxh,
        vidChannelCarVideoDTOList,
      }).then((res) => {
        this.videoOpen = false;
        this.msgSuccess("保存成功");
      });
    },

    handleSure() {
      this.visible = true;
      if (this.operating !== 3) {
        // 新增，修改 逻辑
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.operating == 1) {
              examCarNewAdd({
                ...this.form,
              }).then(() => {
                this.visible = false;
                this.getTableList();
                this.msgSuccess("新增成功");
              });
            } else {
              const params = {};
              const field = [
                "kcxh",
                "clxh",
                "hphm",
                "kcbh",
                "clmc",
                "syzjcx",
                "zy",
                "clzt",
                "clpplx",
                "ccdjrq",
                "qzbfqz",
                "syzt",
                "reviewer",
                "dnip",
                "dnMac",
                "gateway",
                "vin",
                "remark",
                "cllx",
              ];
              field.map((key) => {
                params[key] =
                  key == "zy" ? Number(this.form[key]) : this.form[key];
              });
              examCarUpdate(params).then(() => {
                this.visible = false;
                this.getTableList();
                this.msgSuccess("修改成功");
              });
            }
          }
        });
      } else {
        this.visible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
.jmyStyle {
  /deep/input {
    width: 125px !important;
  }
}

.plugin {
  width: 100%;
  height: 500px;
}
.xxShow {
  height: 50px;
  span {
    margin-right: 15px;
  }
}
</style>
