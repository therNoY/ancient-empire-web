<!-- 用户地图选择器 -->
<template>
  <div class="userMap-select">
    <ae-dialog
      ref="aeDialog"
      v-model="showModel"
      :showItem="showItem"
      title="选择地图"
      :queryDataGrid="getUserMapSelect"
      :titleSwitchSelect="titleSwitchSelect"
      :footerButtons="buttonList"
      :footerButtonClickAction="footerButtonClickAction"
      :width="40"
      @titleSwtichSelectChange="titleSwtichSelectChange"
    >
    </ae-dialog>
    <ae-button
      :width="80"
      class="userMap-select-button"
      @onClick="clickSelectMap"
    >
      选择地图
    </ae-button>
    <div
      @click="clickPreivewChooseMap"
      class="userMap-select-name"
      v-if="chooseMap && chooseMap.map_name"
    >
      {{ chooseMap.map_name }}
    </div>
    <ae-base-dialog title="设置地图" v-model="setMapShow" @close="closeSetMap">
      <div>
        <el-table :data="initArmys" style="width: 100%">
          <el-table-column label="军队" width="80px">
            <template slot-scope="army">
              <img :src="$appHelper.getUnitImg('10', army.row.color)" />
            </template>
          </el-table-column>
          <el-table-column label="行动顺序">
            <template slot-scope="army">
              <div @mouseenter="getCurrent(army.row.color)">
                <el-input-number
                  :min="1"
                  :max="initArmys.length"
                  @change="changeOrder"
                  size="mini"
                  v-model="army.row.order"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="color" label="玩家类型">
            <template slot-scope="army">
              <ae-switch-select
                v-model="army.row.type"
                :items="armyType"
              ></ae-switch-select>
            </template>
          </el-table-column>
          <el-table-column label="阵营">
            <template slot-scope="army">
              <div>
                <el-input-number
                  :min="1"
                  :max="initArmys.length"
                  size="mini"
                  v-model="army.row.camp"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="common_init">
          <span>初始金币:</span>
          <el-input-number
            v-model="initMoney"
            :min="500"
            :max="2000"
            size="mini"
            :step="500"
          ></el-input-number>
          <span style="padding-left: 15%">最大人口:</span>
          <el-input-number
            v-model="maxPop"
            :min="15"
            :max="50"
            size="mini"
            :step="5"
          ></el-input-number>
        </div>
        <el-button
          style="width: 30%; margin-top: 10px"
          @click="startStandGame"
          type="primary"
          size="mini"
          >确认</el-button
        >
      </div>
    </ae-base-dialog>
    <ae-map-preview
      v-model="previewVisible"
      @close="close"
      :mapId="previewMapId"
    ></ae-map-preview>
  </div>
</template>

<script>
import {
  GetEncounterMap,
  GetUserMapList,
  GetUserDownloadMap,
  GetWorldMapList,
  InitEncounterMap,
} from "@/api";
import MapPreview from "../map_manger/MapPreview.vue";
import AeMapPreview from "../map_manger/AeMapPreview.vue";
import AeBaseDialog from "../frame/AeBaseDialog.vue";
import AeSwitchSelect from "../frame/AeSwitchSelect.vue";
export default {
  components: { MapPreview, AeMapPreview, AeBaseDialog, AeSwitchSelect },
  props: {
    label: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  data() {
    return {
      titleSwitchSelect: {
        type: "switchSelect",
        key: "round_time",
        default: "1",
        des: "",
        items: [
          { key: "1", value: "系统地图" },
          { key: "2", value: "我的地图" },
          { key: "3", value: "下载地图" },
          { key: "4", value: "世界地图" },
        ],
      },
      showItem: ["map_name"],
      showModel: false,
      buttonList: ["选择", "预览"],
      queryModel: 1,
      previewVisible: false,
      previewMapId: null,
      chooseMap: null,
      setMapShow: false,
      initArmys: [],
      initMoney: 500,
      maxPop: 40,
      currentColor: null,
      armyType: [
        {
          key: "user",
          value: "玩家",
        },
        {
          key: "ai",
          value: "电脑",
        },
        {
          key: "no",
          value: "无",
        },
      ],
    };
  },
  methods: {
    clickSelectMap() {
      this.showModel = true;
      console.log(this.$refs.aeDialog);
    },
    closeSetMap() {},
    titleSwtichSelectChange(value) {
      this.queryModel = value;
      this.$nextTick(() => {
        this.$refs.aeDialog.flushData();
      });
    },
    clickChooseMap() {
      console.log(this.$refs.aeDialog);
      let value = this.$refs.aeDialog.getDataGridSelect();
      this.chooseMap = value;
      // this.showModel = false;
      this.setMap();
      console.log("选择地图", value);
      this.$emit("input", value.map_id);
    },
    clickPreivewButton() {
      let value = this.$refs.aeDialog.getDataGridSelect();
      console.log(value);
      if (value && value.map_id) {
        this.previewMapId = value.map_id;
        this.previewVisible = true;
        return;
      }
    },
    clickPreivewChooseMap() {
      let value = this.chooseMap;
      console.log(value);
      if (value && value.map_id) {
        this.previewMapId = value.map_id;
        this.previewVisible = true;
        return;
      }
    },
    close() {
      this.previewVisible = false;
    },
    // 初始化军队
    setMap() {
      this.initArmys = [];
      let args = {};
      args.uuid = this.chooseMap.map_id;
      InitEncounterMap(args).then((resp) => {
        if (resp.res_code == 0) {
          this.setMapShow = true;
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
    getCurrent(color) {
      this.currentColor = color;
    },
    changeOrder(newNum, oldNum) {
      for (let index = 0; index < this.initArmys.length; index++) {
        let army = this.initArmys[index];
        if (army.order == newNum && army.color != this.currentColor) {
          // 这是要被改变的那个
          army.order = oldNum;
          break;
        }
      }
    },
  },
  created() {
    window.UserMapSelectVue = this;
  },
  computed: {
    getUserMapSelect() {
      if (this.queryModel == 1) {
        return GetEncounterMap;
      } else if (this.queryModel == 2) {
        return GetUserMapList;
      } else if (this.queryModel == 3) {
        return GetUserDownloadMap;
      } else if (this.queryModel == 4) {
        return GetWorldMapList;
      }
    },
    footerButtonClickAction() {
      let functionList = [];
      functionList.push(this.clickChooseMap);
      functionList.push(this.clickPreivewButton);
      return functionList;
    },
  },
};
</script>

<style lang="scss" scoped>
.userMap-select {
  float: left;
  width: 100%;
  .userMap-select-button {
    float: left;
    width: 30%;
  }
  .userMap-select-name {
    font-size: 14px;
    float: left;
    width: 30%;
    padding: 2%;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>