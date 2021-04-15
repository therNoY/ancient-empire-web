<!--
  模板管理 管理我的模板 可以修改 查看我引用的模板 查找可以引用的模板
-->
<template>
  <div id="user_template">
    <div class="buttonList">
      <el-button
        v-show="model == 'myTemp'"
        style="margin-left: 1%"
        @click="addNewTemp"
        type="primary"
        size="mini"
        >新建模板</el-button
      >
      <el-button
        style="margin-left: 1%"
        type="primary"
        @click="init()"
        size="mini"
        >刷新</el-button
      >
    </div>

    <div class="template_table">
      <div
        v-for="(temp,index) in templateList"
        v-bind:key="index"
        class="template"
        @click="showTempDetail(temp)"
      >
        <div style="height: 10%">
          {{ temp.template_name }}
        </div>
        <div style="height: 20%">{{ temp.template_desc }}</div>
        <div style="height: 35%">
          <preview-unit-list
            v-if="temp.bind_uint_list && temp.bind_uint_list.length > 0"
            :unit_list="temp.bind_uint_list"
          ></preview-unit-list>
        </div>
        <div style="height: 10%"><span>下载次数:</span>{{ temp.link_num }}</div>
        <div style="height: 20%">
          <span>平均评价:</span>
          <el-rate
            :value="computedStart(temp.count_start, temp.link_num)"
            disabled
            show-score
            class="start"
            text-color="#ff9900"
          >
          </el-rate>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      :page-size="page.page_size"
      background
      :current-page="page.page_start"
      @current-change="pageInfoChange"
      layout="prev, pager, next"
      :total="page.page_count"
    >
    </el-pagination>
    <!-- 模板信息展示框 -->
    <el-dialog :title="currTemp.template_name" :visible.sync="showDetail">
      <div class="temp_show">
        <div class="temp_main">
          <el-form
            :disabled="model != 'myTemp'"
            ref="form"
            size="mini"
            :model="currTemp"
            label-width="15%"
          >
            <el-collapse v-model="activeNames" accordion>
              <el-collapse-item title="基础信息" name="1">
                <el-form-item label="模板名称">
                  <el-input
                    size="mini"
                    placeholder="输入模板名称"
                    v-model="currTemp.template_name"
                  ></el-input>
                </el-form-item>
                <el-form-item label="模板描述">
                  <el-input
                    size="mini"
                    placeholder="输入模板描述"
                    v-model="currTemp.template_desc"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否共享">
                  <el-radio-group v-model="currTemp.shared" size="mini">
                    <el-radio-button label="1">共享</el-radio-button>
                    <el-radio-button label="0">不共享</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="晋升信息" name="2">
                <el-form-item label="晋升模式">
                  <el-select size="mini" v-model="currTemp.promotion_mode">
                    <el-option label="不晋升" value="0"></el-option>
                    <el-option label="用户选择" value="1"></el-option>
                    <el-option label="随机晋升" value="2"></el-option>
                    <el-option
                      label="默认(首个达到晋升等级的晋升)"
                      value="3"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="currTemp.promotion_mode != '0'"
                  label="最大晋升数量"
                >
                  <el-input-number
                    size="mini"
                    v-model="currTemp.promotion_max_num"
                    :min="1"
                    :max="10"
                  ></el-input-number>
                </el-form-item>
                <el-form-item
                  v-if="currTemp.promotion_mode != '0'"
                  label="最小晋升等级"
                >
                  <el-input-number
                    size="mini"
                    v-model="currTemp.promotion_level"
                    :min="2"
                    :max="5"
                  ></el-input-number>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="攻击信息" name="3">
                <el-form-item label="攻击模式">
                  <el-radio-group v-model="currTemp.attach_model" size="mini">
                    <el-radio-button label="1">固定伤害</el-radio-button>
                    <el-radio-button label="2"
                      >固定伤害+随机伤害</el-radio-button
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="攻击经验">
                  <el-input-number
                    v-model="currTemp.attach_experience"
                    :min="10"
                    :max="50"
                    :step="5"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="反击经验">
                  <el-input-number
                    v-model="currTemp.counterattack_experience"
                    :min="0"
                    :max="50"
                    :step="5"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="击杀经验">
                  <el-input-number
                    v-model="currTemp.kill_experience"
                    :min="10"
                    :max="50"
                    :step="5"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="反击杀经验">
                  <el-input-number
                    v-model="currTemp.antikill_experience"
                    :min="0"
                    :max="50"
                    :step="5"
                  ></el-input-number>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="单位信息" name="4">
                <el-form-item label="单位最大等级">
                  <el-input-number
                    v-model="currTemp.unit_max_level"
                    :min="1"
                    :max="9"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="可选单位">
                  <unit-checkbox
                    v-if="showDetail"
                    ref="unitCheckbox"
                    :disabled="model != 'myTemp'"
                    :template_id="currTemp.id"
                    v-model="currTemp.bind_uint_list"
                  ></unit-checkbox>
                </el-form-item>
                <el-form-item label="召唤类型">
                  <el-tooltip
                    :content="derivativeTip"
                    placement="left"
                    effect="light"
                    v-if="showDetail"
                  >
                    <unit-radio
                      v-model="currTemp.derivative_id"
                      :unitList="currTemp.bind_uint_list"
                      :edit_able="model == 'myTemp'"
                      :template_id="currTemp.id"
                    ></unit-radio>
                  </el-tooltip>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="动画信息" name="5" v-if="showDetail">
                <el-form-item label="攻击动画">
                  <editable-animate
                    v-model="currTemp.attach_animation"
                    :singo="singo"
                    :template_id="currTemp.id"
                  ></editable-animate>
                </el-form-item>
                <el-form-item label="召唤动画">
                  <editable-animate
                    v-model="currTemp.summon_animation"
                    :singo="singo"
                    :template_id="currTemp.id"
                  ></editable-animate>
                </el-form-item>
                <el-form-item label="死亡动画">
                  <editable-animate
                    v-model="currTemp.dead_animation"
                    :singo="singo"
                    :template_id="currTemp.id"
                  ></editable-animate>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </div>

        <div class="temp_detail_footer">
          <el-button size="mini" @click="showDetail = false">取消</el-button>
          <el-button v-show="model == 'download'" size="mini" @click="$refs.startComment.showComment()"
            >下载</el-button
          >
          <el-button
            v-show="model == 'myTemp' || model == 'myDownload'"
            type="danger"
            size="mini"
            @click="removeTemp"
            >删除</el-button
          >
          <el-button
            size="mini"
            v-show="model == 'myTemp' && currTemp.status == '0'"
            @click="saveDraft"
            >保存草稿</el-button
          >
          <el-button
            v-show="model == 'myTemp'"
            type="primary"
            size="mini"
            v-if="canEdit"
            @click="saveTemplateInfo"
            >保存</el-button
          >
        </div>
      </div>
    </el-dialog>
    
    <start-Comment ref="startComment" v-model="downloadComment" @ok="doDownload" ></start-Comment>
  </div>
