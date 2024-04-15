<template>
  <div class="wscn-http404-container">
    <img class="pic-404__parent" src="@/assets/404_images/404.gif" alt="404" />
  </div>
</template>

<script>
export default {
  name: "Page404",
  computed: {
    message() {
      return "找不到网页！";
    },
  },
};
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  height: 100%;
  .pic-404__parent {
    width: 100%;
    height: 100%;
  }
}
</style>
