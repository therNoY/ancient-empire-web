
import store from "../store";
import commendType from "./commandType"
import eventype from "./eventType"
import appHelper from "../utils/appHelper"
import { imgUrl } from "../api/env"
/**
 * 移动
 */
var moveHelper = {

  /**
   * 移动单位
   */
  move(armyIndex = game.curr_army_index, index, moveLine, moveFinsh) {
    store.commit("setMapState", 1);
    let game = store.getters.game;
    let currUnit = game.army_list[armyIndex].units[index];
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
            store.commit("setMapState", 0);
            moveFinsh();
          }, moveLine[i].length * 250)
        }
      }, sumTime + "");
      sumTime += moveLine[i].length * 250;
    }
  },

}
/**
 * 行动
 */
var actionHelper = {
  /**
   * 设置图标展示
   */
  setActionShow(site, actions, showOk) {
    let actionShow1 = [];
    let currPoint = site;
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
        action1.row -= 1;
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
      showOk();
    }, 50);
  }
}
/**
 * 动画
 */
var animateHelper = {

  // 空的function
  emptyFunction: function (f) {
    if (f instanceof Function) {
      f();
    }
  },

  // 展示攻击动画
  showAttachAnim(anim, { army_index, unit_index }, callback) {
    // 设置每个帧动画结束的回调 让单位移动
    const shake = 0.02;
    let functions = [];
    let game = store.getters.game;
    let currUnit = game.army_list[army_index].units[unit_index];
    for (let i = 0; i < anim.anim_list.length / 2; i++) {
      let rowOper = Math.round(Math.random());
      let columnOper = Math.round(Math.random());
      functions.push(() => {
        if (rowOper == 0) {
          currUnit.row = currUnit.row - shake;
        } else {
          currUnit.row = currUnit.row + shake;
        }
        if (columnOper == 0) {
          currUnit.column = currUnit.column - shake;
        } else {
          currUnit.column = currUnit.column + shake;
        }
      });
      functions.push(() => {
        if (rowOper == 1) {
          currUnit.row = currUnit.row - shake;
        } else {
          currUnit.row = currUnit.row + shake;
        }
        if (columnOper == 1) {
          currUnit.column = currUnit.column - shake;
        } else {
          currUnit.column = currUnit.column + shake;
        }
      });
    }
    this.showAnim(anim, functions, callback, 200);
  },

  /**
   * 基础展示动画
   * @param {*} anim 动画信息
   * @param {*} frameCallBack 给个帧动画完成的回调类
   * @param {*} callback 整个动画完成的回调
   * @param {*} timer 结果是否需要定时回调
   */
  showAnim(anim, frameCallBack, callback, timer) {
    let animates = {};
    let anim_list = [];
    for (const animObj of anim.anim_list) {
      if (animObj instanceof String) {
        // 固定动画
        anim_list.push(imgUrl + "template/" + animObj);
      } else {
        // 可移动动画
        anim_list.push({animImg:imgUrl + "template/" + animObj.anim_img, row:animObj.row, column:animObj.column});
      }
      
    }
    // 设置回调函数
    let callBackFunction = [];
    for (let i = 0; i < anim_list.length; i++) {
      if (i < anim_list.length - 1) {
        // 前面的回调不调用最终回调函数
        if (frameCallBack instanceof Array && frameCallBack[i] instanceof Function) {
          callBackFunction.push(() => {
            frameCallBack[i]();
          });
        } else {
          callBackFunction.push(null);
        }
      } else {
        // 最后一帧播放完毕需要设置播放完毕回调
        if (frameCallBack instanceof Array && frameCallBack[i] instanceof Function) {
          callBackFunction.push(() => {
            frameCallBack[i]();
            // 设置结果回调
            if (callback) {
              if (typeof timer == 'number') {
                setTimeout(() => {
                  commendDispatcher.dispatch(callback.next(), callback);
                }, timer);
              } else {
                commendDispatcher.dispatch(callback.next(), callback);
              }
            }
          });
        } else {
          callBackFunction.push(() => {
            console.log(callback);
            if (callback) {
              if (typeof timer == 'number') {
                setTimeout(() => {
                  commendDispatcher.dispatch(callback.next(), callback);
                }, timer);
              } else {
                commendDispatcher.dispatch(callback.next(), callback);
              }
            }
          });
        }
      }
    }
    animates.anim_list = anim_list;
    animates.row = anim.row;
    animates.column = anim.column;
    animates.frame = anim.frame;
    animates.callback = callBackFunction;
    // 执行动画
    console.log(animates);
    store.dispatch("showAnimates", [animates]);
  }
}

