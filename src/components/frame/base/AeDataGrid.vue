<template>
  <div style="width: 100%">
    <div class="ae-data-grid">
      <table v-if="data && data.length > 0">
        <tr v-if="showTitle && showTitle.length > 0">
          <td v-for="(key, keyIndx) in showTitle" :key="keyIndx" :style="getTabelTdStyle(keyIndx)">
            <div v-if="isNotFunction(key)">
              {{ key }}
            </div>
            <div v-else>
              <ae-dynamic :componentFunction="key"></ae-dynamic>
            </div>
          </td>
        </tr>
        <tr
          v-for="(item, index) in data"
          :key="index"
          :style="getTabelItemStyle(index)"
          @click="clickItem(index)"
        >
          <td v-for="(key, keyIndx) in showKey" :key="keyIndx" :style="getTabelTdStyle(keyIndx)">
            <div v-if="isNotFunction(key)">
              {{ item[key] }}
            </div>
            <div v-else>
              <ae-dynamic :componentFunction="key" :item="item"></ae-dynamic>
            </div>
          </td>
        </tr>
      </table>
      <div v-else>
        <table>
          <tr v-if="showTitle && showTitle.length > 0">
            <td v-for="(key, keyIndx) in showTitle" v-bind:key="keyIndx">
              <div v-if="isNotFunction(key)">
                {{ key }}
              </div>
              <div v-else>
                <ae-dynamic :componentFunction="key"></ae-dynamic>
              </div>
            </td>
          </tr>
        </table>

      </div>
    </div>

    <ae-page
      ref="aePage"
      v-if="page"
      :count="count"
      @onPageNowChange="onPageNowChange"
    ></ae-page>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
    showTitle: {
      type: Array,
    },
    showItem: {
      type: Array,
    },
    page: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
    tableConfig:{

    }
  },
  data() {
    return {
      selectIndex: 0,
    };
  },
  created() {
    window.AeDataGridVue = this;
  },
  methods: {
    isNotFunction(obj) {
      return typeof obj != 'function'
    },
    getTabelItemStyle(index) {
      if (index == this.selectIndex) {
        return {
          backgroundColor: "#5a5c59",
        };
      }
      return {
        backgroundColor: "#444444",
      };
    },
    getTabelTdStyle(index) {
      if (this.tableConfig && this.tableConfig[index] && this.tableConfig[index]["style"]) {
        return this.tableConfig[index]["style"];
      }
      return {};
    },
    clickItem(index) {
      this.selectIndex = index;
    },
    getSelectIndex() {
      return this.selectIndex;
    },
    getSelect() {
      return this.data[this.selectIndex];
    },
    onPageNowChange(pageNow) {
      this.$emit("onPageNowChange", pageNow);
    },
  },
  computed: {
    showKey() {
      if (this.showItem && this.showItem.length > 0) {
        return this.showItem;
      } else {
        let showKeys = [];
        if (this.data && this.data.length > 0) {
          for (let key in this.data[0]) {
            showKeys.push(key);
          }
        }
        return showKeys;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-data-grid {
  width: 100%;
  max-height: 320px;
  height: 320px;
  overflow: auto;
  border-top: 2px #242424 solid;
  border-left: 2px #242424 solid;
  border-right: 2px #aaaaaa solid;
  border-bottom: 2px #aaaaaa solid;

  table {
    font-family: verdana, arial, sans-serif;
    font-size: 13px;
    color: #ffffff;
    border-width: 0px;
    width: 100%;
    border-collapse: collapse;
  }

  table th {
    border-width: 0px;
    padding: 8px;
    border-style: solid;
  }

  table tr {
    cursor: pointer;
  }

  table td {
    border-width: 0px;
    padding: 8px;
    border-style: solid;
  }
}
</style>
