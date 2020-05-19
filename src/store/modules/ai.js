// 和人机交互有关的需要整理

const ai = {
  
  state: {
    aiProperty: {
      aiMovePointIndex: 0,
      movePoint: {},
    }
  },

  mutations: {
    descAiMovePointIndex(state) {
      state.aiProperty.aiMovePointIndex++;
    }
  },

  actions: {
    // 单位的移动
    aiMove(store, doEndFunction) {
      console.log("准备移动");
      console.log(store.getters.mapDt.pathPoints);
      store.commit("setUnitStatus", "moveIng");
      // 1.移动之前计算将要移动的移动距离, 点击就开始移动
      store.dispatch("aiMoveUnit");
      // 如果只移动一段距离 就不需要
      if (store.getters.mapDt.pathPoints.length > 1) {
        let sumTime = 0; // 用于记录定时器需要延迟的时间 越往后越慢
        for (let i = 0; i < store.getters.mapDt.pathPoints.length - 2; i++) {
          // 这里减去2 最后一个移动点不需要计算
          // 循环出下一段 然后计算出 需要定时的时间
          sumTime = sumTime + store.getters.mapDt.pathPoints[i].length * 250;
          console.log(sumTime);
          setTimeout(() => { store.dispatch("aiMoveUnit", doEndFunction) }, sumTime + "");
        }
      }
    },
    // 使单位移动一段距离的方法
    aiMoveUnit(store, doEndFunction) {
      console.log("realMove");
      // 先计算出移动距离
      store.dispatch("aiGetMoveLength");
      let i = store.getters.aiProperty.aiMovePointIndex + 1;
      //  移动的核心逻辑 使当前移动的单位改变位置
      store.commit("changeCurrentUnitPosition", store.getters.mapDt.pathPoints[i]);
      store.commit("descAiMovePointIndex");

      // 判断如果是倒数第二段 就设置一个和倒数第一段相同的计时器 用来处理移动结束的逻辑
      if (store.getters.aiProperty.aiMovePointIndex + 1 == store.getters.mapDt.pathPoints.length) {
        let time = store.getters.mapDt.pathPoints[store.getters.mapDt.pathPoints.length - 2].length * 250;
        setTimeout(() => { store.dispatch("aiMoveFinish", doEndFunction) }, time + "");
        // 获取此时单位可进行的移动 比如 attach等
      }
    },
    // 通过当前移动的点movePointIndex 计算出下一段的距离
    aiGetMoveLength(store) {
      let point = store.getters.mapDt.pathPoints[store.getters.aiProperty.aiMovePointIndex];
      store.commit("changeMoveLength", point.length);
    },
    // 单位到达要移动的地方 判断单位能进行的action
    aiMoveFinish(store, doEndFunction) {
      store.commit("changeCurrentPoint", store.getters.mapDt.pathPoints[store.getters.mapDt.pathPoints.length - 1]);
      console.log("AI单位完成");
      // 单位移动完毕
      store.getters.aiProperty.aiMovePointIndex = 0;
      if (store.getters.mapSt.mapStatus == "secendMove") {
        store.commit("setUnitStatus", "moveDone");
        store.dispatch("getEndResult", "getEndResult");
        return;
      }
      store.commit("setUnitStatus", "moveDone");
      if (typeof doEndFunction == "function") {
        doEndFunction();
      }
    },
    aiBuyUnit(store, aiBuyUnitInfo) {
      // 增加单位 改变人口和金币
      store.commit("changeCurrentPoint", aiBuyUnitInfo.site);
      let army = store.getters.record.army_list[aiBuyUnitInfo.army_index];
      console.log("当前军队");
      console.log(army);
      army.units.push(aiBuyUnitInfo.unit);
      army.money = army.money - aiBuyUnitInfo.unit_mes.price;
      army.pop = army.pop + aiBuyUnitInfo.unit_mes.population;
    }

  }

}

export default ai
