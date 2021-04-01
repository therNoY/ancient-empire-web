<template>
  <!-- 遭遇战 -->
  <ae-base-dialog title="遭遇战" v-model="showEncounterDialog" @close="close">
    <user-map-select
      ref="userMapSelect"
      style="padding-top: 5%; padding-bottom: 5%; margin-left: 5%"
      v-model="selectMap"
      label="选择遭遇战地图"
    ></user-map-select>
    <div>
      <ae-button-list
        :buttonList="buttonList"
        :clickAction="[startStandGame, previewMap]"
      ></ae-button-list>
    </div>
  </ae-base-dialog>
</template>

<script>
import {
  InitEncounterMap,
  GetUserTemp,
  GetUnitLevelByTemp,
  RecordInit,
} from "@/api";
import AeButtonList from "../frame/AeButtonList.vue";
import UserMapSelect from "../map_base/UserMapSelect";

export default {
  components: {
    UserMapSelect,
    AeButtonList,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showEncounterDialog: false,
      selectMap: "",
      buttonList: ["开始", "预览"],
    };
  },
  created() {
    window.EncounterVue = this;
  },
  methods: {
    previewMap() {
      if (this.selectMap) {
        this.$refs.userMapSelect.clickPreivewChooseMap();
      }
    },
    close() {
      this.$emit("input", false);
    },

    /**
     * 开始一局单机游戏
     * 1.创建ws连接,
     * 2.后台根据地图和游戏类型生成一个游戏上下文,
     * 3.可以开始游戏
     */
    startStandGame() {
      if (!this.selectMap) {
        return;
      }
      this.$appHelper.setLoading();
      console.log("开始一个遭遇战的单机游戏");
      let record = this.selectMap;
      record.game_type = "encounter";
      RecordInit(record)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.$store.commit("setGame", resp.res_val);
            // 获取单位最大生命值
            this.getUnitLevelByTemp(resp.res_val.template_id);
            // 获取模板
            GetUserTemp(resp.res_val.template_id).then((tempResp) => {
              if (tempResp && tempResp.res_val) {
                this.$store.commit("setTemplate", tempResp.res_val);
                this.$store
                  .dispatch("connectGameSocket", resp.res_val.uuid)
                  .then((r) => {
                    this.loading = false;
                    this.$router.push("/gameIndex");
                  })
                  .catch((e) => {
                    this.loading = false;
                  });
              } else {
                this.$message.error(resp.res_mes);
                this.loading = false;
              }
            });
          } else {
            this.$message.error(resp.res_mes);
            this.loading = false;
          }
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 初始化军队
    setMap() {
      this.initArmys = [];
      let args = {};
      args.uuid = this.currentMap.map_id;
      InitEncounterMap(args).then((resp) => {
        if (resp.res_code == 0) {
          this.initSettingDialog = true;
          let colors = resp.res_val;
          for (let index = 0; index < colors.length; index++) {
            const color = colors[index];
            let army = {};
            army.color = color;
            army.order = index + 1;
            army.camp = index + 1;
            army.type = "user";
            this.initArmys.push(army);
          }
        } else {
          this.$message.error(resp.res_mes);
        }
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
  watch: {
    value() {
      this.showEncounterDialog = this.value;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>