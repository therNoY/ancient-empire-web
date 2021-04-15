<template>
  <div id="template_detail">
    <ae-base-dialog
      v-model="showModel"
      :showCloseTip="false"
      :title="templateDeatil.template_name"
      :width="45"
    >
      <div class="temp_main">
        <el-form
          :disabled="model != 'myTemp'"
          ref="form"
          size="mini"
          :model="templateDeatil"
          label-width="15%"
        >
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item title="基础信息" name="1">
              <el-form-item label="模板名称">
                <el-input
                  size="mini"
                  placeholder="输入模板名称"
                  v-model="templateDeatil.template_name"
                ></el-input>
              </el-form-item>
              <el-form-item label="模板描述">
                <el-input
                  size="mini"
                  placeholder="输入模板描述"
                  v-model="templateDeatil.template_desc"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否共享">
                <el-radio-group v-model="templateDeatil.shared" size="mini">
                  <ae-radio-button label="1">共享</ae-radio-button>
                  <ae-radio-button label="0">不共享</ae-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="晋升信息" name="2">
              <el-form-item label="晋升模式">
                <el-select size="mini" v-model="templateDeatil.promotion_mode">
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
                v-if="templateDeatil.promotion_mode != '0'"
                label="最大晋升数量"
              >
                <el-input-number
                  size="mini"
                  v-model="templateDeatil.promotion_max_num"
                  :min="1"
                  :max="10"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                v-if="templateDeatil.promotion_mode != '0'"
                label="最小晋升等级"
              >
                <el-input-number
                  size="mini"
                  v-model="templateDeatil.promotion_level"
                  :min="2"
                  :max="5"
                ></el-input-number>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="攻击信息" name="3">
              <el-form-item label="攻击模式">
                <el-radio-group
                  v-model="templateDeatil.attach_model"
                  size="mini"
                >
                  <ae-radio-button label="1">固定伤害</ae-radio-button>
                  <ae-radio-button label="2">固定伤害+随机伤害</ae-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="攻击经验">
                <el-input-number
                  v-model="templateDeatil.attach_experience"
                  :min="10"
                  :max="50"
                  :step="5"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="反击经验">
                <el-input-number
                  v-model="templateDeatil.counterattack_experience"
                  :min="0"
                  :max="50"
                  :step="5"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="击杀经验">
                <el-input-number
                  v-model="templateDeatil.kill_experience"
                  :min="10"
                  :max="50"
                  :step="5"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="反击杀经验">
                <el-input-number
                  v-model="templateDeatil.antikill_experience"
                  :min="0"
                  :max="50"
                  :step="5"
                ></el-input-number>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="单位信息" name="4">
              <el-form-item label="单位最大等级">
                <el-input-number
                  v-model="templateDeatil.unit_max_level"
                  :min="1"
                  :max="9"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="可选单位">
                <unit-checkbox
                  v-if="showDetail"
                  ref="unitCheckbox"
                  :disabled="model != 'myTemp'"
                  :template_id="templateDeatil.id"
                  v-model="templateDeatil.bind_uint_list"
                ></unit-checkbox>
              </el-form-item>
              <el-form-item label="召唤类型">
                <unit-radio
                  v-model="templateDeatil.derivative_id"
                  :unitList="templateDeatil.bind_uint_list"
                  :edit_able="model == 'myTemp'"
                  :template_id="templateDeatil.id"
                ></unit-radio>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="动画信息" name="5" v-if="showDetail">
              <el-form-item label="攻击动画">
                <editable-animate
                  v-model="templateDeatil.attach_animation"
                  :singo="singo"
                  :template_id="templateDeatil.id"
                ></editable-animate>
              </el-form-item>
              <el-form-item label="召唤动画">
                <editable-animate
                  v-model="templateDeatil.summon_animation"
                  :singo="singo"
                  :template_id="templateDeatil.id"
                ></editable-animate>
              </el-form-item>
              <el-form-item label="死亡动画">
                <editable-animate
                  v-model="templateDeatil.dead_animation"
                  :singo="singo"
                  :template_id="templateDeatil.id"
                ></editable-animate>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <ae-button-list
        :buttonList="dynamicButton.map((a) => a.name)"
        :clickAction="dynamicButton.map((a) => a.action)"
      ></ae-button-list>
    </ae-base-dialog>
    <start-Comment
      ref="startComment"
      :comment="downloadComment"
      @ok="downLoadTemp"
    ></start-Comment>
  </div>
</template>

