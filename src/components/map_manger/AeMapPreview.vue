<template>
  <ae-base-dialog
    v-if="!loading"
    :title="mapName"
    :value="value"
    id="aeMapPreview"
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
          <point-view
            v-if="currentMap.currPoint"
            :point="currentMap.currPoint"
          ></point-view>
          <unit-view-list :units="currentMap.units"></unit-view-list>
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
export default {
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
    armyConfigList:{
      default: [],
    },
    map: {
      // 直接传地图进来
      default: null,
    },
    isRecord: {
      // 是否是存档 默认不是
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
                this.currentMap = resp.res_val;
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
          GetUserMapWithConfig(args).then((resp) => {
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
  watch: {
    value(v) {
      if (v) {
        this.initMap();
      }
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