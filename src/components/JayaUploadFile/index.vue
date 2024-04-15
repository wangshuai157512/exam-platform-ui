<template>
  <div>
    <el-upload
      action=""
      ref="upload"
      :multiple="multiple"
      :accept="accept"
      :limit="limit"
      :http-request="httpRequest"
      :show-file-list="showFileList"
      :before-upload="beforeAvatarUpload"
      :on-change="oNchange"
      auto-upload
      class="uploadFile"
    >
      <template v-if="isHasSlot">
        <slot></slot>
      </template>
      <div v-else>
        <div class="defaultUpload">
          <div class="fileTitle">{{ fileTitle }}</div>
          <div>
            <div class="default-upload-container">{{ getFileName }}</div>
            <span>{{ annotation }}</span>
          </div>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "JayaUploadFile",
  props: {
    fileTitle: {
      type: String,
      default: "上传文件",
    },
    annotation: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: "",
    },
    limit: {
      type: Number,
      default: 100,
    },
    httpRequest: {
      type: Function,
      default: () => {},
    },
    fileSize: {
      type: String,
      default: "10",
    },
    showFileList: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "file",
    },
    base64Img: {
      type: Boolean,
      default: false,
    }, // 需要返回base64Imgurl
  },
  data() {
    return {
      name: "点击上传文件",
      fileList: [],
    };
  },
  computed: {
    isHasSlot() {
      return this.$slots.default && this.$slots.default.length;
    },
    getFileName() {
      if (this.multiple) {
        let newName = this.name.replace(/点击上传文件/g, "");
        return this.name === "点击上传文件"
          ? this.name
          : newName.substring(0, newName.lastIndexOf("、"));
      } else {
        return this.name;
      }
    },
  },
  methods: {
    beforeAvatarUpload(file) {
      let size = Math.floor(file.size / 1024 / 1024); //计算文件的大小
      if (size > this.fileSize) {
        this.$message.error(`${"上传文件大小不能超过" + this.fileSize + "M!"}`);
        return false;
      }
      let FileExt = file.name.replace(/.+\./, "");
      let arrAccept = this.accept?.split(",");
      if (
        this.accept && arrAccept.indexOf(FileExt.toLowerCase()) === -1
      ) {
        this.$message({
          type: "warning",
          message:
            this.type === "images"
              ? `请上传后缀名为${this.accept}的图片！`
              : `请上传后缀名为${this.accept}的附件！`,
        });
        return false;
      }
      if (this.multiple) {
        if (this.name.indexOf(file.name) === -1) {
          this.name += `${file.name}、`;
        }
      } else {
        this.name = file.name;
      }
    },
    clearFileName() {
      this.$refs.upload.clearFiles();
      this.name = "点击上传文件";
    },
    oNchange(file, fileList) {
      let imgExt = file.name.replace(/.+\./, "");
      let imgAccept = this.accept.split(",");
      if (imgAccept.indexOf(imgExt) !== -1) {
        if (this.base64Img) {
          this.getBase64(file.raw).then((res) => {
            const params = res.split(",");
            if (params.length > 0) {
              let imageUrl = params[1];
              this.$emit("getImageUrl", imageUrl);
            }
          });
        } else {
          let imageUrl = URL.createObjectURL(file.raw);
          this.$emit("getImageUrl", imageUrl);
        }
      }

      // 同一文件只添加一次
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name);
      if (existFile) {
        fileList.pop();
      }
      this.fileList = fileList;
      this.$emit("getFileList", this.fileList);
    },
    // 获取图片转base64
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.default-upload-container {
  box-sizing: border-box;
  width: 460px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #dddddd;
  background: rgba(255, 255, 255, 0.35);
  color: #c2c4cc;
  font-size: 13px;
  line-height: 40px;
  text-align: left;
  padding-left: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 10px;
}
.uploadFile {
  .defaultUpload {
    text-align: left;
    display: flex;
    align-items: center;
    margin-top: 20px;
    .fileTitle {
      text-align: right;
      display: block;
      width: 84px;
      margin-top: -18px;
    }
    span {
      margin-left: 10px;
      color: red;
    }
  }
}
</style>
