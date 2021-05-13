
<script>
export default {
  props: {
    component: {
      type: String,
    },
    item:{

    },
    componentFunction: {
      type: Function,
    },
  },
  render: function (createElement) {
    //   return createElement("button", {}, "按钮");
      return this.componentFunction(createElement, this.item);
  },
};
</script>

<style>
</style>