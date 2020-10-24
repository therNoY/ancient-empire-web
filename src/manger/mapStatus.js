// 地图状态机 从选择一个单位到一个一个单位结束行动 有一个状态
var mapStatus = {
  /**
   * 没有选择 初始状态
   */
  noChoose: "0",

  /**
   * 选中单位
   */
  chooseUnit: "1",

  /**
   * 展示移动区域
   */
  showMoveArea: "2",

  /**
   * 准备移动
   */
  readyMove: "3",

  /**
   * 单位移动中
   */
  moveIng: "4",

  /**
   * 移动完毕
   */
  moveDone: "5",

  /**
   * 展示可选行动
   */
  showAction: "6",

  /**
   * 即将攻击
   */
  willAttach: "7_0",

  /**
   * 准备召唤
   */
  willSummon: "7_1",

  /**
   * 攻击中
   */
  attachIng: "8_0",

  /**
   * 召唤中
   */
  summonIng: "8_1",

  /**
   * 攻击结束
   */
  attachDone: "9_0",

  /**
   * 等级提升
   */
  levelUp: "10",

  /**
   * 二次移动
   */
  secendMove: "11",

  /**
   * 行动结束
   */
  actionDone: "12",

}



export default mapStatus;