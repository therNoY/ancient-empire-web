<template>
  <div>
    <el-table
      :data="unitLevels"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="UnitImg(scope.row.type)" />
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级"></el-table-column>
      <el-table-column prop="min_attack" label="最小攻击"></el-table-column>
      <el-table-column prop="max_attack" label="最大攻击"></el-table-column>
      <el-table-column prop="physical_defense" label="物理防御"></el-table-column>
      <el-table-column prop="magic_defense" label="魔法防御"></el-table-column>
      <el-table-column prop="speed" label="移动力"></el-table-column>
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
            <el-input v-model="unit.type" :disabled="true" />
          </el-form-item>

          <el-form-item label="等级">
            <el-input v-model="unit.level" :disabled="true" />
          </el-form-item>
          <el-form-item label="攻击">
            <el-col :span="11">
              <el-input v-model="unit.min_attack" placeholder="最小攻击"></el-input>
            </el-col>
            <el-col class="line" :span="2">&nbsp; -</el-col>
            <el-col :span="11">
              <el-input v-model="unit.max_attack" placeholder="最大攻击"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="物理防御">
            <el-input v-model="unit.physical_defense" />
          </el-form-item>
          <el-form-item label="魔法防御">
            <el-input v-model="unit.magic_defense" />
          </el-form-item>
          <el-form-item label="移动范围">
            <el-input v-model="unit.speed"></el-input>
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
import { GetUnitLevel,SaveUnitLevel } from "@/api";
export default {
  data() {
    return {
      diaTitle: "修改数据",
      dialogVisible: false,
      search: null,
      page: {
        pageNow: 1,
        pageSize: 8
      },
      unit: {},
      pageCount: 40,
      unitLevels: []
    };
  },
  methods: {
    // 获取数据
    async init() {
      const resp = await GetUnitLevel(this.page);
      if (resp.res_code == 0) {
        this.unitLevels = resp.res_val.data;
        this.pageCount = resp.res_val.pageCount;
      } else {
        this.$message.error(resp.res_mes);
      }
    },
    handleEdit(index, unit) {
      this.diaTitle = "修改数据";
      this.dialogVisible = true;
      this.unit = unit;
    },
    currentChange(pageNow) {
      this.page.pageNow = pageNow;
      this.init();
    },
    async save() {
      const resp = await SaveUnitLevel(this.unit);
      if (resp.res_code == 0) {
        this.$message.success("修改成功");
      } else {
        this.$message.error(resp.res_mes);
      }
      this.dialogVisible = false;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    
  },
  computed: {
    UnitImg() {
      return function(type) {
        return require("@/assets/images/unit/blue/" + type + ".png");
      };
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="css" scoped>
</style>