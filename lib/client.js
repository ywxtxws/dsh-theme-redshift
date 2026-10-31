/**
 * 赤色观测站 — 浏览器半侧
 *
 * 暗红赛博朋克皮肤。分层：
 *   ① 配色   ctx.theme.overrideTokens（114 个 token 全量重映射，可整层撤销）
 *   ② 底景   body::before  场景图 + 舷窗反光 + 底部沉降
 *   ③ 纹层   body::after   双密度网格 + 星尘 + 星云 + 扫描线 + 噪点 + 暗角
 *   ④ HUD    shell.overlay  四角角标 + 边缘刻度 + 下扫光带 + 数据流 + 撕裂带 + 状态灯
 *
 * 以手写 ModuleLoader bundle 格式加载，无需构建。
 */
window.__ModuleLoader__.load({
  id: 'dsh-theme-redshift',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const SOURCE = 'dsh-theme-redshift'
    const SCENE_URL = '/redshift/scene.jpg?v=10-0'

    /* ------------------------------------------------------------------ *
     * ① 配色：整体从「暖棕红」推到「血红 / 品红」，冷色只做点缀
     * ------------------------------------------------------------------ */
    const DARK = {
      // 基底：更黑、偏紫，霓虹才跳得出来
      '--dsw-alias-bg-base': 'rgba(5, 2, 7, 0.30)',
      '--dsw-alias-bg-layer-1': '#150a10',
      '--dsw-alias-bg-layer-2': '#1d0d15',
      '--dsw-alias-bg-layer-3': '#260f19',
      '--dsw-alias-bg-overlay': '#2a1020',
      '--dsw-alias-bg-module-platform': '#260f19',
      '--dsw-alias-bg-multi-select': '#220d17',
      '--dsw-alias-bg-skeleton': 'rgba(255, 90, 120, 0.08)',
      '--dsw-alias-bg-document-preview': '#0a0410',
      '--dsw-alias-bg-document-selection': 'rgba(255, 45, 85, 0.40)',
      '--dsw-alias-bg-mask-1': 'rgba(0, 0, 0, 0.52)',
      '--dsw-alias-bg-mask-2': 'rgba(0, 0, 0, 0.22)',
      '--dsw-alias-bg-mask-3': 'rgba(0, 0, 0, 0.50)',
      '--dsw-alias-bg-mask-photo': 'rgba(0, 0, 0, 0.90)',
      '--dsw-alias-bg-mask-drop': 'rgba(38, 15, 26, 0.72)',

      // 边框：带品红的半透明，像霓虹灯管的余晖
      '--dsw-alias-border-l1': 'rgba(255, 70, 105, 0.11)',
      '--dsw-alias-border-l2': 'rgba(255, 70, 105, 0.17)',
      '--dsw-alias-border-l3': 'rgba(255, 70, 105, 0.23)',
      '--dsw-alias-border-l4': 'rgba(255, 70, 105, 0.31)',
      '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 70, 105, 0.12)',
      '--dsw-alias-border-inverted': 'rgba(255, 255, 255, 0.09)',
      '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0.12)',

      // 品牌：主按钮保持浅底深字，强调位换成血红
      '--dsw-alias-brand-primary': '#f7e6e8',
      '--dsw-alias-brand-primary-invert': '#0a0310',
      '--dsw-alias-brand-primary-new-colorprimary-new-color': '#ff2d55',
      '--dsw-alias-brand-text': '#f7e6e8',

      // 按钮
      '--dsw-alias-button-contrast-fill': '#f7e6e8',
      '--dsw-alias-button-elevated-fill': '#380f1e',
      '--dsw-alias-button-floating-fill': '#1d0d15',
      '--dsw-alias-button-floating-hover': '#260f19',
      '--dsw-alias-button-ghost-active-border': '#6b2136',
      '--dsw-alias-button-ghost-active-fill': '#380f1e',
      '--dsw-alias-button-ghost-active-hover': '#4d1226',
      '--dsw-alias-button-info-fill': '#e01840',
      '--dsw-alias-button-info-hover': '#b81133',
      '--dsw-alias-button-primary-dimmed': '#5c1428',
      '--dsw-alias-button-primary-fill': '#f7e6e8',
      '--dsw-alias-button-primary-hover': '#fff3f5',
      '--dsw-alias-button-tool-bar-fill': 'rgba(72, 24, 44, 0.52)',
      '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(24, 10, 18, 0.38)',
      '--dsw-alias-button-tool-bar-hover': 'rgba(100, 30, 56, 0.62)',

      // 交互反馈
      '--dsw-alias-interactive-bg-hover': 'rgba(255, 80, 115, 0.09)',
      '--dsw-alias-interactive-bg-active': 'rgba(255, 80, 115, 0.16)',
      '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 80, 115, 0.26)',
      '--dsw-alias-interactive-bg-hover-danger': 'rgba(255, 60, 90, 0.16)',
      '--dsw-alias-interactive-bg-hover-solid': '#260f19',

      // 文字
      '--dsw-alias-label-primary': '#f7e9ea',
      '--dsw-alias-label-primary-bluish': '#f7e9ea',
      '--dsw-alias-label-primary-dimmed': '#e2ccd1',
      '--dsw-alias-label-primary-foreground': '#0a0310',
      '--dsw-alias-label-primary-inverted': '#260f19',
      '--dsw-alias-label-secondary': '#d8bcc3',
      '--dsw-alias-label-tertiary': '#b599a1',
      '--dsw-alias-label-caption': '#8e737c',
      '--dsw-alias-label-dimmed': '#4a1428',
      '--dsw-alias-label-shimmer': 'rgba(255, 235, 240, 0.45)',
      '--dsw-alias-label-deep-diving': '#ff5c78',
      '--dsw-alias-label-deep-diving-shimmer': '#ff8ea0',
      '--dsw-alias-label-document-preview': '#d8bcc3',
      '--dsw-alias-menu-icon': '#eed9dd',
      '--dsw-alias-link': '#ff5f7a',

      // 状态：错误用血红，成功用青绿（唯一的冷色点缀），警告用琥珀
      '--dsw-alias-state-business-primary': '#ff2d55',
      '--dsw-alias-state-business-tertiary': '#4d0f1e',
      '--dsw-alias-state-error-primary': '#ff3b5c',
      '--dsw-alias-state-error-secondary': '#ff3b5c',
      '--dsw-alias-state-idle-primary': '#7a6167',
      '--dsw-alias-state-success-primary': '#4fd6a8',
      '--dsw-alias-state-success-secondary': '#7ce8c4',
      '--dsw-alias-state-success-tertiary': '#0f2b23',
      '--dsw-alias-state-warn-primary': '#ff9f43',
      '--dsw-alias-state-warn-secondary': '#ffb96b',
      '--dsw-alias-state-warn-label': '#e88a32',
      '--dsw-alias-state-warn-tertiary': '#33220f',
      '--dsw-alias-switch-thumb': '#c0a3a8',

      // 浮层
      '--dsw-alias-toast-bg': '#380f1e',
      '--dsw-alias-toast-label': '#fff3f5',
      '--dsw-alias-tooltip-bg': '#380f1e',
      '--dsw-alias-tooltip-key-bg': '#5c1a30',
      '--dsw-alias-menu-group-header-fill': 'rgba(38, 15, 25, 0.94)',

      // Markdown / 代码
      '--dsw-alias-markdown-citation': '#260f19',
      '--dsw-alias-markdown-code-block': '#0f0712',
      '--dsw-alias-markdown-code-block-banner': '#1d0d15',
      '--dsw-alias-markdown-code-segment-selected': '#260f19',
      '--dsw-alias-markdown-code-segment-unselected': '#0f0712',
      '--dsw-alias-markdown-inline-code': '#260f19',
      '--dsw-alias-markdown-placeholder': '#1d0d15',
      '--dsw-alias-markdown-tag': '#1d0d15',

      // 滚动条
      '--dsw-alias-scrollbar-bg-l1': '#4d1226',
      '--dsw-alias-scrollbar-bg-l2': '#6b1a32',
      '--dsw-alias-scrollbar-hover-l1': '#6b1a32',
      '--dsw-alias-scrollbar-hover-l2': '#8a2340',

      // 设置卡片
      '--dsw-alias-settings-card-fill': '#150a10',
      '--dsw-alias-settings-card-stroke': 'rgba(255, 70, 105, 0.17)',

      // 回合触发
      '--dsw-alias-turn-trigger-bg': 'rgba(255, 80, 115, 0.09)',
      '--dsw-alias-turn-trigger-bg-hover': 'rgba(255, 80, 115, 0.16)',

      // diff
      '--dsw-alias-code-diff-added': 'rgba(79, 214, 168, 0.12)',
      '--dsw-alias-code-diff-deleted': 'rgba(255, 59, 92, 0.12)',
      '--dsw-alias-file-diff-added-bg': '#0f2b23',
      '--dsw-alias-file-diff-added-gutter': '#091a15',
      '--dsw-alias-file-diff-added-marker': '#4fd6a8',
      '--dsw-alias-file-diff-deleted-bg': '#3a101f',
      '--dsw-alias-file-diff-deleted-gutter': '#280a14',
      '--dsw-alias-file-diff-deleted-marker': '#ff3b5c',

      // 侧栏与气泡
      '--dsw-specific-bubble': '#1d0d15',
      '--dsw-specific-bubble-highlight': '#2a1020',
      '--dsw-specific-input-major': '#170a11',
      '--dsw-specific-login-input': '#0f0712',
      '--dsw-specific-menu': '#170a11',
      '--dsw-specific-selector': '#260f19',
      '--dsw-specific-sidebar-fill': 'rgba(9, 4, 12, 0.76)',
      '--dsw-specific-sidebar-nav-item-active': '#380f1e',
      '--dsw-specific-sidebar-nav-item-active-accent': '#260f19',
      '--dsw-specific-sidebar-nav-item-hover': '#1d0d15',
      '--dsw-specific-tip': '#260f19',
    }

    const TOKENS = {}
    for (const key of Object.keys(DARK)) TOKENS[key] = { light: DARK[key], dark: DARK[key] }

    /* ------------------------------------------------------------------ *
     * 星尘：固定种子，每次加载都是同一片星空
     * ------------------------------------------------------------------ */
    function buildStars(count) {
      let seed = 20261028
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return seed / 0x7fffffff
      }
      const layers = []
      for (let i = 0; i < count; i++) {
        const y = Math.pow(rnd(), 0.8) * 100
        const x = rnd() * 100
        const big = rnd() > 0.88
        const r = big ? 1.15 + rnd() * 0.7 : 0.38 + rnd() * 0.42
        const a = big ? 0.45 + rnd() * 0.30 : 0.12 + rnd() * 0.30
        const cool = rnd() > 0.74
        const col = cool ? '198, 214, 255' : '255, 238, 228'
        layers.push(
          'radial-gradient(circle at ' + x.toFixed(1) + '% ' + y.toFixed(1) + '%, ' +
            'rgba(' + col + ', ' + a.toFixed(2) + ') 0 ' + r.toFixed(2) + 'px, ' +
            'rgba(' + col + ', 0) ' + (r + 1.1).toFixed(2) + 'px)',
        )
      }
      return layers.join(',\n    ')
    }

    const STARS = buildStars(46)

    // 噪点：用 SVG 湍流生成真正的颗粒（比手写随机点更细）
    const NOISE =
      'url("data:image/svg+xml;utf8,' +
      "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/>" +
      "<feColorMatrix type='saturate' values='0'/></filter>" +
      "<rect width='160' height='160' filter='url(%23n)' opacity='0.28'/>" +
      '</svg>")'

    /* ------------------------------------------------------------------ *
     * ② 样式
     * ------------------------------------------------------------------ */
    const CSS = `
/* ============ 底景：舷窗外的赤色深空 ============ */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background-color: #050208;
  background-image:
    radial-gradient(ellipse 64% 42% at 9% -8%,
      rgba(255, 70, 110, 0.10),
      rgba(255, 70, 110, 0.022) 44%,
      rgba(255, 70, 110, 0) 64%),
    radial-gradient(ellipse 110% 46% at 42% 118%,
      rgba(3, 1, 5, 0.72),
      rgba(3, 1, 5, 0.26) 46%,
      rgba(3, 1, 5, 0) 70%),
    url("${SCENE_URL}");
  background-size: cover, cover, cover;
  background-position: center, center, center bottom;
  background-repeat: no-repeat;
  transform-origin: 78% 36%;
  animation: rs-drift 84s ease-in-out infinite alternate;
}

/* 整片星空极慢地推近、平移 —— 黑洞和飞船就这样“活”起来 */
@keyframes rs-drift {
  0%   { transform: scale(1.01) translate3d(0, 0, 0); }
  100% { transform: scale(1.06) translate3d(-1.4%, -0.9%, 0); }
}

/* ============ 纹层：网格 / 星尘 / 星云 / 扫描线 / 噪点 / 暗角 ============ */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background-image:
    /* 四角暗角（最上层） */
    radial-gradient(ellipse 126% 106% at 50% 44%,
      rgba(2, 1, 4, 0) 40%,
      rgba(2, 1, 4, 0.32) 72%,
      rgba(2, 1, 4, 0.70) 100%),
    /* 细腻网格（13px） */
    repeating-linear-gradient(to right, rgba(255, 60, 95, 0.008) 0 1px, rgba(255, 60, 95, 0) 1px 13px),
    repeating-linear-gradient(to bottom, rgba(255, 60, 95, 0.008) 0 1px, rgba(255, 60, 95, 0) 1px 13px),
    /* 主网格（52px） */
    repeating-linear-gradient(to right, rgba(255, 60, 95, 0.019) 0 1px, rgba(255, 60, 95, 0) 1px 52px),
    repeating-linear-gradient(to bottom, rgba(255, 60, 95, 0.019) 0 1px, rgba(255, 60, 95, 0) 1px 52px),
    /* 屏幕扫描线 */
    repeating-linear-gradient(to bottom,
      rgba(255, 160, 175, 0.048) 0 1px,
      rgba(255, 160, 175, 0) 1px 4px),
    /* 星云薄雾 */
    radial-gradient(ellipse 52% 36% at 81% 18%, rgba(255, 45, 85, 0.075), rgba(255, 45, 85, 0) 70%),
    radial-gradient(ellipse 38% 28% at 22% 74%, rgba(150, 20, 60, 0.060), rgba(150, 20, 60, 0) 72%),
    radial-gradient(ellipse 30% 22% at 60% 52%, rgba(255, 90, 60, 0.035), rgba(255, 90, 60, 0) 74%),
    /* 银河斜带 */
    linear-gradient(116deg,
      rgba(255, 45, 85, 0) 28%,
      rgba(255, 45, 85, 0.026) 43%,
      rgba(255, 150, 170, 0.060) 50%,
      rgba(255, 45, 85, 0.026) 57%,
      rgba(255, 45, 85, 0) 72%),
    /* 星尘 */
    ${STARS},
    /* 颗粒噪点（最下层） */
    ${NOISE};
  background-size: auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, 160px 160px;
  opacity: 0.96;
  animation: rs-twinkle 21s ease-in-out infinite;
}

@keyframes rs-twinkle {
  0%, 100% { opacity: 0.96; }
  36%      { opacity: 0.78; }
  53%      { opacity: 1; }
  74%      { opacity: 0.84; }
}

/* ============ HUD：四角角标 + 边缘刻度 ============ */
.rs-hud {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.rs-corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 0 solid rgba(255, 60, 95, 0.55);
  box-shadow: 0 0 10px rgba(255, 30, 70, 0.28);
}

.rs-corner.tl { top: 9px; left: 9px; border-top-width: 1px; border-left-width: 1px; }
.rs-corner.tr { top: 9px; right: 9px; border-top-width: 1px; border-right-width: 1px; }
.rs-corner.bl { bottom: 9px; left: 9px; border-bottom-width: 1px; border-left-width: 1px; }
.rs-corner.br { bottom: 9px; right: 9px; border-bottom-width: 1px; border-right-width: 1px; }

.rs-ruler-b {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 7px;
  background-image: repeating-linear-gradient(to right,
    rgba(255, 70, 100, 0.38) 0 1px, rgba(255, 70, 100, 0) 1px 26px);
  -webkit-mask-image: linear-gradient(to top, #000 32%, transparent 100%);
  mask-image: linear-gradient(to top, #000 32%, transparent 100%);
}

.rs-ruler-l {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background-image: repeating-linear-gradient(to bottom,
    rgba(255, 70, 100, 0.22) 0 1px, rgba(255, 70, 100, 0) 1px 26px);
  -webkit-mask-image: linear-gradient(to right, #000 32%, transparent 100%);
  mask-image: linear-gradient(to right, #000 32%, transparent 100%);
}

/* 屏幕边缘的霓虹余晖 */
.rs-hud::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 140px rgba(255, 45, 85, 0.075);
}

/* 下扫光带：像雷达扫过整屏 */
.rs-scan {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 220px;
  mix-blend-mode: screen;
  background: linear-gradient(to bottom,
    rgba(255, 60, 95, 0) 0%,
    rgba(255, 60, 95, 0.030) 54%,
    rgba(255, 140, 160, 0.055) 72%,
    rgba(255, 60, 95, 0) 100%);
  animation: rs-scan 12.5s linear infinite;
}

@keyframes rs-scan {
  from { transform: translateY(-240px); }
  to   { transform: translateY(100vh); }
}

/* 数据流：垂直下落的细光柱 */
.rs-stream {
  position: absolute;
  top: 0;
  width: 1px;
  mix-blend-mode: screen;
  background: linear-gradient(to bottom,
    rgba(255, 60, 95, 0) 0%,
    rgba(255, 60, 95, 0.16) 18%,
    rgba(255, 200, 210, 0.30) 50%,
    rgba(255, 60, 95, 0.16) 82%,
    rgba(255, 60, 95, 0) 100%);
  animation-name: rs-stream;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes rs-stream {
  from { transform: translateY(-34vh); }
  to   { transform: translateY(108vh); }
}

/* ============ 雷达扫掠（2026-10-29）============
   同心圆旋转是看不出来的（旋转对称），所以这里用 conic-gradient 画一道扇形扫掠，
   120 秒一圈 —— 慢到只有余光能察觉，但界面会"活着"。 */
.rs-radar {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.rs-radar::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 46%;
  width: 160vmax;
  height: 160vmax;
  transform: translate(-50%, -50%) rotate(0deg);
  background: conic-gradient(from 0deg,
    rgba(255, 45, 85, 0.085) 0deg,
    rgba(255, 45, 85, 0.030) 6deg,
    rgba(255, 45, 85, 0.000) 17deg 360deg);
  animation: rs-radar-spin 120s linear infinite;
  will-change: transform;
}
@keyframes rs-radar-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ============ 四周霓虹侵蚀带（2026-10-29）============
   四条细带沿屏幕边缘绕一圈（上/下/左/右），content 是横/竖排乱码，
   clip-path 把内侧边缘切成参差阶梯 + skew 挤压 + 间歇抽搐。
   ★ 上边和右边都避开了右上角立绘区域，不挡人。 */
.rs-erode {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
.rs-erode i {
  position: absolute;
  overflow: hidden;
  font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
  font-size: 11px;
  line-height: 1.05;
  letter-spacing: 0.06em;
  white-space: pre;   /* 上/下条用 \n 分多行；左右条是竖排单行 */
  color: rgba(255, 45, 85, 0.42);
  text-shadow: 0 0 6px rgba(255, 30, 60, 0.5), 0 0 16px rgba(255, 30, 60, 0.22);
  will-change: transform, opacity;
}
/* 上边：右侧留出 250px 给立绘 */
.rs-erode-top {
  left: 0; right: 250px; top: 0; height: 42px;
  padding: 2px 0 0 2px;
  clip-path: polygon(0 0, 100% 0, 100% 62%, 92% 62%, 92% 78%, 80% 78%,
                     80% 90%, 64% 90%, 64% 100%, 38% 100%, 38% 88%, 22% 88%, 22% 74%, 8% 74%, 8% 58%, 0 58%);
}
/* 下边：整条铺满 */
.rs-erode-bottom {
  left: 0; right: 0; bottom: 0; height: 42px;
  padding: 0 0 2px 2px;
  clip-path: polygon(0 38%, 10% 38%, 10% 22%, 26% 22%, 26% 10%, 44% 10%,
                     44% 0, 68% 0, 68% 12%, 82% 12%, 82% 26%, 94% 26%, 94% 44%, 100% 44%, 100% 100%, 0 100%);
}
/* 左边：整条，竖排字符 */
.rs-erode-left {
  left: 0; top: 0; bottom: 0; width: 34px;
  padding: 2px 0 0 2px;
  writing-mode: vertical-rl;
  clip-path: polygon(0 0, 58% 0, 58% 8%, 78% 8%, 78% 22%, 90% 22%,
                     90% 38%, 100% 38%, 100% 64%, 88% 64%, 88% 80%, 72% 80%, 72% 92%, 54% 92%, 54% 100%, 0 100%);
}
/* 右边：从立绘下方开始，竖排字符 */
.rs-erode-right {
  right: 0; top: 185px; bottom: 0; width: 34px;
  padding: 0 2px 0 0;
  writing-mode: vertical-rl;
  clip-path: polygon(42% 0, 100% 0, 100% 100%, 0 100%, 0 86%, 12% 86%,
                     12% 68%, 24% 68%, 24% 52%, 34% 52%, 34% 34%, 42% 34%);
}
/* 四条各自不同的抽搐节奏（互质，避免同时抽） */
.rs-erode i { animation: rs-erode-twitch 7.3s steps(1, end) infinite; }
.rs-erode-bottom { animation-duration: 9.1s; animation-delay: -2.4s; }
.rs-erode-left   { animation-duration: 8.3s; animation-delay: -5.1s; }
.rs-erode-right  { animation-duration: 11s;  animation-delay: -7.6s; }

@keyframes rs-erode-twitch {
  0%, 74%   { opacity: 0.9;  transform: translate(0, 0) skewX(0deg); }
  75%       { opacity: 1;    transform: translate(-2px, 1px) skewX(-1.6deg); }
  77%       { opacity: 0.4;  transform: translate(2px, -1px) skewX(1.2deg); }
  79%       { opacity: 0.95; transform: translate(-1px, 1px) skewX(-0.8deg); }
  81%, 100% { opacity: 0.9;  transform: translate(0, 0) skewX(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .rs-erode i { animation: none; }
}

/* ============ 撕裂：横向光带 + 竖向裂缝 + 色散 ============ */
.rs-rift {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  mix-blend-mode: screen;
}

.rs-rift i {
  position: absolute;
  left: -6%;
  width: 112%;
  display: block;
  opacity: 0;
  filter: blur(0.35px);
  animation-name: rs-tear;
  animation-timing-function: steps(1, end);
  animation-iteration-count: infinite;
  background: linear-gradient(90deg,
    rgba(255, 40, 85, 0) 0%,
    rgba(255, 60, 95, 0.10) 18%,
    rgba(255, 214, 196, 0.72) 46%,
    rgba(255, 90, 120, 0.32) 58%,
    rgba(255, 50, 90, 0.10) 78%,
    rgba(255, 40, 85, 0) 100%);
}

.rs-rift i.rs-hot {
  background: linear-gradient(90deg,
    rgba(255, 45, 85, 0) 0%,
    rgba(255, 80, 115, 0.18) 15%,
    rgba(255, 246, 240, 0.92) 47%,
    rgba(255, 110, 140, 0.44) 60%,
    rgba(255, 45, 85, 0.13) 80%,
    rgba(255, 45, 85, 0) 100%);
  box-shadow: 0 0 24px rgba(255, 45, 85, 0.34);
}

/* 色散带：红 / 青分离，赛博朋克签名 */
.rs-rift i.rs-chroma {
  background: linear-gradient(90deg,
    rgba(255, 45, 85, 0) 0%,
    rgba(0, 214, 255, 0.16) 40%,
    rgba(255, 246, 240, 0.88) 50%,
    rgba(255, 45, 85, 0.34) 60%,
    rgba(255, 45, 85, 0) 100%);
  filter: blur(0.6px);
  box-shadow: 0 0 18px rgba(0, 200, 255, 0.18);
}

@keyframes rs-tear {
  0%    { opacity: 0;    transform: translateX(0) scaleX(1); }
  0.7%  { opacity: 0.90; }
  1.2%  { opacity: 0.12; }
  1.8%  { opacity: 0.66; }
  2.5%  { opacity: 0;    transform: translateX(-2.2%) scaleX(0.988); }
  100%  { opacity: 0;    transform: translateX(-2.2%) scaleX(0.988); }
}

.rs-rift u {
  position: absolute;
  top: -6%;
  height: 112%;
  display: block;
  opacity: 0;
  filter: blur(0.4px);
  animation: rs-tear-v 23.1s steps(1, end) 12.4s infinite;
  background: linear-gradient(180deg,
    rgba(255, 45, 85, 0) 0%,
    rgba(255, 214, 196, 0.34) 42%,
    rgba(255, 246, 240, 0.66) 50%,
    rgba(255, 214, 196, 0.34) 58%,
    rgba(255, 45, 85, 0) 100%);
}

@keyframes rs-tear-v {
  0%    { opacity: 0; }
  0.5%  { opacity: 0.55; }
  0.9%  { opacity: 0; }
  100%  { opacity: 0; }
}

/* ============ 引力波 ============ */
.rs-wave {
  position: absolute;
  left: -12%;
  width: 124%;
  height: 130px;
  display: block;
  pointer-events: none;
  filter: blur(28px);
  background: radial-gradient(ellipse 46% 50% at 66% 50%,
    rgba(255, 45, 85, 0.16),
    rgba(255, 45, 85, 0.045) 56%,
    rgba(255, 45, 85, 0) 78%);
  animation: rs-wave 31s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

@keyframes rs-wave {
  0%   { opacity: 0;    transform: translateY(-18vh); }
  12%  { opacity: 0.66; }
  58%  { opacity: 0.38; }
  88%  { opacity: 0.08; }
  100% { opacity: 0;    transform: translateY(108vh); }
}

/* ============ 天体：行星 / 彗星 / 脉冲星 / 小行星带 ============ */

/* 行星已并入背景合成图，这里只留 CSS 天体：彗星 / 脉冲星 / 小行星带 */


/* 彗星：27 秒从左上掠过 */
.rs-comet {
  position: absolute;
  left: -8%;
  top: 10%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  background: #fff6f2;
  box-shadow: 0 0 10px 3px rgba(255, 190, 170, 0.7);
  animation: rs-comet 27s linear 5s infinite;
}

.rs-comet::after {
  content: "";
  position: absolute;
  right: 2px;
  top: 50%;
  width: 190px;
  height: 1.4px;
  transform: translateY(-50%) rotate(21deg);
  transform-origin: right center;
  background: linear-gradient(to left,
    rgba(255, 236, 228, 0.90),
    rgba(255, 120, 140, 0.34) 42%,
    rgba(255, 45, 85, 0) 100%);
  filter: blur(0.4px);
}

@keyframes rs-comet {
  0%   { opacity: 0; transform: translate(0, 0); }
  1.5% { opacity: 1; }
  16%  { opacity: 1; }
  20%  { opacity: 0; }
  100% { opacity: 0; transform: translate(88vw, 52vh); }
}

/* 脉冲星 */
.rs-pulsar {
  position: absolute;
  left: 21%;
  top: 16%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  pointer-events: none;
  background: #dff0ff;
  box-shadow: 0 0 14px 4px rgba(180, 220, 255, 0.45);
  animation: rs-pulsar 5.8s ease-in-out infinite;
}

@keyframes rs-pulsar {
  0%, 100% { opacity: 0.18; transform: scale(0.75); }
  46%      { opacity: 1;    transform: scale(1.30); }
  54%      { opacity: 0.88; transform: scale(1.08); }
}

/* 小行星带 */
.rs-belt {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.rs-belt i {
  position: absolute;
  border-radius: 50%;
  background: rgba(198, 138, 128, 0.40);
  box-shadow: 0 0 6px rgba(255, 80, 100, 0.16);
}

/* ============ 观景窗：驻站数据（2026-10-31 替换立绘 · 零外部素材） ============ */
.rs-window {
  position: fixed;
  right: 22px;
  top: 20px;
  width: 112px;
  height: 150px;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
  border: 1px solid rgba(255, 45, 85, 0.36);
  background: radial-gradient(circle at 50% 46%, rgba(255, 45, 85, 0.16), rgba(10, 4, 7, 0.72) 62%);
  box-shadow:
    0 0 0 1px rgba(255, 45, 85, 0.10),
    0 0 20px rgba(255, 45, 85, 0.30),
    inset 0 0 26px rgba(255, 45, 85, 0.12);
}
.rs-window::before,
.rs-window::after {
  content: "";
  position: absolute;
  left: 8px; right: 8px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 45, 85, 0.55), transparent);
}
.rs-window::before { top: 10px; }
.rs-window::after { bottom: 12px; }

.rs-w-ring {
  position: absolute;
  left: 50%; top: 46%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 60, 95, 0.45);
}
.rs-w-ring.a { width: 84px; height: 84px; animation: rs-w-spin 26s linear infinite; }
.rs-w-ring.b { width: 58px; height: 58px; border-style: dashed; opacity: .55; animation: rs-w-spin 17s linear infinite reverse; }

.rs-w-ticks {
  position: absolute;
  left: 50%; top: 46%;
  width: 96px; height: 96px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: repeating-conic-gradient(from 0deg, rgba(255, 70, 100, .55) 0deg .7deg, transparent .7deg 12deg);
  -webkit-mask: radial-gradient(circle, transparent 44px, #000 45px, #000 47px, transparent 48px);
  mask: radial-gradient(circle, transparent 44px, #000 45px, #000 47px, transparent 48px);
  animation: rs-w-spin 40s linear infinite;
  opacity: .7;
}

.rs-w-cross::before,
.rs-w-cross::after {
  content: "";
  position: absolute;
  left: 50%; top: 46%;
  background: rgba(255, 80, 110, 0.35);
}
.rs-w-cross::before { width: 22px; height: 1px; transform: translate(-11px, 0); }
.rs-w-cross::after { width: 1px; height: 22px; transform: translate(0, -11px); }

.rs-w-dot {
  position: absolute;
  left: 50%; top: 46%;
  width: 5px; height: 5px;
  margin: -2.5px 0 0 -2.5px;
  border-radius: 50%;
  background: #ff5a7d;
  box-shadow: 0 0 10px 2px rgba(255, 60, 100, 0.55);
  animation: rs-w-pulse 3.2s ease-in-out infinite;
}

.rs-w-scan {
  position: absolute;
  left: 0; right: 0; height: 18px;
  background: linear-gradient(180deg, rgba(255, 60, 100, 0) 0%, rgba(255, 60, 100, 0.16) 55%, rgba(255, 60, 100, 0) 100%);
  animation: rs-w-scan 7.5s linear infinite;
}

.rs-w-read, .rs-w-read2 {
  position: absolute;
  left: 8px;
  font: 7px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: .18em;
  color: rgba(255, 120, 140, 0.62);
}
.rs-w-read { bottom: 20px; }
.rs-w-read2 { bottom: 8px; color: rgba(255, 120, 140, 0.4); font-size: 6px; }

@keyframes rs-w-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes rs-w-pulse { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@keyframes rs-w-scan { 0% { top: -20px; } 100% { top: 152px; } }

/* ============ 侧栏的霓虹竖线 ============ */
[class*="sidebarCol"] {
  border-right: 1px solid rgba(255, 45, 85, 0.42) !important;
  box-shadow:
    2px 0 24px -4px rgba(255, 45, 85, 0.55),
    inset -1px 0 0 rgba(255, 140, 165, 0.22);
}

/* ============ 角落读数 ============ */
.rs-readout {
  position: fixed;
  right: 30px;
  bottom: 10px;
  pointer-events: none;
  font-family: ui-monospace, "Cascadia Mono", "Consolas", monospace;
  font-size: 9px;
  line-height: 1;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(94, 234, 255, 0.52);
  text-shadow: 0 0 9px rgba(0, 214, 255, 0.45);
}

/* ============ 观测站状态灯（带外圈脉冲） ============ */.rs-beacon {
  position: fixed;
  right: 15px;
  bottom: 13px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  pointer-events: none;
  background: #ff2d55;
  box-shadow: 0 0 0 0 rgba(255, 45, 85, 0.6), 0 0 12px rgba(255, 45, 85, 0.9);
  animation: rs-beacon 3.2s ease-in-out infinite;
}

.rs-beacon::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid rgba(255, 45, 85, 0.5);
  animation: rs-beacon-ring 3.2s ease-out infinite;
}

@keyframes rs-beacon {
  0%, 100% { opacity: 0.62; }
  50%      { opacity: 1; }
}

@keyframes rs-beacon-ring {
  0%   { transform: scale(0.8); opacity: 0.7; }
  70%  { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}

/* ============ 面板质感 ============ */
[data-composer-card] {
  position: relative;
}

/* 输入区的霓虹灯箱边 */
[data-composer-card]::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    0 0 26px -6px rgba(255, 45, 85, 0.32),
    inset 0 0 0 1px rgba(255, 45, 85, 0.10);
}

[data-composer-card]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 200, 210, 0.085),
    inset 0 0 78px rgba(255, 45, 85, 0.032),
    inset 0 -18px 40px -20px rgba(0, 0, 0, 0.62);
}

[data-composer-input]::placeholder {
  color: rgba(180, 152, 160, 0.72);
}

[data-conversation-content] {
  background-image: linear-gradient(to bottom,
    rgba(255, 45, 85, 0.04) 0,
    rgba(255, 45, 85, 0) 64px);
  background-repeat: no-repeat;
}

/* ============ 细节 ============ */
::selection {
  background: rgba(255, 45, 85, 0.42);
  color: #fff4f6;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(150, 35, 65, 0.58) transparent;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(150, 35, 65, 0.55);
  border: 2px solid transparent;
  border-radius: 6px;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(210, 55, 95, 0.68);
  background-clip: content-box;
}


/* ============ 品牌：观测中枢 ============ */
.rs-brand-name {
  display: flex;
  flex-direction: column;
  line-height: 1.06;
  gap: 1px;
}

.rs-brand-zh {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #f7e9ea;
  text-shadow: 0 0 12px rgba(255, 45, 85, 0.45);
}

.rs-brand-en {
  font-size: 8px;
  letter-spacing: 0.26em;
  color: rgba(255, 120, 145, 0.55);
}

/* ============ Hero 标题：探索未至之境 → 观测中枢 ============ */
[class*="titleGroup"] > span:first-child {
  font-size: 0 !important;
  line-height: 1;
}

[class*="titleGroup"] > span:first-child::before {
  content: "赤色观测站";
  display: inline-block;
  font-size: 44px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #f7e9ea;
  text-shadow:
    0 0 20px rgba(255, 90, 120, 0.55),
    0 0 52px rgba(255, 45, 85, 0.35);
}

[class*="titleGroup"] > span:first-child::after {
  content: "REDSHIFT OBSERVATORY";
  display: block;
  margin-top: 8px;
  font-family: ui-monospace, "Cascadia Mono", monospace;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.42em;
  color: rgba(255, 130, 155, 0.55);
}

/* ============ 线框层：赛博朋克的红黑线条 ============ */
.rs-wire {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.62;
  mix-blend-mode: screen;
  shape-rendering: geometricPrecision;
}

.rs-wire .w-slow {
  animation: rs-wire-spin 90s linear infinite;
  transform-origin: 1180px 262px;
}

@keyframes rs-wire-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* 故障位移：偶尔整屏错切一下 */
.rs-glitch {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  background:
    repeating-linear-gradient(to bottom,
      rgba(255, 45, 85, 0) 0 3px,
      rgba(255, 45, 85, 0.10) 3px 4px,
      rgba(255, 45, 85, 0) 4px 9px);
  animation: rs-glitch 11s steps(1, end) infinite;
}

@keyframes rs-glitch {
  0%, 91%   { opacity: 0; transform: translateX(0); }
  92%       { opacity: 0.55; transform: translateX(-4px); }
  92.8%     { opacity: 0;    transform: translateX(0); }
  94%       { opacity: 0.75; transform: translateX(5px); }
  94.6%     { opacity: 0;    transform: translateX(-2px); }
  95.4%     { opacity: 0.35; transform: translateX(0); }
  96%       { opacity: 0; }
  100%      { opacity: 0; }
}

/* ============ 青色系统状态：唯一的一处冷色 ============ */
.rs-sys {
  position: fixed;
  right: 15px;
  bottom: 30px;
  display: flex;
  align-items: center;
  gap: 5px;
  pointer-events: none;
}

.rs-sys i {
  display: block;
  width: 2px;
  border-radius: 0;
  background: rgba(94, 234, 255, 0.75);
  box-shadow: 0 0 6px rgba(0, 214, 255, 0.6);
  animation: rs-sys-bar 2.6s ease-in-out infinite;
}

.rs-sys i:nth-child(1) { height: 5px;  animation-delay: 0s; }
.rs-sys i:nth-child(2) { height: 10px; animation-delay: 0.18s; }
.rs-sys i:nth-child(3) { height: 7px;  animation-delay: 0.36s; }
.rs-sys i:nth-child(4) { height: 12px; animation-delay: 0.54s; }
.rs-sys i:nth-child(5) { height: 6px;  animation-delay: 0.72s; }

@keyframes rs-sys-bar {
  0%, 100% { opacity: 0.35; transform: scaleY(0.6); }
  50%      { opacity: 1;    transform: scaleY(1); }
}

@media (prefers-reduced-motion: reduce) {
  .rs-sys i { animation: none !important; opacity: 0.7; }
}

/* ============ 过载：数据雨 / 扫描环 / 呼吸灯 ============ */

/* 数据雨：垂直下落的短横线 */
.rs-rain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  mix-blend-mode: screen;
}

.rs-rain i {
  position: absolute;
  width: 1px;
  display: block;
  background: linear-gradient(to bottom,
    rgba(255, 45, 85, 0) 0%,
    rgba(255, 90, 120, 0.55) 30%,
    rgba(255, 200, 200, 0.75) 55%,
    rgba(255, 60, 95, 0.25) 85%,
    rgba(255, 45, 85, 0) 100%);
  animation-name: rs-rain-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes rs-rain-fall {
  from { transform: translateY(-120%); opacity: 0; }
  6%   { opacity: 1; }
  92%  { opacity: 0.5; }
  to   { transform: translateY(120vh); opacity: 0; }
}

/* 扫描环：从黑洞圆心往外扩散的虚线环 */
.rs-ring {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
  border: 1px dashed rgba(255, 60, 95, 0.30);
  width: 140px;
  height: 140px;
  margin: -70px 0 0 -70px;
  animation: rs-ring-out 4.6s ease-out infinite;
}

@keyframes rs-ring-out {
  0%   { transform: scale(0.4) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.75; }
  100% { transform: scale(6) rotate(120deg); opacity: 0; }
}

/* 基地呼吸灯：左下的建筑窗光 */
.rs-dock {
  position: fixed;
  left: 3%;
  bottom: 3%;
  width: 34%;
  height: 26%;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 22% 46%, rgba(255, 70, 90, 0.55) 0 2px, rgba(255, 70, 90, 0) 7px),
    radial-gradient(circle at 35% 38%, rgba(255, 90, 110, 0.45) 0 1.5px, rgba(255, 90, 110, 0) 6px),
    radial-gradient(circle at 47% 50%, rgba(255, 70, 90, 0.50) 0 2px, rgba(255, 70, 90, 0) 7px),
    radial-gradient(circle at 58% 42%, rgba(255, 100, 120, 0.40) 0 1.5px, rgba(255, 100, 120, 0) 6px),
    radial-gradient(circle at 68% 52%, rgba(255, 70, 90, 0.45) 0 2px, rgba(255, 70, 90, 0) 7px),
    radial-gradient(ellipse 70% 60% at 44% 50%, rgba(255, 45, 85, 0.18), rgba(255, 45, 85, 0) 72%);
  animation: rs-dock-breath 4.2s ease-in-out infinite;
}

@keyframes rs-dock-breath {
  0%, 100% { opacity: 0.32; filter: brightness(0.8); }
  50%      { opacity: 1;    filter: brightness(1.5); }
}

/* 故障层加频：11s -> 5.5s */
.rs-glitch {
  animation-duration: 5.5s !important;
}

/* ============ 过载：设备故障 / 信息错误 / 能量溢出 ============ */

/* 爆发时整屏错切 + 色偏 */
.rs-overload {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  mix-blend-mode: screen;
}

.rs-overload.on {
  animation: rs-burst 0.46s steps(3, end) 1;
}

@keyframes rs-burst {
  0%   { opacity: 0;    transform: translate(0, 0); }
  10%  { opacity: 0.92; transform: translate(-7px, 3px) skewX(0.7deg); }
  22%  { opacity: 0.55; transform: translate(6px, -4px) skewX(-0.5deg); }
  38%  { opacity: 0.95; transform: translate(-4px, 1px); }
  55%  { opacity: 0.40; transform: translate(5px, 2px) skewX(0.35deg); }
  74%  { opacity: 0.78; transform: translate(-2px, 0); }
  100% { opacity: 0;    transform: translate(0, 0); }
}

/* 爆发时那层红白条纹 */
.rs-overload.on::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(to bottom,
      rgba(255, 60, 90, 0.00) 0 5px,
      rgba(255, 60, 90, 0.16) 5px 7px,
      rgba(255, 200, 200, 0.05) 7px 9px,
      rgba(255, 60, 90, 0.00) 9px 15px);
}

/* 爆发时整屏色差（红/青分离） */
.rs-overload.on::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    rgba(255, 40, 70, 0.10) 0%,
    rgba(0, 220, 255, 0.07) 100%);
  mix-blend-mode: screen;
}

/* 乱码文字：平时透明，爆发时闪现 */
.rs-corrupt {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  opacity: 0;
  font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.10em;
  color: rgba(255, 74, 96, 0.85);
  text-shadow: 0 0 8px rgba(255, 30, 60, 0.7);
}

.rs-corrupt.on {
  opacity: 1;
  animation: rs-corrupt-flash 0.46s steps(2, end) 1;
}

@keyframes rs-corrupt-flash {
  0%   { opacity: 0; }
  12%  { opacity: 1; }
  30%  { opacity: 0.15; }
  46%  { opacity: 0.9; }
  66%  { opacity: 0.2; }
  82%  { opacity: 0.75; }
  100% { opacity: 0; }
}

.rs-corrupt span {
  position: absolute;
  white-space: nowrap;
}

/* 溢出光：从黑洞方向扫出来的能量弧 */
.rs-surge {
  position: fixed;
  pointer-events: none;
  z-index: 2;
  left: 50%;
  top: 22%;
  width: 180vmax;
  height: 180vmax;
  margin: -90vmax 0 0 -90vmax;
  border-radius: 50%;
  opacity: 0;
  background: radial-gradient(circle,
    rgba(255, 60, 90, 0.00) 0%,
    rgba(255, 60, 90, 0.00) 33%,
    rgba(255, 70, 100, 0.34) 42%,
    rgba(255, 160, 160, 0.20) 46%,
    rgba(255, 60, 90, 0.00) 54%);
}

.rs-surge.on {
  animation: rs-surge-out 0.9s ease-out 1;
}

@keyframes rs-surge-out {
  0%   { opacity: 0;    transform: scale(0.28); }
  18%  { opacity: 0.95; }
  100% { opacity: 0;    transform: scale(1.05); }
}

@media (prefers-reduced-motion: reduce) {
  .rs-overload.on,
  .rs-corrupt.on,
  .rs-surge.on { animation: none !important; opacity: 0 !important; }
}

/* ============ 常驻数据流：竖排字符缓慢下落 ============ */
.rs-code {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.08em;
  color: rgba(255, 74, 100, 0.85);
  text-shadow: 0 0 7px rgba(255, 30, 60, 0.65);
}

.rs-code span {
  position: absolute;
  top: 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  white-space: pre;
  animation-name: rs-code-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

@keyframes rs-code-fall {
  from { transform: translateY(-42%); }
  to   { transform: translateY(112%); }
}

@media (prefers-reduced-motion: reduce) {
  .rs-code span { animation: none !important; }
  .rs-code { opacity: 0.18; }
}

/* ============ 交互增强（2026-10-29）============
   DSH 的输入框/按钮没有可依赖的稳定类名（client 样式全打在 bundle 里、带哈希），
   所以只挂通用元素选择器：textarea / contenteditable / button。
   风险很低 —— 不碰布局、不改尺寸，只加描边和辉光。 */
textarea:focus,
[contenteditable="true"]:focus {
  outline: 1px solid rgba(255, 45, 85, 0.55);
  outline-offset: 2px;
  box-shadow:
    0 0 18px rgba(255, 45, 85, 0.22),
    inset 0 0 14px rgba(255, 45, 85, 0.06);
  transition: box-shadow 180ms ease-out, outline-color 180ms ease-out;
  /* ── 四角瞄准括号（2026-10-29）──
     纯 background-image 画，不碰 DOM。textarea 不支持伪元素，这是唯一的纯 CSS 做法。
     只覆盖 background-image，输入框自己的 background-color 不受影响。 */
  --rs-aim: rgba(255, 60, 100, 0.9);
  background-image:
    linear-gradient(var(--rs-aim), var(--rs-aim)),
    linear-gradient(var(--rs-aim), var(--rs-aim)),
    linear-gradient(var(--rs-aim), var(--rs-aim)),
    linear-gradient(var(--rs-aim), var(--rs-aim)),
    linear-gradient(var(--rs-aim), var(--rs-aim)),
    linear-gradient(var(--rs-aim), var(--rs-aim)),
    linear-gradient(var(--rs-aim), var(--rs-aim)),
    linear-gradient(var(--rs-aim), var(--rs-aim));
  background-repeat: no-repeat;
  background-size:
    13px 1.5px, 1.5px 13px,
    13px 1.5px, 1.5px 13px,
    13px 1.5px, 1.5px 13px,
    13px 1.5px, 1.5px 13px;
  background-position:
    left 7px top 7px,   left 7px top 7px,
    right 7px top 7px,  right 7px top 7px,
    left 7px bottom 7px, left 7px bottom 7px,
    right 7px bottom 7px, right 7px bottom 7px;
}

/* 按钮悬停：像物理按键一样透出一点红光 */
button:hover {
  box-shadow:
    0 0 10px rgba(255, 45, 85, 0.26),
    inset 0 0 6px rgba(255, 45, 85, 0.10);
  transition: box-shadow 160ms ease-out;
}
button:active {
  box-shadow:
    0 0 4px rgba(255, 45, 85, 0.35),
    inset 0 0 10px rgba(255, 45, 85, 0.18);
}

@media (prefers-reduced-motion: reduce) {
  textarea:focus, [contenteditable="true"]:focus, button:hover { transition: none; }
}

/* ============ 尊重“减少动态效果” ============ */
@media (prefers-reduced-motion: reduce) {
  .rs-rift i, .rs-rift u, .rs-wave, .rs-beacon, .rs-beacon::after,
  .rs-scan, .rs-stream, body::after { animation: none !important; }
  .rs-rift i { opacity: 0.09; }
  .rs-rift u { opacity: 0.05; }
  .rs-wave { opacity: 0.16; }
  .rs-scan { opacity: 0.35; }
  .rs-stream { opacity: 0.25; }
}
`

    /* ------------------------------------------------------------------ *
     * ③ HUD 组件
     * 撕裂带周期取互质数（11.7 / 17.3 / 13.9），永远不会同步成“一起闪”。
     * ------------------------------------------------------------------ */
    const BANDS = [
      { top: '22%', height: 1.2, duration: '11.7s', delay: '0.0s', cls: '' },
      { top: '48%', height: 1.8, duration: '17.3s', delay: '4.1s', cls: 'rs-hot' },
      { top: '74%', height: 1.2, duration: '13.9s', delay: '8.6s', cls: '' },
      { top: '60%', height: 1.0, duration: '19.7s', delay: '13.2s', cls: 'rs-chroma' },
    ]

    const STREAMS = [
      { x: '9%', delay: '0s', dur: '6.6s', h: 22 },
      { x: '24%', delay: '2.4s', dur: '9.9s', h: 16 },
      { x: '42%', delay: '4.8s', dur: '8.1s', h: 27 },
      { x: '58%', delay: '1.5s', dur: '11.4s', h: 14 },
      { x: '73%', delay: '7.1s', dur: '8.7s', h: 23 },
      { x: '90%', delay: '3.9s', dur: '10.3s', h: 18 },
    ]

    // 小行星带：沿一条斜线撒 18 颗，固定种子
    const ASTEROIDS = (() => {
      let seed = 77123
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return seed / 0x7fffffff
      }
      const out = []
      for (let i = 0; i < 18; i++) {
        const t = i / 17
        out.push({
          left: (45 + t * 43 + (rnd() - 0.5) * 6).toFixed(2) + '%',
          top: (56 + t * 27 + (rnd() - 0.5) * 5).toFixed(2) + '%',
          size: (1.2 + rnd() * 2.6).toFixed(1) + 'px',
          opacity: (0.16 + rnd() * 0.40).toFixed(2),
        })
      }
      return out
    })()

    // 数据雨：固定种子，位置稳定不闪
    const RAIN = (() => {
      let seed = 90210
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return seed / 0x7fffffff
      }
      const out = []
      for (let i = 0; i < 26; i++) {
        out.push({
          x: (rnd() * 100).toFixed(1) + '%',
          top: (rnd() * 100).toFixed(1) + '%',
          h: (6 + rnd() * 18).toFixed(0) + 'vh',
          dur: (3.4 + rnd() * 5.2).toFixed(1) + 's',
          delay: (rnd() * 6).toFixed(1) + 's',
          op: (0.12 + rnd() * 0.35).toFixed(2),
        })
      }
      return out
    })()

    /* ---------- 常驻数据流：32 列竖排字符 ---------- */
    const CODE_COLS = (() => {
      const CHARS = '0123456789ABCDEF·/\\|░▒▓─═│┤┼'
      let seed = 20261028
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return seed / 0x7fffffff
      }
      const out = []
      for (let c = 0; c < 32; c++) {
        let line = ''
        const len = 34 + Math.floor(rnd() * 26)
        for (let i = 0; i < len; i++) {
          line += CHARS[Math.floor(rnd() * CHARS.length)]
          if (i % 3 === 2) line += ' '
        }
        out.push({
          left: (1.5 + c * 3.05).toFixed(2) + '%',
          text: line,
          dur: (26 + rnd() * 30).toFixed(1) + 's',
          delay: (-rnd() * 42).toFixed(1) + 's',
          op: (0.14 + rnd() * 0.30).toFixed(3),
        })
      }
      return out
    })()

    /* ---------- 过载：间歇爆发 ---------- */
    const CORRUPT_POOL = [
      'ERR 0x7F // SIG LOST',
      'NULL POINTER @ 0x4A2E',
      'SYNC FAIL · RETRY 3/5',
      '░▒▓█ OVERFLOW █▓▒░',
      'TEMP 1184.6K · CRITICAL',
      '0xDEADBEEF · CORE DUMP',
      'SIGNAL DEGRADED 41%',
      'MEM 99.7% · SWAP FAIL',
      'RS-02 // NO RESPONSE',
      'COORD 61.2 / -4.8 · DRIFT',
    ]

    function Overload() {
      const [phase, setPhase] = React.useState('idle')
      const [lines, setLines] = React.useState([])

      React.useEffect(() => {
        let timer = null
        let alive = true
        const fire = () => {
          if (!alive) return
          // 每次爆 3~5 行乱码，位置随机贴在边缘
          const count = 3 + Math.floor(Math.random() * 3)
          const picked = []
          for (let i = 0; i < count; i++) {
            const text = CORRUPT_POOL[Math.floor(Math.random() * CORRUPT_POOL.length)]
            const edge = Math.random()
            const top = edge < 0.5
              ? 4 + Math.random() * 22
              : 66 + Math.random() * 28
            const left = 3 + Math.random() * 78
            picked.push({ text, top: top.toFixed(1) + 'vh', left: left.toFixed(1) + 'vw' })
          }
          setLines(picked)
          setPhase('on')
          window.setTimeout(() => { if (alive) setPhase('idle') }, 620)
          const gap = 7000 + Math.random() * 7000
          timer = window.setTimeout(fire, gap)
        }
        timer = window.setTimeout(fire, 2600 + Math.random() * 3000)
        return () => {
          alive = false
          if (timer) window.clearTimeout(timer)
        }
      }, [])

      const on = phase === 'on'
      return h(
        React.Fragment,
        null,
        h('div', { className: 'rs-surge' + (on ? ' on' : ''), 'aria-hidden': 'true' }),
        h('div', { className: 'rs-overload' + (on ? ' on' : ''), 'aria-hidden': 'true' }),
        h(
          'div',
          { className: 'rs-corrupt' + (on ? ' on' : ''), 'aria-hidden': 'true' },
          lines.map((l, i) => h('span', { key: 'c-' + i, style: { top: l.top, left: l.left } }, l.text)),
        ),
      )
    }

    /* ---------- 线框：把黑洞画成极坐标网格 ---------- */
    function Wireframe() {
      const CX = 1180          // 黑洞中心（跟背景图对齐）
      const CY = 262
      const rings = [56, 86, 124, 172, 232, 304, 388]
      const spokes = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2)

      return h(
        'svg',
        {
          className: 'rs-wire',
          viewBox: '0 0 1600 1000',
          preserveAspectRatio: 'xMidYMid slice',
          'aria-hidden': 'true',
        },
        // 极坐标网格
        h(
          'g',
          { fill: 'none', stroke: '#ff2d55', strokeWidth: 1 },
          rings.map((r, i) =>
            h('circle', {
              key: 'ring-' + i,
              cx: CX,
              cy: CY,
              r,
              strokeOpacity: Math.max(0.06, 0.52 - i * 0.062),
            }),
          ),
          h(
            'g',
            { className: 'w-slow', strokeOpacity: 0.13 },
            spokes.map((a, i) =>
              h('line', {
                key: 'spoke-' + i,
                x1: CX + Math.cos(a) * 60,
                y1: CY + Math.sin(a) * 60,
                x2: CX + Math.cos(a) * 470,
                y2: CY + Math.sin(a) * 470,
              }),
            ),
          ),
          // 吸积盘轨道
          h('ellipse', {
            cx: CX, cy: CY, rx: 330, ry: 62,
            strokeOpacity: 0.42,
            transform: 'rotate(-16 ' + CX + ' ' + CY + ')',
          }),
          h('ellipse', {
            cx: CX, cy: CY, rx: 396, ry: 78,
            strokeOpacity: 0.20,
            transform: 'rotate(-16 ' + CX + ' ' + CY + ')',
          }),
          h('ellipse', {
            cx: CX, cy: CY, rx: 262, ry: 48,
            strokeOpacity: 0.28,
            transform: 'rotate(-16 ' + CX + ' ' + CY + ')',
          }),
          // 十字准星
          h('line', { x1: CX - 470, y1: CY, x2: CX - 420, y2: CY, strokeOpacity: 0.35 }),
          h('line', { x1: CX + 420, y1: CY, x2: CX + 470, y2: CY, strokeOpacity: 0.35 }),
          h('line', { x1: CX, y1: CY - 470, x2: CX, y2: CY - 420, strokeOpacity: 0.35 }),
        ),
        // 地平线：几条同心弧
        h(
          'g',
          { fill: 'none', stroke: '#ff2d55', strokeWidth: 1 },
          h('path', { d: 'M -40 706 Q 800 648 1640 706', strokeOpacity: 0.30 }),
          h('path', { d: 'M -40 742 Q 800 684 1640 742', strokeOpacity: 0.18 }),
          h('path', { d: 'M -40 782 Q 800 724 1640 782', strokeOpacity: 0.10 }),
        ),
        // 角落刻度串（沿上边和右边）
        h(
          'g',
          { stroke: '#ff2d55', strokeWidth: 1, strokeOpacity: 0.22 },
          Array.from({ length: 22 }, (_, i) =>
            h('line', {
              key: 'tick-t-' + i,
              x1: 60 + i * 72,
              y1: 0,
              x2: 60 + i * 72,
              y2: i % 5 === 0 ? 16 : 7,
            }),
          ),
        ),
      )
    }

    /* ---------- 观测站徽记 ---------- */
    function Emblem({ size }) {
      const s2 = size || 22
      // viewBox 是 512，缩到 s2 像素时线宽会被一起缩掉，
      // 所以按比例把 stroke 放大，保证任何尺寸下都是 ~1.6px 的视觉线宽
      const k = (512 / s2) * 0.27
      const g = {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 6 * k,
        strokeLinecap: 'round',
      }
      return h(
        'svg',
        {
          viewBox: '0 0 512 512',
          width: s2,
          height: s2,
          'aria-hidden': 'true',
          style: { display: 'block' },
        },
        h(
          'g',
          g,
          h('circle', { cx: 256, cy: 256, r: 196, strokeOpacity: 0.95 }),
          h('circle', { cx: 256, cy: 256, r: 176, strokeOpacity: 0.35, strokeWidth: 2 * k }),
          h('circle', { cx: 256, cy: 256, r: 118, strokeOpacity: 0.55, strokeWidth: 3 * k }),
          h('line', { x1: 256, y1: 40, x2: 256, y2: 112, strokeOpacity: 0.8 }),
          h('line', { x1: 256, y1: 400, x2: 256, y2: 472, strokeOpacity: 0.8 }),
          h('line', { x1: 40, y1: 256, x2: 112, y2: 256, strokeOpacity: 0.8 }),
          h('line', { x1: 400, y1: 256, x2: 472, y2: 256, strokeOpacity: 0.8 }),
          h('path', { d: 'M 196 372 L 316 372 L 296 344 L 216 344 Z', strokeOpacity: 0.9, strokeWidth: 5 * k }),
          h('path', { d: 'M 232 344 L 232 250 L 280 250 L 280 344', strokeOpacity: 0.9, strokeWidth: 5 * k }),
          h('line', { x1: 232, y1: 300, x2: 280, y2: 300, strokeOpacity: 0.5, strokeWidth: 3 * k }),
          h('path', { d: 'M 196 236 Q 256 178 316 236', strokeOpacity: 0.95 }),
          h('line', { x1: 256, y1: 236, x2: 256, y2: 250, strokeOpacity: 0.8, strokeWidth: 4 * k }),
          h('line', { x1: 256, y1: 208, x2: 256, y2: 176, strokeOpacity: 0.6, strokeWidth: 3 * k }),
          h('circle', { cx: 256, cy: 256, r: 8 * k * 0.9, fill: 'currentColor', stroke: 'none', opacity: 0.9 }),
        ),
      )
    }

    function BrandMark() {
      return h('span', { className: 'rs-brand-mark', style: { color: '#ff2d55', filter: 'drop-shadow(0 0 6px rgba(255,45,85,.6))' } },
        h(Emblem, { size: 24 }))
    }

    function HeroMark() {
      return h(
        'span',
        {
          className: 'rs-hero-mark',
          style: {
            color: '#ff2d55',
            display: 'contents',
            filter: 'drop-shadow(0 0 18px rgba(255, 45, 85, 0.6))',
          },
        },
        h(Emblem, { size: 40 }),
      )
    }

    function BrandName() {
      return h(
        'span',
        { className: 'rs-brand-name' },
        h('span', { className: 'rs-brand-zh' }, '赤色观测站'),
        h('span', { className: 'rs-brand-en' }, 'REDSHIFT OBSERVATORY'),
      )
    }

    /* 四周侵蚀带的乱码内容：确定性生成（同一次加载内不变，刷新才换一套）
       上/下条：每行 300 字符 × 4 行（超出宽度自动裁掉）
       左/右条：竖排单行 80 字符 */
    const ERODE_BLOCKS = (() => {
      const CHARS = '▓▒░█▌▐╱╲｜/\\<>[]{}#$%&@!?*0123456789ABCDEF'
      let seed = 20261029
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return seed / 0x7fffffff
      }
      const make = (cols, rows) => {
        const lines = []
        for (let r = 0; r < rows; r++) {
          let line = ''
          for (let c = 0; c < cols; c++) line += CHARS[Math.floor(rnd() * CHARS.length)]
          lines.push(line)
        }
        return lines.join('\n')
      }
      const strip = (len) => {
        let s = ''
        for (let i = 0; i < len; i++) s += CHARS[Math.floor(rnd() * CHARS.length)]
        return s
      }
      return {
        top: make(300, 4),
        bottom: make(300, 4),
        left: strip(80),
        right: strip(80),
      }
    })()


    /* ---------- 观测计划：跃迁版时间轴（2026-10-28 从 opening-v2.html 移植） ----------
       0.08-2.10 剧震+乱码 / 2.10-2.34 静场 / 2.34-3.58 星流汇聚 /
       3.58-3.88 裂缝出现 / 3.88-4.30 撕裂张开 / 4.30-4.66 白光过曝 → 红余晖 /
       4.66-6.60 徽记 + 「观测计划」浮现 */
    function RiftLayer() {
      const bands = BANDS.map((band, index) =>
        h('i', {
          key: 'band-' + index,
          className: band.cls || undefined,
          style: {
            top: band.top,
            height: band.height + 'px',
            animationDuration: band.duration,
            animationDelay: band.delay,
          },
        }),
      )

      const streams = STREAMS.map((s, index) =>
        h('span', {
          key: 'stream-' + index,
          className: 'rs-stream',
          style: {
            left: s.x,
            height: s.h + 'vh',
            animationDuration: s.dur,
            animationDelay: s.delay,
          },
        }),
      )

      const asteroids = ASTEROIDS.map((a, index) =>
        h('i', {
          key: 'ast-' + index,
          style: {
            left: a.left,
            top: a.top,
            width: a.size,
            height: a.size,
            opacity: a.opacity,
          },
        }),
      )

      return h(
        React.Fragment,
        null,
        h(Wireframe),
        h('div', { className: 'rs-radar', 'aria-hidden': 'true' }),
        h(
          'div',
          { className: 'rs-erode', 'aria-hidden': 'true' },
          h('i', { className: 'rs-erode-top' }, ERODE_BLOCKS.top),
          h('i', { className: 'rs-erode-bottom' }, ERODE_BLOCKS.bottom),
          h('i', { className: 'rs-erode-left' }, ERODE_BLOCKS.left),
          h('i', { className: 'rs-erode-right' }, ERODE_BLOCKS.right),
        ),
        h('div', { className: 'rs-glitch', 'aria-hidden': 'true' }),
        h('div', { className: 'rs-dock', 'aria-hidden': 'true' }),
        h(
          'div',
          { className: 'rs-code', 'aria-hidden': 'true' },
          CODE_COLS.map((c, i) =>
            h('span', {
              key: 'code-' + i,
              style: {
                left: c.left,
                animationDuration: c.dur,
                animationDelay: c.delay,
                opacity: c.op,
              },
            }, c.text),
          ),
        ),
        h(Overload),
        h(
          'div',
          { className: 'rs-rain', 'aria-hidden': 'true' },
          RAIN.map((r, i) =>
            h('i', {
              key: 'rain-' + i,
              style: {
                left: r.x,
                top: r.top,
                height: r.h,
                animationDuration: r.dur,
                animationDelay: r.delay,
                opacity: r.op,
              },
            }),
          ),
        ),
        h('div', {
          className: 'rs-ring',
          'aria-hidden': 'true',
          style: { left: '71%', top: '26%' },
        }),
        h(
          'div',
          { className: 'rs-hud', 'aria-hidden': 'true' },
          h('span', { className: 'rs-pulsar' }),
          h('span', { className: 'rs-comet' }),
          h('div', { className: 'rs-belt' }, asteroids),
          h(
          'div',
          { className: 'rs-window', 'aria-hidden': 'true' },
          h('span', { className: 'rs-w-ticks' }),
          h('span', { className: 'rs-w-ring a' }),
          h('span', { className: 'rs-w-ring b' }),
          h('span', { className: 'rs-w-cross' }),
          h('span', { className: 'rs-w-dot' }),
          h('span', { className: 'rs-w-scan' }),
          h('span', { className: 'rs-w-read' }, 'RS-02'),
          h('span', { className: 'rs-w-read2' }, 'CREW · STANDBY'),
        ),
          h('span', { className: 'rs-corner tl' }),
          h('span', { className: 'rs-corner tr' }),
          h('span', { className: 'rs-corner bl' }),
          h('span', { className: 'rs-corner br' }),
          h('span', { className: 'rs-ruler-b' }),
          h('span', { className: 'rs-ruler-l' }),
          h('span', { className: 'rs-scan' }),
          streams,
        ),
        h(
          'div',
          { className: 'rs-rift', 'aria-hidden': 'true' },
          h('b', { className: 'rs-wave' }),
          h('u', { style: { left: '68%', width: '1.2px' } }),
          bands,
        ),
        h('div', { className: 'rs-beacon', 'aria-hidden': 'true', title: '赤色观测站 运行中' }),
        h('div', { className: 'rs-sys', 'aria-hidden': 'true' },
          h('i'), h('i'), h('i'), h('i'), h('i'),
        ),
        h('div', { className: 'rs-readout', 'aria-hidden': 'true' }, 'RS·02 // OBSERVATORY ONLINE'),
      )
    }

    /* ------------------------------------------------------------------ *
     * 插件入口
     * ------------------------------------------------------------------ */
    function apply(ctx) {
      if (ctx.theme && typeof ctx.theme.overrideTokens === 'function') {
        ctx.effect(() => ctx.theme.overrideTokens(SOURCE, TOKENS))
      }

      ctx.effect(() => {
        const existing = document.querySelector('style[data-redshift]')
        if (existing) return () => {}

        const style = document.createElement('style')
        style.setAttribute('data-redshift', '1')
        style.textContent = CSS
        document.head.appendChild(style)

        return () => {
          style.remove()
        }
      })

      // 观测中枢：品牌名 + 徽记
      ctx.slots.inject('sidebar.brand.mark', () =>
        ctx.slots.register({ name: 'sidebar.brand.mark', id: 'redshift-emblem' }, BrandMark),
      )

      ctx.slots.inject('sidebar.brand.name', () =>
        ctx.slots.register({ name: 'sidebar.brand.name', id: 'redshift-brand' }, BrandName),
      )

      // 空白会话的鲸鱼 logo → 观测站徽记
      ctx.slots.inject('conversation.hero.brand.mark', () =>
        ctx.slots.register(
          { name: 'conversation.hero.brand.mark', id: 'redshift-hero-mark' },
          HeroMark,
        ),
      )

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'redshift-rift',
            order: 40,
            label: () => '赤色观测站 HUD',
          },
          RiftLayer,
        ),
      )
    }

    return {
      name: SOURCE,
      inject: ['slots', 'theme'],
      apply,
    }
  },
})
