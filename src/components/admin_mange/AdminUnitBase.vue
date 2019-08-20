<template>
  <div class="body">
    <div class="add_button">
      <el-button type="primary" @click="addUnit">新增</el-button>
    </div>
    <el-table style="width: 100%" :data="unitMess">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <span>描述: {{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="id"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="UnitImg(scope.row.type)" />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type"  width="130px"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>

      <el-table-column label="攻击类型">
        <template slot-scope="scope">{{GetAttachType(scope.row.attack_type)}}</template>
      </el-table-column>
      <el-table-column label="攻击范围">
        <template slot-scope="scope">{{scope.row.min_attach_range}}-{{scope.row.max_attach_range}}</template>
      </el-table-column>
      <el-table-column label="人口" prop="population"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>

      <!--编辑删除-->
      <el-table-column align="right" width="200px">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :current-page="page.pageNow"
        :page-size="page.pageSize"
        layout="prev, pager, next"
        :total="pageCount"
        @current-change="currentChange"
      ></el-pagination>
    </div>
    <el-dialog
      :title="diaTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="input_mes">
        <el-form ref="form" :model="unit" label-width="68px" size="small">
          <el-form-item label="类型">
            <el-input v-model="unit.type"></el-input>
          </el-form-item>
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
          <el-form-item label="描述">
            <el-input type="textarea" v-model="unit.description"></el-input>
          </el-form-item>
        </el-form>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetUnitData, SaveUnit } from "@/api";
export default {
  data() {
    return {
      search: null,
      page: {
        pageNow: 1,
        pageSize: 5
      },
      unit: {},
      dialogVisible: false,
      diaTitle: "新增单位",
      pageCount: 1,
      unitMess: []
    };
  },
  methods: {
    async save() {
      const resp = await SaveUnit(this.unit);
      if (resp.res_code == 0) {
        this.dialogVisible = false;
        this.init();
      } else {
        this.$message.error(resp.res_mes);
      }
    },
    currentChange(pageNow) {
      this.page.pageNow = pageNow;
      this.init();
    },
    handleEdit(index, unit) {
      this.diaTitle= "编辑单位";
      this.dialogVisible = true;
      this.unit = unit;
    },
    handleDelete(index, unit) {
      console.log("删除" + unit);
    },
    async init() {
      const resp = await GetUnitData(this.page);
      if (resp.res_code == 0) {
        this.pageCount = resp.res_val.pageCount;
        this.unitMess = resp.res_val.data;
      } else {
        this.$message.error(resp.res_mes);
      }
    },
    addUnit() {
      this.unit = {};
      this.diaTitle= "新增单位";
      this.dialogVisible = true;
    }
  },
  computed: {
    UnitImg() {
      return function(type) {
        return require("@/assets/images/unit/blue/" + type + ".png");
      };
    },
    GetAttachType() {
      return function(type) {
        if (type == "1") {
          return "物理攻击";
        } else if (type == "2") {
          return "魔法攻击";
        } else {
          return "-";
        }
      };
    }
  },
  created() {
    // 初始化
    this.init();
  }
};
</script>

<style lang="css" scoped>
.body {
  float: left;
}
</style>