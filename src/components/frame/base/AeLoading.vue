<template>
  <div class="ae-loading-container" v-show="globleLoading">
    <div class="ae-loading-body">
      <unit :unit_id="unitId" :singo="singo"></unit>
      <div>加载中...</div>
    </div>
  </div>
</template>

<script>
import Unit from "../Unit.vue";

export default {
  components: { Unit },
  data() {
    return {
      loading: false,
      unitId: 1,
      singo: 0,
      timerChangeSingo: -1,
    };
  },
  computed: {
    globleLoading() {
      if (
        this.loading != this.$store.getters.gloadLoading &&
        this.$store.getters.gloadLoading
      ) {
        this.changeUnit();
        this.startWork();
      }
      this.loading = this.$store.getters.gloadLoading;
      if (!this.loading) {
        clearInterval(this.timerChangeSingo);
      }
      return this.$store.getters.gloadLoading;
    },
  },
  methods: {
    changeUnit() {
      this.unitId = Math.floor(1 + Math.random() * 12);
    },
    startWork() {
      let _this = this;
      this.timerChangeSingo = setInterval(() => {
        if (_this.singo < 1000) {
          _this.singo++;
        } else {
          _this.singo = 0;
        }
      }, 300);
    },
  },
};
</script>

<style lang="scss" scope>
.ae-loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(167, 167, 167, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.ae-loading-body {
  background: #242a43;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  padding-top: 1%;
  padding-left: 50%;
  width: 100%;
  height: 10%;
  color: aliceblue;
}
</style>
