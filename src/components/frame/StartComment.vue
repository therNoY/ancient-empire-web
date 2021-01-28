<template>
  <div>
    <el-dialog :title="title" :visible.sync="show" width="30%">
      <el-form v-model="value">
        <el-form-item>
          <el-rate v-model="value.start"></el-rate>
        </el-form-item>
        <el-form-item>
          <el-input v-model="value.comment" size="mini" type="textArea" placeholder="请输入评论..."></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="show = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:"评价"
    },
    value:{},
  },
  data() {
    return {
      show:false
    }
  },
  methods: {
    showComment(){
      this.show = true;
    },
    ok(){
      this.$emit("input", this.value);
      this.$emit("ok", this.value);
      this.show = false;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>