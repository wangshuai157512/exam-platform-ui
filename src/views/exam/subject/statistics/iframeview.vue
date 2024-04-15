<template>
  <div class="main-container">
    <component v-if="notHomeName != null" :is="notHomeName" />
  </div>
</template>

<script>
import components from "./register";

const comName = window.location.href.split("?")[1];
export default {
  name: "IframeView",
  components,
  data: function() {
    return {
      notHomeName: comName,
    };
  },
  mounted() {
    if (!comName) {
      top.postMessage("");
    }
  },
  methods: {},
};
</script>

<style scoped>
.main-container {
  width: 100%;
  margin-left: 0 !important;
}
</style>
