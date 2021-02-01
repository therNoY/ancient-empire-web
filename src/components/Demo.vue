<template>
  <div>
    <el-button @click="timer">休息</el-button>
    <el-button @click="openSocket">连接</el-button>
    <el-input size="mini" v-model="sendText"></el-input>
    <el-button @click="sendMessage">发送</el-button>
    <!--整个地图-->
    <div class="map">
      <!--可移动区域-->
      <div v-if="showMoveArea" class="move_area" v-for="moveArea in moveAreas">
        <img
          src="../assets/images/assist/alpha.png"
          @mouseover="showAimArea(moveArea.row, moveArea.column)"
          :style="{top: position(1, moveArea.row), left: position(2, moveArea.column)}"
        />
      </div>
      <!--攻击范围区域-->
      <div v-if="showAttachArea" class="attach_area" v-for="attachArea in attachAreas">
        <img
          src="../assets/images/assist/alpha.png"
          @mouseover="showAimArea(attachArea.row, attachArea.column)"
          :style="{top: position(1, attachArea.row), left: position(1, attachArea.column)}"
        />
      </div>
      <!--移动路线-->
      <div class="movePath" v-for="(pathPoint,index) in pathPoints">
        <div
          v-if="index < pathPoints.length - 1"
          :style="{top: movePathTop(pathPoint, pathPoints[index+1]), left: movePathLeft(pathPoint, pathPoints[index+1]) ,width: movePathWidth(pathPoint, pathPoints[index+1]), height: movePathHeight(pathPoint, pathPoints[index+1])}"
        ></div>
      </div>
      <!--指针框 -->
      <div class="cursor_normal">
        <img
          src="../assets/images/assist/cursor_00.png"
          :style="{top: position(1, currentPoint.row), left: position(1, currentPoint.column)}"
          v-if="singo"
        />
        <img
          :style="{top: position(1, currentPoint.row), left: position(1, currentPoint.column)}"
          src="../assets/images/assist/cursor_01.png"
          v-else
        />
      </div>
      <!--目的地指针 只在移动区域显示的时候才会显示-->
      <div class="aimPoint" @click="goAimPoint">
        <img
          v-show="showMoveArea"
          src="../assets/images/assist/cursor_target.png"
          :style="{top: position(1, currentPoint.row), left: position(1, currentPoint.column)}"
        />
      </div>
      <!--单位消失的烟-->
      <div class="dust">
        <!--冒烟特效-->
        <!--被攻击者冒烟-->
        <img
          v-if="beAttachDustNum > 0 && beAttachDustNum < 5"
          :src="dustImg(beAttachDustNum)"
          :style="{top: position(1, beAttachUnit.row), left: position(1, beAttachUnit.column)}"
        />
        <!--攻击者冒烟-->
        <img
          v-if="attachDustNum > 0 && attachDustNum < 5"
          :src="dustImg(attachDustNum)"
          :style="{top: position(1, currentPoint.row), left: position(1, currentPoint.column)}"
        />
      </div>
      <!--坟墓-->
      <div class="tomb">
        <img
          v-for="tomb in tombs"
          src="../assets/images/unit/tomb.png"
          :style="{top: position(1, tomb.row), left: position(1, tomb.column)}"
        />
      </div>
      <!--所有军队-->
      <div class="armys" v-for="(army, armyIndex) in armys">
        <!--每个单位-->
        <div v-for="(unit, index) in army.units" :key="index" v-if="!unit.isDead">
          <div
            @click="operationUnit(armyIndex, index)"
            @mousemove="showAimArea(unit.row, unit.column)"
          >
            <img
              v-if="unit.isDone"
              :src="isDoneImg(unit.type)"
              :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (moveLength*0.25) + 's'}"
            />
            <div v-else>
              <img
                v-if="singo"
                :src="img(army.color, unit.type)"
                :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (moveLength*0.25) + 's'}"
              />
              <img
                v-else
                :src="img(army.color, unit.type, '2')"
                :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (moveLength*0.25) + 's'}"
              />
            </div>
          </div>
          <!--单位的状态 血量 等级 buff-->
          <div class="unit_status">
            <!--血量-->
            <div
              v-if="isNot100(unit.life_num)"
              class="lifeNum"
              :style="{top: lifeNumTop(unit), left: lifeNumLeft(unit), transitionDuration: (moveLength*0.25) + 's'}"
            >
              <img v-for="lifeNum in unit.life_num" :src="liftImg(lifeNum)" />
            </div>
            <!--等级-->
            <div
              v-if="unit.level > 0"
              class="unit_level"
              :style="{top: levelTop(unit.row), left: levelLeft(unit.column), transitionDuration: (moveLength*0.25) + 's'}"
            >
              <img :src="levelImg(unit.level)" />
            </div>
            <!--状态-->
          </div>
        </div>
      </div>
      <!--升级-->
      <div class="level_up" v-if="leveupUnit != null">
        <img
          src="../assets/images/assist/levelup.png"
          :style="{top: leveupTop(leveupUnit.row), left: leveupLeft(leveupUnit.column)}"
        />
      </div>
      <!--展示单位可以进行行动 攻击 召唤 购买 修复-->
      <div class="actionLogo" v-show="moveDone && showAction" v-for="action in unitActions">
        <img
          :src="actionImg(action.name)"
          @click="doAction(action.name)"
          :style="{top: position(1, action.row), left: position(1, action.column)}"
        />
      </div>
      <!--显示攻击瞄准的图-->
      <div class="attackPoint" v-if="showAttachPoint" @click="unitAttach">
        <img
          src="../assets/images/assist/cursor_03.png"
          :style="{top: attachTop(beAttachUnit.row), left: attachLeft(beAttachUnit.column)}"
          v-if="singo"
        />
        <img
          :style="{top: attachTop(beAttachUnit.row), left: attachLeft(beAttachUnit.column)}"
          src="../assets/images/assist/cursor_04.png"
          v-else
        />
      </div>
      <!--攻击特效-->
      <div class="spark_attack" v-if="attachSpark > 0 && attachSpark < 7">
        <img
          :src="attachSparkImg(this.attachSpark)"
          :style="{top: position(1, beAttachUnitBak.row), left: position(1, beAttachUnitBak.column)}"
        />
        <div
          class="attach_num"
          :style="{top: attachNumTop(beAttachUnitBak.row), left: position(1, beAttachUnitBak.column)}"
        >
          <img v-for="attachNum in attachResult.attach" :src="lifeCImg(attachNum)" />
        </div>
      </div>
      <!--反击特效-->
      <div class="spark_attack" v-if="selfAttachSpark > 0 && selfAttachSpark < 7">
        <img
          :src="attachSparkImg(this.selfAttachSpark)"
          :style="{top: position(1, beAttachUnitBak.row), left: position(1, beAttachUnitBak.column)}"
        />
        <div
          class="attach_num"
          :style="{top: attachNumTop(beAttachUnitBak.row), left: position(1, beAttachUnitBak.column)}"
        >
          <img v-for="attachNum in attachResult.selfAttach" :src="lifeCImg(attachNum)" />
        </div>
      </div>

      <!--地图的背景-->
      <div>
        <img
          class="region"
          v-for="(item, index) in 100"
          :key="index"
          src="../assets/images/Region/grove.png"
          @click="getRegionMes(index)"
        />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      sendText:"",
      movePointIndex: 0, // 单位移动的辅助值 用于表示当前移动到第几个点了
      willMove: false, // 表示单位是否准备移动
      moveDone: false, // 表示当前单位是否移动完成
      showMoveArea: false, // 展示单位可移动区域
      showAttachArea: false,
      showAttachPoint: false,
      showAction: false,
      worker: null, // H5的后台任务 单独线程
      singo: true, // 控制单位一闪一闪
      currentArmyIndex: 0, // 当前单位的军队index
      currentUnitIndex: 0, // 当前单位的Index
      currentUnit: { id: 0 }, // 表示当前的单位
      beAttachArmyIndex: 0, // 当前单位的军队index
      beAttachUnitIndex: 0, // 当前单位的Index
      beAttachUnit: {}, // 表示当前准备被攻击的单位
      beAttachUnitBak: {}, // 用于记录当前的被攻击的位置
      deadUnit: {}, // 上个死亡的单位
      moveLength: -1, // 将要移动的距离
      attachTimer: null, // 切换攻击火花的定时器
      beAttachDeadTimer: null, // 被攻击单位死亡冒烟的定时器
      attachDeadTimer: null, // 攻击单位被反击死亡冒烟的定时器
      attachSpark: 0, // 攻击火花
      selfAttachSpark: 0, // 反击火花
      beAttachDustNum: 0, // 死亡冒烟
      attachDustNum: 0, // 死亡冒烟
      leveupUnit: null, // 升级的
      tombs: [],
      unitActions: [
        {
          name: "attack",
          row: 4,
          column: 7
        },
        {
          name: "end",
          row: 4,
          column: 7
        }
      ],
      /**
       * 单位要移动的节点位置 通过后台计算返回 第一个点表示当前位置
       * 第二个表示下一个要去的位置 row表示行colum表示列 length表示下个距离
       */
      pathPoints: [
        { row: 6, column: 5, length: 2 },
        { row: 6, column: 7, length: 2 },
        { row: 4, column: 7, length: 0 }
        // { row: 1, column: 1, length: 0  },
      ],
      moveAreas: [
        { row: 5, column: 6 },
        { row: 6, column: 6 },
        { row: 6, column: 5 },
        { row: 6, column: 7 },
        { row: 7, column: 6 },
        { row: 4, column: 6 },
        { row: 5, column: 5 },
        { row: 5, column: 7 },
        { row: 4, column: 6 },
        { row: 4, column: 7 },
        { row: 6, column: 4 }
      ], // 单位可以移动的区域 后台计算后返回
      attachAreas: [
        { row: 3, column: 7 },
        { row: 4, column: 7 },
        { row: 4, column: 6 },
        { row: 4, column: 8 },
        { row: 5, column: 7 }
      ],
      currentPoint: {
        row: 1,
        column: 1
      }, // 当前显示框的位置
      map: {
        width: 10,
        height: 10,
        regions: [[]]
      },
      armys: [
        {
          id: "",
          color: "blue",
          money: null,
          units: [
            {
              id: 1,
              type: "soldier",
              life: [1, 0, 0],
              row: 2,
              column: 2,
              isDead: false,
              level: 0,
              isDone: true
            },
            {
              id: 2,
              type: "soldier",
              life: [9, 0],
              row: 2,
              column: 4,
              isDead: false,
              level: 2,
              isDone: false
            },
            {
              id: 3,
              type: "wolf",
              life: [7, 0],
              row: 6,
              column: 5,
              isDead: false,
              level: 2,
              isDone: false
            }
          ]
        },
        {
          color: "red",
          money: null,
          units: [
            {
              id: 4,
              type: "soldier",
              life: [1, 0, 0],
              row: 4,
              column: 8,
              isDead: false,
              level: 3,
              isDone: false
            },
            {
              id: 5,
              type: "soldier",
              life: [1, 0, 0],
              row: 3,
              column: 7,
              isDead: false,
              level: 4,
              isDone: false
            }
          ]
        }
      ],
      // 攻击事件的传递的数据
      attachResult: {
        attach: [-1, 2, 0], // 伤害
        isDead: false, // 被攻击者是否死
        lastLife: [8, 0], // 被攻击者剩余血量
        isHaveTomb: true, //死了是否有坟墓
        isLeaveUp: true, // 是否升级
        endStatus: {}, // 事件结束后 的状态

        isSelfAttach: true, //是否被反击

        selfAttach: [-1, 1, 0], // 被反击的伤害
        selfIsDead: false, // 是否被反击死
        selfLastLife: [6, 0], // 剩余血量
        selfIsHaveTomb: true, // 自己死了是否有坟墓
        selfIsLeaveUp: false, // 是否升级
        selfEndStatus: {} // 事件结束后 自己的状态
      }
    };
  },
  methods: {
    sendMessage(){
      this.$store.dispatch("sendEvent", this.sendText)
    },
    openSocket(){
      this.$store.dispatch("connectGameSocket", this.sendText);
      this.clearText();
    },
    clearText(){
      this.sendText = null;
    },
    // 单位的移动
    goAimPoint() {
      this.willMove = true;
      // 1.移动之前计算将要移动的移动距离, 点击就开始移动
      this.moveUnit();
      // 如果只移动一段距离 就不需要
      if (this.pathPoints.length > 1) {
        let sumTime = 0; // 用于记录定时器需要延迟的时间 越往后越慢
        for (let i = 0; i < this.pathPoints.length - 2; i++) {
          // 这里减去2 最后一个移动点不需要计算
          // 循环出下一段 然后计算出 需要定时的时间
          sumTime = sumTime + this.pathPoints[i].length * 250;
          setTimeout(this.moveUnit, sumTime + "");
        }
      }
    },
    // 使单位移动一段距离的方法
    moveUnit() {
      // 先计算出移动距离
      this.getMoveLength();
      let i = this.movePointIndex + 1;
      //  移动的核心逻辑 使当前移动的单位改变位置
      this.currentUnit.row = this.pathPoints[i].row;
      this.currentUnit.column = this.pathPoints[i].column;
      this.movePointIndex++;

      // 判断如果是倒数第二段 就设置一个和倒数第一段相同的计时器 用来处理移动结束的逻辑
      if (this.movePointIndex + 1 == this.pathPoints.length) {
        let time = this.pathPoints[this.pathPoints.length - 2].length * 250;
        setTimeout(this.moveFinish, time + "");
      }
    },
    // 单位到达要移动的地方 判断单位能进行的action
    moveFinish() {
      // 单位移动完毕
      this.showMoveArea = false;
      this.willMove = false;
      this.moveDone = true;
      this.showAction = true;
      setTimeout(this.showAtcionLogo, 50);
    },
    // 异步执行动画显示行为logo
    showAtcionLogo() {
      this.unitActions = [
        {
          name: "attack",
          row: 2.7,
          column: 7
        },
        {
          name: "end",
          row: 5.3,
          column: 7
        },{
          name: "end",
          row: 5.3,
          column: 7
        }
      ];
    },
    // 展示单位将要进行的行动
    doAction(name) {
      if (name == "attack") {
        // 攻击
        this.showAction = false;
        this.showAttachArea = true;
      } else if (name == "end") {
        // 结束
      } else {
        alert(1);
      }
    },
    // 单位攻击
    unitAttach() {
      // 获取攻击事件的结果
      // attachEvent1.隐藏攻击指针
      this.showAttachPoint = false;
      const eventResult = this.attachResult;
      console.log(eventResult);
      console.log(this.beAttachUnit);
      // attachEvent1.展示攻击特效 被攻击者扣除血量
      this.beAttachUnitBak = JSON.parse(JSON.stringify(this.beAttachUnit));
      console.log("被攻击特效开始");
      this.attachTimer = setInterval(this.changeBeAttachSpark, 50);
    },
    // 切换单位被攻击时的动画
    changeBeAttachSpark() {
      if (this.attachSpark == 0) {
        this.beAttachUnit.row = this.beAttachUnit.row - 0.5;
        this.attachSpark++;
      } else if (this.attachSpark == 1) {
        this.beAttachUnit.row = this.beAttachUnit.row + 0.5;
        this.attachSpark++;
      } else if (this.attachSpark == 2) {
        this.beAttachUnit.row = this.beAttachUnit.row + 0.5;
        this.attachSpark++;
      } else if (this.attachSpark == 3) {
        this.beAttachUnit.row = this.beAttachUnit.row - 0.5;
        this.attachSpark++;
      } else if (this.attachSpark == 4) {
        this.beAttachUnit.column = this.beAttachUnit.column - 0.5;
        this.attachSpark++;
      } else if (this.attachSpark == 5) {
        this.beAttachUnit.column = this.beAttachUnit.column + 0.5;
        this.attachSpark++;
      } else if (this.attachSpark == 6) {
        this.beAttachUnit.column = this.beAttachUnit.column + 0.5;
        this.attachSpark++;
      } else if (this.attachSpark == 7) {
        this.beAttachUnit.column = this.beAttachUnit.column - 0.5;
        this.attachSpark = 0;
        clearInterval(this.attachTimer);
        // attachEvent3. 如果有被反击展示反击特效 否则直接处理结果
        if (this.attachResult.isSelfAttach) {
          this.beAttachUnitBak = JSON.parse(JSON.stringify(this.currentUnit));
          this.attachTimer = null;
          console.log("被攻击特效开始");
          this.attachTimer = setInterval(this.changeSelftAttachSpark, 50);
        } else {
          this.handleAttachResult();
        }
      }
    },
    // 切换单位被反击时的动画
    changeSelftAttachSpark() {
      if (this.selfAttachSpark == 0) {
        this.currentUnit.row = this.currentUnit.row - 0.5;
        this.selfAttachSpark++;
      } else if (this.selfAttachSpark == 1) {
        this.currentUnit.row = this.currentUnit.row + 0.5;
        this.selfAttachSpark++;
      } else if (this.selfAttachSpark == 2) {
        this.currentUnit.row = this.currentUnit.row + 0.5;
        this.selfAttachSpark++;
      } else if (this.selfAttachSpark == 3) {
        this.currentUnit.row = this.currentUnit.row - 0.5;
        this.selfAttachSpark++;
      } else if (this.selfAttachSpark == 4) {
        this.currentUnit.column = this.currentUnit.column - 0.5;
        this.selfAttachSpark++;
      } else if (this.selfAttachSpark == 5) {
        this.currentUnit.column = this.currentUnit.column + 0.5;
        this.selfAttachSpark++;
      } else if (this.selfAttachSpark == 6) {
        this.currentUnit.column = this.currentUnit.column + 0.5;
        this.selfAttachSpark++;
      } else if (this.selfAttachSpark == 7) {
        this.currentUnit.column = this.currentUnit.column - 0.5;
        this.selfAttachSpark = 0;
        clearInterval(this.attachTimer);
        // attachEvent4 处理攻击后的结果
        this.handleAttachResult();
      } else {
        this.selfAttachSpark++;
      }
    },
    // 处理攻击后的结果
    handleAttachResult() {
      let beAttachArmy = this.armys[this.beAttachArmyIndex];
      console.log(this.attachResult);
      // attachEvent4.1 判断被攻击的单位的状态
      if (this.attachResult.isDead) {
        // 去掉死掉的单位
        console.log(this.beAttachUnitIndex);
        //  this.armys[this.beAttachArmyIndex].units.splice(this.beAttachUnitIndex, 1);
        beAttachArmy.units[this.beAttachUnitIndex].isDead = true;
        console.log(this.armys);
        // 将单位转换成坟墓
        this.deadUnit = this.beAttachUnit;
        this.beAttachDeadTimer = setInterval(this.beAttachDead, 100);
      } else {
        // 改变单位的剩余的血量
        beAttachArmy.units[
          this.beAttachUnitIndex
        ].life = this.attachResult.lastLife;
      }
      // attachEvent4.2 判断攻击单位的状态
      if (this.attachResult.isSelfAttach) {
        // 只有当有反击发生的时候才有的逻辑
        let attachArmy = this.armys[this.currentArmyIndex];
        if (this.attachResult.selfIsDead) {
          // 去掉死掉的单位
          //  this.armys[this.beAttachArmyIndex].units.splice(this.beAttachUnitIndex, 1);
          attachArmy.units[this.currentUnitIndex].isDead = true;
          console.log(this.armys);
          // 将单位转换成坟墓
          this.deadUnit = this.currentUnit;
          this.attachTimer = setInterval(this.attachDead, 100);
        } else {
          // 改变单位的剩余的血量
          attachArmy.units[
            this.currentUnitIndex
          ].life = this.attachResult.selfLastLife;
        }
      }
      // attachEvent4.3 判断是否升级
      if (this.attachResult.selfIsLeaveUp) {
        this.leveupUnit = JSON.parse(JSON.stringify(this.currentUnit));
        setTimeout(this.upLevelImg, 100);
        setTimeout(this.removeAttachLevelUpUnit, 700);
      } else if (this.attachResult.isLeaveUp) {
        setTimeout(this.changeLevelUnit, 10);
        setTimeout(this.upLevelImg, 100);
        setTimeout(this.removebeAttachLevelUpUnit, 700);
      }
      // attachEvent4.4 判断是否有突击部队的能力

      // attachEvent4.5 攻击者石化
      this.currentUnit.isDone = true;
    },
    // 升级攻击者 同时判断被攻击者
    removeAttachLevelUpUnit() {
      this.leveupUnit = null;
      this.currentUnit.level++;
      // 攻击者升级后判断被攻击者是否升级
      if (this.attachResult.isLeaveUp) {
        setTimeout(this.changeLevelUnit, 10);
        setTimeout(this.upLevelImg, 100);
        setTimeout(this.removebeAttachLevelUpUnit, 700);
      }
    },
    // 改变升级者
    changeLevelUnit() {
      this.leveupUnit = JSON.parse(JSON.stringify(this.beAttachUnit));
    },
    // 移动升级的图片 升高
    upLevelImg() {
      this.leveupUnit.row = this.leveupUnit.row - 0.5;
    },
    // 升级被攻击者的等级
    removebeAttachLevelUpUnit() {
      this.leveupUnit = null;
      this.beAttachUnit.level++;
    },
    // 被攻击的单位死
    beAttachDead() {
      if (this.beAttachDustNum == 4) {
        clearInterval(this.beAttachDeadTimer);
        // 判断单位死了之后是否有坟墓
        if (this.attachResult.isHaveTomb) {
          let tomb = {};
          tomb.row = this.beAttachUnit.row;
          tomb.column = this.beAttachUnit.column;
          this.tombs.push(tomb);
        }
        this.beAttachDustNum = 0;
        this.beAttachDeadTimer = null;
      } else {
        this.beAttachDustNum++;
      }
    },
    // 攻击者死
    attachDead() {
      if (this.attachDustNum == 4) {
        clearInterval(this.attachTimer);
        // 判断单位死了之后是否有坟墓
        if (this.attachResult.selfIsHaveTomb) {
          let tomb = {};
          tomb.row = this.currentUnit.row;
          tomb.column = this.currentUnit.column;
          this.tombs.push(tomb);
        }
        this.attachDustNum = 0;
        this.attachTimer = null;
      } else {
        this.attachDustNum++;
      }
    },
    // 通过当前移动的点movePointIndex 计算出下一段的距离
    getMoveLength() {
      let point1 = this.pathPoints[this.movePointIndex];
      let point2 = this.pathPoints[this.movePointIndex + 1];
      if (point1.row == point2.row) {
        this.moveLength = Math.abs(point1.column - point2.column);
      } else {
        this.moveLength = Math.abs(point1.row - point2.row);
      }
    },
    // 展示当前单位的移动目的
    showAimArea(row, column) {
      if (this.showMoveArea) {
        this.currentPoint.row = row;
        this.currentPoint.column = column;
      }
    },
    // 鼠标点击单位
    operationUnit(armyIndex, index) {
      // todo 判断是不是敌军 判断被点击的单位的地方是不是在攻击的区域内
      console.log("开始判断");
      if (
        this.showAttachArea && // 判断当前是准备攻击阶段
        (this.currentUnit.row != this.armys[armyIndex].units[index].row ||
          this.currentUnit.column != this.armys[armyIndex].units[index].column)
      ) {
        (this.beAttachArmyIndex = armyIndex),
          (this.beAttachUnitIndex = index),
          (this.beAttachUnit = this.armys[armyIndex].units[index]);
        console.log("是准备被攻击的");
        console.log(this.beAttachUnit);
        this.showAttachPoint = true;
        return;
      }
      this.currentArmyIndex = armyIndex;
      this.currentUnitIndex = index;
      this.currentUnit = this.armys[armyIndex].units[index];
      this.currentPoint.row = this.currentUnit.row;
      this.currentPoint.column = this.currentUnit.column;
      // 显示能移动的所有区域
      this.showCanMoveArea();
    },
    // 鼠标点击地图
    getRegionMes(index) {
      // 移动鼠标
      let y = (index + 1) % this.map.width;
      if (y == 0) {
        y = 5;
      }
      this.currentPoint.column = y;
      if (((index + 1) / this.map.width) % 1 == 0) {
        this.currentPoint.row = (index + 1) / this.map.width;
      } else {
        this.currentPoint.row = Math.floor((index + 1) / this.map.width) + 1;
      }
      // 如果当前是点击单位准备启动的阶段 则取消移动
      if (this.showMoveArea) {
        this.showMoveArea = false;
      }
    },
    // 展示当前单位可以移动的区域
    showCanMoveArea() {
      if (this.currentUnit.id == 3) {
        this.showMoveArea = true;
      }
    },
    // 开启一个后台进程 计时器
    startWorker() {
      if (typeof Worker !== "undefined") {
        if (this.worker == null) {
          this.worker = new Worker(setInterval(this.timer, 500));
        }
      } else {
        alert("抱歉 您的电脑不支持");
      }
    },
    timer() {
      this.singo = !this.singo;
    }
  },
  computed: {
    // 通过 单位所属的颜色 找到相应的图片
    img() {
      return function(color, type, num = "") {
        return require("../assets/images/unit/" +
          color +
          "/" +
          type +
          num +
          ".png");
      };
    },
    isDoneImg() {
      return function(type) {
        return require("../assets/images/unit/done/" + type + ".png");
      };
    },
    // 根据单位的action名字 来计算出图片
    actionImg() {
      return function(name) {
        return require("../assets/images/assist/action_" + name + ".png");
      };
    },
    // 根据血量来找图片
    liftImg() {
      return function(liftImg) {
        return require("../assets/images/assist/life_" + liftImg + ".png");
      };
    },
    // 获取攻击火花的图
    attachSparkImg() {
      return function(attachSpark) {
        return require("../assets/images/assist/spark_attack_" +
          attachSpark +
          ".png");
      };
    },
    // 获取生命数字的图片
    lifeCImg() {
      return function(attachNum) {
        return require("../assets/images/assist/life_c_" + attachNum + ".png");
      };
    },
    // 获取烟的图片
    dustImg() {
      return function(dustNum) {
        return require("../assets/images/assist/dust_" + dustNum + ".png");
      };
    },
    levelImg() {
      return function(dustNum) {
        return require("../assets/images/assist/level_" + dustNum + ".png");
      };
    },
    // 根据后端传过来的和row 和column 返回图片相对于父布局的 top和left
    position() {
      return function(num, row) {
        return (row - num) * 24 + "px";
      };
    },
    isNot100() {
      return function(life) {
        if (life.length != 3) {
          return true;
        } else if (life[2] != 0) {
          return true;
        } else if (life[1] != 0) {
          return true;
        } else if (life[0] != 1) {
          return true;
        } else {
          return false;
        }
      };
    },
    // 根据单位的名字 来获取单位的具体位置
    armyLeft() {
      return function(type, column) {
        let unit_index = this.$store.state.unit_index;
        let left = (column - unit_index[type]) * 24 + "px";
        return left;
      };
    },
    //血量位置的计算
    lifeNumTop() {
      return function(unit) {
        // if (unit.id == this.beAttachUnit.id) {
        //   if ( this.beAttachUnitBak != null && this.beAttachUnitBak.row != null ) {
        //     let top = (this.beAttachUnitBak.row - 0.29) * 24 + "px";
        //     return top;
        //   }
        // }
        let top = (unit.row - 0.29) * 24 + "px";
        return top;
      };
    },
    lifeNumLeft() {
      return function(unit) {
        let left = (unit.column - 1) * 24 + "px";
        return left;
      };
    },
    // 计算等级的位置
    levelTop() {
      return function(row) {
        let top = (row - 1) * 24 + "px";
        return top;
      };
    },
    levelLeft() {
      return function(column) {
        let left = (column - 0.35) * 24 + "px";
        return left;
      };
    },
    // 计算升级位置
    leveupTop() {
      return function(row) {
        let top = (row - 1) * 24 + "px";
        return top;
      };
    },
    leveupLeft() {
      return function(column) {
        let left = (column - 2) * 24 + "px";
        return left;
      };
    },
    // 攻击数top位置
    attachNumTop() {
      return function(row) {
        let top = (row - 0.48) * 24 + "px";
        return top;
      };
    },
    // 计算出攻击图标的位置
    attachTop() {
      return function(row) {
        let top = (row - 1 - 0.3) * 24 + "px";
        return top;
      };
    },
    attachLeft() {
      return function(column) {
        let left = (column - 1 - 0.3) * 24 + "px";
        return left;
      };
    },
    // 根据 得到最短距离需要拐弯的几个点 画出一条红线
    movePathTop() {
      return function(point, point2) {
        if (point.row <= point2.row) {
          return (point.row - 1) * 24 + 8 + "px";
        } else {
          return (point2.row - 1) * 24 + 8 + "px";
        }
      };
    },
    movePathLeft() {
      return function(point, point2) {
        if (point.column < point2.column) {
          return (point.column - 1) * 24 + 8 + "px";
        } else {
          return (point2.column - 1) * 24 + 8 + "px";
        }
      };
    },
    movePathWidth() {
      return function(point1, point2) {
        if (point1.column == point2.column) {
          return "8px";
        } else {
          return Math.abs(point2.column - point1.column) * 24 + 8 + "px";
        }
      };
    },
    movePathHeight() {
      return function(point1, point2) {
        if (point1.row == point2.row) {
          return "8px";
        } else {
          return Math.abs(point2.row - point1.row) * 24 + "px";
        }
      };
    }
  },
  created() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#f7f7f7");
  }
};
</script>

