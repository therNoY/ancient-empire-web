//渲染单位行动有关的数据

const store = {
  state: {
    action: [], // 单位可以有的action
    leftChanges: [], // 单位血量变化
    animates: [], // 展示的动画,
    levelUpInfo: null, // 单位升级详情
    levelUpSite: null, // 单位升级位置
  },
  mutations: {
    setAction(state, action) {
      state.action = action;
    },
    setLeftChange(state, leftChanges) {
      if (leftChanges instanceof Array) {
        state.leftChanges = leftChanges;
      } else {
        state.leftChanges = [leftChanges];
      }
      // 设置好就定时清理
      setTimeout(() => {
        state.leftChanges = [];
      }, 500);
    },
    setAnimates(state, storeAnims) {
      if (storeAnims.animImg) {
        if (storeAnims.imageIndex == 0) {
          state.animates.splice(storeAnims.index, 0, storeAnims);
        } else {
          state.animates[storeAnims.index].animImg = storeAnims.animImg;
          state.animates[storeAnims.index].row = storeAnims.row;
          state.animates[storeAnims.index].column = storeAnims.column;
        }
      } else {
        state.animates.splice(storeAnims.index, 1);
      }
    },
    setAnimatesInit(state) {
      state.animates = [];
    },
    setLevelUpInfo(state, levelUpInfo){
      state.levelUpInfo = levelUpInfo;
    },
    setLevelUpSite(state, levelUpSite){
      state.levelUpSite = levelUpSite;
    }
  },
  actions: {
    showAnimates(store, animates) {
      store.commit("setAnimatesInit");
      // 可以同时播放多个动画
      console.log("需要播放的动画", animates);
      for (let i = 0; i < animates.length; i++) {
        const animate = animates[i];
        const frame = animate.frame;
        let j = 0;
        for (; j < animate.anim_list.length + 1; j++) {
          // 使用闭包
          (
            function (n, k) {
              if (j == animate.anim_list.length) {
                // 播放最后一帧画
                setTimeout(() => {
                  store.commit("setAnimates", { index: n, animImg: null });
                  if (animate.callback instanceof Array && animate.callback[k] instanceof Function) {
                    animate.callback[k]();
                  }
                }, frame * k);
              } else {
                const anim = animate.anim_list[k];
                setTimeout(() => {
                  let storeAnims = anim;
                  storeAnims.animImg = anim.animImg;
                  storeAnims.row = anim.row;
                  storeAnims.column = anim.column;
                  if (!storeAnims.row && animate.row) {
                    storeAnims.row = animate.row;
                  }
                  if (!storeAnims.column && animate.column) {
                    storeAnims.column = animate.column;
                  }
                  storeAnims.index = n;
                  storeAnims.imageIndex = k;
                  console.log(JSON.stringify(storeAnims));
                  store.commit("setAnimates", JSON.parse(JSON.stringify(storeAnims)));
                  if (animate.callback instanceof Array && animate.callback[k] instanceof Function) {
                    animate.callback[k]();
                  }
                }, frame * k);
              }

            }
          )(i, j);
        }
      }
    }
  }
}

export default store;
