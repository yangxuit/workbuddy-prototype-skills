/* ============================================================
 * mock.js · 数据层（单一事实源）
 * 五层零依赖架构之数据层：IIFE 挂 window.DB
 * 纪律：全平台唯一数据源；按模块编号组织数据域；
 *      页面禁止散落硬编码业务数据，一律从 DB 取。
 * 世界观：虚构主体写入 DB.meta，所有数据域从世界观派生，
 *      人名/部门/地点/设备口径全站一致。
 * ============================================================ */
(function () {
  window.DB = {
    /* 世界观元数据（虚构主体设定） */
    meta: {
      app: '设备运行监控平台',
      corp: '示例制造有限公司（虚构演示主体）',
      version: 'V1.0 · hi-fi prototype skill 骨架示例',
      demoDate: '2026-11-19',
      runDays: 486,
      mock: '纯静态演示，全部数据为虚构 Mock'
    },

    /* 演示模板池（实时推送用；document.hidden 时跳过推送） */
    pools: {
      alarms: [
        { title: '空压机B 排气压力超限', lv: 'orange' },
        { title: '冷却泵C 电流波动异常', lv: 'yellow' },
        { title: '输送线D 光幕遮挡', lv: 'blue' }
      ]
    },

    /* ---- 01 设备监控 数据域 ---- */
    m01: {
      kpi: { total: 48, run: 41, warn: 4, alarm: 2, idle: 1, oee: 87.4 },
      devices: [
        { id: 'EQ-001', name: '空压机A', area: '动力车间', status: 'alarm', health: 42,
          temp: '108.2℃ / 阈值105℃', update: '09:41:23',
          tags: ['红警', '已派单'] },
        { id: 'EQ-003', name: '行车C', area: '装配车间', status: 'warn', health: 63,
          temp: '振动 7.2mm/s', update: '09:12:07', tags: ['关注'] },
        { id: 'EQ-002', name: '冷却泵B', area: '动力车间', status: 'run', health: 88,
          temp: '正常', update: '09:40:00', tags: [] },
        { id: 'EQ-004', name: '数控铣D', area: '机加车间', status: 'run', health: 91,
          temp: '正常', update: '09:38:41', tags: [] },
        { id: 'EQ-005', name: '输送线E', area: '装配车间', status: 'run', health: 84,
          temp: '正常', update: '09:35:12', tags: [] },
        { id: 'EQ-006', name: '注塑机F', area: '注塑车间', status: 'idle', health: 95,
          temp: '待机', update: '09:30:00', tags: ['排产 14:00'] }
      ],
      /* 贯穿性剧本：该事件在 02 告警域同源出现（数据对上账） */
      mainline: { deviceId: 'EQ-001', alarmId: 'AL-1119-003', workorderId: 'WO-1119-02' }
    },

    /* ---- 02 告警中心 数据域 ---- */
    m02: {
      alarms: [
        { id: 'AL-1119-003', time: '09:41:23', device: 'EQ-001', lv: 'red', state: 'doing',
          title: '空压机A 排气温度超限（连续3次>105℃）', value: '108.2℃ / 阈值105℃', ticket: 'WO-1119-02' },
        { id: 'AL-1119-002', time: '09:12:07', device: 'EQ-003', lv: 'orange', state: 'doing',
          title: '行车C 大车行走振动偏高', value: '7.2mm/s / 关注线6.5', ticket: null },
        { id: 'AL-1119-001', time: '08:55:40', device: 'EQ-005', lv: 'yellow', state: 'done',
          title: '输送线E 末端光幕短暂遮挡', value: '遮挡 3.2s / 自动恢复', ticket: null },
        { id: 'AL-1118-011', time: '2026-11-18 16:47', device: 'EQ-004', lv: 'yellow', state: 'done',
          title: '数控铣D 液压油温偏高提示', value: '52℃ / 关注线50℃', ticket: null }
      ],
      kpi: { today: 4, doing: 2, done: 2, redToday: 1, avgCloseMin: 42 }
    },

    /* 门户交付状态（门户卡片按 delivered 字段标注） */
    portal: {
      docs: [
        { no: '01', name: '设备监控', file: '01-设备监控.html', delivered: true },
        { no: '02', name: '告警中心', file: '02-告警中心.html', delivered: false, note: 'P1 规划中' }
      ]
    }
  };
})();