</template>

<script>
import {
  GetUserTemplate,
  SaveTemplateInfo,
  GetUserDraftTemplate,
  GetUserAttentionTemp,
  RemoveUserTemplate,
  GetDownloadAbleTemplate,
  DownloadTemplate,
  RemoveUserTemplateAttention,
} from "@/api";
import EditableAnimate from "../map_base/EditableAnimate.vue";
import UnitRadio from "../map_base/UnitRadio.vue";
import UnitCheckbox from "../map_base/UnitCheckbox.vue";
import PreviewUnitList from "../map_base/PreviewUnitList.vue";
import StartComment from '../frame/StartComment.vue';
export default {
  components: {
    EditableAnimate,
    UnitRadio,
    UnitCheckbox,
    PreviewUnitList,
    StartComment,
  },
  data() {
    return {
      page: {
        page_start: 1,
        page_size: 10,
        page_count: 0,
      },
      formEdit: true,
      showDetail: false,
      templateList: [],
      canEdit: true,
      currTemp: {},
      chooseAbleList: [],
      activeNames: ["1"],
      derivativeTip: "具有召唤能力的单位从坟墓中召唤出来的单位类型",
      singo: 0,
      // 查看模式 myTemp myDownload
      model: "",
      downloadComment:{
        start:5,
        comment:null,
      },
    };
  },
  methods: {
    saveDraft() {
      this.showDetail = false;
      if (this.currTemp.status == 0) {
        let args = this.currTemp;
        args.relation_unit_list = this.currTemp.bind_uint_list.map((u) => u.id);
        args.cancel_save = true;
        SaveTemplateInfo(args).then((resp) => {
          if (resp && resp.res_code == 0) {
            this.$message.success("保存草稿成功");
            this.showDetail = false;
          }
        });
      }
    },
    saveTemplateInfo() {
      let args = this.currTemp;
      args.relation_unit_list = this.currTemp.bind_uint_list.map((u) => u.id);
      SaveTemplateInfo(args).then((resp) => {
        if (resp && resp.res_code == 0) {
          this.$message.success("保存成功");
          this.showDetail = false;
        }
      });
    },
    showTempDetail(date) {
      this.currTemp = date;
      this.showDetail = true;
    },
    init() {
      this.model = this.$route.params.model;
      let args = Object.assign({}, this.page);
      if (this.model == "myTemp") {
        GetUserTemplate(args).then((resp) => {
          if (resp.res_code == 0) {
            this.page.page_count = resp.res_val.page_count;
            this.templateList = resp.res_val.data;
          }
        });
      } else if (this.model == "myDownload") {
        GetUserAttentionTemp(this.page).then((resp) => {
          if (resp.res_code == 0) {
            this.page.page_count = resp.res_val.page_count;
            this.templateList = resp.res_val.data;
          }
        });
      } else if (this.model == "download") {
        GetDownloadAbleTemplate(this.page).then((resp) => {
          if (resp.res_code == 0) {
            this.page.page_count = resp.res_val.page_count;
            this.templateList = resp.res_val.data;
          }
        });
      }
    },
    addNewTemp() {
      let parms = {};
      GetUserDraftTemplate(parms).then((resp) => {
        if (resp.res_code == 0) {
          this.currTemp = resp.res_val;
          this.showDetail = true;
        }
      });
    },
    removeTemp() {
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        let args = {};
        args.id = this.currTemp.id;
        if (this.model == "myTemp") {
          RemoveUserTemplate(args).then((resp) => {
            this.$message.success("移除成功");
            this.showDetail = false;
            this.init();
          });
        } else if (this.model == "myDownload") {
          RemoveUserTemplateAttention(args).then((resp) => {
            this.$message.success("移除成功");
            this.showDetail = false;
            this.init();
          });
        }
      });
    },
    doDownload(){
      let args = {};
      args.template_id = this.currTemp.id;
      args.template_start = this.downloadComment.start;
      args.template_comment = this.downloadComment.comment;
      DownloadTemplate(args).then((resp) => {
          if (resp.res_code == 0) {
            this.showDetail = false;
            this.$message.success("下载成功");
            this.init();
          }
        });
    },
    pageInfoChange() {},
  },
  computed: {
    computedStart() {
      return function(countStart, count){
        if (count == 0) {
          return 0;
        }
        let num = countStart/(count + 0.0);
        if (Number.isInteger(num)) {
          return num;
        }
        return num.toFixed(1);
      }
    }
  },
  created() {
    this.init();
    setInterval(() => {
      if (this.singo < 1000) {
        this.singo++;
      } else {
        this.singo = 0;
      }
    }, 500);
    window.MyTempVue = this;
  },
};
</script>

<style lang="scss" scoped>
#user_template {
  float: left;
  margin-top: 2%;
  margin-left: 1%;
  width: 99%;
  height: 90%;
  .buttonList {
    width: 100%;
  }
  .template_table {
    width: 100%;
    height: 80%;
    .template {
      float: left;
      width: 18%;
      margin: 1%;
      height: 45%;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      color: rgb(51, 51, 51);
      cursor: pointer;
      div {
        margin-left: 2%;
        margin-top: 2%;
        overflow: hidden;
        text-overflow: ellipsis;
        span {
          float: left;
          display: block;
          margin-right: 5%;
        }
        .start {
          width: 50%;
          float: left;
        }
      }
    }
  }
  .temp_show {
    width: 100%;
    font-size: 13px;
    .temp_main {
      width: 100%;
      unit-radio {
        margin: auto;
      }
      .el-form-item__label {
        font-size: 12px;
      }
    }
    .temp_detail_footer {
      margin-top: 10px;
      float: right;
    }
  }
}
</style>