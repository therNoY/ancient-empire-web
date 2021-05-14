<template>
  <div id="template_detail">
    <ae-base-dialog
      v-model="showModel"
      :title="TemplateDetail.template_name"
      :width="45"
      fixedDialog
      :top="9"
    >
      <ae-tab-form
        ref="templateInfoForm"
        :edit="model == 'myTemp'"
        :dataObj="TemplateDetail"
        :singo="singo"
        :templateId="TemplateDetail.id"
        :formConfig="templateInfoFormConfig"
      >
        <!--TODO 这里可以展示评论-->
      </ae-tab-form>

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
import EditableAnimate from "@frame/EditableAnimate.vue";
import UnitRadio from "@frame/UnitRadio.vue";
import UnitCheckbox from "@frame/UnitCheckbox.vue";
import PreviewUnitList from "@frame/PreviewUnitList.vue";
import StartComment from "@frame/StartComment.vue";
import dialogShow from "@/mixins/frame/dialogShow.js";
import {
  SaveTemplateInfo,
  RemoveUserTemplate,
  RemoveUserTemplateAttention,
  UpdateUserTempAttention,
  RevertTemplateVersion,
} from "@/api";
export default {
  mixins: [dialogShow],
  props: {
    TemplateDetail: {},
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
  },
  data() {
    return {
      templateInfoFormConfig: [
        {
          type: "input",
          key: "template_name",
          des: "模板名称",
          tab: "基本信息",
        },
        {
          type: "switchSelect",
          key: "shared",
          des: "是否共享",
          items: [
            { key: "1", value: "共享" },
            { key: "2", value: "不共享" },
          ],
          tab: "基本信息",
        },
        {
          type: "input",
          key: "template_desc",
          des: "模板描述",
          tab: "基本信息",
        },
        {
          type: "input",
          key: "unit_max_level",
          des: "最大等级",
          style: "number",
          tab: "单位信息",
        },
        {
          type: "unitCheckbox",
          key: "bind_uint_list",
          des: "可选单位",
          tab: "单位信息",
        },
        {
          type: "unitRadio",
          key: "derivative_id",
          des: "召唤类型",
          tab: "单位信息",
        },
        {
          type: "switchSelect",
          key: "attach_model",
          des: "攻击模式",
          items: [
            { key: "1", value: "固定数值" },
            { key: "2", value: "浮动数值" },
          ],
          tab: "攻击信息",
        },
        {
          type: "input",
          key: "attach_experience",
          des: "攻击经验",
          style: "number",
          tab: "攻击信息",
        },
        {
          type: "input",
          key: "counterattack_experience",
          des: "反击经验",
          style: "number",
          tab: "攻击信息",
        },
        {
          type: "input",
          key: "kill_experience",
          des: "击杀经验",
          style: "number",
          tab: "攻击信息",
        },
        {
          type: "input",
          key: "antikill_experience",
          des: "反杀经验",
          style: "number",
          tab: "攻击信息",
        },
        {
          type: "editableAnimate",
          key: "attach_animation",
          des: "攻击动画",
          tab: "动画设置",
        },
        {
          type: "editableAnimate",
          key: "summon_animation",
          des: "召唤动画",
          tab: "动画设置",
        },
        {
          type: "editableAnimate",
          key: "dead_animation",
          des: "死亡动画",
          tab: "动画设置",
        },
        {
          type: "switchSelect",
          key: "promotion_mode",
          items: [
            { key: "0", value: "不晋升" },
            { key: "1", value: "用户选择" },
            { key: "2", value: "随机晋升" },
            { key: "3", value: "达到晋升等级" },
          ],
          des: "晋升模式",
          tab: "晋升设置",
        },
        {
          type: "input",
          key: "promotion_max_num",
          des: "最大晋升数量",
          style: "number",
          tab: "晋升设置",
        },
        {
          type: "input",
          key: "promotion_level",
          des: "最小晋升等级",
          style: "number",
          tab: "晋升设置",
        },
      ],
      activeName: "baseInfo",
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
      this.templateInfoFormConfig;
    },
    onDialogDestroy() {
      clearInterval(this.dialogTimer);
    },
    downLoadTemp(comment){
      this.$emit('downLoadTemp', comment)
    },
    saveTemp() {
      let args = this.TemplateDetail;
      args.relation_unit_list = this.TemplateDetail.bind_uint_list.map(
        (u) => u.id
      );
      args.opt_type = "1";
      SaveTemplateInfo(args).then((resp) => {
        if (resp && resp.res_code == 0) {
          this.$appHelper.successMsg("保存成功");
          this.$emit("input", false);
          this.$emit("saveOrDel");
        }
      });
    },
    delTemp(TemplateDetail = this.TemplateDetail) {
      let _this = this;
      this.$appHelper.showTip("确定要删除么？", () => {
        let args = {};
        args.id = TemplateDetail.id;
        if (_this.model == "myTemp") {
          RemoveUserTemplate(args).then((resp) => {
            _this.$appHelper.infoMsg("删除成功");
            _this.$emit("input", false);
            _this.$emit("saveOrDel");
          });
        } else if (_this.model == "myDownload") {
          RemoveUserTemplateAttention(args).then((resp) => {
            _this.$appHelper.infoMsg("移除成功");
            _this.$emit("input", false);
            _this.$emit("saveOrDel");
          });
        }
      });
    },

    saveDraft() {
      let args = this.TemplateDetail;
      args.relation_unit_list = this.TemplateDetail.bind_uint_list.map(
        (u) => u.id
      );
      args.opt_type = "0";
      SaveTemplateInfo(args).then((resp) => {
        if (resp && resp.res_code == 0) {
          this.$appHelper.infoMsg("保存草稿成功");
          this.$emit("input", false);
          this.$emit("saveOrDel");
        }
      });
    },
    updateVersion() {
      let args = {};
      if (
        this.TemplateDetail.max_version &&
        this.TemplateDetail.max_version > this.TemplateDetail.version
      ) {
        args.template_id = this.TemplateDetail.id;
        this.$appHelper.setLoading();
        UpdateUserTempAttention(args)
          .then((resp) => {
            if (resp.res_code == "0") {
              this.$appHelper.successMsg("更新成功");
              this.$emit("input", false);
              this.$emit("saveOrDel");
            }
            this.$appHelper.setLoading();
          })
          .catch((error) => {
            this.$appHelper.setLoading();
          });
      } else {
        this.$appHelper.warningMsg("当前最新版本,无需更新");
      }
    },
    reverVersion() {
      let template = this.TemplateDetail;
      if (template.status == "0") {
        console.log("回退单位草稿版本");
        let args = {};
        args.template_id = template.id;
        this.$appHelper.setLoading();
        RevertTemplateVersion(args)
          .then((resp) => {
            if (resp.res_code == 0) {
              this.$appHelper.infoMsg("回退成功");
              this.$emit("input", false);
              this.$emit("saveOrDel");
            }
            this.$appHelper.setLoading();
          })
          .catch((error) => {
            this.$appHelper.setLoading();
          });
      } else {
        this.$appHelper.infoMsg("当前单位是正式版本 无需回退");
      }
    },
  },
  computed: {
    dynamicButton() {
      if (this.model == "myTemp") {
        return [
          { name: "发布版本", action: this.saveTemp },
          { name: "保存草稿", action: this.saveDraft },
          { name: "草稿回退", action: this.reverVersion },
        ];
      } else if (this.model == "myDownload") {
        return [
          { name: "更新版本", action: this.updateVersion },
          { name: "删除下载", action: this.delTemp },
        ];
      } else if (this.model == "download") {
        return [
          {
            name: "下载模板",
            action: () => this.$refs.startComment.showComment(),
          },
        ];
      } else {
        return [];
      }
    },
  },
  watch: {},
  created() {
    window.TemplateDetailVue = this;
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
