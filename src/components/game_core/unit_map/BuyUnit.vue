<template>
  <div>
    <!--招募军队弹框-->
    <el-dialog title="招募" :visible.sync="buyUnitShow" width="40%">
      <div class="content" v-if="buyUnitShow && buyUnitsInfo">
        <!--信息头-->
        <div class="title">
          <!--名称-->
          <b>{{ buyUnitsInfo[selectIndex].unit_mes.name }}</b>
          <!--价格-->
          <div>
            <img src="../../../assets/images/assist/action_buy.png" />
            <span>{{ buyUnitsInfo[selectIndex].unit_mes.price }}</span>
          </div>
          <!--攻击范围-->
          <div>
            <img src="../../../assets/images/assist/show_attach_area.png" />
            <span
              >{{ buyUnitsInfo[selectIndex].unit_mes.min_attach_range }} -
              {{ buyUnitsInfo[selectIndex].unit_mes.max_attach_range }}</span
            >
          </div>
          <!--所占人口-->
          <div>
            <img src="../../../assets/images/assist/pop_show.png" />
            <span>{{ buyUnitsInfo[selectIndex].unit_mes.population }}</span>
          </div>
        </div>
        <!--属性信息-->
        <div class="unit_info">
          <!--攻击信息-->
          <div>
            <img src="../../../assets/images/assist/info_attach.png" />
            <span
              >{{ buyUnitsInfo[selectIndex].level_mes.min_attack }} -
              {{ buyUnitsInfo[selectIndex].level_mes.max_attack }}</span
            >
          </div>
          <div>
            <img
              src="../../../assets/images/assist/info_physical_defense.png"
            />
            <span>{{
              buyUnitsInfo[selectIndex].level_mes.physical_defense
            }}</span>
          </div>
          <div>
            <img src="../../../assets/images/assist/info_magic_defense.png" />
            <span>{{ buyUnitsInfo[selectIndex].level_mes.magic_defense }}</span>
          </div>
          <div>
            <img src="../../../assets/images/assist/info_move.png" />
            <span>{{ buyUnitsInfo[selectIndex].level_mes.speed }}</span>
          </div>
        </div>
        <!--介绍信息-->
        <div class="unit_intr">
          <div>{{ buyUnitsInfo[selectIndex].unit_mes.description }}</div>
          <!--能力类表-->
          <div class="unit_ability">
            <b class="unit_ability_tit">能力:</b>
            <div v-for="abilitie in buyUnitsInfo[selectIndex].abilities">
              {{ abilitie.name }}
            </div>
          </div>
        </div>

        <!--图片信息-->
        <div class="img">
          <div
            class="unit_show"
            v-for="(unitInfo, index) in buyUnitsInfo"
            @click="selectIndex = index"
          >
            <img
              class="unit_img"
              :src="$appHelper.getUnitImg(unitInfo.unit_mes.id, color)"
            />
            <img
              src="../../../assets/images/assist/show_unit.png"
              v-if="index != selectIndex"
            />
            <img src="../../../assets/images/assist/select_unit.png" v-else />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="buyUnit">购 买</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import eventype from "../../../manger/eventType";
import { GetUnitInfoList } from "../../../api";
export default {
  data() {
    return {
      selectIndex: 0,
      buyUnitsInfo: null,
    };
  },
  methods: {
    buyUnit() {
      let game = this.$store.getters.game;
      let currArmy = game.army_list[game.curr_army_index];
      const unitInfo = this.buyUnitsInfo[this.selectIndex];
      // 验证军队资金
      console.log("现有金币" + currArmy.money);
      console.log("需要金币" + unitInfo.unit_mes.price);
      if (currArmy.money < unitInfo.unit_mes.price) {
        this.$message.error("资金不足");
        return;
      }
      // 验证军队人口
      console.log(currArmy.pop + unitInfo.unit_mes.population);
      console.log(this.$store.getters.game.max_pop);
      if (
        currArmy.pop + unitInfo.unit_mes.population >
        this.$store.getters.game.max_pop
      ) {
        this.$message.error("人口达到上限");
        return;
      }

      // 准备购买
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(
          eventype.CLICK_BUY_ACTION,
          null,
          null,
          null,
          unitInfo.unit_mes.id
        );
        this.$emit("dialogClose");
        this.$store.commit("setAction", []);
      }
      this.close();
    },
    close() {
      this.$store.commit("setBuyUnitDialog", false);
    },
  },
  computed: {
    buyUnitShow: {
      get: function () {
        return this.$store.getters.buyUnitDialog;
      },
      set: function (value) {
        this.$store.commit("setBuyUnitDialog", value);
      },
    },
    color() {
      return this.$store.getters.game.curr_color;
    },
  },
  created() {
    let args = {};
    args.uuid = this.$store.getters.game.uuid;
    GetUnitInfoList(args).then((resp) => {
      if (resp.res_code == 0) {
        this.buyUnitsInfo = resp.res_val;
      }
    });
    window.buyUnitVue = this;
  },
};
</script>

<style lang="css" scoped>
.content {
  float: left;
}
.title {
  float: left;
  width: 100%;
  padding-bottom: 10px;
  text-align: center;
  border-bottom: 1px rgb(202, 202, 202) solid;
}
.title b {
  float: left;
  width: 60px;
  margin-left: 10px;
  margin-right: 13px;
}
.title img {
  float: left;
  margin-left: 10px;
}
.title div {
  float: left;
}
.title span {
  font-size: 12px;
  float: left;
  margin: 0 auto;
  margin-left: 10px;
  background-color: rgb(214, 214, 214);
  padding-top: 5px;
  display: block;
  width: 43px;
}
.unit_info {
  float: left;
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px rgb(190, 190, 190) solid;
  text-align: center;
}
.unit_info div {
  float: left;
}
.unit_info img {
  float: left;
  margin-left: 10px;
}
.unit_info span {
  font-size: 12px;
  float: left;
  margin: 0 auto;
  margin-left: 10px;
  background-color: rgb(223, 223, 223);
  padding-top: 5px;
  display: block;
  width: 43px;
}
.unit_intr {
  margin-left: 20px;
  float: left;
  font-size: 12px;
  height: 100px;
}
.img {
  float: left;
}
.unit_show {
  float: left;
  margin-left: 10px;
  position: relative;
  cursor: pointer;
}
.unit_img {
  position: absolute;
  top: 4px;
  left: 4px;
}
.unit_ability {
  font-size: 12px;
  margin-top: 10px;
  color: rgb(41, 41, 41);
}
.unit_ability b {
  display: block;
}
.unit_ability div {
  float: left;
  margin-right: 10px;
}
.unit_ability div:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>