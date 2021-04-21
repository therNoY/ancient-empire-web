<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      v-model="showModel"
      :showItem="showItem"
      title="选择存档"
      :initQueryDataGrid="queryDataFunction"
      :footerButtons="footerButtons"
      :width="40"
    ></ae-complex-dialog>
  </div>
</template>

<script>
import dialogShow from "@/mixins/frame/dialogShow.js";
import {
  GetUserTemp,
  GetStoreList,
  GetUnitLevelByTemp,
  MapInit,
} from "@/api";
export default {
  mixins: [dialogShow],
  data() {
    return {
      footerButtons: [
        { name: "开始", action: this.startStoreGame },
        { name: "返回", action: () => this.$emit("input", false) },
      ],
      queryDataFunction: null,
      showItem: ["map_name"],
    };
  },
  methods: {
    /**
     * 开始一局单机游戏
     * 1.创建ws连接,
     * 2.后台根据地图和游戏类型生成一个游戏上下文,
     * 3.可以开始游戏
     */
    startStoreGame() {
      let record = this.$refs.aeDialog.getDataGridSelect();
      this.$appHelper.setLoading();
      console.log("开始一个遭遇战的单机游戏");
      let args = {};
      args.map_id = record.uuid;
      args.game_type = "story";
      MapInit(args).then((resp) => {
          if (resp.res_code == 0) {
            this.$store.commit("setGame", resp.res_val);
            // 获取单位最大生命值
            this.getUnitLevelByTemp(resp.res_val.template_id);
            // 获取模板
            GetUserTemp(resp.res_val.template_id).then((tempResp) => {
              if (tempResp && tempResp.res_val) {
                this.$store.commit("setTemplate", tempResp.res_val);
                let connArgs = {};
                connArgs.recordId = resp.res_val.uuid;
                connArgs.type = "chapter_game";
                this.$store
                  .dispatch("connectGameSocket", connArgs)
                  .then((r) => {
                    this.$appHelper.setLoading();
                    this.loading = false;
                    this.$router.push("/gameIndex");
                  })
                  .catch((e) => {
                    console.error(e);
                    this.$appHelper.setLoading();
                  });
              } else {
                this.$message.error(resp.res_mes);
                this.$appHelper.setLoading();
              }
            });
          } else {
            this.$message.error(resp.res_mes);
            this.$appHelper.setLoading();
          }
        })
        .catch((e) => {
          console.error(e);
          this.$appHelper.setLoading();
        });
    },

    async getUnitLevelByTemp(tempId) {
      const resp = await GetUnitLevelByTemp(tempId);
      if (resp.res_code == 0) {
        this.$store.commit("setUnitLevelInfo", resp.res_val);
        return resp.res_val;
      } else {
        this.$message.error(resp.res_mes);
        return null;
      }
    },
  },
  created() {
    this.queryDataFunction = GetStoreList;
    window.UserRecordVue = this;
  },
};
</script>

<style>
</style>