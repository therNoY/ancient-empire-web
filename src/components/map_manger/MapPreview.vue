<!-- 预览地图 -->
<template>
  <div id="mapPreview">
    <!--预览地图-->
    <el-dialog
      :title="currentMap.map_name"
      :visible.sync="previewMap"
      :width="$appHelper.getMapSize(currentMap.column)"
      @close="$emit('dialogClose')"
    >
      <div class="preview_map" :style="mapStyle">
        <region-view-list
          :regions="currentMap.regions"
          :row="currentMap.row"
          :column="currentMap.column"
          :castleTitles="currentMap.castle_titles"
        ></region-view-list>
        <unit-view-list :units="currentMap.units"></unit-view-list>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetUserMapById, GetRecordById } from "../../api";
import RegionViewList from "../map_base/RegionViewList.vue";
import UnitViewList from "../map_base/UnitViewList.vue";
export default {
  components: {
    RegionViewList,
    UnitViewList,
  },
  /**
   * props设置默认值 指定类型
   */
  props: {
    mapId: {
      // 地图ID
      default: "",
    },
    map: {
      // 直接传地图进来
      default: null,
    },
    isRecord: {
      // 是否是存档 默认不是
      default: false,
    },
    previewVisible: {
      default: false,
    },
  },
  data() {
    return {
      currentMap: {},
    };
  },
  created() {
    console.log("created");
    this.initMap();
  },
  computed: {
    previewMap: {
      get: function () {
        return this.previewVisible;
      },
      set: function () {},
    },
    mapStyle() {
      return {
        width: this.$appHelper.getMapSize(this.currentMap.column),
        height: this.$appHelper.getMapSize(this.currentMap.row),
      };
    },
  },
  methods: {
    initMap() {
      if (this.map) {
        this.currentMap = this.map;
      } else if (this.mapId) {
        // TODO 通过ID获取地图
        if (this.isRecord) {
          GetRecordById(this.mapId).then((resp) => {
            if (resp && resp.res_code == 0) {
              this.currentMap = resp.res_val;
            }
          });
        } else {
          GetUserMapById(this.mapId).then((resp) => {
            if (resp && resp.res_code == 0) {
              this.currentMap = resp.res_val;
            }
          });
        }
      }
    },
  },
  watch: {
    mapId() {
      this.initMap();
    },
  },
};
</script>

<style lang="scss" >
#mapPreview {
  .preview_map {
    position: absolute;
    float: left;
    margin-left: -10px;
    img {
      float: left;
    }
  }
  .el-dialog__header {
    padding: 10px 10px 5px !important;
  }
  .el-dialog__body {
    padding: 0px 10px !important;
  }
}
</style>