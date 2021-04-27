var eventype = {

  /**
     * 回合开始事件 目前没有指令
     */
  ROUND_START: "ROUND_START",

  /**
   * 点击可以行动的单位事件
   * 领主如果在己方城堡上会获取行动，通知 SHOW_ACTION
   * 否则通知 SHOW_MOVE_AREA
   */
  CLICK_ACTIVE_UNIT: "CLICK_ACTIVE_UNIT",

  /**
   * 点击不能行动的单位 或者其他单位
   * 领主如果在己方城堡上会获取行动，通知 SHOW_ACTION
   * 否则通知 SHOW_MOVE_AREA
   */
  CLICK_UN_ACTIVE_UNIT: "CLICK_UN_ACTIVE_UNIT",

  /**
   * 点击可以行动的单位事件
   * 领主如果在己方城堡上会获取行动，通知 SHOW_ACTION
   * 否则通知 SHOW_MOVE_AREA
   */
  CLICK_REGION: "CLICK_REGION",

  /**
   * 点击坟墓
   */
  CLICK_TOMB: "CLICK_TOMB",

  /**
   * 点击移动区域 准备移动事件
   * 通知 SHOW_MOVE_LINE
  */
  CLICK_MOVE_AREA: "CLICK_MOVE_AREA",

  /**
   * 点击指针
   */
  CLICK_POINT:"CLICK_POINT",

  /**
    * 点击移动的目标点 移动
    * 通知 移动单位 MOVE_UNIT 通知不展示移动区域 DIS_SHOW_MOVE_AREA 并且展示actionSHOW_ACTION
    */
  CLICK_AIM_POINT: "CLICK_AIM_POINT",

  /**
   *点击选择指针框 可能是攻击单位 召唤单位 治疗单位 给一个单位重新加回合 具体
    * 需要根据状态机判断, 然后通知 攻击/召唤/治疗 动作
   */
  CLICK_CHOOSE_POINT: "CLICK_CHOOSE_POINT",

/**
   * 准备攻击事件 获取攻击范围 通知 SHOW_ATTACH_AREA
   */
  CLICK_ATTACH_ACTION:"CLICK_ATTACH_ACTION",

  /**
   *  点击移动图标
   */
  CLICK_MOVE_ACTION: "CLICK_MOVE_ACTION",

  /**
   * 点击攻击区域
   */
  CLICK_ATTACH_AREA:"CLICK_ATTACH_AREA",

  /**
   * 选择攻击单位事件 通知移动攻击指针
   */
  CHOOSE_ATTACH_AIM: "CHOOSE_ATTACH_AIM",

  /**
   * 攻击单位 通知 展示攻击状态，改变单位信息  移除单位，添加坟墓
   */
  CLICK_ATTACH_ACTION: "CLICK_ATTACH_ACTION",

  /**
   * 购买单位事件:"", 通知移动指针，添加单位， （如果此处有领主，必须要移动）展示移动范围
   */
  CLICK_BUY_ACTION: "CLICK_BUY_ACTION",

  /**
   * 单位占领事件 通知修改地形，通知信息条
   */
  CLICK_REPAIR_ACTION: "CLICK_REPAIR_ACTION",

  /**
   * 单位修复事件， 通知修改地形，通知信息条
   */
  CLICK_OCCUPIED_ACTION: "CLICK_OCCUPIED_ACTION",

  /**
   * 召唤坟墓事件 通知移除坟墓，添加单位
   */
  CLICK_SUMMON_ACTION: "CLICK_SUMMON_ACTION",


  /**
   * 单位结束事件， 改变单位信息，（其他单位加血，该状态）
   */
  CLICK_END_ACTION: "CLICK_END_ACTION",


  /**
   * 准备移动事件:"", 点击单位移动范围内区域， 展示移动路线命令
   */
  READY_MOVE: "READY_MOVE",

  /**
   * 单位移动 通知单位移动命令
   */
  MOVE: "MOVE",

  /**
   * 撤销移动 修改单位状态
   */
  MOVE_BACK: "MOVE_BACK",

  /**
   * 单位移动结束事件， 展示可选行动
   */
  MOVE_END: "MOVE_END",

  /**
   * 结束回合事件，通知信息条，
   */
  ROUND_END: "ROUND_END",

  /**
   * 有序命令执行结束
   */
  COMMEND_EXEC_OVER: "COMMEND_EXEC_OVER",
}



export default eventype;