<script>
import EditableAnimate from "../map_base/EditableAnimate.vue";
import UnitRadio from "../map_base/UnitRadio.vue";
import UnitCheckbox from "../map_base/UnitCheckbox.vue";
import PreviewUnitList from "../map_base/PreviewUnitList.vue";
import StartComment from "../frame/StartComment.vue";
import dialogShow from "../../mixins/frame/dialogShow.js";
import AeButtonList from "../frame/AeButtonList.vue";
import AeTip from "../frame/AeTip.vue";
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
import AeBaseDialog from "../frame/AeBaseDialog.vue";
export default {
  mixins: [dialogShow],
  props: {
    templateDeatil: {},
    // 查看模式 myTemp myDownload
    model: {
      type: String,
      default: "myTemp",
    },
  },
  components: {
    EditableAnimate,
    UnitRadio,
    UnitCheckbox,
    PreviewUnitList,
    StartComment,
    AeButtonList,
    AeTip,
    AeBaseDialog,
  },
  data() {
    return {
      activeNames: ["1"],
      showDetail: true,
      derivativeTip: "具有召唤能力的单位从坟墓中召唤出来的单位类型",
      singo: 0,
      downloadComment: {},
      dialogTimer: null,
    };
  },
  methods: {
    onDialogCreate() {
      this.dialogTimer = setInterval(() => {
        if (this.singo < 1000) {
          this.singo++;
        } else {
          this.singo = 0;
        }
      }, 500);
    },
    onDialogDestroy() {
      clearInterval(this.dialogTimer);
    },
    saveTemp() {
      let args = this.templateDeatil;
      args.relation_unit_list = this.templateDeatil.bind_uint_list.map(
        (u) => u.id
      );
      SaveTemplateInfo(args).then((resp) => {
        if (resp && resp.res_code == 0) {
          this.$message.success("保存成功");
          this.$emit("input", false);
          this.$emit("saveOrDel");
        }
      });
    },
    delTemp() {
      let _this = this;
      this.$appHelper.showTip("确定要删除么？", () => {
        let args = {};
        args.id = _this.templateDeatil.id;
        if (_this.model == "myTemp") {
          RemoveUserTemplate(args).then((resp) => {
            _this.$message.info("删除成功");
            _this.$emit("input", false);
            _this.$emit("saveOrDel");
          });
        } else if (_this.model == "myDownload") {
          RemoveUserTemplateAttention(args).then((resp) => {
            _this.$message.info("移除成功");
            _this.$emit("input", false);
            _this.$emit("saveOrDel");
          });
        }
      });
    },
    downLoadTemp() {
      let args = {};
      args.template_id = this.templateDeatil.id;
      args.template_start = this.downloadComment.start;
      args.template_comment = this.downloadComment.comment;
      DownloadTemplate(args).then((resp) => {
        if (resp.res_code == 0) {
          this.$message.info("下载成功");
          this.$emit("input", false);
          this.$emit("saveOrDel");
        }
      });
    },
    saveDraft() {
      if (this.templateDeatil.status == 0) {
        let args = this.templateDeatil;
        args.relation_unit_list = this.templateDeatil.bind_uint_list.map(
          (u) => u.id
        );
        args.cancel_save = true;
        SaveTemplateInfo(args).then((resp) => {
          if (resp && resp.res_code == 0) {
            this.$message.info("保存草稿成功");
            this.$emit("input", false);
          }
        });
      }
    },
  },
  computed: {
    dynamicButton() {
      if (this.model == "myTemp") {
        if (this.templateDeatil.status == "0") {
          return [
            { name: "创 建", action: this.saveTemp },
            { name: "保存草稿", action: this.saveDraft },
            { name: "删 除", action: this.delTemp },
          ];
        } else {
          return [
            { name: "保 存", action: this.saveTemp },
            { name: "删 除", action: this.delTemp },
          ];
        }
      } else if (this.model == "myDownload") {
        return [{ name: "删 除", action: this.delTemp }];
      } else if (this.model == "download") {
        return [
          {
            name: "下 载",
            action: () => this.$refs.startComment.showComment(),
          },
          { name: "取 消", action: () => this.$emit("input", false) },
        ];
      }
    },
  },
  watch: {},
  created() {
    window.TemplateDeatilVue = this;
  },
};
</script>

<style lang="scss" >
#template_detail {
  margin-top: 10px;
  .el-collapse-item__header {
    background-color: #5a5c59;
    color: #ffffff;
    text-align: center;
    padding-left: 45%;
    border-bottom: 1px solid #919191;
  }
  .el-collapse-item__wrap {
    background-color: #5a5c59;
    color: #ffffff;
    border-bottom: 1px solid #919191;
  }
  .el-form-item__label {
    float: left;
    margin-top: 1%;
  }
  .el-form-item__content {
    margin-top: 1%;
    width: 80%;
    padding-bottom: 0% !important;
  }
  .el-form-item__label {
    color: #e0e0e0;
  }
}
</style>