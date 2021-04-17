<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      title="选择存档"
      :initQueryDataGrid="queryDataFunction"
      :footerButtons="footerButtons"
      showSearch
      :width="40"
      page
    >
    </ae-complex-dialog>
    <ae-map-preview
      v-model="showPreview"
      :mapId="mapId"
      isRecord
    ></ae-map-preview>
  </div>
</template>

<script>
import {
  GetUserRecordList,
  RecordInit,
  GetUnitLevelByTemp,
  GetUserTemp,
  DelUserRecord,
} from "@/api";
import dialogShow from "@/mixins/frame/dialogShow.js";
import AeMapPreview from "../map_manger/AeMapPreview.vue";
export default {
  components: { AeMapPreview },
  mixins: [dialogShow],
  props: {},
  data() {
    return {
      queryDataFunction: null,
      footerButtons: [
        { name: "继续", action: this.continueRecord },
        { name: "预览", action: this.preview },
        { name: "删除", action: this.delUserRecord },
      ],
      showTitle: ["名称", "创建时间"],
      showItem: ["record_name", "create_time"],
      showPreview: false,
      mapId: null,
    };
  },
  created() {
    this.queryDataFunction = GetUserRecordList;
    window.UserRecordVue = this;
  },
  methods: {
    preview() {
      let record = this.$refs.aeDialog.getDataGridSelect();
      this.mapId = record.uuid;
      this.showPreview = true;
    },
    delUserRecord() {
      this.$appHelper.showTip("确定要删除么？", () => {
        let record = this.$refs.aeDialog.getDataGridSelect();
        this.$appHelper.setLoading();
        DelUserRecord(record.uuid)
          .then((resp) => {
            this.$appHelper.setLoading();
            this.$message.info("删除成功");
            this.$refs.aeDialog.flushData();
          })
          .catch((err) => {
            console.log(err);
            this.$appHelper.setLoading();
          });
      });
    },
    /**
     * 继续一局单机游戏
     * 1.创建ws连接,
     * 2.后台根据地图和游戏类型生成一个游戏上下文,
     * 3.可以开始游戏
     */
    continueRecord() {
      let record = this.$refs.aeDialog.getDataGridSelect();
      this.$appHelper.setLoading();
      console.log("开始一个遭遇战的单机游戏");
      let args = {};
      args.uuid = record.uuid;
      RecordInit(args)
        .then((resp) => {
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
                connArgs.type = "stand_game";
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
};
</script>

<style lang="scss" scoped>
</style>