<template>
  <div>
    <el-form class="dialogForm" :inline="true">
      <el-form-item label="考场简称">
        <jaya-select
          :disabled="true"
          type="K"
          v-model="form.kcxh"
        ></jaya-select>
      </el-form-item>
      <el-form-item label="考车号牌">
        <el-input :disabled="true" v-model="form.kchp" placeholder="" />
      </el-form-item>
      <el-form-item label="预警分类">
        <el-select
          :disabled="true"
          v-model="form.yjfl"
          placeholder="预警分类"
          size="small"
        >
          <el-option
            v-for="item in yjfl"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预警信息">
        <el-input v-model="form.yjxx" placeholder="预警信息" />
      </el-form-item>
    </el-form>
    <div>
      <el-button
        style="float: right"
        type="primary"
        size="small"
        @click="addWaring"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { addWaring } from "@/api/exam/invigilate";
function getUrlVars(url) {
  var hash;
  var myJson = {};
  var hashes = url.slice(url.indexOf("?") + 1).split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    myJson[hash[0]] = hash[1];
  }
  return myJson;
}
export default {
  name: "Addwaring",
  data() {
    return {
      form: { yjfl: "2", ...getUrlVars(location.href) },
      yjfl: [
        {
          value: "1",
          label: "考前检查",
        },
        {
          value: "2",
          label: "考试过程",
        },
        {
          value: "3",
          label: "视频",
        },
        {
          value: "4",
          label: "设备",
        },
        {
          value: "5",
          label: "考完核验",
        },
        {
          value: "6",
          label: "合格率",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    addWaring() {
      const { ksxh } = this.form;

      if (!ksxh) return this.msgWarn("考生不在考试中,无法预警");
      addWaring({ ...this.form, ksxh, zt: "1" }).then((res) => {
        if (res.code == 200) this.msgSuccess(res.msg);
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