// 有序命令执行的问题
function Callback(commandList, index = 0) {

  this.commandList = commandList;

  this.index = index;
}

Callback.prototype.next = function () {
  if (this.commandList instanceof Array && this.index < this.commandList.length) {
    return this.commandList[this.index++];
  } else {
    // 返回undefined 说明有序命令执行结束
    console.log("有序命令执行结束");
    return undefined;
  }
};

var commendDispatcher = {
  /**
   * 对后端发送命令的分发
   * @param {*} gameCommend 命令
   * @param {*} callback 命令执行完毕回调
   * @returns 
   */
  dispatch(gameCommend, callback) {

    if (gameCommend === undefined) {
      // 有序命令执行结束
      appHelper.sendEvent(eventype.COMMEND_EXEC_OVER);
      return;
    }

    if (gameCommend === null) {
      // 如果有回调也要执行回调
      if (callback) {
        this.dispatch(callback.next(), callback);
      }
      return;
    }

    if (gameCommend.delay) {
      setTimeout(() => {
        this.handleCommend(gameCommend, callback);
      }, gameCommend.delay);
    } else {
      this.handleCommend(gameCommend, callback);
    }
    
  },

  handleCommend({ game_commend_enum, aim_site, unit_index, ext_mes }, callback) {
    switch (game_commend_enum) {
      // ---------------------基础信息改变事件------------------------
      case commendType.CHANGE_CURR_UNIT:
        console.log("执行改变当前单位");
        store.getters.game.curr_unit = ext_mes.unit_info;
        break;
      case commendType.CHANGE_CURR_REGION:
        console.log("执行改变当前地形");
        store.getters.game.curr_region = ext_mes.region_info;
        break;
      case commendType.CHANGE_CURR_POINT:
        console.log("执行改变当前指针");
        store.getters.game.curr_point = aim_site;
        break;
      case commendType.CHANGE_CURR_BG_COLOR:
        console.log("执行改变当前背景颜色");
        store.getters.game.bg_color = ext_mes.bg_color;
        break;
      case commendType.CHANG_REGION:
        store.commit("changeRegion", ext_mes);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.CHANGE_UNIT_STATUS:
        game = store.getters.game;
        // 按照数组处理
        if (!(ext_mes.unit_status instanceof Array)) {
          ext_mes.unit_status = [ext_mes.unit_status];
        }
        for (let i = 0; i < ext_mes.unit_status.length; i++) {
          const unit_statue = ext_mes.unit_status[i];
          if (unit_statue['life']) {
            unit_statue['life'] = unit_statue['life_num']
          }
          currUnit = game.army_list[unit_statue.army_index].units[unit_statue.unit_index];;
          let cShowUnit = store.getters.cUnit;
          let upCurr = cShowUnit ? currUnit.id == cShowUnit.id : false;
          for (let key in unit_statue) {
            if (currUnit.hasOwnProperty(key)) {
              currUnit[key] = unit_statue[key];
              if (upCurr) {
                cShowUnit[key] = unit_statue[key];
              }
            }
          }
        }
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.CHANGE_ARMY_INFO:
        game = store.getters.game;
        const army_statue = ext_mes.army_info;
        let currArmy = game.army_list[game.curr_army_index];
        game.curr_player = currArmy.player;
        for (let key in army_statue) {
          if (currArmy.hasOwnProperty(key)) {
            currArmy[key] = army_statue[key];
          }
        }
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.CHANGE_RECORD_INFO:
        game = store.getters.game;
        const record_info = ext_mes.record_info;
        for (let key in record_info) {
          if (game.hasOwnProperty(key)) {
            game[key] = record_info[key];
          }
        }
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      // -------------------单位移动系统--------------------------
      case commendType.SHOW_MOVE_AREA:
        console.log("展示移动区域");
        store.commit("setMoveArea", ext_mes.move_area);
        store.commit("setMoveLine", []);
        break;
      case commendType.DIS_SHOW_MOVE_AREA:
        console.log("不展示移动区域");
        store.commit("setMoveArea", []);
        store.commit("setMoveLine", []);
        break;
      case commendType.SHOW_MOVE_LINE:
        console.log("展示移动路线");
        store.commit("setMoveLine", ext_mes.move_line);
        break;
      case commendType.MOVE_ATTACH_POINT:
        console.log("移动攻击指针");
        break;
      case commendType.MOVE_UNIT:
        console.log("单位移动", unit_index);
        moveHelper.move(ext_mes.army_index, unit_index, ext_mes.move_line, () => {
          console.log("移动完毕 展示行动", ext_mes.actions);
          actionHelper.setActionShow(ext_mes.site, ext_mes.actions, ()=>{
            if (callback) {
              this.dispatch(callback.next(), callback);
            }
          });
          
        });
        break;
      case commendType.ROLLBACK_MOVE:
        console.log("回退攻击");
        store.commit("setMoveLength", 0);
        let game = store.getters.game;
        let currUnit = game.army_list[game.curr_army_index].units[unit_index];
        currUnit.row = aim_site.row;
        currUnit.column = aim_site.column;
        break;
      // ---------------------单位行动--------------------------------
      case commendType.SHOW_ATTACH_AREA:
        console.log("展示攻击区域", ext_mes.attach_area);
        store.commit("setAttachArea", ext_mes.attach_area);
        break;
      case commendType.SHOW_ACTION:
        // 展示行动
        store.commit("setAttachArea", []);
        store.commit("setAttachPoint", {});
        actionHelper.setActionShow(ext_mes.site, ext_mes.actions, ()=>{
          if (callback) {
            this.dispatch(callback.next(), callback);
          }
        });
        break;
      case commendType.DIS_SHOW_ACTION:
        store.commit("setAction", []);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.SHOW_ATTACH_POINT:
        console.log("展示攻击的点");
        store.commit("setAttachPoint", aim_site);
        break;
      case commendType.DIS_SHOW_ATTACH_AREA:
        store.commit("setAttachArea", []);
        store.commit("setAttachPoint", {});
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      // --------------------单位攻击系列事件----------------------
      case commendType.RUSH_UNIT:
        // 展示单位突袭
        game = store.getters.game;
        currUnit = game.army_list[ext_mes.army_unit_index.army_index].units[ext_mes.army_unit_index.unit_index];
        let row = currUnit.row;
        let column = currUnit.column;
        store.commit("setMoveLength", 0.4);
        currUnit.row = ext_mes.site.row;
        currUnit.column = ext_mes.site.column;
        setTimeout(() => {
          currUnit.row = row;
          currUnit.column = column;
          store.commit("setMoveLength", 0);
          if (callback) {
            this.dispatch(callback.next(), callback);
          }
        }, 80);
        break;
      case commendType.LEFT_CHANGE:
        // 掉血
        store.commit("setLeftChange", ext_mes.left_change);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.SHOW_ATTACH_ANIM:
        // 展示攻击动画
        animateHelper.showAttachAnim(ext_mes.anim, ext_mes.army_unit_index, callback);
        break;
      case commendType.REMOVE_UNIT:
        store.commit("setMoveLength", 0);
        game = store.getters.game;
        let army = game.army_list[ext_mes.army_unit_index.army_index];
        army.units.splice(ext_mes.army_unit_index.unit_index, 1);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.SHOW_UNIT_DEAD:
        animateHelper.showAnim(ext_mes.anim, null, callback, 200);
        break;
      case commendType.ADD_TOMB:
        game = store.getters.game;
        game.tomb_list.push(aim_site);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      // ---------------------召唤单位系列事件-------------------------
      case commendType.SHOW_SUMMON_ANIM:
        animateHelper.showAnim(ext_mes.anim, null, callback, 200);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.REMOVE_TOMB:
        let remvoeTomb = aim_site;
        store.commit("removeTomb", remvoeTomb);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.ADD_UNIT:
        store.commit("addUnit", ext_mes);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.SHOW_BUY_UNIT:
        store.commit("setBuyUnitDialog", true);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      //---------------------其他-------------------------
      case commendType.SHOW_GAME_NEWS:
        store.commit("addGameMessage", ext_mes.message);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
      case commendType.SHOW_LEVEL_UP:
        debugger
        store.commit("setLevelUpInfo", ext_mes.level_up_info);
        store.commit("setLevelUpSite", ext_mes.site);
        setTimeout(() => {
          ext_mes.site.row = ext_mes.site.row - 0.5;
          store.commit("setLevelUpSite", ext_mes.site);
          setTimeout(() => {
            store.commit("setLevelUpInfo", null);
            store.commit("setLevelUpSite", null);
          }, 500);
        }, 200);
        if (callback) {
          this.dispatch(callback.next(), callback);
        }
        break;
    }
  },

  // 对后端发送命令的分发
  dispatchOrder(commandList) {
    let callBackCommand = new Callback(commandList);
    console.log("准备执行顺序命令", callBackCommand);
    this.dispatch(null, callBackCommand);
  },
}

export default commendDispatcher;