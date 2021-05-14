<template>
  <div class="body">
    <ae-complex-dialog ref="mainDiaglog" v-model="showModel" showSearch title="单位管理" :titleButtons="titleButtonList"
      :footerButtons="footButtonList" :initQueryDataGrid="queryDataFunction" :showItem="showItem" :showTitle="showTitle"
      :titleSwitchSelect="titleSwitchSelect" @titleSwitchSelectChange="switchChange" :width="70" page>
    </ae-complex-dialog>

    <ae-base-dialog :title="diaTitle" v-model="dialogVisible" fixedDialog :top="3" :width="48">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="baseInfo">
          <div class="input_mes">
            <ae-form ref="unitBaseInfoForm" :dataObj="unit" :edit="showPageIndex == '1'"
              :formConfig="unitBaseInfoFormConfig" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="绑定能力" name="unitAbility">
          <ae-transfer v-model="currUnitInfo.abilityInfo" showKey="name" valueKey="id" showTipKey="description"
            :dataList="allAbilityList" :disabled="showPageIndex != '1'" />
        </el-tab-pane>
        <el-tab-pane label="等级面板" name="levelInfo">
          <ae-data-grid ref="unitLevelDataGrid" :data="currUnitInfo.levelInfoData" :showTitle="unitLevelShowTitle"
            :showItem="unitLevelShowItem">
          </ae-data-grid>
        </el-tab-pane>
        <!-- <el-tab-pane label="动画管理" name="fourth"> 暂未开通 </el-tab-pane> -->
      </el-tabs>
      <ae-button-list :buttonList="getButtonList" :clickAction="getClickAction"></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog title="修改等级信息" :width="40" v-model="editUnitLevelInfoDialog">
      <ae-form ref="levelInfoForm" v-if="currentLevelInfo" :dataObj="currentLevelInfo" :edit="showPageIndex == '1'"
        :formConfig="unitLevelInfoFormConfig" />
      <ae-button @onClick="saveLevelInfo">确 定</ae-button>
    </ae-base-dialog>

    <start-comment ref="startComment" @ok="handleDownload" />
    <upload-unit-img ref="uploadUnitImg" v-model="showUplpadUnitImg" @uploadOk="createUnit" />
  </div>
</template>

