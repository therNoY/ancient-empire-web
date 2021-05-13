<template>
  <div id="mapEdit">
    <!--可选单位-->
    <div class="unit" v-if="flushUnitFlag">
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
                :title="getUnitTitle(unit)"
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
              changeAction,
              changeMapSize,
              () => (showChangeMsg = true),
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

    <!--设置宽度弹出框 改变大小新建-->
    <ae-base-dialog
      class="size_dialog"
      title="设置大小"
      v-model="reSizeDialog"
      :width="20"
    >
      <ae-input label="名字：" v-model="currentMapInfo.map_name"></ae-input>
      <ae-input
        label="高度："
        v-model="newMapColumn"
        type="number"
        :max="100"
        :min="10"
      ></ae-input>
      <ae-input
        label="高度："
        v-model="newMapRow"
        type="number"
        :max="100"
        :min="10"
      ></ae-input>
      <ae-button @onClick="createNewMapBySize(newMapColumn, newMapRow)"
        >确 定</ae-button
      >
    </ae-base-dialog>

    <!--我的地图-->
    <ae-complex-dialog
      ref="myMap"
      v-model="showMapVisible"
      :showItem="showItem"
      showSearch
      title="我的地图"
      :initQueryDataGrid="queryFunction"
      :footerButtons="myMapEditButtonList"
      :width="40"
      page
    >
    </ae-complex-dialog>

    <template-select
      v-model="showSelectTemp"
      @onSelect="createNewMapByTemplateId"
    ></template-select>

    <!--预览地图-->
    <map-preview
      v-model="previewVisible"
      :mapId="currPreviewMap.map_id"
    ></map-preview>

    <!--用于保存或者发布-->
    <ae-complex-dialog
      v-model="showChangeMsg"
      title="保存地图"
      :formConfig="baseMapFormConfig"
      :dataObj="currentMapInfo"
      :footerButtons="changMapInfoButtons"
    ></ae-complex-dialog>
  </div>
</template>

