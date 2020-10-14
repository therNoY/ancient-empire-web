
import store from "../store";
import commendType from "./commendType"
import { imgUrl } from "../api/env"






var moveHelper = {

  /**
   * 移动单位
   */
  move(index, moveLine, moveFinsh) {
    store.commit("setMapState", 1);
    let game = store.getters.game;
    let currUnit = game.army_list[game.curr_army_index].units[index];
    let sumTime = 0; // 用于记录定时器需要延迟的时间 越往后越慢
    for (let i = 0; i < moveLine.length - 1; i++) {
      // 这里减去2 最后一个移动点不需要计算
      // 循环出下一段 然后计算出 需要定时的时间
      console.log("准备定时移动", sumTime);
      setTimeout(() => {
        store.commit("setMoveLength", moveLine[i].length);
        currUnit.row = moveLine[i + 1].row;
        currUnit.column = moveLine[i + 1].column;
        if (i == moveLine.length - 2) {
          setTimeout(() => {
            store.commit("setMoveLength", 0);
            moveFinsh();
          }, moveLine[i].length * 250)
        }
      }, sumTime + "");
      sumTime += moveLine[i].length * 250;
    }
  },



}

var actionHelper = {
  /**
   * 设置图标展示
   */
  setActionShow(actions) {
    let actionShow1 = [];
    let currPoint = store.getters.game.curr_point;
    for (const action of actions) {
      actionShow1.push({
        row: currPoint.row,
        column: currPoint.column,
        action: action
      })
    }
    store.commit("setAction", actionShow1);
    // 是action 图标动态显示
    setTimeout(() => {
      let action1, action2, action3, action4;
      if (actions.length == 1) {
        // 只有一个action 显示在下面
        action1 = actionShow1[0];
        action1.row += 1;
        action1.column += 0.16;
      } else if (actions.length == 2) {
        // 2个action一个显示在上面 一个显示下面
        action1 = actionShow1[0];
        action1.row -= 1;
        action1.column + 0.16;
        action2 = actionShow1[1];
        action2.row += 1;
        action2.column + 0.16;
      } else if (actions.length == 3) {
        // 3个显示个3交
        action1 = actionShow1[0];
        action1.row -= 1;
        action1.column += 0.16;

        action2 = actionShow1[1];
        action2.row += 1;
        action2.column += 0.84;

        action3 = actionShow1[2];
        action3.row += 1;
        action3.column -= 0.84;
      } else if (actions.length == 4) {
        // 4个显示
        action1 = actionShow1[0];
        action1.row - 1;
        action1.column + 0.16;

        action2 = actionShow1[1];
        action2.row += 1;
        action2.column += 0.16;

        action3 = actionShow1[2];
        action3.row += 0.16;
        action3.column -= 1;

        action4 = actionShow1[3];
        action4.row += 0.16;
        action4.column += 1;
      }
      store.commit("setMapState", 0);
    }, 50);
  }
}

var animateHelper = {
  // 展示攻击动画
  showAttachAnim(anim, { armyIndex, unitIndex }, callback) {

    const shake = 0.05;

    let animates = {};
    let animList = [];
    for (const animImg of anim.animList) {
      animList.push(imgUrl + "temp/" + animImg);
    }
    animates.animList = animList;
    animates.row = anim.row;
    animates.column = anim.column;

    let functions = [];

    let game = store.getters.game;
    let currUnit = game.army_list[armyIndex].units[unitIndex];

    functions.push(() => {
      currUnit.row = currUnit.row - shake;
      currUnit.column = currUnit.column - shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row + shake;
      currUnit.column = currUnit.column + shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row + shake;
      currUnit.column = currUnit.column + shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row - shake;
      currUnit.column = currUnit.column - shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row + shake;
      currUnit.column = currUnit.column - shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row - shake;
      currUnit.column = currUnit.column + shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row - shake;
      currUnit.column = currUnit.column + shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row + shake;
      currUnit.column = currUnit.column - shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row + shake;
      currUnit.column = currUnit.column - shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row - shake;
      currUnit.column = currUnit.column + shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row - shake;
      currUnit.column = currUnit.column - shake;
    });
    functions.push(() => {
      currUnit.row = currUnit.row + shake;
      currUnit.column = currUnit.column + shake;
      // 到这里执行完成
      if (callback) {
        setTimeout(() => {
          commendDispatcher.dispatch(callback.call(), callback);
        }, 200);
      }
    });

    animates.callback = functions;

    store.dispatch("showAnimates", [animates]);

  }
}

// 有序命令执行的问题
function Callback(commandList, index = 0) {

  this.commandList = commandList;

  this.index = index;
}

Callback.prototype.call = function () {
  if (this.commandList instanceof Array && this.index < this.commandList.length) {
    return this.commandList[this.index++];
  } else {
    return undefined;
  }
};

