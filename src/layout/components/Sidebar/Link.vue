<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    query: {
      type: String,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return "a";
      }
      return "router-link";
    },
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        let href = to;
        if (to.split("router").length > 1) {
          href = to.split("router")[1];
        }

        return {
          href,
          target: "_blank",
          rel: "noopener",
        };
      }
      return {
        to: this.query ? `${to}?${this.query}` : to,
      };
    },
  },
};
</script>