<script>
import {
  GetLastEditMap,
  SimpleDrawing,
  GetUserMapList,
  SaveUserMap,
  CreateDraftMap,
  ChangeUserSetting,
  GetUserMapById,
  GetUserTemplateBindUnit,
} from "@/api";
import RegionViewList from "../map_base/RegionViewList";
import MapPreview from "@frame/MapPreview.vue";
import TemplateSelect from "../template_mange/TemplateSelect";
export default {
  components: {
    RegionViewList,
    MapPreview,
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
      previewVisible: false,
      showSelectTemp: false,
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
      currentMapInfo: { map_name: "", share: "1", map_id: null },
      currPreviewMap: {}, // 准备预览的地图
      buttonList: ["主页", "新建", "绘画", "重置", "保存", "我的"],
      myMapEditButtonList: [
        { name: "修改", action: this.editMap },
        { name: "预览", action: this.previewMap },
      ],
      flushUnitFlag: true, // 帮助刷新
      currentTemplateId: null, // 当前模板ID

      showChangeMsg: false,
      baseMapFormConfig: [
        {
          type: "input",
          key: "map_name",
          des: "模板名称",
        },
        {
          type: "switchSelect",
          key: "share",
          des: "是否共享",
          items: [
            { key: "1", value: "共享" },
            { key: "0", value: "不共享" },
          ],
        },
      ],
      changMapInfoButtons: [
        { name: "保存草稿", action: () => this.saveMap(0) },
        { name: "发布版本", action: () => this.saveMap(1) },
      ],
    };
  },
  methods: {
    // 查看单位的说明
    getUnitTitle(unit) {
      return unit.row + "行" + unit.column + "列";
    },
    revertMap() {},
    previewMap() {
      this.currPreviewMap = this.$refs.myMap.getDataGridSelect();
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
    changeAction() {
      if (this.action == "painting") {
        this.buttonList.splice(0, 0);
        this.buttonList[2] = "删除";
        this.action = "delete";
      } else {
        this.buttonList.splice(0, 0);
        this.buttonList[2] = "绘画";
        this.action = "painting";
      }
      this.$notify({
        message: this.buttonList[2] + " 模式",
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
        this.selectRegion = JSON.parse(JSON.stringify(this.selectRegion));
        this.selectRegion["type"] = "sea";
        this.doPainting();
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
    createNewMapBySize() {
      if (
        !this.currentMapInfo.map_name ||
        !this.newMapRow ||
        !this.newMapColumn
      ) {
        this.$appHelper.errorMsg("输入有误");
        return;
      }
      if (this.newMapRow < 10 || this.newMapColumn < 10) {
        this.$appHelper.errorMsg("宽高最低是10");
        return;
      }

      if (this.newMapRow > 100 || this.newMapColumn > 100) {
        this.$appHelper.errorMsg("宽高最多是100哦!");
        return;
      }

      // 1. 保存用户的大小设定
      let args = {};
      args.map_init_row = row;
      args.map_init_column = colum;
      ChangeUserSetting(args);
      this.createNewMap({
        tempId: this.currentTemplateId,
        mapRow: this.newMapRow,
        mapCloumn: this.newMapColumn,
        mapName: this.currentMapInfo.map_name,
      });
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
        // 地形需要优化 异步画地形
        this.getSimpleDrawing(
          this.currentEditInfo.index,
          this.selectRegion.type
        );
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
    // 修改地图地形
    updateMap(index, type) {
      this.maps[index].type = type;
      this.maps[index].color = this.regionColor;
      console.log("修改index 和 type", index, type);
    },
    // 保存地图
    saveMap(optType) {
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
      args.opt_type = optType;
      args.uuid = this.currentMapInfo.map_id;
      args.share = this.currentMapInfo.share;
      args.map_name = this.currentMapInfo.map_name;
      this.$appHelper.setLoading();
      SaveUserMap(args)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.$appHelper.infoMsg("保存成功");
            this.saveMapDialog = false;
          } else {
            this.$appHelper.errorMsg(resp.res_mes);
          }
          this.showChangeMsg = false;
          this.getLastEditMap();
          this.$appHelper.setLoading();
        })
        .catch((err) => {
          this.$appHelper.setLoading();
        });
    },
    // 从创建过的地图里面选择编辑地图
    editMap(editMap) {
      if (!editMap) {
        this.currPreviewMap = this.$refs.myMap.getDataGridSelect();
        editMap = this.currPreviewMap;
      }
      GetUserMapById(editMap.map_id).then((resp) => {
        if (resp && resp.res_code == 0) {
          let userMap = resp.res_val;
          this.maps = userMap.regions;
          this.mapColumn = userMap.column;
          this.mapRow = userMap.row;
          this.unitList = userMap.units;
          this.showMapVisible = false;
          this.currentMapInfo.map_name = userMap.map_name;
          this.currentMapInfo.share = userMap.share;
          this.currentMapInfo.map_id = userMap.uuid;
          if (resp.res_val.template_id) {
            let args = {};
            args.template_id = resp.res_val.template_id;
            GetUserTemplateBindUnit(args).then((resp) => {
              this.flushUnitFlag = false;
              this.initMapInfo.unit_mes_list = resp.res_val.unit_mes_list;
              this.initMapInfo.region_mes = resp.res_val.region_mes;
              this.flushUnitFlag = true;
            });
          }
        }
      });
    },
    // 初始化
    createNewMap({ tempId, mapRow, mapCloumn, mapName }) {
      let args = {};
      args.template_id = tempId;
      args.map_row = mapRow;
      args.map_cloumn = mapCloumn;
      args.map_name = mapName;

      this.$appHelper.setLoading();
      CreateDraftMap(args)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.currentMapInfo.map_name = mapName;
            // 默认共享
            this.currentMapInfo.share = "1";
            this.currentMapInfo.map_id = this.initMapInfo.un_save_map.uuid;
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
            this.$appHelper.errorMsg(resp.res_mes);
          }
          this.$appHelper.setLoading();
        })
        .catch((err) => {
          this.$appHelper.setLoading();
        });
    },

    createNewMapByTemplateId(tempId) {
      console.log("新的模板Id");
      this.$appHelper.showInputDialog("创建地图", "地图名称", (mapName) => {
        this.createNewMap({
          tempId: tempId,
          mapName: mapName,
          mapRow: this.mapRow,
          mapCloumn: this.mapCloumn,
        });
      });
    },
    /**
     * 获取上一个编辑的地图
     */
    getLastEditMap() {
      GetLastEditMap().then((resp) => {
        if (resp.res_code == "0") {
          this.initMapInfo = resp.res_val;
          this.userSetting = resp.res_val.user_setting;
          this.unitList = this.initMapInfo.un_save_map.units;
          if (!this.unitList) {
            this.unitList = [];
          }
          this.currentMapInfo.map_name = resp.res_val.un_save_map.map_name;
          this.currentMapInfo.share = resp.res_val.un_save_map.share;
          this.currentMapInfo.map_id = resp.res_val.un_save_map.uuid;

          this.maps = this.initMapInfo.un_save_map.regions;
          this.mapColumn = this.initMapInfo.un_save_map.column;
          this.mapRow = this.initMapInfo.un_save_map.row;
          this.currentTemplateId = this.initMapInfo.user_template.id;
        }
      });
    },
  },
  created() {
    // 1.获取初始化地图的宽高 初始化地图的type 获取已有地图的Id Name 获取可编辑的Unit 和 Region
    this.queryFunction = GetUserMapList;
    if (this.$route.params.mapId && this.$route.params.mapId != "0") {
      let map = {};
      map.map_id = this.$route.params.mapId;
      this.editMap(map);
    } else {
      this.getLastEditMap();
    }

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
    // TODO 暂时不实现 需要判断没有保存的 需要与地图的回退和恢复一起实现
    // this.saveMap("0");
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
    .select_unit,
    .un_select_unit {
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
