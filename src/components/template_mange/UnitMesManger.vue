<template>
  <div class="body">
    <ae-complex-dialog
      ref="mainDiaglog"
      v-model="showModel"
      showSearch
      title="单位管理"
      :footerButtons="footButtonList"
      :initQueryDataGrid="queryDataFunction"
      :showItem="showItem"
      :showTitle="showTitle"A
      :width="70"
      page
    >
    </ae-complex-dialog>

    <ae-base-dialog
      :title="diaTitle"
      v-model="dialogVisible"
      fixedDialog
      :top="3"
      :width="48"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="baseInfo">
          <div class="input_mes">
            <el-form ref="form" :model="unit" label-width="17%" size="mini">
              <el-form-item label="名称">
                <el-input v-model="unit.name"></el-input>
              </el-form-item>
              <el-form-item label="攻击类型">
                <el-radio-group v-model="unit.attack_type">
                  <ae-radio-button label="1">物理攻击</ae-radio-button>
                  <ae-radio-button label="2">魔法攻击</ae-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="攻击范围">
                <el-col :span="11">
                  <el-input v-model="unit.min_attach_range"></el-input>
                </el-col>
                <el-col class="line" :span="2">&nbsp; -</el-col>
                <el-col :span="11">
                  <el-input v-model="unit.max_attach_range"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="人口">
                <el-input v-model="unit.population" />
              </el-form-item>
              <el-form-item label="价格">
                <el-input v-model="unit.price" />
              </el-form-item>
              <el-form-item label="是否可以购买">
                <el-radio-group v-model="unit.tradeable">
                  <ae-radio-button label="1">是</ae-radio-button>
                  <ae-radio-button label="0">否</ae-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="晋升单位">
                <unit-radio
                  v-model="unit.promotion"
                  :unitList="allUnitList"
                ></unit-radio>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="unit.description"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="绑定能力" name="unitAbility">
          <ae-transfer
            v-model="currUnitInfo.abilityInfo"
            showKey="name"
            valueKey="id"
            showTipKey="description"
            :dataList="allAbilityList"
          />
        </el-tab-pane>
        <el-tab-pane label="等级面板" name="levelInfo">
          <el-table
            :data="currUnitInfo.levelInfoData"
            style="levelInfoStyle"
            :cell-style="tableCellStyle"
            :header-cell-style="tableHeaderColor"
          >
            <el-table-column label="等级" prop="level"> </el-table-column>
            <el-table-column label="最小攻击" prop="min_attack">
            </el-table-column>
            <el-table-column label="最大攻击" prop="max_attack">
            </el-table-column>
            <el-table-column label="物理防御" prop="physical_defense">
            </el-table-column>
            <el-table-column label="魔法防御" prop="magic_defense">
            </el-table-column>
            <el-table-column label="最大生命" prop="max_life">
            </el-table-column>
            <el-table-column label="移动力" prop="speed"> </el-table-column>
            <el-table-column align="right">
              <template slot="header">
                <el-button size="mini" type="primary" @click="addNewLevel"
                  >增加</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button size="mini" @click="editUnitLevelInfo(scope.$index)"
                  >修改</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="动画管理" name="fourth"> 暂未开通 </el-tab-pane> -->
      </el-tabs>

      <ae-button @onClick="dialogVisible = false">取 消</ae-button>
      <ae-button @onClick="save">保 存</ae-button>
    </ae-base-dialog>

    <ae-base-dialog
      title="修改等级信息"
      :width="40"
      v-model="editUnitLevelInfoDialog"
    >
      <el-form
        ref="levelInfoForm"
        v-if="currentLevelInfo"
        label-width="18%"
        :model="currentLevelInfo"
        size="mini"
      >
        <el-form-item label="等级" :rules="inputNumRule">
          <el-input
            v-model.number="currentLevelInfo.level"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="最小攻击" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.min_attack"></el-input>
        </el-form-item>
        <el-form-item label="最大攻击" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.max_attack"></el-input>
        </el-form-item>
        <el-form-item label="物理防御" :rules="inputNumRule">
          <el-input
            v-model.number="currentLevelInfo.physical_defense"
          ></el-input>
        </el-form-item>
        <el-form-item label="魔法防御" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.magic_defense"></el-input>
        </el-form-item>
        <el-form-item label="最大生命" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.max_life"></el-input>
        </el-form-item>
        <el-form-item label="移动力" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.speed"></el-input>
        </el-form-item>
      </el-form>
      <ae-button @onClick="saveLevelInfo">确 定</ae-button>
    </ae-base-dialog>
  </div>
</template>

