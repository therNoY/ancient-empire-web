<template>
  <div>
    <!--招募军队弹框-->
    <el-dialog
      title="招募"
      :visible.sync="buyUnitDialog"
      :before-close="closeBuyUnitDialog"
      width="40%"
    >
      <div class="content" v-if="buyUnitDialog">
        <!--信息头-->
        <div class="title">
          <!--名称-->
          <b>{{buyUnitsInfo[selectIndex].unit.name}}</b>
          <!--价格-->
          <div>
            <img src="../../../assets/images/assist/action_buy.png" />
            <span>{{buyUnitsInfo[selectIndex].unit.price}}</span>
          </div>
          <!--攻击范围-->
          <div>
            <img src="../../../assets/images/assist/show_attach_area.png" />
            <span>{{buyUnitsInfo[selectIndex].unit.min_attach_range}} - {{buyUnitsInfo[selectIndex].unit.max_attach_range}}</span>
          </div>
          <!--所占人口-->
          <div>
            <img src="../../../assets/images/assist/pop_show.png" />
            <span>{{buyUnitsInfo[selectIndex].unit.population}}</span>
          </div>
        </div>
        <!--属性信息-->
        <div class="unit_info">
          <!--攻击信息-->
          <div>
            <img src="../../../assets/images/assist/info_attach.png" />
            <span>{{buyUnitsInfo[selectIndex].level.min_attack}} - {{buyUnitsInfo[selectIndex].level.max_attack}}</span>
          </div>
          <div>
            <img src="../../../assets/images/assist/info_physical_defense.png" />
            <span>{{buyUnitsInfo[selectIndex].level.physical_defense}}</span>
          </div>
          <div>
            <img src="../../../assets/images/assist/info_magic_defense.png" />
            <span>{{buyUnitsInfo[selectIndex].level.magic_defense}}</span>
          </div>
          <div>
            <img src="../../../assets/images/assist/info_move.png" />
            <span>{{buyUnitsInfo[selectIndex].level.speed}}</span>
          </div>
        </div>
        <!--介绍信息-->
        <div class="unit_intr">
          <div>{{buyUnitsInfo[selectIndex].unit.description}}</div>
          <!--能力类表-->
          <div class="unit_ability">
            <b class="unit_ability_tit">能力:</b>
            <div v-for="abilitie in buyUnitsInfo[selectIndex].abilities">{{abilitie.name}}</div>
          </div>
        </div>

        <!--图片信息-->
        <div class="img">
          <div
            class="unit_show"
            v-for="(unitInfo,index) in buyUnitsInfo"
            @click="changeBuyUnit(index)"
          >
            <img class="unit_img" :src="$appHelper.getUnitImg(unitInfo.unit.type, $store.getters.record.curr_color)" />
            <img src="../../../assets/images/assist/show_unit.png" v-if="index != selectIndex" />
            <img src="../../../assets/images/assist/select_unit.png" v-else />
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeBuyUnitDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="buyUnit">购 买</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["buyUnitDialog", "buyUnitsInfo"],
  data() {
    return {
      selectIndex: 0
    };
  },
  methods: {
    // 关闭购买军队框
    closeBuyUnitDialog() {
      this.$store.commit("changeLordBuy", true);
      this.$store.commit("changeBuyUnitDialog", false);
    },
    // 改变当前要购买的单位
    changeBuyUnit(index) {
      this.selectIndex = index;
    },
    buyUnit() {
      let currArmy;
      for (
        let index = 0;
        index < this.$store.getters.record.army_list.length;
        index++
      ) {
        const army = this.$store.getters.record.army_list[index];
        if (army.color == this.$store.getters.record.curr_color) {
          currArmy = army;
          break;
        }
      }

      const unitInfo = this.buyUnitsInfo[this.selectIndex];
      // 验证军队资金
      console.log("现有金币" + currArmy.money);
      console.log("需要金币" + unitInfo.unit.price);
      if (currArmy.money < unitInfo.unit.price) {
        this.$message.error("资金不足");
        return;
      }
      // 验证军队人口
      console.log((currArmy.pop + unitInfo.unit.population));
      console.log(this.$store.getters.record.max_pop);
      if (
        currArmy.pop + unitInfo.unit.population >
        this.$store.getters.record.max_pop
      ) {
        this.$message.error("人口达到上限");
        return;
      }

      // 准备购买
      this.$store.dispatch("byUnit", unitInfo.unit.type);
    }
  }
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
  border-bottom: 1px rgb(133, 133, 133) solid;
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
  background-color: rgb(155, 155, 155);
  padding-top: 5px;
  display: block;
  width: 43px;
}
.unit_info {
  float: left;
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px rgb(133, 133, 133) solid;
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
  background-color: rgb(155, 155, 155);
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