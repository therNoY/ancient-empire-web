<!-- 玩家点击遭遇战 -->
<template>
  <div class="body">
    <!--返回主页-->
    <el-page-header @back="goHome"></el-page-header>

    <!--主要内容-->
    <el-tabs class="select_map" type="border-card">
      <!--系统地图-->
      <el-tab-pane>
        <span slot="label" @click="this.currentMapIndex = -1">
          <i class="el-icon-date"></i> 系统地图
        </span>
        <el-container
          style="
            width: 100%;
            height: 250px;
            border: 1px solid #eee;
            padding-right: 10px;
          "
        >
          <el-main>
            <div v-for="(map, index) in encounterMaps">
              <div
                class="map_item"
                v-if="index != currentMapIndex"
                @click="selectMap(map, index)"
              >
                {{ map.map_name }}
              </div>
              <div
                class="map_item"
                style="background-color: #005aa3ad"
                v-else
                @click="selectMap(map, index)"
              >
                {{ map.map_name }}
              </div>
            </div>
          </el-main>
          <el-footer>
            <!--按钮-->
            <div>
              <el-button
                :disabled="currentMapIndex == -1"
                @click="setMap"
                type="primary"
                size="mini"
                >选择</el-button
              >
              <el-button
                :disabled="currentMapIndex == -1"
                type="primary"
                @click="previewVisible = true"
                size="mini"
                >预览</el-button
              >
            </div>
          </el-footer>
        </el-container>
      </el-tab-pane>
      <!--用户地图-->
      <el-tab-pane label="我的地图" v-if="!noLog">
        <span slot="label" @click="currentMapIndex = -1">
          <i class="el-icon-user-solid"></i> 我的地图
        </span>
        <el-container
          style="
            width: 100%;
            height: 250px;
            border: 1px solid #eee;
            padding-right: 10px;
          "
        >
          <el-main>
            <div v-for="(map, index) in userMaps">
              <div
                class="map_item"
                v-if="index != currentMapIndex"
                @click="selectMap(map, index)"
              >
                {{ map.map_name }}
              </div>
              <div
                class="map_item"
                style="background-color: #005aa3ad"
                v-else
                @click="selectMap(map, index)"
              >
                {{ map.map_name }}
              </div>
            </div>
          </el-main>
          <el-footer>
            <!--按钮-->
            <div>
              <el-button
                :disabled="currentMapIndex == -1"
                @click="setMap"
                type="primary"
                size="mini"
                >选择</el-button
              >
              <el-button
                :disabled="currentMapIndex == -1"
                type="primary"
                @click="previewVisible = true"
                size="mini"
                >预览</el-button
              >
            </div>
          </el-footer>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="我的下载">
        <span slot="label"> <i class="el-icon-star-on"></i> 我的下载 </span
        >暂未开启！！！
      </el-tab-pane>
      <el-tab-pane label="世界地图">
        <span slot="label"> <i class="el-icon-s-promotion"></i> 世界地图 </span
        >暂未开启！！
      </el-tab-pane>
    </el-tabs>

    <!--预览地图-->
    <map-preview
      :mapId="currentMap.map_id"
      :previewVisible="previewVisible"
      @dialogClose="previewVisible = false"
    ></map-preview>

    <!--初始化设置地图-->
    <el-dialog
      title="设置地图"
      class="init_dialog"
      :close-on-click-modal="false"
      v-loading="loading"
      element-loading-text="正在努力创建房间"
      :visible.sync="initSettingDialog"
      width="70%"
    >
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
              <el-radio-group v-model="army.row.type" size="mini">
                <el-radio-button label="user">玩家</el-radio-button>
                <el-radio-button label="ai">电脑</el-radio-button>
                <el-radio-button label="no">无</el-radio-button>
              </el-radio-group>
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
            v-model="money"
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
    </el-dialog>
  </div>
</template>

<script>
import {
  GetEncounterMap,
  GetUserMapList,
  InitEncounterMap,
  GetUserTemp,
  RecordInit,
} from "@/api";
import MapPreview from "../map_manger/MapPreview";
export default {
  components: {
    MapPreview,
  },
  data() {
    return {
      mapId: null,
      loading: false,
      encounterMaps: [],
      currentMap: {},
      currentMapIndex: -1,
      userMaps: [],
      noLog: true,
      initSettingDialog: false,
      previewVisible: false,
      currentColor: null,
      money: 500,
      maxPop: 40,
      initArmys: [],
    };
  },
  methods: {
    goHome() {
      this.$router.push("/");
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
    selectMap(map, index) {
      this.currentMap = map;
      this.currentMapIndex = index;
    },
    /**
     * 开始一局单机游戏
     * 1.创建ws连接,
     * 2.后台根据地图和游戏类型生成一个游戏上下文,
     * 3.可以开始游戏
     */
    startStandGame() {
      this.loading = true;
      console.log("开始一个遭遇战的单机游戏");
      let record = {};
      record.map_id = this.currentMap.map_id;
      record.max_pop = this.maxPop;
      record.money = this.money;
      record.army_list = this.initArmys;
      record.game_type = "encounter";
      RecordInit(record)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.$store.commit("setGame", resp.res_val);
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
    async getEncounterMap() {
      const resp = await GetEncounterMap();
      if (resp.res_code == 0) {
        this.encounterMaps = resp.res_val;
      } else {
        this.$message.error(resp.res_mes);
      }
    },
    async getUserMap() {
      const resp = await GetUserMapList();
      if (resp.res_code == 0) {
        this.userMaps = resp.res_val;
        this.noLog = false;
      } else if (resp.res_code == 40001 || resp.res_code == 40002) {
        console.log("用户没登陆");
        this.noLog = true;
      }
    },
  },
  created() {
    //首选判断是不是登录的用户
    this.getEncounterMap();
    this.getUserMap();
    this.$appHelper.setWidthBack();
  },
};
</script>

<style lang="css" scoped>
.body {
  text-align: center;
}
.select_map {
  width: 60%;
  margin: 3% auto;
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
.unit_img {
  position: absolute;
}
.common_init {
  margin-top: 10px;
}
</style>