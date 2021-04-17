<template>
  <div id="mapEdit">
    <!--可选单位-->
    <div class="unit">
      <div class="color_select" style="margin-top: 20px">
        <el-radio-group v-model="color" size="mini">
          <el-radio-button label="blue">蓝色</el-radio-button>
          <el-radio-button label="red">红色</el-radio-button>
          <el-radio-button label="green">绿色</el-radio-button>
          <el-radio-button label="black">黑色</el-radio-button>
        </el-radio-group>
      </div>
      <div
        v-for="(unit, key) in this.initMapInfo.unit_mes_list"
        v-bind:key="key"
      >
        <img
          class="select_unit"
          v-if="unit.id == selectUnit.id"
          :src="$appHelper.getUnitImg(unit.id, color)"
          @click="getUnit(unit)"
        />
        <img
          class="un_select_unit"
          v-else
          :src="$appHelper.getUnitImg(unit.id, color)"
          @click="getUnit(unit)"
        />
      </div>
      <div v-if="selectUnit && selectUnit.id" class="select_desc">
        {{ selectUnit.name }}:{{ selectUnit.description }}
      </div>
    </div>
    <!--操作地图-->
    <div class="main">
      <el-container class="map-edit-container">
        <el-main>
          <div class="map_div" :style="mapStyle">
            <div class="map" :style="mapWidthStyle">
              <img
                class="unit_img"
                v-for="(unit, index) in unitList"
                v-bind:key="index"
                :src="
                  $appHelper.getUnitImg(
                    unit.id ? unit.id : unit.type_id,
                    unit.color
                  )
                "
                :style="{
                  top: $appHelper.getUnitPosition(unit.row),
                  left: $appHelper.getUnitPosition(unit.column),
                }"
                @click="clickEditMapUnit(unit, index)"
              />
              <region-view-list
                ref="regionViewList"
                :regions="maps"
                :row="mapRow"
                :column="mapColumn"
                showTitle
                @clickRegion="clickEditMapRegion"
              />
            </div>
          </div>
        </el-main>
        <el-footer class="opera_button">
          <ae-button-list
            :factor="70"
            :buttonList="buttonList"
            :clickAction="[
              () => $router.push('/'),
              () => (showSelectTemp = true),
              () => changeAction('painting'),
              () => changeAction('delete'),
              changeMapSize,
              saveMap,
              () => (showMapVisible = true),
            ]"
          ></ae-button-list>
        </el-footer>
      </el-container>
    </div>

    <!--可选地形-->
    <div class="region">
      <div class="color_select" style="margin-top: 20px">
        <el-radio-group v-model="regionColor" size="mini">
          <el-radio-button label>空</el-radio-button>
          <el-radio-button label="blue">蓝色</el-radio-button>
          <el-radio-button label="red">红色</el-radio-button>
          <el-radio-button label="green">绿色</el-radio-button>
          <el-radio-button label="black">黑色</el-radio-button>
        </el-radio-group>
      </div>
      <div
        v-for="(region, index) in this.initMapInfo.region_mes"
        v-bind:key="index"
      >
        <img
          class="select_unit"
          v-if="region.id == selectRegion.id"
          :src="$appHelper.getRegionImg(region.type, regionColor)"
          @click="getRegion(region)"
        />
        <img
          class="un_select_unit"
          v-else
          :src="$appHelper.getRegionImg(region.type, regionColor)"
          @click="getRegion(region)"
        />
      </div>
      <div v-if="selectRegion && selectRegion.name" class="select_desc">
        {{ selectRegion.name }}:{{ selectRegion.description }}
      </div>
    </div>

    <!--设置宽度弹出框-->
    <ae-base-dialog
      class="size_dialog"
      title="设置大小"
      v-model="reSizeDialog"
      :width="20"
    >
      宽度：
      <el-input-number size="mini" v-model="newMapRow"></el-input-number>
      <br />高度：
      <el-input-number size="mini" v-model="newMapColumn"></el-input-number>
      <ae-button @onClick="getNewInitMap(newMapColumn, newMapRow)"
        >确 定</ae-button
      >
    </ae-base-dialog>

    <!--保存地图-->
    <ae-base-dialog title="保存地图" v-model="saveMapDialog" :width="30">
      <div style="padding: 2%">
        <ae-input
          v-model="saveMapName"
          label="地图名字"
          placeholder="请输入要保存的地图的名字"
        ></ae-input>
      </div>

      <ae-button
        style="margin-left: 65%; margin-top: 5%"
        :width="65"
        @onClick="saveDraftMap"
        >确 定</ae-button
      >
    </ae-base-dialog>

    <!--我的地图-->
    <ae-complex-dialog
      ref="myMap"
      v-model="showMapVisible"
      :showItem="showItem"
      title="我的地图"
      :initQueryDataGrid="queryFunction"
      :footerButtons="myMapEditButtonList"
      :width="40"
    >
    </ae-complex-dialog>

    <template-select v-model="showSelectTemp" @onSelect="selectNewTemp"></template-select>

    <!--预览地图-->
    <ae-map-preview
      v-model="previewVisible"
      :mapId="currMap.map_id"
    ></ae-map-preview>
  </div>