<script>
import {
  GetUnitMesList,
  SaveUnitInfo,
  GetAllUserUnitMes,
  GetUnitAbilityInfo,
  GetAllAbilityInfo,
  GetUnitLevelInfoById,
} from "@/api";
import UnitRadio from "../map_base/UnitRadio.vue";
import AeTransfer from "../frame/AeTransfer.vue";
import dialogShow from "../../mixins/frame/dialogShow.js";
import AeBaseDialog from "../frame/AeBaseDialog.vue";
import blackStyle from "../../mixins/style/blackStyle";
import AeComplexDialog from "../frame/AeComplexDialog.vue";
import AeButtonList from "../frame/AeButtonList.vue";
export default {
  mixins: [dialogShow, blackStyle],
  components: {
    UnitRadio,
    AeTransfer,
    AeBaseDialog,
    AeComplexDialog,
    AeButtonList,
  },
  data() {
    return {
      unit: {},
      dialogVisible: false,
      editUnitLevelInfoDialog: false,
      diaTitle: "新增单位",
      addLevel: false,
      activeName: "baseInfo",
      allUnitList: [],
      allAbilityList: [],
      currUnitInfo: {
        baseInfo: {},
        abilityInfo: [],
        levelInfoData: [],
      },
      footButtonList: [
        { name: "编辑", action: this.handleEdit },
        { name: "删除", action: this.handleDelete },
      ],
      inputNumRule: [
        { required: true, message: "不能为空" },
        { type: "number", message: "必须是数字" },
      ],
      currentLevelInfo: null,
      queryDataFunction: null,
      showTitle: [
        "单位",
        "名称",
        "攻击类型",
        "攻击范围",
        "所占人口",
        "价格",
        "可以购买",
        "晋升",
      ],
      showItem: [
        (h, p) => {
          return h("img", { attrs: { src: this.$appHelper.getUnitImg(p.id) } });
        },
        "name",
        (h, p) => {
          if (p.attack_type == "1") {
            return h("div", {}, "物理攻击");
          } else if (p.attack_type == "2") {
            return h("div", {}, "魔法攻击");
          }
        },
        (h, p) => {
          return h("div", {}, p.min_attach_range + "-" + p.max_attach_range);
        },
        "population",
        "price",
        (h, p) => {
          if (p.tradeable) {
            return h("div", {}, "是");
          } else {
            return h("div", {}, "否");
          }
        },
        (h, p) => {
          if (p.promotion) {
            return h("img", {
              attrs: { src: this.$appHelper.getUnitImg(p.promotion) },
            });
          } else {
            return h("div", {}, "-");
          }
        },
      ],
    };
  },
  methods: {
    save() {
      this.$appHelper.setLoading();
      let args = {};
      args.base_info = this.unit;
      args.ability_info = this.currUnitInfo.abilityInfo;
      args.level_info_data = this.currUnitInfo.levelInfoData;
      SaveUnitInfo(args)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.dialogVisible = false;
            this.$message.info("保存成功");
          } else {
            this.$message.error(resp.res_mes);
          }
          this.$appHelper.setLoading();
        })
        .catch(function (error) {
          console.log(error);
          this.$appHelper.setLoading();
        });
    },
    onDialogCreate() {
      this.init();
    },
    handleEdit() {
      let unit = this.$refs.mainDiaglog.getDataGridSelect();
      this.diaTitle = "编辑单位";
      this.dialogVisible = true;
      this.unit = unit;
      GetUnitAbilityInfo(unit.id).then((resp) => {
        if (resp.res_code == 0) {
          this.currUnitInfo.abilityInfo = resp.res_val;
        }
      });
      GetUnitLevelInfoById(unit.id).then((resp) => {
        if (resp.res_code == 0) {
          this.currUnitInfo.levelInfoData = resp.res_val;
        }
      });
    },
    handleDelete() {
      let unit = this.$refs.mainDiaglog.getDataGridSelect();
      console.log("删除" + unit);
    },
    editUnitLevelInfo(index) {
      this.addLevel = false;
      this.editUnitLevelInfoDialog = true;
      this.currentLevelInfo = this.currUnitInfo.levelInfoData[index];
    },
    addNewLevel() {
      this.addLevel = true;
      this.editUnitLevelInfoDialog = true;
      this.currentLevelInfo = {};
      this.currentLevelInfo.level = this.currUnitInfo.levelInfoData.length;
    },
    saveLevelInfo() {
      this.editUnitLevelInfoDialog = false;
      if (this.addLevel) {
        this.currUnitInfo.levelInfoData.push(
          Object.assign(this.currentLevelInfo)
        );
      }
    },
    init() {
      GetAllUserUnitMes().then((resp) => {
        if (resp.res_code == 0) {
          this.allUnitList = resp.res_val;
        }
      });
      GetAllAbilityInfo().then((resp) => {
        if (resp.res_code == 0) {
          this.allAbilityList = resp.res_val;
        }
      });
    },
    addUnit() {
      this.unit = {};
      this.diaTitle = "新增单位";
      this.dialogVisible = true;
    },
  },
  computed: {
    UnitImg() {
      return function (id) {
        return this.$appHelper.getUnitImg(id);
      };
    },
    GetAttachType() {
      return function (type) {
        if (type == "1") {
          return "物理攻击";
        } else if (type == "2") {
          return "魔法攻击";
        } else {
          return "-";
        }
      };
    },
  },
  created() {
    // 初始化
    this.queryDataFunction = GetUnitMesList;
    window.UnitMesMangerVue = this;
  },
};
</script>

<style lang="css" scoped>
.unitMesMangerMainTableStyle {
  max-height: 500px;
  width: 100%;
}
.serchInput {
  width: 200px;
  float: left;
}
.addButton {
  float: left;
}
.input_mes {
  background-color: #5a5c59;
  padding: 1%;
}
.el-form-item__content {
  float: left;
}
.levelInfoStyle th {
  padding: 8px, 0 !important;
}
</style>
