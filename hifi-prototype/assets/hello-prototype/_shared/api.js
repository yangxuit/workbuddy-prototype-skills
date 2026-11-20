/* ============================================================
 * api.js · 服务层（异步 API 桩）
 * 五层零依赖架构之服务层：IIFE 挂 window.API
 * 契约：每个函数 async + delay(200~1200ms) 拟真延迟；
 *      统一返回 {code:0, msg:'ok', data}；
 *      写操作真实变更 DB 状态（unshift/状态字段修改），
 *      使交互具备内存态连续性。
 * 三段式注释 = 后端可机械替换的关键：
 *      /** 中文功能说明（含业务规则）*\/
 *      // GET|POST /api/v1/xxx {入参} → {出参}
 * 命名规范：fetch* 查询 / create*·submit* 新建 /
 *      confirm*·resolve* 流转 / toggle*·update* 更新 /
 *      simulate*·fire* 演示触发。
 * ============================================================ */
(function () {
  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function ok(data) { return { code: 0, msg: 'ok', data: data }; }

  window.API = {

    /** 查询设备台账列表（含健康度与运行状态；KPI 汇总数与明细对账一致） */
    // GET /api/v1/devices {} → { kpi, devices[] }
    fetchDevices: async function () {
      await delay(320);
      return ok({ kpi: DB.m01.kpi, devices: DB.m01.devices });
    },

    /** 查询设备运行趋势（健康度近12点序列，末点=当前值） */
    // GET /api/v1/devices/{id}/trend {} → { points[] }
    fetchTrend: async function (id) {
      await delay(420);
      var d = DB.m01.devices.filter(function (x) { return x.id === id; })[0] || DB.m01.devices[0];
      var pts = [], v = d.health + 30 > 100 ? 96 : d.health + 30;
      for (var i = 0; i < 12; i++) { pts.push(v); v = Math.max(d.health, v - (Math.random() * 4 + 1)); }
      pts[11] = d.health; /* 趋势末点 = 当前值（数据对上账） */
      return ok({ points: pts.map(function (p) { return +p.toFixed(1); }) });
    },

    /** 告警确认（状态 doing→done，联动刷新受影响区域由页面负责） */
    // POST /api/v1/alarms/{id}/confirm {} → { state }
    confirmAlarm: async function (id) {
      await delay(560);
      var a = DB.m02.alarms.filter(function (x) { return x.id === id; })[0];
      if (a) { a.state = 'done'; DB.m02.kpi.doing--; DB.m02.kpi.done++; }
      return ok({ state: 'done' });
    },

    /** 演示触发：从模板池推送一条新告警（剧本按钮；document.hidden 时页面侧跳过） */
    // POST /api/v1/alarms/simulate {} → { alarm }
    simulateAlarm: async function () {
      await delay(620);
      var pool = DB.pools.alarms;
      var p = pool[Math.floor(Math.random() * pool.length)];
      var no = String(DB.m02.alarms.length + 1).padStart(3, '0');
      var a = {
        id: 'AL-1119-' + no, time: new Date().toTimeString().slice(0, 8),
        device: 'EQ-00' + (2 + Math.floor(Math.random() * 4)), lv: p.lv, state: 'todo',
        title: p.title, value: '模拟推送', ticket: null
      };
      DB.m02.alarms.unshift(a);
      DB.m02.kpi.today++; DB.m02.kpi.doing++;
      return ok({ alarm: a });
    }
  };
})();
