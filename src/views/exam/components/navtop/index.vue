<template>
  <div class="container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="warnKC">
            <ul>
              <li v-for="(item, index) in waringInfo" :key="index">
                <!-- <em>11:38:38</em> -->
                <span :title="item.yjxx"
                  >考场：{{ item.kcjc }},{{ item.kchp }},{{
                    yjfl[item.yjfl]
                  }},{{ item.yjsj }},【{{ item.yjxx }}】</span
                >
              </li>
            </ul>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="form">
            <p>
              <label>当前考场：</label>
              <el-select
                clearable
                style="width: 220px !important"
                v-model="room"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in examRoom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </p>
            <p>
              <label>考试车型：</label>
              <el-select
                clearable
                style="width: 220px !important"
                v-model="carType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in examCarType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <!-- <el-select
                style="width:120px!important;"
                v-model="car"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in examCar"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </p>
            <p v-if="isMap">
              <label>追踪车辆：</label>
              <el-select
                clearable
                style="width: 220px !important"
                :value="trackCar"
                @change="changeTrackCar"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in trackCarList"
                  :key="item.kcbh"
                  :label="item.clmc"
                  :value="item.kcbh"
                >
                </el-option>
              </el-select>
            </p>
            <button @click="inquire" class="btn">查看</button>
          </div></el-col
        >
        <el-col :span="12">
          <div>
            <p v-if="statis">
              <!-- <span class="s1">正常</span> -->
              <!-- <span v-if="isMap" class="s1">未考试</span>
              <span v-if="isMap" class="s2">分配完成</span> -->
              <span v-if="isMap" class="s2">立即上车</span>
              <span class="s3">正在考试</span>
              <span class="s4">考试结束</span>
              <span class="s"> (预约人数：{{ statis.yyrs }}</span>
              <span class="s"> 合格人数：{{ statis.hgrs }}</span>
              <span class="s"> 不合格人数：{{ statis.bhgrs }}</span>
              <span class="s">已考人数{{ statis.ykrs }}</span>
              <span class="s">未考人数：{{ statis.wkrs }}</span>
              <span class="s">合格率：{{ statis.hgl }}%)</span>
            </p>
            <p v-if="examCar.length > 0">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  @change="handleCheckedCitiesChange($event, item)"
                  v-for="item in examCar"
                  :key="item.kcbh"
                  :label="item"
                  >{{ item.clmc }}</el-checkbox
                >
              </el-checkbox-group>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <i
      v-if="isMap"
      style="
        z-index: 999;
        color: white;
        font-size: 25px;
        position: absolute;
        right: 5px;
        bottom: 5px;
        cursor: pointer;
        background: #7f9dc3;
      "
      @click="swch"
      :class="!isWc ? 'el-icon-top' : 'el-icon-bottom bot'"
    ></i>
  </div>
</template>

