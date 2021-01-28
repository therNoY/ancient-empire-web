<template>
  <div class="body">
    <el-table style="width: 100%" :data="unitMess">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <span>描述: {{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="id"></el-table-column>
      <el-table-column label="图片" width="120%">
        <template slot-scope="scope">
          <img :src="UnitImg(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>

      <el-table-column label="攻击类型" width="110%">
        <template slot-scope="scope">{{
          GetAttachType(scope.row.attack_type)
        }}</template>
      </el-table-column>
      <el-table-column label="攻击范围" width="120%">
        <template slot-scope="scope"
          >{{ scope.row.min_attach_range }}-{{
            scope.row.max_attach_range
          }}</template
        >
      </el-table-column>
      <el-table-column label="人口" prop="population"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="是否可以购买" prop="name" width="120%">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.tradeable == '1'" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="晋升单位" prop="name">
        <template slot-scope="scope">
          <img v-if="scope.row.promotion" :src="UnitImg(scope.row.promotion)" />
          <div v-else>-</div>
        </template>
      </el-table-column>
      <!--编辑删除-->
      <el-table-column align="right" width="200%">
        <template slot="header" slot-scope="scope">
          <div class="serchInput">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </div>
          <!-- <div class="addButton">
            <el-button
            type="primary"
            style="float: left"
            @click="addUnit"
            size="mini"
            >新增</el-button
          >
          </div> -->
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >禁用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :current-page="page.page_start"
        :page-size="page.page_size"
        layout="prev, pager, next"
        :total="pageCount"
        @current-change="currentChange"
      ></el-pagination>
    </div>
    <el-dialog
      :title="diaTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="baseInfo">
          <div class="input_mes">
            <el-form ref="form" :model="unit" label-width="17%" size="mini">
              <el-form-item label="名称">
                <el-input v-model="unit.name"></el-input>
              </el-form-item>
              <el-form-item label="攻击类型">
                <el-select v-model="unit.attack_type" placeholder="攻击类型">
                  <el-option label="物理攻击" value="1"></el-option>
                  <el-option label="魔法攻击" value="2"></el-option>
                </el-select>
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
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
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
          <transfer
            v-model="currUnitInfo.abilityInfo"
            showKey="name"
            valueKey="id"
            showTipKey="description"
            :dataList="allAbilityList"
          />
        </el-tab-pane>
        <el-tab-pane label="等级面板" name="levelInfo">
          <el-table :data="currUnitInfo.levelInfoData" style="levelInfoStyle">
            <el-table-column label="等级" prop="level"> </el-table-column>
            <el-table-column label="最小攻击" prop="min_attack"> </el-table-column>
            <el-table-column label="最大攻击" prop="max_attack"> </el-table-column>
            <el-table-column label="物理防御" prop="physical_defense"> </el-table-column>
            <el-table-column label="魔法防御" prop="magic_defense"> </el-table-column>
            <el-table-column label="最大生命" prop="max_life"> </el-table-column>
            <el-table-column label="移动力" prop="speed"> </el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-button size="mini" type="primary" @click="addNewLevel">增加</el-button>
              </template>
              <template slot-scope="scope">
                <el-button size="mini" @click="editUnitLevelInfo(scope.$index)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="动画管理" name="fourth">
          暂未开通
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="save" size="mini">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改等级信息" width="40%" append-to-body :visible.sync="editUnitLevelInfoDialog">
      <el-form ref="levelInfoForm" v-if="currentLevelInfo" label-width="18%" :model="currentLevelInfo" size="mini">
        <el-form-item label="等级" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.level" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="最小攻击" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.min_attack"></el-input>
        </el-form-item>
        <el-form-item label="最大攻击" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.max_attack"></el-input>
        </el-form-item>
        <el-form-item label="物理防御" :rules="inputNumRule">
          <el-input v-model.number="currentLevelInfo.physical_defense"></el-input>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveLevelInfo" size="mini">确 定</el-button>
      </span>
    </el-dialog>
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
import Transfer from "../frame/Transfer.vue";
export default {
  components: { UnitRadio, Transfer },
  data() {
    return {
      search: null,
      page: {
        page_start: 1,
        page_size: 8,
      },
      unit: {},
      dialogVisible: false,
      editUnitLevelInfoDialog: false,
      editUnitLevelInfoLoading: true,
      diaTitle: "新增单位",
      pageCount: 1,
      unitMess: [],
      addLevel:false,
      activeName: "baseInfo",
      allUnitList: [],
      allAbilityList: [],
      currUnitInfo: {
        baseInfo: {},
        abilityInfo: [],
        levelInfoData: [],
      },
      inputNumRule:[
        { required: true, message: '不能为空'},
        { type: 'number', message: '必须是数字'}
      ],
      currentLevelInfo: null,
    };
  },
  methods: {
    save() {
      this.editUnitLevelInfoLoading = this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      let args = {};
      args.base_info = this.unit;
      args.ability_info = this.currUnitInfo.abilityInfo;
      args.level_info_data = this.currUnitInfo.levelInfoData;
      SaveUnitInfo(args).then(resp=>{
        if (resp.res_code == 0) {
          this.dialogVisible = false;
          this.$message.success("保存成功")
          this.editUnitLevelInfoLoading.close();
        } else {
          this.editUnitLevelInfoLoading.close();
          this.$message.error(resp.res_mes);
        }
      }).catch(function (error) {
          this.editUnitLevelInfoLoading.close();
        })
    },
    currentChange(page_start) {
      this.page.page_start = page_start;
      this.init();
    },
    handleEdit(index, unit) {
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
    handleDelete(index, unit) {
      console.log("删除" + unit);
    },
    editUnitLevelInfo(index) {
      this.addLevel = false;
      this.editUnitLevelInfoDialog = true;
      this.currentLevelInfo = this.currUnitInfo.levelInfoData[index];
    },
    addNewLevel(){
      this.addLevel = true;
      this.editUnitLevelInfoDialog = true;
      this.currentLevelInfo = {};
      this.currentLevelInfo.level = this.currUnitInfo.levelInfoData.length;
    },
    saveLevelInfo(){
      this.editUnitLevelInfoDialog = false;
      if (this.addLevel) {
        this.currUnitInfo.levelInfoData.push(Object.assign(this.currentLevelInfo));
      }
    },
    init() {
      GetUnitMesList(this.page).then((resp) => {
        if (resp.res_code == 0) {
          this.pageCount = resp.res_val.pageCount;
          this.unitMess = resp.res_val.data;
        } else {
          this.$message.error(resp.res_mes);
        }
      });
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
    this.init();
    window.UnitMesMangerVue = this;
  },
};
</script>

<style lang="css" scoped>
.body {
  float: left;
}
/* .serchInput {
  width: 200px;
  float: left;
} */
.addButton {
  float: left;
}
.levelInfoStyle th{
  padding: 8px, 0 !important;
}
</style>