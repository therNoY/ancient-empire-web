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
      <div v-for="unit in this.initMapInfo.unit_mes_list">
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
      <el-container
        style="
          width: 100%;
          height: 100%;
          border: 1px solid #eee;
          padding-right: 20px;
        "
      >
        <el-main>
          <div class="map_div">
            <div class="map" :style="mapWidthStyle">
              <img
                class="unit_img"
                v-for="(unit, index) in unitList"
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
                :row="new_init_row"
                :column="new_init_column"
                @clickRegion="clickEditMapRegion"
              />
            </div>
          </div>
        </el-main>
        <el-footer>
          <div class="opera_button">
            <el-button
              type="primary"
              v-if="action == 'painting'"
              icon="el-icon-magic-stick"
              size="mini"
              >绘画</el-button
            >
            <el-button
              type="primary"
              @click="changeAction('painting')"
              v-else
              icon="el-icon-magic-stick"
              plain
              size="mini"
              >绘画</el-button
            >

            <el-button
              type="danger"
              v-if="action == 'delete'"
              icon="el-icon-scissors"
              size="mini"
              >删除</el-button
            >
            <el-button
              type="danger"
              v-else
              @click="changeAction('delete')"
              icon="el-icon-scissors"
              plain
              size="mini"
              >删除</el-button
            >

            <el-button
              type="info"
              @click="changeMapSize"
              icon="el-icon-setting"
              plain
              size="mini"
              >大小</el-button
            >

            <el-button
              type="success"
              @click="saveMap"
              icon="el-icon-upload"
              plain
              size="mini"
              >保存</el-button
            >

            <el-button
              type="warning"
              @click="getUserMap"
              icon="el-icon-s-goods"
              plain
              size="mini"
              >我的</el-button
            >
          </div>
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
      <div v-for="region in this.initMapInfo.region_mes">
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
    <el-dialog
      class="size_dialog"
      title="大小设置"
      :close-on-click-modal="false"
      :visible.sync="sizeDialog"
      width="20%"
    >
      宽度：
      <el-input-number size="mini" v-model="new_init_column"></el-input-number>
      <br />高度：
      <el-input-number size="mini" v-model="new_init_row"></el-input-number>
      <el-button type="primary" @click="getNewInitMap" size="mini"
        >确定</el-button
      >
    </el-dialog>

    <!--保存地图-->
    <el-dialog
      class="save_dialog"
      title="保存地图"
      :close-on-click-modal="false"
      :visible.sync="saveDialog"
      width="30%"
    >
      <el-input
        class="input"
        size="mini"
        v-model="saveMapName"
        placeholder="请输入要保存的地图的名字"
      ></el-input>
      <el-button type="primary" @click="saveMap" size="mini">确定</el-button>
    </el-dialog>

    <!--我的地图-->
    <el-dialog
      title="我的地图"
      :close-on-click-modal="false"
      :visible.sync="showMapVisible"
      :show-close="true"
      width="50%"
    >
      <!--地图-->
      <el-container
        style="
          width: 100%;
          height: 250px;
          border: 1px solid #eee;
          padding-right: 10px;
        "
      >
        <el-main>
          <div v-for="(map, index) in myMaps">
            <div
              class="map_item"
              v-if="index != selectMapIndex"
              @click="selectMap(index)"
            >
              {{ map.map_name }}
            </div>
            <div
              class="map_item"
              style="background-color: #005aa3ad"
              v-else
              @click="selectMap(index)"
            >
              {{ map.map_name }}
            </div>
          </div>
        </el-main>
        <el-footer>
          <!--按钮-->
          <div>
            <el-button
              :disabled="selectMapIndex == -1"
              @click="delMap"
              type="danger"
              size="mini"
              >删除</el-button
            >
            <el-button type="warning" size="mini" @click="buildNewMap"
              >新建</el-button
            >
            <el-button
              :disabled="selectMapIndex == -1"
              @click="editMap"
              type="info"
              size="mini"
              >编辑</el-button
            >
            <el-button
              :disabled="selectMapIndex == -1"
              type="primary"
              @click="previewVisible = true"
              size="mini"
              >预览</el-button
            >
          </div>
        </el-footer>
      </el-container>
    </el-dialog>

    <!--预览地图-->
    <map-preview
      v-if="selectMapIndex >= 0"
      :mapId="myMaps[selectMapIndex].uuid"
      v-model="previewVisible"
    ></map-preview>
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
} from "@/api";
import RegionViewList from "../map_base/RegionViewList";
import MapPreview from "./MapPreview.vue";
export default {
  components: {
    RegionViewList,
    MapPreview,
  },
  data() {
    return {
      // 地图上的要被编辑的地图
      currentEditInfo: {},
      sizeDialog: false,
      new_init_row: null,
      new_init_column: null,
      showMapVisible: false,
      saveDialog: false,
      previewVisible: false,
      initMapInfo: {},
      color: "blue",
      regionColor: "",
      selectUnit: {},
      selectRegion: {},
      userSetting: {}, // 用户设定
      maps: [],
      // 有单位type 和 color 其他都没
      unitList: [],
      myMaps: [], // 我的地图
      action: "painting", // 编辑模式
      countMap: 0,
      selectMapIndex: -1,
      saveMapName: null, // 保存地图名
      editMapModel: "draft",
    };
  },
  methods: {
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
      if ((index + 1) % this.new_init_column == 0) {
        this.currentEditInfo.row = Math.floor(
          (index + 1) / this.new_init_column
        );
        this.currentEditInfo.column = this.new_init_column;
      } else {
        this.currentEditInfo.row =
          Math.floor((index + 1) / this.new_init_column) + 1;
        this.currentEditInfo.column = (index + 1) % this.new_init_column;
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
    // 改变地图大小
    changeMapSize() {
      this.$confirm("改变地图大小将会删除当前地图，从新载入新的地图", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.sizeDialog = true;
        })
        .catch();
    },
    // 获取新的初始化地图
    async getNewInitMap() {
      // 1. 保存用户的大小设定
      let args = {};
      args.map_init_row = this.new_init_row;
      args.map_init_column = this.new_init_column;
      const resp = await ChangeUserSetting(args);
      if (resp.res_code == 0) {
        this.countMap = this.new_init_row * this.new_init_column;
        this.userSetting.map_init_column = this.new_init_column;
        this.userSetting.map_init_row = this.new_init_row;
        this.maps = [];
        let map = {};
        map.color = "";
        map.type = this.userSetting.map_init_region_type;
        for (let i = 0; i < this.countMap; i++) {
          this.maps.push(map);
        }
        this.sizeDialog = false;
        this.$message.success("重置成功");
      } else {
        this.$message.error(resp.res_mes);
      }
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
      args.row = this.new_init_row;
      args.column = this.new_init_column;
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
    // 点击我的地图的一个
    selectMap(index) {
      this.selectMapIndex = index;
    },
    // 保存地图
    saveMap() {
      let args = {};
      this.unitList.forEach(u=>{
        if (u.id && !u.type_id) {
          u.type_id = u.id;
        }
      })
      args.units = this.unitList;
      args.regions = this.maps;

      args.row = this.new_init_row;
      args.column = this.new_init_column;
      if (this.editMapModel == "editMap") {
        // 编辑模式直接保存
        args.uuid = this.myMaps[this.selectMapIndex].uuid;
        
        SaveMap(args).then((resp) => {
          if (resp.res_code == 0) {
            this.$message.success("保存成功");
            this.saveDialog = false;
          } else {
            this.$message.error(resp.res_mes);
          }
        });
      } else if (this.editMapModel == "draft") {
        this.$prompt("请输入保存地图的名字", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            args.map_name = value;
            args.template_id = this.initMapInfo.user_template.id;
            SaveMap(args).then((resp) => {
              if (resp.res_code == 0) {
                this.$message.success("保存成功");
                this.saveDialog = false;
              } else {
                this.$message.error(resp.res_mes);
                reject(resp.res_mes)
              }
            });
          })
          .catch(() => {});
      }
    },
    // 删除地图
    delMap() {
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.delUserMap(this.myMaps[this.selectMapIndex].uuid);
        })
        .catch();
    },
    async delUserMap(uuid) {
      const resp = await DelUserMap(uuid);
      if (resp.res_code == 0) {
        this.$message.success("删除成功");
        this.myMaps.splice(this.selectMapIndex, 1);
        this.selectMapIndex = -1;
      } else {
        this.$message.error(resp.res_mes);
      }
    },
    // 获取我的地图
    getUserMap() {
      GetUserMapList().then((resp) => {
        if (resp.res_code == 0) {
          this.myMaps = resp.res_val;
        }
        this.showMapVisible = true;
        this.selectMapIndex = -1;
      });
    },
    // 新建地图
    buildNewMap() {
      this.showMapVisible = false;
      for (let i = 0; i < this.countMap; i++) {
        this.maps[i].type = "sea";
      }
      this.unitList = [];
    },
    // 编辑地图
    editMap() {
      this.maps = this.myMaps[this.selectMapIndex].regions;
      this.new_init_column = this.myMaps[this.selectMapIndex].column;
      this.new_init_row = this.myMaps[this.selectMapIndex].row;
      this.countMap =
        this.userSetting.map_init_column * this.userSetting.map_init_row;
      this.unitList = this.myMaps[this.selectMapIndex].units;
      this.editMapModel = "editMap";
      this.showMapVisible = false;
    },
    // 初始化
    init() {
      GetInitUserMap().then((resp) => {
        if (resp.res_code == 0) {
          this.initMapInfo = resp.res_val;
          this.userSetting = resp.res_val.user_setting;
          this.unitList = this.initMapInfo.un_save_map.units;
          this.maps = this.initMapInfo.un_save_map.regions;
          this.new_init_column = this.initMapInfo.un_save_map.column;
          this.new_init_row = this.initMapInfo.un_save_map.row;
        } else {
          this.$message.error(resp.res_mes);
        }
      });
    },

    // 销毁之前保存临时地图
    saveTempMap() {
      if (this.editMapModel == "draft") {
        let userMap = {};
        this.unitList.forEach(u=>{
          if (u.id && !u.type_id) {
          u.type_id = u.id;

          }
        })
        userMap.units = this.unitList;
        userMap.regions = this.maps;
        userMap.row = this.new_init_row;
        userMap.column = this.new_init_column;
        userMap.template_id = this.initMapInfo.user_template.id;
        SaveTempMap(userMap);
      }
    },
  },
  created() {
    // 1.获取初始化地图的宽高 初始化地图的type 获取已有地图的Id Name 获取可编辑的Unit 和 Region
    this.init();
    window.MapEditVue = this;
  },
  computed: {
    mapWidthStyle() {
      return {
        width: this.$appHelper.getMapSize(this.new_init_column),
        height: this.$appHelper.getMapSize(this.new_init_row),
      };
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
    background-color: #ffffff;
    img {
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
    background-color: #ffffff;
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
    color: #5a5a5a;
    font-size: 12px;
    float: left;
    width: 100%;
  }
  .opera_button {
    margin-top: 10px;
  }
  .main {
    float: left;
    width: 54%;
    height: 100%;
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
    background-color: #77c2ffd0;
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
    background-color: #005aa3ad;
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
