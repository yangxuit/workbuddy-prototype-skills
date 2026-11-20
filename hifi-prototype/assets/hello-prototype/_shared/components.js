/* ============================================================
 * components.js · 组件层（图标/导航/路由/反馈）
 * 五层零依赖架构之组件层：IIFE 挂 window.CMP
 * 词表：icon(name,size) 自托管图标（<i data-icon> 占位幂等替换）
 *      NAV_DOCS 导航唯一事实源（禁止页面手写导航）
 *      toast / confirmModal / contentModal / beep
 *      initDoc / initAdminDoc（hash 路由 + 视图生命周期）
 * ============================================================ */
(function () {
  /* ---- 图标字典（Lucide path 精选 24 个，viewBox 0 0 24 24）---- */
  var ICONS = {
    'monitor': 'M8 3H4a2 2 0 0 0-2 2v4m18-4a2 2 0 0 0-2-2h-4m0 18h4a2 2 0 0 0 2-2v-4M2 15v4a2 2 0 0 0 2 2h4',
    'bell': 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
    'alert-triangle': 'M21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4m0 4h.01',
    'check-circle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    'activity': 'M22 12h-4l-3 9L9 3l-3 9H2',
    'settings': 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    'x': 'M18 6 6 18M6 6l12 12',
    'chevron-right': 'm9 18 6-6-6-6',
    'chevron-left': 'm15 18-6-6 6-6',
    'zap': 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
    'clock': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4 2',
    'phone': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
    'wrench': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    'factory': 'M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z M17 18h1M12 18h1M7 18h1',
    'shield': 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'file-text': 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z M14 2v4a2 2 0 0 0 2 2h4M10 9H8m6 4H8m6 4H8',
    'play': 'm6 3 14 9-14 9V3z',
    'search': 'm21 21-4.34-4.34M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z',
    'plus': 'M5 12h14M12 5v14',
    'menu': 'M4 6h16M4 12h16M4 18h16',
    'cpu': 'M4 4h16v16H4zM9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3',
    'database': 'M12 8c4.97 0 9-1.343 9-3s-4.03-3-9-3-9 1.343-9 3 4.03 3 9 3zM21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5',
    'trending-up': 'm22 7-8.5 8.5-5-5L2 17M16 7h6v6'
  };

  function icon(name, size) {
    var p = ICONS[name] || ICONS['activity'];
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + p + '"/></svg>';
  }

  /* ---- NAV_DOCS：导航唯一事实源（顶栏/侧栏/抽屉三处由它注入）---- */
  var NAV_DOCS = [
    { no: '01', name: '设备监控', file: '01-设备监控.html', icon: 'monitor' },
    { no: '02', name: '告警中心', file: '02-告警中心.html', icon: 'bell', disabled: true, note: 'P1 规划中' }
  ];

  /* ---- Toast（右上角四态）---- */
  function toast(type, title, desc) {
    var root = document.getElementById('toast-root');
    if (!root) { root = document.createElement('div'); root.id = 'toast-root'; document.body.appendChild(root); }
    var colors = { success: '#00B42A', warning: '#FF7D00', info: '#165DFF', danger: '#F53F3F' };
    var icons = { success: 'check-circle', warning: 'alert-triangle', info: 'bell', danger: 'zap' };
    var t = document.createElement('div');
    t.className = 'a-toast';
    t.innerHTML = icon(icons[type] || 'bell') + '<div><b>' + title + '</b>' + (desc ? '<span>' + desc + '</span>' : '') + '</div>';
    t.style.borderLeft = '3px solid ' + (colors[type] || colors.info);
    root.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }, 3600);
  }

  /* ---- confirmModal（危险操作二次确认；Esc/遮罩关闭）---- */
  function confirmModal(opts) {
    return new Promise(function (resolve) {
      var mask = document.createElement('div');
      mask.className = 'a-mask';
      mask.innerHTML =
        '<div class="a-modal"><div class="a-modal-t">' + (opts.title || '确认操作') + '</div>' +
        '<div class="a-modal-d">' + (opts.desc || '') + '</div>' +
        '<div class="a-modal-btns"><button class="btn" data-r="0">取消</button>' +
        '<button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" data-r="1">' + (opts.okText || '确认') + '</button></div></div>';
      function done(r) { mask.remove(); document.removeEventListener('keydown', esc); resolve(!!r); }
      function esc(e) { if (e.key === 'Escape') done(0); }
      mask.addEventListener('click', function (e) { if (e.target === mask) done(0); });
      mask.querySelectorAll('[data-r]').forEach(function (b) { b.onclick = function () { done(b.getAttribute('data-r')); }; });
      document.addEventListener('keydown', esc);
      document.body.appendChild(mask);
    });
  }

  /* ---- contentModal（通用内容弹窗）---- */
  function contentModal(opts) {
    var mask = document.createElement('div');
    mask.className = 'a-mask';
    mask.innerHTML = '<div class="a-modal ' + (opts.wide ? 'a-modal-wide' : '') + '"><div class="a-modal-t">' + (opts.title || '') +
      '<button class="a-modal-x">' + icon('x', 14) + '</button></div><div class="a-modal-body">' + opts.html + '</div></div>';
    function close() { mask.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    mask.querySelector('.a-modal-x').onclick = close;
    document.addEventListener('keydown', esc);
    document.body.appendChild(mask);
    return { close: close, el: mask };
  }

  /* ---- beep（WebAudio 合成 880Hz，无音频文件）---- */
  function beep() {
    try {
      var ctx = beep.ctx = beep.ctx || new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .35);
      o.start(); o.stop(ctx.currentTime + .36);
    } catch (e) { }
  }

  /* ---- 时钟（顶栏）---- */
  function startClock(el) {
    function tick() { el.textContent = new Date().toTimeString().slice(0, 8); }
    tick(); return setInterval(tick, 1000);
  }

  /* ---- hash 路由 + 视图生命周期（initAdminDoc）----
   * views: { key: { onEnter, onLeave, dark } }
   * 懒加载：XXSTATE.built 标志由页面 onEnter 自管；
   * 有轮询/定时器的视图必须实现 onLeave 清理。
   * hash 语法：#/view（视图）/ #/view@tab（页内 Tab 直达）/ #/view?key=v（查询参数） */
  function initAdminDoc(cfg) {
    var views = cfg.views, cur = null;
    function apply() {
      var key = (location.hash.replace(/^#\//, '').split('@')[0].split('?')[0]) || cfg.defaultView;
      var v = views[key] || views[cfg.defaultView];
      if (!v) return;
      if (cur && views[cur] && views[cur].onLeave) views[cur].onLeave();
      document.querySelectorAll('.view').forEach(function (s) { s.classList.remove('on'); });
      var sec = document.querySelector('.view[data-view="' + key + '"]') || document.querySelector('.view[data-view="' + cfg.defaultView + '"]');
      if (sec) sec.classList.add('on');
      document.body.classList.toggle('screen-on', !!v.dark);
      cur = key; v.onEnter && v.onEnter(key);
      /* 页内 Tab 直达：#/view@tab */
      var tab = (location.hash.split('@')[1] || '').split('?')[0];
      if (tab) { var tb = sec && sec.querySelector('.a-tabs [data-tab="' + tab + '"]'); if (tb) tb.click(); }
    }
    window.addEventListener('hashchange', apply);
    apply();
  }

  /* ---- 导航注入（侧栏由 NAV_DOCS 生成，禁止页面手写）---- */
  function injectNav(docFile, mountId) {
    var mount = document.getElementById(mountId || 'side-nav');
    if (!mount) return;
    mount.innerHTML = NAV_DOCS.map(function (d) {
      var on = d.file === docFile;
      if (d.disabled) return '<div class="nav-item nav-disabled" title="' + d.note + '">' + icon(d.icon) + d.name + '<span class="a-tag wait">' + d.note + '</span></div>';
      return '<a class="nav-item' + (on ? ' on' : '') + '" href="' + d.file + '">' + icon(d.icon) + d.name + '</a>';
    }).join('');
  }

  /* ---- <i data-icon> 占位符幂等替换 ---- */
  function hydrateIcons(root) {
    (root || document).querySelectorAll('i[data-icon]').forEach(function (el) {
      if (!el.getAttribute('data-done')) { el.innerHTML = icon(el.getAttribute('data-icon'), el.getAttribute('data-size') || 16); el.setAttribute('data-done', '1'); }
    });
  }

  window.CMP = {
    icon: icon, NAV_DOCS: NAV_DOCS,
    toast: toast, confirmModal: confirmModal, contentModal: contentModal,
    beep: beep, startClock: startClock,
    initAdminDoc: initAdminDoc, injectNav: injectNav, hydrateIcons: hydrateIcons
  };
})();