var commendDispatcher = {
  // 对后端发送命令的分发
  dispatch(gameCommend, callback) {

    if (gameCommend === undefined) {
      return;
    }

    if (gameCommend === null) {
      if (callback) {
        this.dispatch(callback.call(), callback);
      }
      return;
    }

    let gameCommendEnum = gameCommend.gameCommendEnum;
    let aimSite = gameCommend.aimSite;
    let unitIndex = gameCommend.unitIndex;
    let extMes = gameCommend.extMes;

    switch (gameCommendEnum) {
      case commendType.CHANGE_CURR_UNIT:
        console.log("执行改变当前单位");
        store.getters.game.curr_unit = extMes.unitInfo;
        break;
      case commendType.CHANGE_CURR_REGION:
        console.log("执行改变当前地形");
        store.getters.game.curr_region = extMes.regionInfo;
        break;
      case commendType.CHANGE_CURR_POINT:
        console.log("执行改变当前指针");
        store.getters.game.curr_point = aimSite;
        break;
      case commendType.CHANGE_CURR_BG_COLOR:
        console.log("执行改变当前背景颜色");
        store.getters.game.bg_color = extMes.bgColor;
        break;
      case commendType.SHOW_MOVE_AREA:
        console.log("展示移动区域");
        store.commit("setMoveArea", extMes.moveArea);
        store.commit("setMoveLine", []);
        break;
      case commendType.DIS_SHOW_MOVE_AREA:
        console.log("不展示移动区域");
        store.commit("setMoveArea", []);
        store.commit("setMoveLine", []);
        break;
      case commendType.SHOW_MOVE_LINE:
        console.log("展示移动路线");
        store.commit("setMoveLine", extMes.moveLine);
        break;
      case commendType.MOVE_ATTACH_POINT:
        console.log("移动攻击指针");
        break;
      case commendType.MOVE_UNIT:
        console.log("单位移动", unitIndex);
        moveHelper.move(unitIndex, extMes.moveLine, () => {
          console.log("移动完毕 展示行动", extMes.actions);
          actionHelper.setActionShow(extMes.actions);
        });
        break;
      case commendType.ROLLBACK_MOVE:
        console.log("回退攻击");
        store.commit("setMoveLength", 0);
        store.commit("setAction", []);
        let game = store.getters.game;
        let currUnit = game.army_list[game.curr_army_index].units[unitIndex];
        currUnit.row = aimSite.row;
        currUnit.column = aimSite.column;
        break;
      case commendType.SHOW_ATTACH_AREA:
        console.log("展示攻击区域", extMes.attachArea);
        store.commit("setAction", []);
        store.commit("setAttachArea", extMes.attachArea);
        break;
      case commendType.SHOW_ACTION:
        // 展示行动
        store.commit("setAttachArea", []);
        store.commit("setAttachPoint", {});
        actionHelper.setActionShow(extMes.actions);
        break;
      case commendType.SHOW_ATTACH_POINT:
        console.log("展示攻击的点");
        store.commit("setAttachPoint", aimSite);
        break;
      case commendType.DIS_SHOW_ATTACH_AREA:
        store.commit("setAttachArea", []);
        store.commit("setAttachPoint", {});
        break;
      case commendType.CHANGE_UNIT_STATUS:
        game = store.getters.game;
        currUnit = game.army_list[extMes.unitStatus.armyIndex].units[extMes.unitStatus.unitIndex];;
        let cShowUnit = store.getters.cUnit;
        let upCurr = currUnit.id == cShowUnit.id;
        for (let key in extMes.unitStatus) {
          if (currUnit.hasOwnProperty(key)) {
            currUnit[key] = extMes.unitStatus[key];
            if (upCurr) {
              cShowUnit[key] = extMes.unitStatus[key];
            }
          }
        }
        break;
      // --------------------单位攻击事件----------------------
      case commendType.RUSH_UNIT:
        // 展示单位突袭
        game = store.getters.game;
        currUnit = game.army_list[extMes.armyUnitIndex.armyIndex].units[extMes.armyUnitIndex.unitIndex];;
        let row = currUnit.row;
        let column = currUnit.column;
        store.commit("setMoveLength", 0.1);
        currUnit.row = extMes.site.row;
        currUnit.column = extMes.site.column;
        setTimeout(() => {
          currUnit.row = row;
          currUnit.column = column;
          store.commit("setMoveLength", 1);
          if (callback) {
            this.dispatch(callback.call(), callback);
          }
        }, 80);
        break;
      case commendType.LEFT_CHANGE:
        // 掉血
        store.commit("setLeftChange", extMes.leftChange);
        if (callback) {
          this.dispatch(callback.call(), callback);
        }
        break;
      case commendType.SHOW_ATTACH_ANIM:
        // 展示攻击动画
        animateHelper.showAttachAnim(extMes.anim, extMes.armyUnitIndex, callback);
        break;
    }
  },

  // 对后端发送命令的分发
  dispatchOrder(commandList) {
    this.dispatch(null, new Callback(commandList));
  },
}

export default commendDispatcher;