</template>

<script>
import {
  GetInitUserMap,
  SaveTempMap,
  SimpleDrawing,
  GetUserMapList,
  DelUserMap,
  SaveMap,
  ChangeUserSetting,
  GetUserMapById,
} from "@/api";
import RegionViewList from "../map_base/RegionViewList";
import MapPreview from "./MapPreview.vue";
import AeBaseDialog from "../frame/AeBaseDialog.vue";
import AeButtonList from "../frame/AeButtonList.vue";
import AeComplexDialog from "../frame/AeComplexDialog.vue";
import AeMapPreview from "./AeMapPreview.vue";
import TemplateSelect from "../template_mange/TemplateSelect"
export default {
  components: {
    RegionViewList,
    MapPreview,
    AeBaseDialog,
    AeButtonList,
    AeComplexDialog,
    AeMapPreview,
    TemplateSelect,
  },
  data() {
    return {
      // 地图上的要被编辑的地图
      currentEditInfo: {},
      reSizeDialog: false,
      mapRow: null,
      mapColumn: null,
      newMapColumn: null,
      newMapRow: null,
      queryFunction: null,

      showItem: ["map_name"],
      showMapVisible: false,
      saveMapDialog: false,
      previewVisible: false,
      showSelectTemp:false,
      initMapInfo: {},
      color: "blue",
      regionColor: "",
      selectUnit: {},
      selectRegion: {},
      userSetting: {}, // 用户设定
      maps: [],
      // 有单位type 和 color 其他都没
      unitList: [],
      action: "painting", // 编辑模式
      saveMapName: null, // 保存地图名
      currMap: {},
      editMapModel: "draft",
      buttonList: ["主页", "新建", "绘画", "删除", "重置", "保存", "我的"],
      myMapEditButtonList: [
        { name: "删除", action: this.delMap },
        { name: "修改", action: this.editMap },
        { name: "预览", action: this.previewMap },
      ],
    };
  },
  methods: {
    previewMap() {
      this.currMap = this.$refs.myMap.getDataGridSelect();
      this.previewVisible = true;
    },
    // 用户点击单位
    getUnit(unit) {
      this.selectUnit = unit;
      this.selectRegion = {};
    },
    // 点击地形
    getRegion(region) {
      this.selectRegion = region;
      this.selectUnit = {};
    },
    // 改变行为
    changeAction(action) {
      this.action = action;
      this.$notify({
        message: action + " 模式",
      });
    },
    // 点击单位地形
    clickEditMapRegion(index) {
      // 首先获取当前点击的哪个位置
      this.currentEditInfo.index = index;
      if ((index + 1) % this.mapColumn == 0) {
        this.currentEditInfo.row = Math.floor((index + 1) / this.mapColumn);
        this.currentEditInfo.column = this.mapColumn;
      } else {
        this.currentEditInfo.row = Math.floor((index + 1) / this.mapColumn) + 1;
        this.currentEditInfo.column = (index + 1) % this.mapColumn;
      }
      console.log(this.currentEditInfo);
      // 判断现在的行为 是不是绘画
      if (this.action == "painting") {
        // 执行绘画逻辑
        this.doPainting();
      } else if (this.action == "delete") {
        // 删除就是画海
        this.doPainting(index, "sea");
      }
    },
    // 点击已有的单位
    clickEditMapUnit(unit, index) {
      // 判断现在的行为 是不是绘画
      if (this.action == "painting") {
        // 执行绘画逻辑
        if (this.selectUnit.hasOwnProperty("type")) {
          // 原来已经存在改单位
          console.log("替换 单位");
          this.unitList[index].color = this.color;
          this.unitList[index].id = this.selectUnit.id;
        } else {
          this.doPainting();
        }
      } else if (this.action == "delete") {
        // 执行擦出逻辑
        console.log("删除" + index);
        this.unitList.splice(index, 1);
        this.getRegion(this.selectRegion);
      }
    },
    changeMapSize() {
      this.$appHelper.showTip("重置将会删除当前地图，从新载入新的地图", () => {
        this.newMapColumn = this.mapColumn;
        this.newMapRow = this.mapRow;
        this.reSizeDialog = true;
      });
    },
    // 获取新的初始化地图
    getNewInitMap(row = this.mapRow, colum = this.mapColumn) {
      // 1. 保存用户的大小设定
      let args = {};
      args.map_init_row = row;
      args.map_init_column = colum;
      ChangeUserSetting(args);

      this.userSetting.map_init_column = colum;
      this.userSetting.map_init_row = row;
      this.maps = [];
      this.unitList = [];
      for (let i = 0; i < row * colum; i++) {
        let map = {};
        map.color = "";
        map.type = this.userSetting.map_init_region_type;
        this.maps.push(map);
      }
      this.mapColumn = colum;
      this.mapRow = row;
      this.reSizeDialog = false;
      this.$message.info("重置成功");
    },
    // 执行绘画逻辑
    doPainting() {
      // 准备画人物
      if (this.selectUnit.hasOwnProperty("type")) {
        console.log("准备画单位");
        // 新增
        let unit = {};
        unit.color = this.color;
        unit.id = this.selectUnit.id;
        unit.row = this.currentEditInfo.row;
        unit.column = this.currentEditInfo.column;
        this.unitList.push(unit);
      } else if (this.selectRegion.hasOwnProperty("type")) {
        // 判断是不是 设置了自动优化
        if (this.userSetting.simple_drawing) {
          this.getSimpleDrawing(
            this.currentEditInfo.index,
            this.selectRegion.type
          );
        } else {
          // 直接设置
          this.updateMap(this.currentEditInfo.index, this.selectRegion.type);
        }
      }
    },
    // 优化简单绘画
    async getSimpleDrawing(index, type) {
      let args = {};
      args.index = index;
      args.type = type;
      args.row = this.mapRow;
      args.column = this.mapColumn;
      args.region_list = this.maps;
      // 获取优化结果
      const resp = await SimpleDrawing(args);
      if (resp.res_code == 0) {
        let updateMaps = resp.res_val;
        for (let index in updateMaps) {
          this.updateMap(index, updateMaps[index]);
        }
      } else {
        console.error(resp.resp_mes);
      }
    },
    // 修改地图大小
    updateMap(index, type) {
      this.maps[index].type = type;
      this.maps[index].color = this.regionColor;
      console.log("修改index 和 type", index, type);
    },
    // 保存地图
    saveMap() {
      let args = {};
      this.unitList.forEach((u) => {
        if (u.id && !u.type_id) {
          u.type_id = u.id;
        }
      });
      args.units = this.unitList;
      args.regions = this.maps;
      args.row = this.mapRow;
      args.column = this.mapColumn;
      if (this.editMapModel == "editMap") {
        // 编辑模式直接保存
        args.uuid = this.currMap.map_id;

        SaveMap(args).then((resp) => {
          if (resp.res_code == 0) {
            this.$message.success("保存成功");
            this.saveMapDialog = false;
          } else {
            this.$message.error(resp.res_mes);
          }
        });
      } else if (this.editMapModel == "draft") {
        this.saveMapDialog = true;
      }
    },
    saveDraftMap() {
      let args = {};
      args.map_name = this.saveMapName;
      args.template_id = this.initMapInfo.user_template.id;
      args.units = this.unitList;
      args.regions = this.maps;
      args.row = this.mapRow;
      args.column = this.mapColumn;
      SaveMap(args).then((resp) => {
        if (resp.res_code == 0) {
          this.$message.info("保存成功");
        } else {
          this.$message.error(resp.res_mes);
        }
        this.saveMapDialog = false;
      });
    },
    // 删除地图
    delMap() {
      this.currMap = this.$refs.myMap.getDataGridSelect();
      let uuid = this.currMap.map_id;
      this.$appHelper.showTip("将会删除当前地图", () => {
        DelUserMap(uuid).then((resp) => {
          if (resp.res_code == 0) {
            this.$message.info("删除成功");
            this.$refs.myMap.flushData();
          } else {
            this.$message.error(resp.res_mes);
          }
        });
      });
    },

    // 编辑地图
    editMap() {
      this.currMap = this.$refs.myMap.getDataGridSelect();
      if (!this.currMap) {
        return;
      }
      GetUserMapById(this.currMap.map_id).then((resp) => {
        if (resp && resp.res_code == 0) {
          let userMap = resp.res_val;
          this.maps = userMap.regions;
          this.mapColumn = userMap.column;
          this.mapRow = userMap.row;
          this.unitList = userMap.units;
          this.editMapModel = "editMap";
          this.showMapVisible = false;
        }
      });
      this.maps = this.currMap.regions;
      this.mapColumn = this.currMap.column;
      this.mapRow = this.currMap.row;
      this.unitList = this.currMap.units;
      this.editMapModel = "editMap";
      this.showMapVisible = false;
    },
    // 初始化
    init(tempId) {
      let args  = {}
      args.template_id = tempId;
      this.$appHelper.setLoading();
      GetInitUserMap(args).then((resp) => {
        if (resp.res_code == 0) {
          this.initMapInfo = resp.res_val;
          this.userSetting = resp.res_val.user_setting;
          this.unitList = this.initMapInfo.un_save_map.units;
          if (!this.unitList) {
            this.unitList = [];
          }
          this.maps = this.initMapInfo.un_save_map.regions;
          this.mapColumn = this.initMapInfo.un_save_map.column;
          this.mapRow = this.initMapInfo.un_save_map.row;
        } else {
          this.$message.error(resp.res_mes);
        }
        this.$appHelper.setLoading();
      }).catch(err=>{
        this.$appHelper.setLoading();
      })
    },

    selectNewTemp(tempId){
      console.log("新的模板Id");
      this.init(tempId);
    },

    // 销毁之前保存临时地图
    saveTempMap() {
      if (this.editMapModel == "draft") {
        let userMap = {};
        this.unitList.forEach((u) => {
          if (u.id && !u.type_id) {
            u.type_id = u.id;
          }
        });
        userMap.units = this.unitList;
        userMap.regions = this.maps;
        userMap.row = this.mapRow;
        userMap.column = this.mapColumn;
        userMap.template_id = this.initMapInfo.user_template.id;
        SaveTempMap(userMap);
      }
    },
  },
  created() {
    // 1.获取初始化地图的宽高 初始化地图的type 获取已有地图的Id Name 获取可编辑的Unit 和 Region
    this.queryFunction = GetUserMapList;
    this.init();

    window.MapEditVue = this;
  },
  computed: {
    mapWidthStyle() {
      return {
        width: this.$appHelper.getMapSize(this.mapColumn),
        height: this.$appHelper.getMapSize(this.mapRow),
      };
    },
    mapStyle() {
      let mapCount = document.body.clientWidth * 0.54;
      let w = this.mapColumn * 24;
      if (mapCount > w) {
        return {
          float: "left",
          marginLeft: (mapCount - w) / 2 + "px",
          width: w + "px",
          height: this.$appHelper.getMapSize(this.mapRow),
        };
      } else {
        return {
          width: w + "px",
          height: this.$appHelper.getMapSize(this.mapRow),
        };
      }
    },
  },
  destroyed() {
    this.saveTempMap();
  },
};
</script>

