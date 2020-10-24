//渲染单位行动有关的数据

const store = {
  state: {
    action: [], // 单位可以有的action
    leftChanges: [], // 单位血量变化
    animates: [], // 展示的动画
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
        }
      } else {
        state.animates.splice(storeAnims.index, 1);
      }
    },
    setAnimatesInit(state) {
      state.animates = [];
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
                  let storeAnims = {};
                  storeAnims.animImg = anim;
                  storeAnims.row = animate.row;
                  storeAnims.column = animate.column;
                  storeAnims.index = n;
                  storeAnims.imageIndex = k;
                  store.commit("setAnimates", storeAnims);
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