<style lang="css" scoped>
.map {
  position: relative;
  background-color: bisque;
  width: 240px;
  float: left;
  margin-left: 200px;
  margin-top: 100px;
  cursor: pointer;
}
.map .region {
  float: left;
}
.actionLogo img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
.armys img {
  position: absolute;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
.lifeNum {
  position: absolute;
  transition-property: all;
  transition-timing-function: linear !important;
  transition-delay: 0s;
}
.lifeNum img {
  position: relative;
  width: 6px;
  float: left;
}
.tomb img {
  position: absolute;
}
.cursor_normal img {
  position: absolute;
}
.move_area img {
  position: absolute;
  clip: rect(0px, 48px, 24px, 24px);
}
.attach_area img {
  position: absolute;
  clip: rect(0px, 24px, 24px, 0px);
}
.aimPoint img {
  position: absolute;
}
.attackPoint img {
  position: absolute;
}
.spark_attack img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
.dust img {
  position: absolute;
}
.level_up img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}

.unit_level {
  position: absolute;
  transition-property: all;
  transition-timing-function: linear !important;
  transition-delay: 0s;
}
.attach_num {
  position: absolute;
}
.attach_num img {
  position: relative !important ;
  float: left;
}
.movePath div {
  position: absolute;
  background-color: #e10052;
}

.animated {
  transition-duration: 0.1s;
  animation-fill-mode: both;
}

.animated.infinite {
  animation-iteration-count: infinite;
}
.bounce {
  animation-name: bounce;
  transform-origin: center bottom;
}
@keyframes bounce {
  from,
  20%,
  53%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }

  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -8px, 0);
  }

  90% {
    transform: translate3d(0, -2px, 0);
  }
}

</style>