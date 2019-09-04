<template>
  <div class="body">
    <div style="font-size:12px; float:left; width:9%">{{mapSt}}</div>
    <div class="map_body">
      <el-container style="width: 100%;height:100%; border: 1px solid #eee;padding-right: 20px;">
        <el-main style="text-align: center;">
          <div
            class="map_div"
            v-if="record.init_map"
            :style="{width: mapSize(record.init_map.column), height: mapSize(record.init_map.row)}"
          >
            <div class="map">
              <!--地形-->
              <region :init_map="record.init_map" :castleTitles="castleTitles"></region>
              <!--攻击移动区域图-->
              <maparea :mapSt="mapSt" :mapDt="mapDt"></maparea>
              <!--指针框-->
              <point :singo="singo" :mapSt="mapSt" :mapDt="mapDt"></point>
              <!--单位-->
              <unit :armyList="record.army_list" :tombs="record.tomb" :currColor="record.curr_color" :singo="singo" :mapSt="mapSt"></unit>
              <!--展示行动图标-->
              <actions :mapStatus="mapSt.mapStatus" :unitActions="mapDt.unitActions"></actions>
            </div>
          </div>
        </el-main>
        <el-footer>
          
          <el-button @click="testSendWS">发送ws</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import region from "./region_map";
import unit from "./unit_map";
import point from "./assits_map/Point";
import maparea from "./assits_map/Area";
import actions from "./assits_map/Action";
import { GetRecordById } from "@/api";
export default {
  components: {
    region,
    unit,
    point,
    maparea,
    actions
  },
  data() {
    return {
      singo: true, // 控制单位一闪一闪
      recordId: null,
      record: {},
      mapSt: null,
      mapDt: null,
      castleTitles: []
    };
  },
  computed: {
    mapSize() {
      return function(num) {
        return num * 24 + "px";
      };
    }
  },
  methods: {
    // 获取记录
    async getRecord() {
      let url = "/record/" + this.recordId;
      const resp = await GetRecordById(url);
      if (resp.res_code == 0) {
        this.record = resp.res_val;
        const map = this.record.init_map;
        // 获取所有的城堡index 然后设置绝对定位设置城堡的头部
        for (let index = 0; index < map.regions.length; index++) {
          const region = map.regions[index];
          if (region.type == "castle") {
            let castleTitle = {};
            if ((index + 1) % map.row == 0) {
              castleTitle.row = Math.floor((index + 1) / map.column) - 1;
              castleTitle.column = map.column;
            } else {
              castleTitle.row = Math.floor((index + 1) / map.column);
              castleTitle.column = (index + 1) % map.column;
            }
            this.castleTitles.push(castleTitle);
          }
        }
      } else {
        this.$message.error(resp.res_mes);
        this.$router.push("/");
      }
    },
    // 与后台创建一个 ws 连接
    connectWs() {
      // 开始连接
      if (this.$store.state.ws.stompClient == null) {
        this.$store.dispatch("wsConnection", this.recordId);
      }
    },
    testSendWS() {
      let args = {};
      args.url = "/ws/test";
      args.mes = "获取移动范围";
      this.$store.dispatch("wsSendMes", args);
    },
    // 开启一个后台进程 计时器
    startWorker() {
      if (typeof Worker !== "undefined") {
        if (this.worker == null) {
          this.worker = new Worker(setInterval(this.timer, 500));
        }
      } else {
        alert("抱歉 您的电脑不支持");
      }
    },
    timer() {
      this.singo = !this.singo;
    }
  },
  created() {
    if ((this.recordId = this.$store.getters.recordId) == null) {
      this.$router.push("/");
      return;
    }
    this.getRecord();
    this.mapSt = this.$store.getters.mapSt;
    this.mapDt = this.$store.getters.mapDt;
    this.connectWs();
    // this.startWorker();
  }
};
</script>

<style lang="css" scoped>
.body {
  width: 100%;
  height: 100%;
  position: relative;
}
.map_body {
  float: left;
  width: 80%;
  height: 100%;
  margin-left: 9%;
}

.map_div {
  margin: 0 auto;
}
.map {
  position: absolute;
}
</style>