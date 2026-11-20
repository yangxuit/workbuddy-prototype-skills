/* demo-tour 放映机引擎 V1.0（按 engine-spec.md 六项能力规范实现并经实测）
 * 接入方式（详见 references/engine-spec.md 第 5 节）：
 *   1. 复制本文件到目标原型 _shared/ 目录，改名 tour.js；
 *   2. 引导条/高亮样式令牌集中在文件尾部 css 注入段，按品牌定制；
 *   3. 动线数据写入原型数据层 DB.tours（形态见 example-baoxiu/_shared/mock.js）；
 *   4. 各页面初始化尾部挂载 CMP.resumeTour() 恢复钩子；
 *   5. 演示入口按钮调用 CMP.startTour('动线ID')。
 * 防御要点：go() 内先写 sessionStorage 进度再发起跳转（防回跳死循环）；
 *           聚焦/筛选轮询按毫秒上限（默认 6s），勿改为帧计数。 */
(function () {
  var TOUR = null;
  function tourKey(id) { return 'tq_tour_' + id; }
  function samePage(page) {
    var cur = location.href.split('#')[0].split('?')[0].split('/').pop();
    try { cur = decodeURIComponent(cur); } catch (e) { }
    return cur === page;
  }
  function clearFocus() {
    document.querySelectorAll('.tour-focus').forEach(function (el) { el.classList.remove('tour-focus'); });
  }
  function endTour() {
    if (!TOUR) return;
    sessionStorage.removeItem(tourKey(TOUR.t.id));
    clearFocus(); TOUR = null;
    var bar = document.getElementById('tour-bar'); if (bar) bar.remove();
    notifyStep(null);
    toast('演示结束', '感谢观看，可自由浏览');
  }
  /* 步骤通知钩子：页面可挂 CMP.onTourStep(stepData|null) 做确定性联动（如收抽屉）。
   * 优于 hashchange——view 为 null 的页内切站 hash 不变，事件不触发。 */
  function notifyStep(st) {
    try { if (typeof window.CMP.onTourStep === 'function') window.CMP.onTourStep(st); } catch (e) { }
  }
  function toast(title, desc) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:18px;right:18px;z-index:999;background:#00B42A;color:#FFF;padding:10px 16px;border-radius:8px;font-size:13px;box-shadow:0 6px 20px rgba(0,180,42,.3)';
    t.textContent = title + (desc ? '｜' + desc : '');
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  }
  function renderTour(id, idx) {
    var t = DB.tours.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    var st0 = t.steps[idx];
    if (st0 && st0.page && !samePage(st0.page)) { location.href = st0.page + '#/tour@' + id; return; }
    clearFocus();
    TOUR = { t: t, idx: idx };
    var st = t.steps[idx];
    if (st.view && location.hash !== '#/' + st.view + '@' + id) location.hash = '#/' + st.view + '@' + id;
    var bar = document.getElementById('tour-bar');
    if (!bar) { bar = document.createElement('div'); bar.id = 'tour-bar'; document.body.appendChild(bar); }
    bar.className = 'tour-bar';
    bar.innerHTML =
      '<div class="tb-head"><b>' + t.name + '</b><span class="tb-step">' + (idx + 1) + ' / ' + t.steps.length + '</span><button class="tb-x">✕</button></div>' +
      '<div class="tb-title">' + st.title + '</div>' +
      '<div class="tb-say">' + st.say + (st.tip ? '<span class="tb-tip">✋ ' + st.tip + '</span>' : '') + '</div>' +
      '<div class="tb-btns">' +
      (idx > 0 ? '<button class="tb-btn" data-tb="prev">← 上一步</button>' : '') +
      (idx < t.steps.length - 1 ? '<button class="tb-btn tb-go" data-tb="next">下一步 →</button>' : '<button class="tb-btn tb-go" data-tb="end">✓ 结束演示</button>') +
      '</div>';
    bar.querySelector('.tb-x').onclick = endTour;
    bar.querySelectorAll('[data-tb]').forEach(function (b) {
      b.onclick = function () {
        var op = b.getAttribute('data-tb');
        if (op === 'prev') go(idx - 1); else if (op === 'next') go(idx + 1); else endTour();
      };
    });
    notifyStep(st);
    /* 聚焦协议（时间上限轮询：帧计数在高fps环境实际时长不足，必须按毫秒计） */
    if (st.focus) {
      var t0 = Date.now();
      (function loop() {
        if (!TOUR || TOUR.idx !== idx) return;
        var el = document.querySelector(st.focus);
        if (el) {
          el.classList.add('tour-focus');
          try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }
          if (st.filter) setTimeout(function () {
            var el2 = document.querySelector(st.focus);
            if (el2 && !el2.classList.contains('tour-focus')) el2.classList.add('tour-focus');
          }, 500);
          return;
        }
        if (Date.now() - t0 < 6000) requestAnimationFrame(loop);
      })();
    }
    /* 筛选协议（同样时间上限） */
    if (st.filter) {
      var tf0 = Date.now();
      (function fLoop() {
        if (!TOUR || TOUR.idx !== idx) return;
        var sel = document.querySelector(st.filter.selector);
        if (sel) {
          if (sel.value !== st.filter.value) { sel.value = st.filter.value; sel.dispatchEvent(new Event('change')); }
          return;
        }
        if (Date.now() - tf0 < 6000) requestAnimationFrame(fLoop);
      })();
    }
  }
  function go(idx) {
    var t = TOUR.t;
    if (idx < 0 || idx >= t.steps.length) return;
    /* 关键顺序：先存进度再跳转——否则新页 resumeTour 读到旧索引回跳死循环 */
    sessionStorage.setItem(tourKey(t.id), String(idx));
    var st = t.steps[idx];
    if (!samePage(st.page)) { location.href = st.page + '#/tour@' + t.id; return; }
    renderTour(t.id, idx);
  }
  window.CMP = window.CMP || {};
  window.CMP.startTour = function (id) {
    var t = DB.tours.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    sessionStorage.setItem(tourKey(id), '0');
    var first = t.steps[0];
    if (!samePage(first.page)) { location.href = first.page + '#/tour@' + id; return; }
    renderTour(id, 0);
  };
  window.CMP.endTour = endTour;
  window.CMP.tourStep = function () { return TOUR ? { id: TOUR.t.id, step: TOUR.idx, page: TOUR.t.steps[TOUR.idx].page, data: TOUR.t.steps[TOUR.idx] } : null; };
  window.CMP.resumeTour = function () {
    var m = location.hash.match(/#\/tour@([\w-]+)/);
    if (!m) return false;
    var id = m[1];
    var t = DB.tours.filter(function (x) { return x.id === id; })[0];
    if (!t) return false;
    renderTour(id, +(sessionStorage.getItem(tourKey(id)) || 0));
    return true;
  };
  /* 样式注入（含深色适配） */
  var css = document.createElement('style');
  css.textContent = '.tour-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:950;width:min(720px,calc(100vw - 32px));background:#FFF;border:1px solid #165DFF;border-radius:12px;box-shadow:0 12px 40px rgba(22,93,255,.22);padding:12px 16px;font-family:"Microsoft YaHei",sans-serif}' +
    '.tour-bar .tb-head{display:flex;align-items:center;gap:10px;margin-bottom:6px}.tour-bar .tb-head b{font-size:13px;color:#1D2129;flex:1}' +
    '.tour-bar .tb-step{font-size:12px;color:#165DFF;font-weight:700}.tour-bar .tb-x{border:none;background:#F2F3F5;border-radius:6px;width:24px;height:24px;cursor:pointer}' +
    '.tour-bar .tb-title{font-size:14.5px;font-weight:600;color:#1D2129;margin-bottom:5px}' +
    '.tour-bar .tb-say{font-size:12.5px;line-height:1.7;color:#4E5969;background:#F7F9FF;border-left:3px solid #165DFF;padding:8px 12px;border-radius:0 6px 6px 0}' +
    '.tour-bar .tb-tip{display:block;margin-top:5px;color:#D25F00;font-size:11.5px}' +
    '.tour-bar .tb-btns{display:flex;gap:10px;justify-content:flex-end;margin-top:10px}' +
    '.tour-bar .tb-btn{border:1px solid #E5E6EB;background:#FFF;border-radius:6px;padding:6px 14px;font-size:12.5px;cursor:pointer}' +
    '.tour-bar .tb-go{background:#165DFF;color:#FFF;border-color:#165DFF}' +
    '.tour-focus{outline:3px solid #FF7D00!important;outline-offset:2px;border-radius:6px;animation:tPulse 1.6s infinite}' +
    '@keyframes tPulse{0%,100%{outline-color:#FF7D00}50%{outline-color:rgba(255,125,0,.25)}}' +
    'body.dark .tour-bar,body.screen-on .tour-bar{background:#0F1B3D;border-color:#4080FF}' +
    '.tour-bar .tb-head b, body.dark .tour-bar .tb-title,body.screen-on .tour-bar .tb-head b,body.screen-on .tour-bar .tb-title{color:#E9F0FC}' +
    'body.dark .tour-bar .tb-say,body.screen-on .tour-bar .tb-say{color:#B8C8E8;background:rgba(22,93,255,.12)}' +
    'body.dark .tour-bar .tb-btn,body.screen-on .tour-bar .tb-btn{background:#16244B;border-color:#2A3B66;color:#B8C8E8}' +
    'body.dark .tour-bar .tb-go,body.screen-on .tour-bar .tb-go{background:#165DFF;color:#FFF;border-color:#165DFF}';
  document.head.appendChild(css);
})();