<style lang="scss">
#mapEdit {
  text-align: center;
  height: 100%;
  .unit {
    float: left;
    width: 20%;
    margin-left: 1%;
    height: 100%;
    color: rgb(255, 255, 255);
    .select_unit, .un_select_unit {
      float: left;
      margin-left: 20px;
      margin-top: 20px;
      cursor: pointer;
    }
  }
  .region {
    float: right;
    width: 24%;
    margin-right: 1%;
    height: 100%;
    color: rgb(255, 255, 255);
    img {
      float: left;
      margin-left: 20px;
      margin-top: 20px;
      cursor: pointer;
    }
  }
  .select_unit {
    border: #5a5a5a75 1px solid;
    background-color: #3030301f;
  }
  .un_select_unit {
    border: #4e4a4a00 1px solid;
  }
  .select_desc {
    margin-top: 20%;
    color: rgb(255, 255, 255);
    font-size: 12px;
    float: left;
    width: 100%;
  }
  .opera_button {
    margin-bottom: 3%;
  }
  .main {
    float: left;
    width: 54%;
    height: 100%;
    background-color: #242b44;
    .map-edit-container {
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
      padding-right: 20px;
    }
  }
  .size_dialog {
    color: white;
    font-size: 14px;
  }
  .map_div {
    position: relative;
  }
  .map img {
    float: left;
    margin: 0px;
    cursor: pointer;
  }
  .save_dialog .el-input {
    margin-bottom: 10px;
  }
  .el-input-number {
    margin-bottom: 10px;
  }
  .unit_img {
    position: absolute;
  }
  .map_item {
    height: 25px;
    width: 70%;
    margin-left: 15%;
    border-radius: 4px;
    font-size: 14px;
    color: #ffffff;
    padding-top: 8px;
    margin-bottom: 5px;
  }
  .map_item:hover {
    cursor: pointer;
  }
  .preview_map {
    float: left;
    margin-left: -20px;
  }
  .preview_map img {
    float: left;
  }
}
</style>
