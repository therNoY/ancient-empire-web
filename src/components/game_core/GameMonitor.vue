<template>
  <div>
    <div class="button">
      <el-form size="mini">
        <el-form-item>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <el-input
              style="width: 30%"
              v-model="gameId"
              placeholder="gameId"
              clearable
            ></el-input>
            <el-input
              style="width: 30%"
              v-model="currArmyIndex"
              placeholder="currArmyIndex"
              clearable
            ></el-input>
            <el-input
              style="width: 30%"
              v-model="currUnitType"
              placeholder="currUnitType"
              clearable
            ></el-input>
            <el-input
              style="width: 30%"
              v-model="point"
              placeholder="point"
              clearable
            ></el-input>
          </div>

          <el-button type="primary" @click="getData('all')">全部</el-button>
          <el-button type="primary" @click="getData('curr_army')"
            >当前军队</el-button
          >
          <el-button type="primary" @click="getData('curr_unit')"
            >当前单位</el-button
          >
          <el-button type="primary" @click="getData('no_map')"
            >记录信息</el-button
          >
          <el-button type="primary" @click="preview">预览</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="conten">
      <json-viewer
        :value="data"
        :expand-depth="expandDepth"
        copyable
        previewMode
      ></json-viewer>
      <map-preview v-if="previewVisible" v-model="previewVisible" :map="previewMap"></map-preview>
    </div>
  </div>
</template>

<script>
import { GetUnitLevelByTemp } from "@/api";
import { request } from "../../api/request";
import MapPreview from "../map_manger/MapPreview.vue";
export default {
  components: { MapPreview },
  data() {
    return {
      gameId: "",
      currArmyIndex: "",
      currUnitType: "",
      expandDepth: 2,
      previewMap: {},
      point:"",
      previewVisible: false,
      data: {},
    };
  },
  methods: {
    preview() {
      let args = { game_id: this.gameId };
      args["all"] = "1";
      request("/api/monitor", args, "POST").then((resp) => {
        if (resp.res_code == 0) {
          this.previewMap = {};
          this.previewMap.regions = resp.res_val.user_record.game_map.regions;
          this.previewMap.tombs = resp.res_val.user_record.tomb_list;
          this.previewMap.row = resp.res_val.user_record.game_map.row;
          this.previewMap.column = resp.res_val.user_record.game_map.column;
          this.previewMap.map_name = "预览";
          let army_list = resp.res_val.user_record.army_list;
          this.previewMap.units = [];
          if (this.point && this.point.split(",") && this.point.split(",").length == 2) {
            let currPoint = {};
            currPoint.row = this.point.split(",")[0];
            currPoint.column = this.point.split(",")[1];
             this.previewMap.currPoint = currPoint;
          }
          for (let army of army_list) {
            army.units.forEach((unit) => {
              unit["color"] = army["color"];
              unit["id"] = unit["type_id"];
            });
            this.previewMap.units = this.previewMap.units.concat(army.units);
          }
          this.previewVisible = true;
        }
      });
    },
    async getUnitLevelByTemp(tempId) {
      const resp = await GetUnitLevelByTemp(tempId);
      if (resp.res_code == 0) {
        this.$store.commit("setUnitLevelInfo", resp.res_val);
      } 
    },
    getData(key, index = "1") {
      let args = { game_id: this.gameId };
      if (this.currArmyIndex) {
        args.curr_army_index = this.currArmyIndex;
      }
      if (this.currUnitType) {
        args.curr_unit_type = this.currUnitType;
      }
      args[key] = index;
      request("/api/monitor", args, "POST").then((resp) => {
        if (resp.res_code == 0) {
          this.data = resp.res_val;
        }
      });
    },
  },
  created() {
    window.MonitorVue = this;
    this.$appHelper.setWidthBack();
    this.getUnitLevelByTemp("1");
  },
};
</script>

<style lang="scss" scoped>
</style>