<script>
import {
  getTodayExamRoom,
  getExamCar,
  getExamCarType,
  getWaringInfo,
  getStatisticsInfo,
  getTodayExamCarList
} from "@/api/exam/invigilate";
let timer;
export default {
  name: "NavTop",
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      checkList: [],
      yjfl: ["", "考前检查", "考试过程", "视频", "设备", "考完核验", "合格率"],
      room: "",
      carType: "",
      car: "",
      examCarType: [],
      examRoom: [],
      examCar: [],
      waringInfo: [],
      trackCarList: [],
      statis: null,
      trackCar: "",
      isMap: location.href.includes("map"),
      isWc: false
    };
  },
  mounted() {
    getTodayExamRoom().then((result) => {
      this.examRoom = result.data;
      this.$emit("loadMap", result.data);
    });
  },
  watch: {
    room() {
      this.carType = "";
      this.examCar = [];
      this.getExamCarTypeOptions();
      this.getWaringInfo();
    },
    trackCar(val) {
      this.$emit("trackCar", val);
    }
  },
  methods: {
    swch() {
      this.isWc = !this.isWc;
      this.$emit("swch", this.isWc);
    },
    changeTrackCar(val) {
      if (!val || this.checkList.some((item) => item.kcbh === val)) {
        this.trackCar = val;
        return;
      } else if (this.checkList.length) {
        this.$message({
          message: "请选择地图上正在运行的车辆",
          type: "warning"
        });
      } else if (!this.checkList.length) {
        this.$message({
          message: "请先选择考车",
          type: "warning"
        });
      }
    },

    getExamCarTypeOptions() {
      getExamCarType({ kcxh: this.room }).then((result) => {
        this.examCarType = result.data;
      });
    },

    getExamCarOptions() {
      getTodayExamCarList({ kcxh: this.room, kscx: this.carType }).then(
        (result) => {
          this.examCar = result.data;
          this.trackCarList = result.data;
        }
      );
    },

    getWaringInfo() {
      getWaringInfo(this.room).then((result) => {
        this.waringInfo = result.data;
        setTimeout(this.getWaringInfo, 5000);
      });
    },

    inquire() {
      this.getWaringInfo();
      this.getExamCarOptions();
      this.checkList = [];
      this.checkAll = false;
      this.isIndeterminate =
        this.checkList.length > 0 &&
        this.checkList.length < this.examCar.length;
      timer && clearTimeout(timer);
      timer = () => {
        getStatisticsInfo(this.room).then((res) => {
          this.statis = res.data;
          setTimeout(timer, 5000);
        });
      };

      timer();

      this.$emit(
        "review",
        this.examRoom.findIndex((room) => room.value == this.room),
        this.examRoom.length
      );
    },

    // 全选
    handleCheckAllChange(val) {
      this.checkList = val ? this.examCar : [];
      this.isIndeterminate = false;
      this.handleCheckedCitiesChange();
    },
    handleCheckedCitiesChange(e, T) {
      if (!this.checkList.some((item) => item.kcbh === this.trackCar)) {
        this.trackCar = "";
      }
      this.$emit("checkedChange", {
        checkList: this.checkList,
        carType: this.carType,
        room: this.room,
        T
      });
      this.checkAll = this.checkList.length === this.examCar.length;
      this.isIndeterminate =
        this.checkList.length > 0 &&
        this.checkList.length < this.examCar.length;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-bottom: 16px;
  background: #001529;
  height: 100%;
  margin: 0px;
  padding: 0px;
  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  overflow: -moz-scrollbars-none;
  position: relative;
  transition: all 0.2s;
}

.bot {
  transform: translateY(30px);
}

.active {
  transform: translateY(-150px);
}

.form {
  color: #9eb6c6;
  font-size: 12px;
}

/deep/.el-input__inner {
  background-color: unset;
  height: 26px;
  line-height: 26px;
}

/deep/.el-input__icon {
  line-height: 26px;
}

/deep/.el-row {
  width: 100%;
}

.btn {
  width: 300px;
  color: white;
  border-radius: 20px;
  background-color: #1e9fff;
  text-align: center;
  padding: 3px 0;
  cursor: pointer;
}

.warnKC {
  height: 100px;
  border: 1px solid #203657;
  line-height: 20px;
  overflow-y: scroll;
  font-size: 12px;
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
  li {
    padding: 2px 0;
  }
  li span {
    color: #9eb6c6;
    display: block;
    // margin-left: 80px;
    cursor: pointer;
    // white-space: nowrap;
  }
}
.s1,
.s2,
.s3,
.s4 {
  display: inline-block;
  margin-right: 20px;
  color: #9eb6c6;
  font-size: 12px;
  &::before {
    content: " ";
    display: inline-block;
    margin-right: 3px;
    width: 9px;
    height: 9px;
  }
}

.s {
  display: inline-block;
  margin-right: 20px;
  color: #9eb6c6;
  font-size: 12px;
}

.s1::before {
  background-color: #f42329;
}

.s2::before {
  background-color: red;
}

.s3::before {
  background-color: #52c41a;
}

.s4::before {
  background-color: #9fa2aa;
}
</style>