<script>
  const createUnitTip =
    "<h3>注意: 创建单位需要一定的像素画知识，或者有现成的图片。</h3>" +
    "如果没有建议不要创建,可以通过单位商城下载作者或者大神开放的单位<br/>" +
    "<h4>上传文件需要注意:</h4> 1.需要上传两张宽度和高度都是<b>24px</b>的图片, 游戏中两张照片相互切换, 达到动态效果<br/><br/>" +
    "2.初始上传的单位为蓝色方基础单位, 会根据这个图片生成其他颜色单位";

  import {
    GetUserCreateUnitMes,
    SaveUnitInfo,
    GetAllUserEnableUnitMes,
    GetUnitAbilityInfo,
    GetAllAbilityInfo,
    GetUnitLevelInfoById,
    GetUserDownloadUnitList,
    GetCanDownloadUnit,
    DeletDownLoadUnit,
    DeleteCreateUnit,
    DownLoadUnit,
    UpdateUnitVersion,
    RevertUnitVersion,
  } from "@/api";
  import UnitRadio from "@frame/UnitRadio.vue";
  import dialogShow from "@/mixins/frame/dialogShow.js";
  import StartComment from "@frame/StartComment.vue";
  import UploadUnitImg from "@frame/UploadUnitImg.vue";
  export default {
    mixins: [dialogShow],
    components: {
      UnitRadio,
      StartComment,
      UploadUnitImg,
    },
    data() {
      return {
        titleSwitchSelect: {
          type: "switchSelect",
          key: "queryType",
          default: "1",
          des: "",
          items: [{
              key: "1",
              value: "我的单位",
              query: GetUserCreateUnitMes
            },
            {
              key: "2",
              value: "我的下载",
              query: GetUserDownloadUnitList
            },
            {
              key: "3",
              value: "单位商城",
              query: GetCanDownloadUnit
            },
          ],
        },
        titleButtonList: [{
          name: "新增",
          action: () =>
            this.$appHelper.showTip(createUnitTip, () => {
              this.showUplpadUnitImg = true;
            }),
        }, ],
        allUnitList: [],
        showPageIndex: "1",
        unit: {},
        unitBaseInfoFormConfig: [{
            type: "input",
            key: "name",
            des: "名称",
          },
          {
            type: "switchSelect",
            key: "attack_type",
            des: "攻击类型",
            items: [{
                key: "1",
                value: "物理攻击"
              },
              {
                key: "2",
                value: "魔法攻击"
              },
            ],
          },
          {
            type: "rangeSelect",
            minKey: "min_attach_range",
            maxKey: "max_attach_range",
            des: "攻击范围",
          },
          {
            type: "input",
            key: "population",
            des: "人口",
            style: "number",
          },
          {
            type: "input",
            key: "price",
            des: "价格",
            style: "number",
          },
          {
            type: "unitRadio",
            key: "promotion",
            des: "晋升单位",
            unitList: this.allUnitList,
          },
          {
            type: "switchSelect",
            key: "tradeable",
            des: "是否可以购买",
            items: [{
                key: "1",
                value: "是"
              },
              {
                key: "0",
                value: "否"
              },
            ],
          },

          {
            type: "input",
            key: "description",
            des: "描述",
          },
        ],
        unitLevelInfoFormConfig: [{
            type: "input",
            key: "level",
            des: "等级",
            style: "number",
            disabled: true,
            require: true,
          },
          {
            type: "input",
            key: "min_attack",
            des: "最小攻击",
            style: "number",
            require: true,
          },
          {
            type: "input",
            key: "max_attack",
            des: "最大攻击",
            style: "number",
            require: true,
          },
          {
            type: "input",
            key: "physical_defense",
            des: "物理防御",
            style: "number",
            require: true,
          },
          {
            type: "input",
            key: "magic_defense",
            des: "魔法防御",
            style: "number",
            require: true,
          },
          {
            type: "input",
            key: "max_life",
            des: "最大生命",
            style: "number",
            require: true,
          },
          {
            type: "input",
            key: "speed",
            des: "移动力",
            style: "number",
            require: true,
          },
        ],
        dialogVisible: false,
        editUnitLevelInfoDialog: false,
        diaTitle: "新增单位",
        addLevel: false,
        activeName: "baseInfo",
        allAbilityList: [],
        currUnitInfo: {
          baseInfo: {},
          abilityInfo: [],
          levelInfoData: [],
        },
        footButtonList1: [{
            name: "详情",
            action: this.handleEdit
          },
          {
            name: "删除",
            action: this.handleDelete
          },
        ],
        footButtonList2: [{
            name: "详情",
            action: this.handleEdit
          },
          {
            name: "下载",
            action: this.downloadUnit
          },
        ],
        currentLevelInfo: null,
        queryDataFunction: null,
        queryShowTitle: [
          "单位",
          "名称",
          "攻击类型",
          "攻击范围",
          "价格",
          "可以购买",
          "晋升",
          "版本",
        ],
        downShowTitle: [
          "单位",
          "名称",
          "作者",
          "可以购买",
          "晋升",
          "版本",
          "评分",
          "下载次数",
        ],
        queryShowItem: [
          (h, p) => {
            return h("img", {
              attrs: {
                src: this.$appHelper.getUnitImg(p.id)
              }
            });
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
                attrs: {
                  src: this.$appHelper.getUnitImg(p.promotion)
                },
              });
            } else {
              return h("div", {}, "-");
            }
          },
          (h, p) => {
            if (p.max_version) {
              return h(
                "div", {},
                "V" + p.version + "(可更新至V" + p.max_version + ")"
              );
            } else if (p.status == "0") {
              return h("div", {}, "V" + p.version + "(草稿版本)");
            } else {
              return h("div", {}, "V" + p.version + "(最新版本)");
            }
          },
        ],
        downloadShowItem: [
          (h, p) => {
            return h("img", {
              attrs: {
                src: this.$appHelper.getUnitImg(p.id)
              }
            });
          },
          "name",
          "create_user_name",
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
                attrs: {
                  src: this.$appHelper.getUnitImg(p.promotion)
                },
              });
            } else {
              return h("div", {}, "-");
            }
          },
          (h, p) => {
            if (p.max_version) {
              return h(
                "div", {},
                "V" + p.version + "(可更新至V" + p.max_version + ")"
              );
            } else if (p.status == "0") {
              return h("div", {}, "V" + p.version + "(草稿版本)");
            } else {
              return h("div", {}, "V" + p.version + "(最新版本)");
            }
          },
          "start_count",
          "down_load_count",
        ],
        unitLevelShowTitle: [
          "等级",
          "最小攻击",
          "最大攻击",
          "物理防御",
          "魔法防御",
          "最大生命",
          "移动力",
          (h, p) => {
            return h(
              "aeButton", {
                props: {
                  width: 80,
                  size: 12
                },
                on: {
                  onClick: this.addNewLevel
                },
              },
              "新增"
            );
          },
        ],
        unitLevelShowItem: [
          "level",
          "min_attack",
          "max_attack",
          "physical_defense",
          "magic_defense",
          "max_life",
          "speed",
          (h, p) => {
            return h(
              "aeButton", {
                props: {
                  width: 80,
                  size: 12
                },
                on: {
                  onClick: () => this.editUnitLevelInfo(p)
                },
              },
              "修改"
            );
          },
        ],
        showUplpadUnitImg: false,
        newUploadImg: {},
      };
    },
    methods: {
      createUnit(newImg) {
        this.newUploadImg = newImg;
        this.dialogVisible = true;
        this.diaTitle = "新建单位";
        this.unit = {};
        this.currUnitInfo.baseInfo = {};
        this.currUnitInfo.abilityInfo = [];
        this.currUnitInfo.levelInfoData = [];
        console.log("创建单位");
      },
      doCreateNewUnit() {
        this.$appHelper.setLoading();
        let args = {};
        args.opt_type = "3";
        args.new_upload_img = this.newUploadImg;
        args.base_info = this.unit;
        args.ability_info = this.currUnitInfo.abilityInfo;
        args.level_info_data = this.currUnitInfo.levelInfoData;
        SaveUnitInfo(args)
          .then((resp) => {
            if (resp.res_code == 0) {
              this.dialogVisible = false;
              this.$appHelper.infoMsg("创建成功");
            } else {
              this.$appHelper.errorMsg(resp.res_mes);
            }
            this.$appHelper.setLoading();
          })
          .catch(function() {
            console.log(error);
            this.$appHelper.setLoading();
          });
      },
      downloadUnit() {
        this.$refs.startComment.showComment();
      },
      reverVersion() {
        let unit = this.$refs.mainDiaglog.getDataGridSelect();
        if (unit.status == "0") {
          console.log("回退单位草稿版本");
          let args = {};
          args.unit_id = unit.id;
          this.$appHelper.setLoading();
          RevertUnitVersion(args)
            .then((resp) => {
              if (resp.res_code == 0) {
                this.$appHelper.infoMsg("回退成功");
                this.$refs.mainDiaglog.flushData();
                this.dialogVisible = false;
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
      updateVersion() {
        let unit = this.$refs.mainDiaglog.getDataGridSelect();
        this.$appHelper.setLoading();
        let args = {};
        args.unit_id = unit.id;
        UpdateUnitVersion(args)
          .then((resp) => {
            if (resp.res_code == "0") {
              this.$appHelper.infoMsg("更新成功");
              this.$refs.mainDiaglog.flushData();
              this.dialogVisible = false;
            } else {
              this.$appHelper.infoMsg(resp.res_mes);
            }
            this.$appHelper.setLoading();
          })
          .catch((error) => {
            this.$appHelper.setLoading();
          });
      },
      save(optType = 0) {
        if (optType == "1") {
          this.$appHelper.showTip("发布新版本会覆盖历史版本, 确定么？", () => {
            this.saveUnitInfo(optType);
          });
        } else {
          this.$appHelper.showTip(
            "保存之后 不会修改最新版本 需要发布才能生效",
            () => {
              this.saveUnitInfo(optType);
            }
          );
        }
      },
      saveUnitInfo(optType) {
        this.$appHelper.setLoading();
        let args = {};
        args.opt_type = optType;
        args.base_info = this.unit;
        args.ability_info = this.currUnitInfo.abilityInfo;
        args.level_info_data = this.currUnitInfo.levelInfoData;
        SaveUnitInfo(args)
          .then((resp) => {
            if (resp.res_code == 0) {
              this.dialogVisible = false;
              this.$appHelper.infoMsg("保存成功");
            } else {
              this.$appHelper.errorMsg(resp.res_mes);
            }
            this.$appHelper.setLoading();
          })
          .catch(function(error) {
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
        if (this.showPageIndex == "2") {
          this.$appHelper.showTip("确定要删除下载么?", () => {
            let args = {};
            args.id = unit.id;
            this.$appHelper.setLoading();
            DeletDownLoadUnit(args)
              .then((resp) => {
                if (resp.res_code == "0") {
                  this.$appHelper.infoMsg("删除成功");
                  this.$refs.mainDiaglog.flushData();
                  this.dialogVisible = false;
                }
                this.$appHelper.setLoading();
              })
              .catch((error) => {
                this.$appHelper.setLoading();
              });
          });
        } else if (this.showPageIndex == "1") {
          this.$appHelper.showTip("操做将会永久删除单位信息,确实么?", () => {
            let args = {};
            args.id = unit.id;
            this.$appHelper.setLoading();
            DeleteCreateUnit(args)
              .then((resp) => {
                if (resp.res_code == "0") {
                  this.$appHelper.infoMsg("删除成功");
                  this.$refs.mainDiaglog.flushData();
                  this.dialogVisible = false;
                }
                this.$appHelper.setLoading();
              })
              .catch((error) => {
                this.$appHelper.setLoading();
              });
          });
        }
      },
      handleDownload(commend) {
        let unit = this.$refs.mainDiaglog.getDataGridSelect();
        let args = {};
        args.unit_id = unit.id;
        args = Object.assign(commend, args);
        this.$appHelper.setLoading();
        DownLoadUnit(args)
          .then((resp) => {
            if (resp.res_code == "0") {
              this.$appHelper.infoMsg("下载成功");
              this.$refs.mainDiaglog.flushData();
              this.dialogVisible = false;
            }
            this.$appHelper.setLoading();
          })
          .catch((error) => {
            this.$appHelper.setLoading();
          });
      },
      editUnitLevelInfo(unitLevelInfo) {
        this.addLevel = false;
        this.editUnitLevelInfoDialog = true;
        this.currentLevelInfo = unitLevelInfo;
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
        GetAllUserEnableUnitMes().then((resp) => {
          if (resp.res_code == 0) {
            this.allUnitList = resp.res_val;
            this.unitBaseInfoFormConfig[6].unitList = resp.res_val;
          }
        });
        GetAllAbilityInfo().then((resp) => {
          if (resp.res_code == 0) {
            this.allAbilityList = resp.res_val;
          }
        });
      },
      switchChange(value) {
        this.showPageIndex = value;
      },
    },
    computed: {
      UnitImg() {
        return function(id) {
          return this.$appHelper.getUnitImg(id);
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
      },
      getButtonList() {
        if (this.showPageIndex == "1") {
          if (this.diaTitle == "编辑单位") {
            return ["保存草稿", "发布版本", "草稿回退"];
          } else {
            return ["创 建", "返 回"];
          }
        } else if (this.showPageIndex == "2") {
          return ["更新版本", "删除下载"];
        } else if (this.showPageIndex == "3") {
          return ["下载单位"];
        }
      },
      getClickAction() {
        if (this.showPageIndex == "1") {
          if (this.diaTitle == "编辑单位") {
            return [this.save, () => this.save(1), this.reverVersion];
          } else {
            return [this.doCreateNewUnit, () => (this.dialogVisible = false)];
          }
        } else if (this.showPageIndex == "2") {
          return [this.updateVersion, this.handleDelete];
        } else if (this.showPageIndex == "3") {
          return [this.downloadUnit];
        }
      },
      showTitle() {
        if (this.showPageIndex == "3") {
          return this.downShowTitle;
        } else {
          return this.queryShowTitle;
        }
      },
      footButtonList() {
        if (this.showPageIndex == "3") {
          return this.footButtonList2;
        } else {
          return this.footButtonList1;
        }
      },
      showItem() {
        if (this.showPageIndex == "3") {
          return this.downloadShowItem;
        } else {
          return this.queryShowItem;
        }
      },
    },
    created() {
      // 初始化
      this.queryDataFunction = GetUserCreateUnitMes;
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
    padding: 1%;
  }

  .el-form-item__content {
    float: left;
  }

  .levelInfoStyle th {
    padding: 8px, 0 !important;
  }
</style>
