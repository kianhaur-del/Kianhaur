<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ETH &amp; 黄金 · 永续短线 Pro</title>
    <style>
      :root {
        --bg:#0b0e11; --panel:#1e2329; --panel-2:#0f1318; --border:#2b3139;
        --text:#eaecef; --muted:#848e9c; --dim:#474d57;
        --green:#0ecb81; --red:#f6465d; --gold:#f0b90b;
      }
      * { box-sizing: border-box; }
      body {
        background:var(--bg); color:var(--text); margin:0; padding:10px;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
        display:flex; flex-direction:column; align-items:center;
        min-height:100vh; -webkit-tap-highlight-color:transparent;
      }
      .wrap { width:100%; max-width:520px; }
      .header {
        width:100%; display:flex; justify-content:space-between; align-items:center;
        padding-bottom:10px; border-bottom:1px solid var(--border); margin-bottom:12px; gap:8px;
        flex-wrap:wrap;
      }
      .brand { font-size:15px; font-weight:700; letter-spacing:.3px; }
      .brand small { color:var(--muted); font-weight:400; font-size:10px; margin-left:4px; }
      .status-area { display:flex; align-items:center; gap:10px; font-size:11px; color:var(--muted); }
      .dot { width:7px; height:7px; border-radius:50%; background:var(--muted); display:inline-block; transition:background .2s; }
      .dot.online { background:var(--green); box-shadow:0 0 6px rgba(14,203,129,.6); }
      .dot.offline { background:var(--red); }
      .dot.warn { background:var(--gold); }
      .tools { display:flex; gap:5px; flex-wrap:wrap; width:100%; justify-content:flex-end; }
      .tool-btn {
        background:none; border:1px solid var(--gold); color:var(--gold);
        border-radius:5px; padding:3px 7px; font-size:10.5px; cursor:pointer;
        transition:background .15s, border-color .15s;
      }
      .tool-btn:active { background:var(--gold); color:#000; }
      .tool-btn.active { background:var(--green); border-color:var(--green); color:#000; }
      .tool-btn.off { opacity:.55; }
      .section { margin-bottom:12px; }
      .symbol-title {
        font-size:13px; font-weight:600; color:var(--gold); margin-bottom:6px;
        display:flex; justify-content:space-between; align-items:baseline;
      }
      .symbol-title .meta-right { color:var(--muted); font-weight:400; font-size:11.5px; }
      .card {
        background:var(--panel); border-radius:10px; padding:12px;
        border:1px solid var(--border); margin-bottom:8px;
        transition:border-color .3s;
      }
      @keyframes flash-green { 0%,100%{border-color:var(--border);} 50%{border-color:var(--green);} }
      @keyframes flash-red   { 0%,100%{border-color:var(--border);} 50%{border-color:var(--red);} }
      @keyframes flash-arm   { 0%,100%{border-color:var(--border);} 50%{border-color:var(--gold);} }
      .card.flash-long  { animation:flash-green 1.1s ease-in-out 3; border-color:var(--green); }
      .card.flash-short { animation:flash-red   1.1s ease-in-out 3; border-color:var(--red); }
      .card.flash-pause { border-color:var(--gold); box-shadow:0 0 8px rgba(240,185,11,.25); }
      .card.flash-arm   { animation:flash-arm 1.8s ease-in-out 3; border-color:var(--gold); }
      .row { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:12.5px; color:var(--muted); }
      .row:last-child { margin-bottom:0; }
      .value { color:var(--text); font-family:"SF Mono",Consolas,monospace; font-size:13.5px; font-weight:600; }
      .bid { color:var(--green); } .ask { color:var(--red); }
      .signal-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0 4px; }
      .signal-text { font-size:17px; font-weight:700; letter-spacing:.4px; }
      .strength-wrap { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--muted); }
      .strength-bar { width:60px; height:5px; background:var(--panel-2); border-radius:3px; overflow:hidden; }
      .strength-fill { height:100%; width:0%; background:linear-gradient(90deg,var(--gold),var(--green)); transition:width .3s; }
      .risk-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:6px; }
      .risk-item { background:var(--panel-2); border-radius:6px; padding:6px; text-align:center; border:1px solid var(--border); }
      .risk-label { font-size:10px; color:var(--muted); margin-bottom:2px; }
      .risk-value { font-family:"SF Mono",Consolas,monospace; font-size:13px; font-weight:700; }
      .sl { color:var(--red); } .tp { color:var(--green); }
      .snap {
        display:none; margin-top:7px; padding:7px 9px; background:var(--panel-2);
        border:1px dashed var(--border); border-radius:6px;
        font-size:10.5px; color:var(--muted); line-height:1.7; font-family:"SF Mono",Consolas,monospace;
      }
      .snap b { color:var(--gold); font-weight:600; }
      .snap .hl { color:var(--text); }
      .cooldown-bar { margin-top:6px; height:3px; background:var(--panel-2); border-radius:2px; overflow:hidden; display:none; }
      .cooldown-fill { height:100%; width:100%; background:var(--gold); transition:width 1s linear; }
      .meta { font-size:10px; color:var(--dim); text-align:right; margin-top:5px; font-family:"SF Mono",Consolas,monospace; }
      .meta.stale { color:var(--gold); }
      .meta.error { color:var(--red); }
      .stats {
        display:grid; grid-template-columns:repeat(4,1fr); gap:6px;
        background:var(--panel); border-radius:10px; border:1px solid var(--border);
        padding:8px 10px; margin-bottom:8px;
      }
      .stat { text-align:center; }
      .stat-label { font-size:9.5px; color:var(--muted); margin-bottom:2px; }
      .stat-value { font-family:"SF Mono",Consolas,monospace; font-size:14px; font-weight:700; color:var(--text); }
      .stat-value.g { color:var(--green); } .stat-value.r { color:var(--red); }
      .history-list {
        background:var(--panel); border-radius:10px; border:1px solid var(--border);
        padding:4px 10px; max-height:340px; overflow-y:auto;
        scrollbar-width:thin; scrollbar-color:var(--dim) transparent;
      }
      .history-list::-webkit-scrollbar { width:4px; }
      .history-list::-webkit-scrollbar-thumb { background:var(--dim); border-radius:2px; }
      .history-item { display:flex; flex-direction:column; gap:2px; padding:7px 2px; border-bottom:1px solid var(--border); }
      .history-item:last-child { border-bottom:none; }
      .h-line1 { display:flex; align-items:center; gap:6px; font-size:11px; }
      .h-line2 { display:flex; gap:10px; font-size:10px; color:var(--muted); font-family:"SF Mono",Consolas,monospace; padding-left:58px; flex-wrap:wrap; }
      .h-time { color:var(--muted); font-family:"SF Mono",Consolas,monospace; font-size:10px; min-width:52px; }
      .h-sym { color:var(--text); font-weight:600; min-width:28px; }
      .h-type { padding:1px 6px; border-radius:4px; font-size:9.5px; font-weight:700; }
      .h-type.long  { background:rgba(14,203,129,.15); color:var(--green); }
      .h-type.short { background:rgba(246,70,93,.15); color:var(--red); }
      .h-type.tp    { background:rgba(14,203,129,.15); color:var(--green); }
      .h-type.sl    { background:rgba(246,70,93,.15); color:var(--red); }
      .h-fake { padding:1px 5px; border-radius:4px; font-size:9px; background:rgba(240,185,11,.15); color:var(--gold); font-weight:700; }
      .h-price { margin-left:auto; color:var(--gold); font-family:"SF Mono",Consolas,monospace; font-size:11px; font-weight:600; }
      .history-empty { text-align:center; color:var(--dim); font-size:11px; padding:18px 0; }
      .btn {
        background:var(--panel); color:var(--text); border:1px solid var(--border);
        padding:11px; border-radius:9px; width:100%; font-size:13.5px; font-weight:600;
        margin-bottom:10px; cursor:pointer; transition:background .15s, border-color .15s;
      }
      .btn:active { background:var(--border); }
      .btn.danger { border-color:rgba(246,70,93,.5); color:var(--red); }
      .btn.danger:active { background:rgba(246,70,93,.12); }
      .warning { font-size:10.5px; color:var(--muted); text-align:center; line-height:1.6; padding:0 4px 12px; }
      .warning b { color:var(--gold); }
      .error-banner {
        display:none; background:rgba(246,70,93,.1); border:1px solid rgba(246,70,93,.4);
        color:var(--red); font-size:11px; padding:8px 10px; border-radius:8px;
        margin-bottom:8px; line-height:1.5;
      }
      #alertOverlay {
        display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(11, 14, 17, 0.95); z-index: 9999;
        flex-direction: column; justify-content: center; align-items: center;
        padding: 20px; text-align: center; backdrop-filter: blur(5px);
      }
      #alertOverlay .alert-content {
        background: var(--panel); border: 2px solid var(--gold); border-radius: 12px;
        padding: 25px 20px; width: 100%; max-width: 320px;
        box-shadow: 0 0 30px rgba(240, 185, 11, 0.4);
        animation: alertPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      #alertOverlay .alert-title { font-size: 20px; font-weight: 800; color: var(--gold); margin-bottom: 10px; }
      #alertOverlay .alert-body { font-size: 14px; color: var(--text); margin-bottom: 20px; line-height: 1.5; font-family: monospace; }
      #alertOverlay .alert-btn {
        background: var(--green); color: #000; border: none; padding: 12px 20px;
        border-radius: 8px; font-size: 15px; font-weight: 700; width: 100%; cursor: pointer;
      }
      @keyframes alertPop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      #wakeVideo { position: fixed; top: -100px; left: -100px; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="header">
        <div class="brand">
          永续短线信号
          <small>Pro</small>
        </div>
        <div class="status-area">
          <span class="dot" id="netEth"></span>
          ETH
          <span class="dot" id="netGold"></span>
          黄金
        </div>
        <div class="tools">
          <button class="tool-btn active" id="pullbackBtn">📉 回调</button>
          <button class="tool-btn active" id="fakeBtn">⚡ 假破</button>
          <button class="tool-btn" id="wakeLockBtn">💡 常亮</button>
          <button class="tool-btn" id="notifyBtn">🔔 通知</button>
          <button class="tool-btn" id="soundBtn">🎵 音效</button>
        </div>
      </div>

      <div class="error-banner" id="errorBanner"></div>

      <div class="section">
        <div class="symbol-title">
          <span>
            ETH/USDT 永续
            <span id="ethTrend" style="color:var(--muted);font-weight:400;font-size:11px;margin-left:8px;">
              [15m: -- 1h: -- 4h: --]
            </span>
          </span>
          <span class="meta-right" id="ethDayChg">日涨跌: --</span>
        </div>
        <div class="card" id="ethCard">
          <div class="row">
            <span>最新价</span>
            <span class="value" id="ethLast">--</span>
          </div>
          <div class="row">
            <span>买一 / 卖一</span>
            <span class="value">
              <span class="bid" id="ethBid">--</span>
              /
              <span class="ask" id="ethAsk">--</span>
            </span>
          </div>
          <div class="signal-row">
            <div class="signal-text" id="ethSignal" style="color:var(--muted)">等待数据…</div>
            <div class="strength-wrap">
              <span>强度</span>
              <div class="strength-bar"><div class="strength-fill" id="ethStrength"></div></div>
            </div>
          </div>
          <div class="risk-grid" id="ethRiskBox" style="display:none;">
            <div class="risk-item">
              <div class="risk-label">止损 SL</div>
              <div class="risk-value sl" id="ethSL">--</div>
            </div>
            <div class="risk-item">
              <div class="risk-label">止盈 TP</div>
              <div class="risk-value tp" id="ethTP">--</div>
            </div>
          </div>
          <div class="cooldown-bar" id="ethCooldownBar"><div class="cooldown-fill" id="ethCooldownFill"></div></div>
          <div class="snap" id="ethSnap"></div>
          <div class="meta" id="ethMeta">--</div>
        </div>
      </div>

      <div class="section">
        <div class="symbol-title">
          <span>
            黄金永续
            <span id="goldCodeTag" style="color:var(--muted);font-weight:400;font-size:11px;">(PAXG-USDT)</span>
            <span id="goldTrend" style="color:var(--muted);font-weight:400;font-size:11px;margin-left:8px;">
              [15m: -- 1h: -- 4h: --]
            </span>
          </span>
          <span class="meta-right" id="goldDayChg">日涨跌: --</span>
        </div>
        <div class="card" id="goldCard">
          <div class="row">
            <span>最新价</span>
            <span class="value" id="goldLast">--</span>
          </div>
          <div class="row">
            <span>买一 / 卖一</span>
            <span class="value">
              <span class="bid" id="goldBid">--</span>
              /
              <span class="ask" id="goldAsk">--</span>
            </span>
          </div>
          <div class="signal-row">
            <div class="signal-text" id="goldSignal" style="color:var(--muted)">等待数据…</div>
            <div class="strength-wrap">
              <span>强度</span>
              <div class="strength-bar"><div class="strength-fill" id="goldStrength"></div></div>
            </div>
          </div>
          <div class="risk-grid" id="goldRiskBox" style="display:none;">
            <div class="risk-item">
              <div class="risk-label">止损 SL</div>
              <div class="risk-value sl" id="goldSL">--</div>
            </div>
            <div class="risk-item">
              <div class="risk-label">止盈 TP</div>
              <div class="risk-value tp" id="goldTP">--</div>
            </div>
          </div>
          <div class="cooldown-bar" id="goldCooldownBar"><div class="cooldown-fill" id="goldCooldownFill"></div></div>
          <div class="snap" id="goldSnap"></div>
          <div class="meta" id="goldMeta">--</div>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">信号</div>
          <div class="stat-value" id="statTotal">0</div>
        </div>
        <div class="stat">
          <div class="stat-label">止盈</div>
          <div class="stat-value g" id="statTp">0</div>
        </div>
        <div class="stat">
          <div class="stat-label">止损</div>
          <div class="stat-value r" id="statSl">0</div>
        </div>
        <div class="stat">
          <div class="stat-label">胜率</div>
          <div class="stat-value" id="statWin">--</div>
        </div>
      </div>

      <button class="btn danger" id="resetBtn">强制重置 / 解除锁定</button>

      <div class="section">
        <div class="symbol-title">
          <span>📜 最近两天信号</span>
          <span class="meta-right" id="historyCount">0 条</span>
        </div>
        <div class="history-list" id="historyList">
          <div class="history-empty">暂无记录</div>
        </div>
      </div>

      <div class="warning">
        ⚠️
        <b>大周期突破需两根K线确认</b>
        ：15m / 1h / 4h 任一周期「第一根突破K线不算」，必须「第二根K线高点&gt;第一根突破K线高点」(多头)
        或「低点&lt;第一根突破K线低点」(空头)，才算完成突破。
        <br />
        <b>两路进场可选</b>
        ：📉 回调确认（15m/1h/4h 共振）、⚡ 假破反打（不受大周期限制）。
        <br />
        买一/卖一价触及即判定 TP/SL，可捕捉插针。
        <br />
        <span style="color:var(--gold);">同向信号 30 分钟内静默防抖，防止后台重载导致重复报警。</span>
        <br />
        <span style="color:var(--green);">☁️ 云端模式：本页仅展示云端状态，关掉页面云端照常监控，信号通过 Telegram 推送。</span>
      </div>
    </div>

    <div id="alertOverlay">
      <div class="alert-content">
        <div class="alert-title" id="alertTitle">交易提醒</div>
        <div class="alert-body" id="alertBody">信号已触发</div>
        <button class="alert-btn" onclick="document.getElementById('alertOverlay').style.display='none'">
          我知道了
        </button>
      </div>
    </div>

    <video id="wakeVideo" loop="" muted="" playsinline="">
      <source
        src="data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAA1tZGF0"
        type="video/mp4"
      />
    </video>

    <script>
      (function () {
        'use strict';

        /* ===== 云端模式配置 ===== */
        const CLOUD_MODE = true;                                    // ← 关键开关
        const CLOUD_URL = 'https://你的云端地址/status';             // ← 改成你的地址
        const cloudInitialized = new Set();                          // 首次加载不触发响铃

        async function fetchCloudJson(url) {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return await res.json();
        }

        const CFG = {
          refreshMs: 2000,
          windowMs: 10 * 60 * 1000,
          minSamples: 20,
          momentumThreshold: 0.0004,
          tpRR: 1.5,
          cooldownMs: 15 * 60 * 1000,
          resetCooldownMs: 5 * 60 * 1000,
          duplicateCooldownMs: 30 * 60 * 1000,
          confirmTicks: 2,
          fetchTimeoutMs: 3500,
          contracts: {
            eth: 'ETH-USDT',
            gold: 'PAXG-USDT'
          },
          historyTTL: 2 * 24 * 60 * 60 * 1000,
          historyMax: 200,
          storageKey: 'perp_pro_state_v9',
          historyKey: 'perp_pro_history_v8',
          modeKey: 'perp_pro_modes_v3',
          maxFailuresBeforeWarn: 5
        };

        const MODES = { pullback: true, fake: true };

        function loadModes() {
          try {
            const m = JSON.parse(localStorage.getItem(CFG.modeKey) || '{}');
            if (typeof m.pullback === 'boolean') MODES.pullback = m.pullback;
            if (typeof m.fake === 'boolean') MODES.fake = m.fake;
            if (!MODES.pullback && !MODES.fake) MODES.pullback = true;
          } catch (e) {}
        }
        function saveModes() {
          try { localStorage.setItem(CFG.modeKey, JSON.stringify(MODES)); } catch (e) {}
        }

        const PB = {
          setupGapPct:  0.0003,
          minDepthPct:  0.0006,
          maxDepthPct:  0.0120,
          vwapTol:      0.0035,
          reboundPct:   0.0004,
          confirmTicks: 1,
          ttlMs:        10 * 60 * 1000,
          cancelCooldownMs: 20 * 1000,
          slBuffer:     0.0015,
          minSLPct:     0.0030,
          maxSLPct:     0.0100,
          vwapBreakTicksToCancel: 2,
          emaCrossTicksToCancel:  2,
          minPullbackDepth: 0.0006
        };

        const FAKE = {
          swingLookback: 60,
          swingExclude: 5,
          breakTolerancePct: 0.00012,
          reclaimPct: 0.0004,
          maxTicksToReclaim: 12,
          minStrength: 20,
          cooldownMs: 8 * 60 * 1000,
          fakeTTLMs: 5 * 60 * 1000,
          weakReclaimGraceTicks: 4
        };

        const SOURCE_URLS = [
          (u) => u,
          (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
          (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
          (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
        ];
        let preferredSrc = 0;
        const srcBlockedUntil = new Array(SOURCE_URLS.length).fill(0);

        const elCache = Object.create(null);
        const $ = (id) => elCache[id] || (elCache[id] = document.getElementById(id));

        const pad2 = (v) => String(v).padStart(2, '0');

        function fmt(n) {
          if (!n || !isFinite(n) || n <= 0) return '--';
          if (n >= 1000) return n.toFixed(2);
          if (n >= 1) return n.toFixed(2);
          if (n >= 0.01) return n.toFixed(4);
          return n.toFixed(6);
        }
        function fmtPct(n) { return isFinite(n) ? ((n >= 0 ? '+' : '') + n.toFixed(2) + '%') : '--'; }
        function timeStr(ts) {
          if (!ts) return '--:--:--';
          const d = new Date(ts);
          return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
        }
        function fmtHistoryTime(ts) {
          const d = new Date(ts);
          const now = new Date();
          const t = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
          if (d.toDateString() === now.toDateString()) return t;
          const yd = new Date(now); yd.setDate(yd.getDate() - 1);
          if (d.toDateString() === yd.toDateString()) return '昨 ' + t;
          return `${d.getMonth() + 1}/${d.getDate()} ${t}`;
        }
        const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
        function setDot(id, cls) {
          const node = $(id);
          if (!node) return;
          const c = 'dot ' + cls;
          if (node.className !== c) node.className = c;
        }

        function showToast(msg) { alert(msg); }

        let audioCtx = null;
        function initAudio() {
          if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
          }
          if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        }
        document.addEventListener('pointerdown', initAudio, { once: true });

        function playAlert() {
          if (!audioCtx) return;
          const now = audioCtx.currentTime;
          const ring = (delay) => {
            const t = now + delay;
            const osc1 = audioCtx.createOscillator(); const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc1.type = 'sine'; osc2.type = 'sine';
            osc1.frequency.setValueAtTime(880, t); osc2.frequency.setValueAtTime(1174.7, t);
            gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.5, t + 0.04);
            gain.gain.setValueAtTime(0.5, t + 0.30); gain.gain.linearRampToValueAtTime(0, t + 0.36);
            osc1.connect(gain); osc2.connect(gain); gain.connect(audioCtx.destination);
            osc1.start(t); osc1.stop(t + 0.4); osc2.start(t); osc2.stop(t + 0.4);
          };
          ring(0); ring(0.45);
        }

        let useSystemNotify = false;
        let internalNotifyEnabled = false;
        function checkNotifySupport() {
          return 'Notification' in window && window.location.protocol !== 'content:';
        }
        function sendNotification(title, body) {
          if (useSystemNotify && Notification.permission === 'granted') {
            try { new Notification(title, { body, requireInteraction: true, tag: 'perp-signal' }); } catch (e) {}
          }
          if (internalNotifyEnabled) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
            $('alertTitle').textContent = title;
            $('alertBody').textContent = body;
            $('alertOverlay').style.display = 'flex';
          }
        }

        let wakeLock = null;
        let videoMode = false;
        async function toggleWakeLock() {
          const btn = $('wakeLockBtn');
          const video = $('wakeVideo');
          if ('wakeLock' in navigator && !videoMode) {
            try {
              if (wakeLock) {
                await wakeLock.release(); wakeLock = null;
                btn.classList.remove('active'); btn.textContent = '💡 常亮';
                showToast('已取消屏幕常亮');
              } else {
                wakeLock = await navigator.wakeLock.request('screen');
                btn.classList.add('active'); btn.textContent = '☀️ 常亮中(系统)';
                wakeLock.addEventListener('release', () => {
                  if(!videoMode) { btn.classList.remove('active'); btn.textContent = '💡 常亮'; wakeLock = null; }
                });
              }
              return;
            } catch (e) { console.warn('WakeLock API failed', e); }
          }
          videoMode = !videoMode;
          if (videoMode) {
            try {
              video.play();
              btn.classList.add('active'); btn.textContent = '☀️ 常亮中(降级)';
              showToast('已开启视频常亮模式。');
            } catch (err) {
              btn.classList.remove('active'); btn.textContent = '💡 常亮'; videoMode = false;
              showToast('常亮启动失败。');
            }
          } else {
            video.pause(); btn.classList.remove('active'); btn.textContent = '💡 常亮';
            showToast('已关闭常亮');
          }
        }

        async function fetchWithTimeout(url, timeoutMs) {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), timeoutMs);
          try {
            const res = await fetch(url, { signal: ctrl.signal, mode: 'cors', cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return await res.json();
          } finally { clearTimeout(timer); }
        }

        async function fetchFast(url, timeoutMs) {
          const now = Date.now();
          const order = [];
          for (let i = 0; i < SOURCE_URLS.length; i++) {
            const idx = (preferredSrc + i) % SOURCE_URLS.length;
            if (srcBlockedUntil[idx] <= now) order.push(idx);
          }
          if (!order.length) order.push(preferredSrc);

          let lastErr = null;
          for (const idx of order) {
            try {
              const data = await fetchWithTimeout(SOURCE_URLS[idx](url), timeoutMs);
              preferredSrc = idx;
              srcBlockedUntil[idx] = 0;
              return data;
            } catch (e) {
              lastErr = e;
              srcBlockedUntil[idx] = Date.now() + (idx === preferredSrc ? 15000 : 45000);
            }
          }
          throw lastErr || new Error('All sources failed');
        }

        const API_BASE = 'https://api.hbdm.com';

        async function fetchMarket(code) {
          const detailUrl = `${API_BASE}/linear-swap-ex/market/detail/merged?contract_code=${code}`;
          const klineUrl  = `${API_BASE}/linear-swap-ex/market/history/kline?contract_code=${code}&period=1min&size=1`;

          const j = await fetchFast(detailUrl, CFG.fetchTimeoutMs);
          if (!j || j.status !== 'ok' || !j.tick) throw new Error('bad payload');
          const t = j.tick;
          const out = {
            last: parseFloat(t.close) || 0,
            bid: parseFloat(t.bid && t.bid[0]) || 0,
            ask: parseFloat(t.ask && t.ask[0]) || 0,
            open: parseFloat(t.open) || 0,
            kline: null
          };

          try {
            const k = await fetchWithTimeout(SOURCE_URLS[preferredSrc](klineUrl), 2500);
            if (k && k.status === 'ok' && Array.isArray(k.data) && k.data.length) {
              const bar = k.data[0];
              out.kline = { id: bar.id, vol: parseFloat(bar.vol) || 0 };
            }
          } catch (e) {}

          return out;
        }

        async function fetchTrend(code, period, size) {
          const s = size || 5;
          const url = `${API_BASE}/linear-swap-ex/market/history/kline?contract_code=${code}&period=${period}&size=${s}`;
          try {
            const k = await fetchWithTimeout(SOURCE_URLS[preferredSrc](url), 2500);
            if (k && k.status === 'ok' && Array.isArray(k.data) && k.data.length >= 4) {
              const c1 = k.data[1];
              const c2 = k.data[2];
              const c3 = k.data[3];

              const o1 = parseFloat(c1.open), cl1 = parseFloat(c1.close), h1 = parseFloat(c1.high), lo1 = parseFloat(c1.low);
              const o2 = parseFloat(c2.open), cl2 = parseFloat(c2.close), h2 = parseFloat(c2.high), lo2 = parseFloat(c2.low);
              const h3 = parseFloat(c3.high), lo3 = parseFloat(c3.low);

              const isBull = (cl2 > o2) && (cl2 > h3) && (cl1 > o1) && (h1 > h2);
              const isBear = (cl2 < o2) && (cl2 < lo3) && (cl1 < o1) && (lo1 < lo2);

              if (isBull) return 'BULL';
              if (isBear) return 'BEAR';
            }
          } catch (e) {}
          return 'NEUTRAL';
        }

        function fetch15mTrend(code) { return fetchTrend(code, '15min', 5); }
        function fetch1hTrend(code)  { return fetchTrend(code, '60min', 5); }
        function fetch4hTrend(code)  { return fetchTrend(code, '4hour', 5); }

        function mkAsset() {
          return {
            last: 0, bid: 0, ask: 0, open: 0, dayChg: 0,
            samples: [], lastTs: 0, ok: false, failCount: 0,
            state: 'WAIT', signal: 'WAIT',
            sl: 0, tp: 0, strength: 0, cooldownUntil: 0, confirmCount: 0,
            entrySnapshot: null, klineId: null, klineVol: 0, _fetching: false,
            stage: 'IDLE', dir: null, breakExtreme: 0,
            pullbackLow: 0, pullbackHigh: 0, breakTs: 0,
            fakeStage: 'IDLE', fakeLevel: 0, fakeExtreme: 0, fakeStartTs: 0, fakeTicks: 0,
            cancelReason: '', cancelTs: 0,
            belowVwapTicks: 0, aboveVwapTicks: 0, emaCrossTicks: 0,
            fakeWeakReclaimTicks: 0,
            m15Trend: 'NEUTRAL', m1hTrend: 'NEUTRAL', m4hTrend: 'NEUTRAL',
            last15mFetch: 0, last1hFetch: 0, last4hFetch: 0
          };
        }
        const state = { eth: mkAsset(), gold: mkAsset(), history: [] };

        let saveTimer = null;
        function scheduleSave(force) {
          if (force) {
            if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
            saveStateNow();
            return;
          }
          if (saveTimer) return;
          saveTimer = setTimeout(() => { saveTimer = null; saveStateNow(); }, 15000);
        }

        function saveStateNow() {
          try {
            const dump = {};
            for (const k of ['eth', 'gold']) {
              const a = state[k];
              dump[k] = {
                samples: a.samples, state: a.state, signal: a.signal,
                sl: a.sl, tp: a.tp, strength: a.strength,
                cooldownUntil: a.cooldownUntil, confirmCount: a.confirmCount,
                last: a.last, bid: a.bid, ask: a.ask, open: a.open, dayChg: a.dayChg,
                lastTs: a.lastTs, entrySnapshot: a.entrySnapshot || null,
                stage: a.stage, dir: a.dir, breakExtreme: a.breakExtreme,
                pullbackLow: a.pullbackLow, pullbackHigh: a.pullbackHigh, breakTs: a.breakTs,
                fakeStage: a.fakeStage, fakeLevel: a.fakeLevel, fakeExtreme: a.fakeExtreme,
                fakeStartTs: a.fakeStartTs, fakeTicks: a.fakeTicks,
                cancelReason: a.cancelReason, cancelTs: a.cancelTs,
                m15Trend: a.m15Trend, m1hTrend: a.m1hTrend, m4hTrend: a.m4hTrend,
                date: todayStr()
              };
            }
            localStorage.setItem(CFG.storageKey, JSON.stringify(dump));
          } catch (e) {}
        }

        function loadState() {
          try {
            const dump = JSON.parse(localStorage.getItem(CFG.storageKey) || '{}');
            const now = Date.now(); const today = todayStr();
            for (const k of ['eth', 'gold']) {
              const saved = dump[k];
              if (!saved || saved.date !== today) continue;
              const a = state[k];
              a.samples = Array.isArray(saved.samples) ? saved.samples.filter((s) => s.ts >= now - CFG.windowMs) : [];
              a.state = saved.state || 'WAIT'; a.signal = saved.signal || 'WAIT';
              a.sl = saved.sl || 0; a.tp = saved.tp || 0; a.strength = saved.strength || 0;
              a.cooldownUntil = saved.cooldownUntil || 0; a.confirmCount = saved.confirmCount || 0;
              a.last = saved.last || 0; a.bid = saved.bid || 0; a.ask = saved.ask || 0; a.open = saved.open || 0; a.dayChg = saved.dayChg || 0;
              a.lastTs = saved.lastTs || 0; a.entrySnapshot = saved.entrySnapshot || null; a.klineId = null; a.klineVol = 0;
              a.cancelReason = saved.cancelReason || ''; a.cancelTs = saved.cancelTs || 0;
              a.m15Trend = saved.m15Trend || 'NEUTRAL';
              a.m1hTrend = saved.m1hTrend || 'NEUTRAL';
              a.m4hTrend = saved.m4hTrend || 'NEUTRAL';

              if (a.state === 'WAIT') {
                a.stage = ['IDLE', 'BREAKOUT', 'PULLBACK'].includes(saved.stage) ? saved.stage : 'IDLE';
                a.dir = saved.dir || null;
                a.breakExtreme = saved.breakExtreme || 0;
                a.pullbackLow = saved.pullbackLow || 0;
                a.pullbackHigh = saved.pullbackHigh || 0;
                a.breakTs = saved.breakTs || 0;
                if (a.stage !== 'IDLE' && (!a.breakTs || now - a.breakTs > PB.ttlMs)) { a.stage = 'IDLE'; a.dir = null; }

                a.fakeStage = ['IDLE', 'WATCH_DOWN', 'WATCH_UP'].includes(saved.fakeStage) ? saved.fakeStage : 'IDLE';
                a.fakeLevel = saved.fakeLevel || 0;
                a.fakeExtreme = saved.fakeExtreme || 0;
                a.fakeStartTs = saved.fakeStartTs || 0;
                a.fakeTicks = saved.fakeTicks || 0;
                if (a.fakeStage !== 'IDLE' && (!a.fakeLevel || !a.fakeExtreme || now - a.fakeStartTs > FAKE.fakeTTLMs)) {
                  a.fakeStage = 'IDLE'; a.fakeLevel = 0; a.fakeExtreme = 0; a.fakeTicks = 0;
                }
              } else {
                a.stage = 'IDLE'; a.dir = null;
                a.fakeStage = 'IDLE'; a.fakeLevel = 0; a.fakeExtreme = 0; a.fakeTicks = 0;
              }
            }
          } catch (e) {}
        }

        function pruneHistory() {
          const cutoff = Date.now() - CFG.historyTTL;
          state.history = state.history.filter((h) => h && h.ts >= cutoff);
          if (state.history.length > CFG.historyMax) state.history = state.history.slice(-CFG.historyMax);
        }
        function loadHistory() { try { state.history = JSON.parse(localStorage.getItem(CFG.historyKey) || '[]'); if (!Array.isArray(state.history)) state.history = []; pruneHistory(); } catch (e) { state.history = []; } }
        function saveHistory() { try { localStorage.setItem(CFG.historyKey, JSON.stringify(state.history)); } catch (e) {} }
        function addHistory(sym, type, asset, tag) {
          state.history.push({
            ts: Date.now(), sym, type, price: asset.last,
            bid: asset.bid, ask: asset.ask, sl: asset.sl, tp: asset.tp,
            tag: tag || null
          });
          pruneHistory(); saveHistory();
        }

        /* ===== 以下为原本地策略代码，云端模式不再调用，保留以备回退 ===== */
        function computeVolDelta(asset, kline) {
          if (!kline) return 0;
          if (asset.klineId === null) { asset.klineId = kline.id; asset.klineVol = kline.vol; return 0; }
          if (kline.id !== asset.klineId) { const completed = asset.klineVol; asset.klineId = kline.id; asset.klineVol = kline.vol; return Math.max(completed, 0); }
          const delta = kline.vol - asset.klineVol; asset.klineVol = kline.vol; return Math.max(delta, 0);
        }
        function pushSample(asset, price, vol) {
          if (!price || price <= 0) return;
          const now = Date.now(); asset.samples.push({ ts: now, price, vol: Math.max(vol, 0) });
          const cutoff = now - CFG.windowMs; while (asset.samples.length && asset.samples[0].ts < cutoff) asset.samples.shift();
        }
        function computeVWAP(asset) {
          if (!asset.samples.length) return 0;
          let pv = 0, v = 0; for (const s of asset.samples) { pv += s.price * s.vol; v += s.vol; }
          return v > 0 ? pv / v : asset.samples.reduce((sum, s) => sum + s.price, 0) / asset.samples.length;
        }
        function computeMomentum(asset, lookback) {
          const n = Math.min(lookback, asset.samples.length - 1); if (n < 1) return 0;
          const old = asset.samples[asset.samples.length - 1 - n].price; const cur = asset.samples[asset.samples.length - 1].price;
          return old > 0 ? (cur - old) / old : 0;
        }
        function computeEMA(samples, period) {
          if (samples.length < period) return 0;
          const k = 2 / (period + 1); let sum = 0;
          for (let i = 0; i < period; i++) sum += samples[i].price;
          let ema = sum / period;
          for (let i = period; i < samples.length; i++) ema = samples[i].price * k + ema * (1 - k);
          return ema;
        }
        function computeStrength(last, vwap, emaFast, emaSlow, mom) {
          if (!vwap || !emaSlow) return 0;
          const vwapDist = Math.abs(last - vwap) / vwap; const emaGap = Math.abs(emaFast - emaSlow) / emaSlow; const momAbs = Math.abs(mom);
          return Math.max(0, Math.min(100, Math.round((vwapDist / 0.005) * 30 + (emaGap / 0.003) * 30 + (momAbs / 0.002) * 40)));
        }

        function findSwing(asset) {
          const s = asset.samples;
          if (s.length < FAKE.swingLookback + FAKE.swingExclude) return null;
          const end = s.length - FAKE.swingExclude;
          const start = Math.max(0, end - FAKE.swingLookback);
          let low = Infinity, high = -Infinity;
          for (let i = start; i < end; i++) {
            if (s[i].price < low) low = s[i].price;
            if (s[i].price > high) high = s[i].price;
          }
          if (!isFinite(low) || !isFinite(high) || low <= 0 || high <= 0) return null;
          return { low, high };
        }

        function detectFakeBreak(asset, symName, vwap, emaFast, emaSlow, mom) {
          // ... 原逻辑保留，云端模式不执行
          return false;
        }
        function openFakeBreak() {}
        function openPosition() {}
        function setCancel() {}
        function setFakeCancel() {}
        function tickStateMachine() {}
        function checkTrigger() {}
        function evaluateSignal() {}
        async function refreshAsset() {}
        /* ===== 本地策略占位结束（云端模式不执行以上函数） ===== */

        /* ===== 云端状态合并 ===== */
        function applyCloud(asset, s, key) {
          if (!s) return;
          const prevState = asset.state;
          const firstSeen = !cloudInitialized.has(key);
          cloudInitialized.add(key);

          asset.last = s.last || 0;
          asset.bid = s.bid || 0;
          asset.ask = s.ask || 0;
          asset.open = s.open || 0;
          asset.dayChg = s.dayChg || 0;
          asset.state = s.state || 'WAIT';
          asset.signal = s.signal || 'WAIT';
          asset.sl = s.sl || 0;
          asset.tp = s.tp || 0;
          asset.strength = s.strength || 0;
          asset.cooldownUntil = s.cooldownUntil || 0;
          asset.stage = s.stage || 'IDLE';
          asset.dir = s.dir || null;
          asset.fakeStage = s.fakeStage || 'IDLE';
          asset.lastTs = s.lastTs || 0;
          asset.ok = !!s.ok;
          asset.failCount = s.failCount || 0;
          asset.sampleCount = s.sampleCount || 0;
          asset.m15Trend = s.m15Trend || 'NEUTRAL';
          asset.m1hTrend = s.m1hTrend || 'NEUTRAL';
          asset.m4hTrend = s.m4hTrend || 'NEUTRAL';
          asset.entrySnapshot = s.entrySnapshot || null;
          asset.cancelReason = s.cancelReason || '';
          asset.cancelTs = s.cancelTs || 0;

          const dotId = key === 'eth' ? 'netEth' : 'netGold';
          setDot(dotId, s.ok ? 'online' : ((s.failCount || 0) >= CFG.maxFailuresBeforeWarn ? 'offline' : 'warn'));

          if (!firstSeen && prevState === 'WAIT' && (asset.state === 'LONG' || asset.state === 'SHORT')) {
            playAlert();
            sendNotification(
              '云端信号',
              `${key === 'eth' ? 'ETH' : '黄金'} ${asset.state} @ ${fmt(asset.last)}`
            );
          }
        }

        const IDS = {
          eth: { card:'ethCard', last:'ethLast', bid:'ethBid', ask:'ethAsk', dayChg:'ethDayChg', trend:'ethTrend', signal:'ethSignal', strength:'ethStrength', riskBox:'ethRiskBox', sl:'ethSL', tp:'ethTP', snap:'ethSnap', meta:'ethMeta', cooldownBar:'ethCooldownBar', cooldownFill:'ethCooldownFill' },
          gold: { card:'goldCard', last:'goldLast', bid:'goldBid', ask:'goldAsk', dayChg:'goldDayChg', trend:'goldTrend', signal:'goldSignal', strength:'goldStrength', riskBox:'goldRiskBox', sl:'goldSL', tp:'goldTP', snap:'goldSnap', meta:'goldMeta', cooldownBar:'goldCooldownBar', cooldownFill:'goldCooldownFill' }
        };

        function renderAsset(asset, ids) {
          $(ids.last).textContent = fmt(asset.last); $(ids.bid).textContent = fmt(asset.bid); $(ids.ask).textContent = fmt(asset.ask);

          const dayEl = $(ids.dayChg);
          if (asset.last > 0) { dayEl.textContent = '日涨跌: ' + fmtPct(asset.dayChg); dayEl.style.color = asset.dayChg >= 0 ? 'var(--green)' : 'var(--red)'; }
          else { dayEl.textContent = '日涨跌: --'; dayEl.style.color = 'var(--muted)'; }

          const trendEl = $(ids.trend);
          if (trendEl) {
            const seg = (t) => t === 'BULL' ? '多↑' : t === 'BEAR' ? '空↓' : '-';
            const newText = `[15m:${seg(asset.m15Trend)} 1h:${seg(asset.m1hTrend)} 4h:${seg(asset.m4hTrend)}]`;
            if (trendEl.textContent !== newText) trendEl.textContent = newText;
            const tr = trendConfirmed(asset);
            const newColor = tr.bull ? 'var(--green)' : tr.bear ? 'var(--red)' : 'var(--muted)';
            if (trendEl.style.color !== newColor) trendEl.style.color = newColor;
          }

          const sigEl = $(ids.signal); sigEl.textContent = asset.signal;
          let color = 'var(--muted)';
          if (asset.state === 'LONG' || asset.state === 'TP_HIT') color = 'var(--green)';
          else if (asset.state === 'SHORT' || asset.state === 'SL_HIT') color = 'var(--red)';
          else if (asset.fakeStage === 'WATCH_DOWN' || asset.fakeStage === 'WATCH_UP') color = 'var(--gold)';
          else if (asset.stage === 'BREAKOUT' || asset.stage === 'PULLBACK') color = 'var(--gold)';
          sigEl.style.color = color;

          const sf = $(ids.strength);
          if (sf) {
            sf.style.width = (asset.strength || 0) + '%';
            const c = asset.strength >= 70 ? 'var(--green)' : asset.strength >= 40 ? 'var(--gold)' : 'var(--dim)';
            if (sf.dataset.c !== c) {
              sf.dataset.c = c;
              sf.style.background = `linear-gradient(90deg, var(--gold), ${c})`;
            }
          }

          const cardEl = $(ids.card);
          if (cardEl) {
            const cardSig = `${asset.state}|${asset.fakeStage}|${asset.stage}`;
            if (cardEl.dataset.sig !== cardSig) {
              cardEl.dataset.sig = cardSig;
              cardEl.className = 'card';
              if (asset.state === 'LONG') cardEl.classList.add('flash-long');
              else if (asset.state === 'SHORT') cardEl.classList.add('flash-short');
              else if (asset.state === 'TP_HIT' || asset.state === 'SL_HIT') cardEl.classList.add('flash-pause');
              else if (asset.fakeStage === 'WATCH_DOWN' || asset.fakeStage === 'WATCH_UP' || asset.stage === 'BREAKOUT' || asset.stage === 'PULLBACK') cardEl.classList.add('flash-arm');
            }
          }

          const inTrade = ['LONG','SHORT','TP_HIT','SL_HIT'].includes(asset.state);
          const riskBox = $(ids.riskBox);
          const rv = inTrade ? 'grid' : 'none';
          if (riskBox.style.display !== rv) riskBox.style.display = rv;
          if (inTrade) {
            $(ids.sl).textContent = fmt(asset.sl);
            $(ids.tp).textContent = fmt(asset.tp);
          }

          const cdBar = $(ids.cooldownBar); const cdFill = $(ids.cooldownFill);
          if (cdBar && cdFill) {
            if ((asset.state === 'TP_HIT' || asset.state === 'SL_HIT') && asset.cooldownUntil > Date.now()) {
              const remain = asset.cooldownUntil - Date.now();
              const pct = Math.max(0, Math.min(100, remain / CFG.cooldownMs * 100));
              if (cdBar.style.display !== 'block') cdBar.style.display = 'block';
              cdFill.style.width = pct + '%';
            } else if (cdBar.style.display !== 'none') {
              cdBar.style.display = 'none';
            }
          }

          const snapEl = $(ids.snap);
          if (snapEl) {
            const snapKey = asset.entrySnapshot ? String(asset.entrySnapshot.ts) : '';
            if (snapEl.dataset.key !== snapKey) {
              snapEl.dataset.key = snapKey;
              if (asset.entrySnapshot) {
                const s = asset.entrySnapshot; snapEl.style.display = 'block';
                const fakeTag = s.fake ? '<span class="h-fake" style="margin-left:4px;">假破</span>' : '';
                const pbTxt = s.fake
                  ? `<br>插针极值 <b>${fmt(s.pullback)}</b> · 原结构 ${fmt(s.extreme)}`
                  : (s.pullback ? `<br>回调极值 <b>${fmt(s.pullback)}</b> · 突破极值 ${fmt(s.extreme)}` : '');
                snapEl.innerHTML = `📸 进场 <b>${timeStr(s.ts)}</b>${fakeTag} · 强度 <b>${s.strength || 0}</b><br><span class="hl">价 ${fmt(s.last)}</span> · 买 ${fmt(s.bid)} / 卖 ${fmt(s.ask)}<br>VWAP ${fmt(s.vwap)} · 动量 ${(s.mom * 100).toFixed(3)}%${pbTxt}`;
              } else {
                snapEl.style.display = 'none';
                snapEl.innerHTML = '';
              }
            }
          }

          const meta = $(ids.meta);
          let baseText = '--'; let baseCls = 'meta';
          const sampleN = (asset.sampleCount !== undefined) ? asset.sampleCount : asset.samples.length;
          if (asset.ok && asset.lastTs) { baseText = `更新 ${timeStr(asset.lastTs)} · 样本 ${sampleN} · ${trendLabel(asset)}`; baseCls = 'meta'; }
          else if (asset.failCount >= CFG.maxFailuresBeforeWarn) { baseText = `⚠ 连续失败 ${asset.failCount} 次 · 最后 ${timeStr(asset.lastTs)}`; baseCls = 'meta error'; }
          else if (asset.lastTs) { baseText = `⚠ 数据中断 · 最后 ${timeStr(asset.lastTs)}`; baseCls = 'meta stale'; }

          const showCancel = asset.cancelReason && asset.cancelTs && (Date.now() - asset.cancelTs < 30000);
          if (showCancel) {
            meta.textContent = `⚠ 作废: ${asset.cancelReason} · ${baseText}`;
            meta.className = 'meta stale';
          } else {
            meta.textContent = baseText;
            meta.className = baseCls;
          }
        }

        function trendConfirmed(asset) {
          const bull = asset.m15Trend === 'BULL' || asset.m1hTrend === 'BULL' || asset.m4hTrend === 'BULL';
          const bear = asset.m15Trend === 'BEAR' || asset.m1hTrend === 'BEAR' || asset.m4hTrend === 'BEAR';
          return { bull, bear };
        }
        function trendLabel(asset) {
          const seg = (t) => t === 'BULL' ? '多' : t === 'BEAR' ? '空' : '-';
          return `15m:${seg(asset.m15Trend)} 1h:${seg(asset.m1hTrend)} 4h:${seg(asset.m4hTrend)}`;
        }

        let historySig = '';
        function renderHistory() {
          const listEl = $('historyList'); const countEl = $('historyCount');
          if (!listEl || !countEl) return;
          pruneHistory();

          const lastTs = state.history.length ? state.history[state.history.length - 1].ts : 0;
          const sig = state.history.length + ':' + lastTs;
          if (sig === historySig) return;
          historySig = sig;

          countEl.textContent = state.history.length + ' 条';
          if (!state.history.length) { listEl.innerHTML = '<div class="history-empty">暂无记录（保留两天）</div>'; renderStats(); return; }

          const typeMap = { LONG: { label: 'LONG', cls: 'long' }, SHORT: { label: 'SHORT', cls: 'short' }, TP_HIT: { label: 'TP', cls: 'tp' }, SL_HIT: { label: 'SL', cls: 'sl' } };
          const scrollTop = listEl.scrollTop; const frag = document.createDocumentFragment();
          for (let i = state.history.length - 1; i >= 0; i--) {
            const h = state.history[i]; const tm = typeMap[h.type] || { label: h.type, cls: '' };
            const fakeTag = h.tag === 'FAKE' ? '<span class="h-fake">假破</span>' : '';
            const item = document.createElement('div'); item.className = 'history-item';
            item.innerHTML = `<div class="h-line1"><span class="h-time">${fmtHistoryTime(h.ts)}</span><span class="h-sym">${h.sym || '--'}</span><span class="h-type ${tm.cls}">${tm.label}</span>${fakeTag}<span class="h-price">${fmt(h.price)}</span></div><div class="h-line2"><span>买 <span class="bid">${fmt(h.bid)}</span></span><span>卖 <span class="ask">${fmt(h.ask)}</span></span><span>SL <span class="sl">${fmt(h.sl)}</span></span><span>TP <span class="tp">${fmt(h.tp)}</span></span></div>`;
            frag.appendChild(item);
          }
          listEl.innerHTML = ''; listEl.appendChild(frag); listEl.scrollTop = scrollTop;
          renderStats();
        }

        let statsSig = '';
        function renderStats() {
          const total = state.history.filter((h) => h.type === 'LONG' || h.type === 'SHORT').length;
          const tp = state.history.filter((h) => h.type === 'TP_HIT').length;
          const sl = state.history.filter((h) => h.type === 'SL_HIT').length;
          const sig = `${total}|${tp}|${sl}`;
          if (sig === statsSig) return;
          statsSig = sig;
          const closed = tp + sl;
          $('statTotal').textContent = total; $('statTp').textContent = tp; $('statSl').textContent = sl;
          $('statWin').textContent = closed > 0 ? (tp / closed * 100).toFixed(0) + '%' : '--';
        }

        function render() {
          renderAsset(state.eth, IDS.eth); renderAsset(state.gold, IDS.gold); renderHistory();

          const anyLong  = state.eth.state === 'LONG'  || state.gold.state === 'LONG';
          const anyShort = state.eth.state === 'SHORT' || state.gold.state === 'SHORT';
          const anyTP    = state.eth.state === 'TP_HIT'|| state.gold.state === 'TP_HIT';
          const anySL    = state.eth.state === 'SL_HIT'|| state.gold.state === 'SL_HIT';
          const anyFake  = [state.eth, state.gold].some(a => a.fakeStage === 'WATCH_DOWN' || a.fakeStage === 'WATCH_UP');
          const anyArm   = [state.eth, state.gold].some(a => a.stage === 'BREAKOUT' || a.stage === 'PULLBACK');

          let prefix = '';
          if (anyLong) prefix = '🟢 ';
          else if (anyShort) prefix = '🔴 ';
          else if (anyTP) prefix = '✅ ';
          else if (anySL) prefix = '⛔ ';
          else if (anyFake) prefix = '⚠ ';
          else if (anyArm) prefix = '⏳ ';
          const title = prefix + 'ETH & 黄金 · 永续短线 Pro';
          if (document.title !== title) document.title = title;

          const banner = $('errorBanner');
          const failedAssets = [];
          if (state.eth.failCount >= CFG.maxFailuresBeforeWarn) failedAssets.push(`ETH(${CFG.contracts.eth})`);
          if (state.gold.failCount >= CFG.maxFailuresBeforeWarn) failedAssets.push(`黄金(${CFG.contracts.gold})`);
          const bannerSig = failedAssets.join(',');
          if (banner.dataset.sig !== bannerSig) {
            banner.dataset.sig = bannerSig;
            if (failedAssets.length) {
              banner.style.display = 'block';
              banner.innerHTML = `⚠ 行情获取连续失败：${failedAssets.join('、')}<br>请检查网络或确认合约代码有效。`;
            } else {
              banner.style.display = 'none';
              banner.innerHTML = '';
            }
          }
        }

        /* ===== 刷新（云端 / 本地 二选一） ===== */
        let refreshPending = false;
        async function refresh() {
          if (refreshPending) return;
          refreshPending = true;
          try {
            if (CLOUD_MODE) {
              const data = await fetchCloudJson(CLOUD_URL);
              applyCloud(state.eth, data.eth, 'eth');
              applyCloud(state.gold, data.gold, 'gold');
              if (Array.isArray(data.history)) state.history = data.history;
              render();
            } else {
              await Promise.all([ refreshAsset(state.eth, CFG.contracts.eth, 'netEth', 'ETH'), refreshAsset(state.gold, CFG.contracts.gold, 'netGold', '黄金') ]);
              render();
              scheduleSave();
            }
          } finally { refreshPending = false; }
        }

        let pollTimer = null;

        async function runPoll() {
          pollTimer = null;
          if (document.hidden) return;
          const t0 = Date.now();
          try { await refresh(); } catch (e) {}
          const elapsed = Date.now() - t0;
          const wait = Math.max(200, CFG.refreshMs - elapsed);
          if (!document.hidden) pollTimer = setTimeout(runPoll, wait);
        }

        function stopPoll() {
          if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
        }

        function onVisibilityChange() {
          if (document.hidden) {
            stopPoll();
          } else {
            stopPoll();
            refresh().catch(() => {}).finally(() => {
              if (!document.hidden && !pollTimer) pollTimer = setTimeout(runPoll, CFG.refreshMs);
            });
          }
        }

        function start() {
          loadModes();
          if (!CLOUD_MODE) { loadState(); loadHistory(); }
          syncModeButtons(); render();
          stopPoll();
          refresh().catch(() => {}).finally(() => {
            if (!document.hidden && !pollTimer) pollTimer = setTimeout(runPoll, CFG.refreshMs);
          });
        }

        function syncModeButtons() {
          const pb = $('pullbackBtn'); const fk = $('fakeBtn');
          pb.classList.toggle('active', MODES.pullback);
          pb.classList.toggle('off', !MODES.pullback);
          pb.textContent = MODES.pullback ? '📉 回调' : '📉 回调(关)';
          fk.classList.toggle('active', MODES.fake);
          fk.classList.toggle('off', !MODES.fake);
          fk.textContent = MODES.fake ? '⚡ 假破' : '⚡ 假破(关)';
        }

        $('pullbackBtn').addEventListener('click', () => {
          if (CLOUD_MODE) { showToast('进场模式在云端配置，手机端不生效'); return; }
          if (MODES.pullback && !MODES.fake) { showToast('至少保留一种进场模式'); return; }
          MODES.pullback = !MODES.pullback;
          saveModes(); syncModeButtons();
          showToast(MODES.pullback ? '✅ 已开启【回调确认】进场' : '⏸ 已暂停【回调确认】进场');
        });

        $('fakeBtn').addEventListener('click', () => {
          if (CLOUD_MODE) { showToast('进场模式在云端配置，手机端不生效'); return; }
          if (MODES.fake && !MODES.pullback) { showToast('至少保留一种进场模式'); return; }
          MODES.fake = !MODES.fake;
          saveModes(); syncModeButtons();
          showToast(MODES.fake ? '✅ 已开启【假破反打】进场' : '⏸ 已暂停【假破反打】进场');
        });

        $('wakeLockBtn').addEventListener('click', toggleWakeLock);
        $('soundBtn').addEventListener('click', () => { initAudio(); playAlert(); });

        $('notifyBtn').addEventListener('click', () => {
          const btn = $('notifyBtn');
          if (internalNotifyEnabled) {
            internalNotifyEnabled = false; btn.classList.remove('active'); btn.textContent = '🔔 通知';
            showToast('已关闭提醒');
            return;
          }
          if (checkNotifySupport()) {
            Notification.requestPermission().then((perm) => {
              if (perm === 'granted') { useSystemNotify = true; btn.classList.add('active'); btn.textContent = '🔔 系统通知'; sendNotification('权限已开启', '有交易信号时会通知你'); }
              else { enableFallbackNotify(); }
            }).catch(() => { enableFallbackNotify(); });
          } else { enableFallbackNotify(); }
        });

        function enableFallbackNotify() {
          internalNotifyEnabled = true; const btn = $('notifyBtn');
          btn.classList.add('active'); btn.textContent = '🔕 页面提醒';
          if (navigator.vibrate) navigator.vibrate(100);
          showToast('当前环境不支持系统通知。\n已自动切换为【页面全屏弹窗+震动】强提醒模式！');
        }

        $('resetBtn').addEventListener('click', () => {
          if (CLOUD_MODE) { showToast('云端模式下请重启 bot.mjs 或调用云端重置接口'); return; }
          initAudio();
          for (const a of [state.eth, state.gold]) {
            a.state = 'WAIT'; a.signal = 'WAIT'; a.sl = a.tp = 0; a.strength = 0;
            a.confirmCount = 0; a.cooldownUntil = Date.now() + CFG.resetCooldownMs; a.entrySnapshot = null;
            a.stage = 'IDLE'; a.dir = null; a.breakExtreme = 0;
            a.pullbackLow = 0; a.pullbackHigh = 0; a.breakTs = 0;
            a.fakeStage = 'IDLE'; a.fakeLevel = 0; a.fakeExtreme = 0; a.fakeTicks = 0;
            a.cancelReason = ''; a.cancelTs = 0;
            a.belowVwapTicks = 0; a.aboveVwapTicks = 0; a.emaCrossTicks = 0;
            a.fakeWeakReclaimTicks = 0;
          }
          render(); saveStateNow();
          showToast('已解除锁定，5 分钟内不会重复发出信号。');
        });

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('pageshow', onVisibilityChange);
        window.addEventListener('pagehide', stopPoll);

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
        $('goldCodeTag').textContent = `(${CFG.contracts.gold})`;
      })();
    </script>
  </body>
</html>
