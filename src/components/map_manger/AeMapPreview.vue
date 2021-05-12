<template>
  <ae-base-dialog
    id="aeMapPreview"
    v-if="!loading"
    :title="mapName"
    :value="showModel"
    @close="close"
    :width="$appHelper.getMapSize(currentMap.column)"
  >
    <el-container :style="containerStyle">
      <el-main style="position: relative">
        <div class="preview_map" :style="mapStyle" v-if="value">
          <region-view-list
            ref="regionViewList"
            :regions="currentMap.regions"
            :row="currentMap.row"
            :column="currentMap.column"
          ></region-view-list>
          <tomb-view v-if="currentMap.tombs" :tombs="currentMap.tombs" />
          <unit-view-list :units="currentMap.units"></unit-view-list>
          <point-view
            v-if="currentMap.currPoint"
            :point="currentMap.currPoint"
          ></point-view>
        </div>
      </el-main>
    </el-container>
  </ae-base-dialog>
</template>

<script>
import { GetUserMapWithConfig, GetRecordById } from "../../api";
import AeBaseDialog from "../frame/AeBaseDialog.vue";
import PointView from "../map_base/PointView.vue";
import RegionViewList from "../map_base/RegionViewList.vue";
import TombView from "../map_base/TombView.vue";
import UnitViewList from "../map_base/UnitViewList.vue";
import dialogShow from "../../mixins/frame/dialogShow.js";

export default {
  mixins: [dialogShow],

  components: {
    RegionViewList,
    UnitViewList,
    TombView,
    PointView,
    AeBaseDialog,
  },
  /**
   * props设置默认值 指定类型
   */
  props: {
    mapId: {
      // 地图ID
      default: "",
    },
    armyConfigList: {
      type: Array,
      default: () => [],
    },
    map: {
      // 直接传地图进来
      default: null,
    },
    isRecord: {
      // 是否是存档 默认不是
      type: Boolean,
      default: false,
    },
    value: {
      default: false,
    },
  },
  data() {
    return {
      currentMap: {},
      loading: false,
    };
  },
  created() {
    window.AeMapPreviewVue = this;
    this.initMap();
  },
  computed: {
    mapStyle() {
      return {
        width: this.$appHelper.getMapSize(this.currentMap.column),
        height: this.$appHelper.getMapSize(this.currentMap.row),
      };
    },
    containerStyle() {
      return {
        width: this.$appHelper.getMapSize(this.currentMap.column),
        height: "400px",
      };
    },
    mapName() {
      if (this.currentMap && this.currentMap.map_name) {
        return this.currentMap.map_name;
      } else {
        return "";
      }
    },
  },
  methods: {
    onDialogCreate(){
      this.initMap();
    },
    initMap() {
      if (this.map) {
        this.currentMap = this.map;
      } else if (this.mapId) {
        // TODO 通过ID获取地图
        if (this.isRecord) {
          this.loading = this.$appHelper.setLoading();
          GetRecordById(this.mapId)
            .then((resp) => {
              if (resp && resp.res_code == 0) {
                this.currentMap = {};
                this.currentMap.regions = resp.res_val.game_map.regions;
                this.currentMap.tombs = resp.res_val.tomb_list;
                this.currentMap.row = resp.res_val.game_map.row;
                this.currentMap.column = resp.res_val.game_map.column;
                this.currentMap.map_name = resp.res_val.record_name;
                this.currentMap.currPoint = resp.res_val.curr_point;

                let army_list = resp.res_val.army_list;
                this.currentMap.units = [];
                for (let army of army_list) {
                  army.units.forEach((unit) => {
                    unit["color"] = army["color"];
                    unit["id"] = unit["type_id"];
                  });
                  this.currentMap.units = this.currentMap.units.concat(
                    army.units
                  );
                }
              }
              this.loading = this.$appHelper.setLoading();
            })
            .catch((error) => {
              this.loading = this.$appHelper.setLoading();
            });
        } else {
          this.loading = this.$appHelper.setLoading();
          let args = {};
          args.map_id = this.mapId;
          args.army_config_list = this.armyConfigList;
          GetUserMapWithConfig(args)
            .then((resp) => {
              if (resp && resp.res_code == 0) {
                this.currentMap = resp.res_val;
              }
              this.loading = this.$appHelper.setLoading();
            })
            .catch((error) => {
              this.loading = this.$appHelper.setLoading();
            });
        }
      }
    },
    close() {
      this.currentMap = {};
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="scss" >
#aeMapPreview {
  .preview_map {
    position: absolute;
    float: left;
    img {
      float: left;
    }
  }
  .el-main {
    padding: 0px !important;
  }
}
</style>