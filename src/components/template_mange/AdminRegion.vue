<template>
  <div class="body">
    <div class="add_button">
      <el-button type="primary" @click="addRegion">新增</el-button>
    </div>
    <el-table style="width: 100%" :data="regionMes">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <span>描述: {{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="id"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="RegionImg(scope.row.type)" />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>

      <el-table-column label="增加防御" prop="buff" >  </el-table-column>
      <el-table-column label="消耗移动力" prop="deplete" >  </el-table-column>
      <el-table-column label="回合恢复" prop="restore"></el-table-column>
      <el-table-column label="回合收入" prop="tax"></el-table-column>

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
        <el-form ref="form" :model="region" label-width="68px" size="small">
          <el-form-item label="类型">
            <el-input v-model="region.type"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="region.name"></el-input>
          </el-form-item>
          <el-form-item label="增加防御">
            <el-input v-model="region.buff"></el-input>
          </el-form-item>
          <el-form-item label="消耗移动力">
            <el-input v-model="region.deplete"></el-input>
          </el-form-item>
          <el-form-item label="回合恢复">
            <el-input v-model="region.restore"></el-input>
          </el-form-item>
          <el-form-item label="回合收入">
            <el-input v-model="region.tax"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="region.description"></el-input>
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
import { GetRegionData, SaveRegion } from "@/api";
export default {
  data() {
    return {
      search: null,
      page: {
        pageNow: 1,
        pageSize: 5
      },
      region: {},
      dialogVisible: false,
      diaTitle: "新增单位",
      pageCount: 1,
      regionMes: []
    };
  },
  methods: {
    async save() {
      const resp = await SaveRegion(this.region);
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
    handleEdit(index, region) {
      this.diaTitle= "编辑单位";
      this.dialogVisible = true;
      this.region = region;
    },
    handleDelete(index, region) {
      console.log("删除" + region);
    },
    async init() {
      const resp = await GetRegionData(this.page);
      if (resp.res_code == 0) {
        this.pageCount = resp.res_val.pageCount;
        this.regionMes = resp.res_val.data;
      } else {
        this.$message.error(resp.res_mes);
      }
    },
    addRegion() {
      this.region = {};
      this.diaTitle= "新增单位";
      this.dialogVisible = true;
    }
  },
  computed: {
    RegionImg() {
      return function(type) {
        return require("@/assets/images/Region/" + type + ".png");
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