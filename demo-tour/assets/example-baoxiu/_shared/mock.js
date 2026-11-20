/* 报修闭环演示原型 · 数据层（单一事实源） */
(function () {
  window.DB = {
    meta: { app: '设备报修闭环平台', demoDate: '2026-11-03', mock: '纯静态演示，数据为虚构 Mock' },

    /* 设备台账 */
    devices: [
      { id: 'EQ-01', name: '空压机A', area: '动力车间', status: 'alarm', health: 42 },
      { id: 'EQ-02', name: '冷却泵B', area: '动力车间', status: 'run', health: 88 },
      { id: 'EQ-03', name: '行车C', area: '装配车间', status: 'warn', health: 63 },
      { id: 'EQ-04', name: '数控铣D', area: '机加车间', status: 'run', health: 91 }
    ],

    /* 告警（多级依赖源头：告警→报修→工单→派单→检修→验收） */
    alarms: [
      { id: 'AL-1103-006', time: '2026-11-03 09:41:23', device: 'EQ-01', lv: 'red', state: 'doing',
        title: '空压机A 排气温度超限（连续3次>105℃）', value: '108.2℃ / 阈值105℃', report: 'RP-1103-02' },
      { id: 'AL-1103-004', time: '2026-11-03 09:12:07', device: 'EQ-03', lv: 'orange', state: 'doing',
        title: '行车C 大车行走振动偏高', value: '7.2mm/s / 关注线6.5', report: null }
    ],

    /* 报修单（由告警一键生成或人工上报） */
    reports: [
      { id: 'RP-1103-02', time: '2026-11-03 09:43', device: 'EQ-01', src: 'AL-1103-006', state: '已派单',
        desc: '排气温度持续超限，疑似冷却器堵塞', urgent: true, ticket: 'WO-1103-05' },
      { id: 'RP-1103-01', time: '2026-11-03 08:55', device: 'EQ-03', src: null, state: '待处理',
        desc: '巡检发现行走异响，人工上报', urgent: false, ticket: null }
    ],

    /* 工单（七步闭环：派单→接单→检修→提交→验收→签名→归档） */
    tickets: [
      { id: 'WO-1103-05', device: 'EQ-01', type: '紧急维修（红警触发）', src: 'RP-1103-02', state: '检修中', step: 3,
        master: '王建国', plan: '11-03 12:00 前', cost: '2.5人时',
        steps: [
          { n: '派单', t: '09:43:12', by: '系统自动（告警联动）' },
          { n: '接单', t: '09:44:05', by: '王建国（维修一班）' },
          { n: '检修', t: '进行中', by: '王建国', note: '冷却器拆检中，进出口温差 18℃' }
        ] },
      { id: 'WO-1102-11', device: 'EQ-04', type: '预防性维护', src: 'RP-1102-08', state: '已归档', step: 7,
        master: '李秀兰', plan: '11-02 前', cost: '1人时',
        steps: [
          { n: '派单', t: '11-02 08:00', by: '张总工' }, { n: '接单', t: '11-02 08:10', by: '李秀兰' },
          { n: '检修', t: '11-02 09:30', by: '李秀兰', note: '导轨润滑' }, { n: '提交', t: '11-02 09:50', by: '李秀兰' },
          { n: '验收', t: '11-02 10:00', by: '系统复测（通过）' }, { n: '签名', t: '11-02 10:05', by: '张总工（SIG-1102-31）' },
          { n: '归档', t: '11-02 10:05', by: '系统' }
        ] }
    ],

    /* 演示动线（放映机引擎消费；编号全部引用上方真实数据——数据同源铁律） */
    tours: [
      {
        id: 'T1', name: '空压机A 高温红警 · 报修全流程闭环',
        steps: [
          { page: 'index.html', title: '开场 · 全景页', view: null,
            say: '今天看一条完整的报修闭环：空压机A 红警触发 → 一键报修 → 自动派单 → 检修 → 验收签名归档。全程系统自动流转，编号可互证：AL-1103-006 → RP-1103-02 → WO-1103-05。',
            tip: null, focus: null },
          { page: '01-设备监控.html', title: '第1站 · 设备监控：红警首发现', view: 'board',
            say: '空压机A 排气温度 108.2℃，连续 3 次超 105℃ 阈值——红警 09:41 自动触发。健康度已从 88 跌到 42，趋势图可以看到坠落拐点。',
            tip: null, focus: '[data-eq="EQ-01"]' },
          { page: '02-告警报修.html', title: '第2站 · 告警详情：一键报修', view: 'pool',
            say: '告警详情里数值、阈值、曲线齐全——不是拍脑袋报警。点"生成报修单"，3 秒内自动带出设备信息与故障描述，不用手填一个字。',
            tip: '✋ 点开 AL-1103-006 详情，再点"生成报修单"看自动填充', focus: '[data-al="AL-1103-006"]',
            filter: { selector: '#f-device', value: 'EQ-01' } },
          { page: '02-告警报修.html', title: '第3站 · 报修单池：自动派单', view: 'pool',
            say: 'RP-1103-02 已生成并自动派单到维修一班——紧急单按区域与技能自动匹配，值班长张总工手机已同步收到推送。',
            tip: null, focus: '[data-rp="RP-1103-02"]' },
          { page: '03-工单闭环.html', title: '第4站 · 工单详情：七步闭环前3步', view: 'flow',
            say: '工单 WO-1103-05：09:43 系统派单、09:44 王建国接单、当前检修中——冷却器进出口温差 18℃，直指堵塞。每一步有时间、有经手人，全程留痕。',
            tip: null, focus: '.wo-steps' },
          { page: '03-工单闭环.html', title: '第5站 · 现场互动：走完检修提交', view: 'flow',
            say: '当着大家的面走完剩余步骤：填检修记录 → 提交 → 系统自动复测验收。检修记录必填，空提交会被红框拦下。',
            tip: '✋ 填写检修记录（如"冷却器清洗，温差恢复至6℃"）→ 点提交 → 等待系统复测', focus: '[data-op="submit"]' },
          { page: '03-工单闭环.html', title: '第6站 · 验收签名：责任落章', view: 'flow',
            say: '复测通过后，张总工数字签名确认——签名带证书编号，归档后不可篡改。至此七步闭环走完，红警自动消音。',
            tip: '✋ 输入口令 → 签名归档', focus: '#op-area' },
          { page: '01-设备监控.html', title: '第7站 · 回到监控：健康度回升', view: 'board',
            say: '检修完成后设备健康度从 42 回升到 89——闭环不只走流程，设备状态真实改善。这就是"发现→处置→验证"的完整价值。',
            tip: null, focus: '[data-eq="EQ-01"]',
            filter: { selector: '#f-device', value: 'EQ-01' } },
          { page: '04-统计分析.html', title: '第8站 · 统计：闭环率与时效', view: 'stats',
            say: '本月报修 12 单，闭环率 92%，平均修复时长 3.2 小时——每张归档工单都沉淀为设备档案，越用越准。',
            tip: null, focus: '#stat-kpis' },
          { page: 'index.html', title: '结束 · 回到全景页', view: null,
            say: '回顾全程：红警 09:41 → 报修 09:43 → 接单 09:44，2 分钟内完成响应；检修、验收、签名全程留痕。这就是把"救火式维修"变成"流程化闭环"的价值。感谢观看。',
            tip: 'Q&A：可回第5站重走互动环节', focus: null }
        ]
      }
    ]
  };
})();
