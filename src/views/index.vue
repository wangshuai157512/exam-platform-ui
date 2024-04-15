<template>
  <div class="home">
    <img src="../assets/images/home-title.png" alt="" />
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  min-height: calc(100vh - 100px);
  background: url("../assets/images/home-bg.png") no-repeat center center;
  background-size: cover;
  img {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 100px;
  }
}
</style>
