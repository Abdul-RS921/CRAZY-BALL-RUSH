// Crazy Ball Rush - Commercial-Quality Infinite 2D Arcade Runner
(function() {
  'use strict';

  // Game States
  const STATE = {
    WELCOME: 'WELCOME',
    GUIDE_PROMPT: 'GUIDE_PROMPT',
    GUIDE: 'GUIDE',
    TUTORIAL: 'TUTORIAL',
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    REVIVING: 'REVIVING',
    GAME_OVER: 'GAME_OVER'
  };

  // Unlockable Runner Shapes
  const SHAPES = {
    'circle': { id: 'circle', name: 'Sphere', symbol: '●', desc: 'Default unlocked' },
    'square': { id: 'square', name: 'Cube', symbol: '■', desc: 'Unlocked via Survivor achievement' },
    'diamond': { id: 'diamond', name: 'Diamond', symbol: '◆', desc: 'Unlocked via First Jump achievement' },
    'hexagon': { id: 'hexagon', name: 'Hexagon', symbol: '⬡', desc: 'Unlocked via Hazard Dodger achievement' },
    'star': { id: 'star', name: 'Super Star', symbol: '★', desc: 'Unlocked via Orbit Master achievement' }
  };

  // Achievement Definitions & Visual Rewards
  const ACHIEVEMENTS_DEF = {
    'firstRun': {
      key: 'firstRun',
      name: 'First Run',
      desc: 'Began your infinite journey',
      icon: '🏆',
      rewardText: '+50 Coins',
      coins: 50
    },
    'firstEscape': {
      key: 'firstEscape',
      name: 'First Escape',
      desc: 'Completed Level 1 and advanced',
      icon: '🏃',
      rewardText: '+100 Coins',
      coins: 100
    },
    'firstJump': {
      key: 'firstJump',
      name: 'First Jump',
      desc: 'Leaped into the air successfully',
      icon: '🦘',
      rewardText: 'Diamond Runner Shape',
      rewardShape: 'diamond'
    },
    'coinCollector': {
      key: 'coinCollector',
      name: 'Coin Collector',
      desc: 'Collected 50 total energy coins',
      icon: '🪙',
      rewardText: 'Sunset Background Theme',
      rewardTheme: 1
    },
    'hazardDodger': {
      key: 'hazardDodger',
      name: 'Hazard Dodger',
      desc: 'Successfully bypassed 10 laser hazards',
      icon: '⚡',
      rewardText: 'Hexagon Runner Shape',
      rewardShape: 'hexagon'
    },
    'survivor': {
      key: 'survivor',
      name: 'Survivor',
      desc: 'Survive for over 60 seconds',
      icon: '⏱️',
      rewardText: 'Cube Runner Shape',
      rewardShape: 'square'
    },
    'untouchable': {
      key: 'untouchable',
      name: 'Untouchable',
      desc: 'Survive for over 2 minutes (120s)',
      icon: '🛡️',
      rewardText: '+200 Coins',
      coins: 200
    },
    'speedDemon': {
      key: 'speedDemon',
      name: 'Speed Demon',
      desc: 'Triggered Supersonic Speed Boost',
      icon: '🚀',
      rewardText: 'Desert Background Theme',
      rewardTheme: 3
    },
    'speedRunner': {
      key: 'speedRunner',
      name: 'Speed Runner',
      desc: 'Reached Level 5 in a continuous run',
      icon: '⚡',
      rewardText: '+250 Coins',
      coins: 250
    },
    'comboMaster': {
      key: 'comboMaster',
      name: 'Combo Master',
      desc: 'Reached a 3x or higher combo',
      icon: '🔥',
      rewardText: 'Super Star Runner Shape',
      rewardShape: 'star'
    },
    'longRun': {
      key: 'longRun',
      name: 'Orbit Master',
      desc: 'Scored over 1,500 points',
      icon: '🌌',
      rewardText: 'Futuristic City Theme',
      rewardTheme: 5
    },
    'masterRunner': {
      key: 'masterRunner',
      name: 'Master Runner',
      desc: 'Reached Level 10 mastery',
      icon: '👑',
      rewardText: '+500 Coins',
      coins: 500
    }
  };

  // 7 Distinct Orb Color Styles
  const ORB_STYLES = {
    'electric-blue': {
      id: 'electric-blue',
      name: 'Electric Blue',
      coreColor: '#ffffff',
      glowColor: '#00f0ff',
      trailColor: '#00c8ff',
      ringColor: '#00f0ff',
      particles: '#a5f3fc',
      unlockDesc: 'Default Unlocked',
      isUnlocked: () => true
    },
    'neon-green': {
      id: 'neon-green',
      name: 'Neon Green',
      coreColor: '#ffffff',
      glowColor: '#00ff88',
      trailColor: '#00dd77',
      ringColor: '#00ff88',
      particles: '#7affc7',
      unlockDesc: 'Unlocked by Default',
      isUnlocked: () => true
    },
    'purple-energy': {
      id: 'purple-energy',
      name: 'Purple Energy',
      coreColor: '#ffffff',
      glowColor: '#b000ff',
      trailColor: '#9900ee',
      ringColor: '#d946ef',
      particles: '#f0abfc',
      unlockDesc: 'Collect 50 Total Coins',
      isUnlocked: (stats) => (stats.totalCoins >= 50)
    },
    'golden': {
      id: 'golden',
      name: 'Golden Radiance',
      coreColor: '#ffffff',
      glowColor: '#ffd700',
      trailColor: '#ffaa00',
      ringColor: '#ffe066',
      particles: '#fde047',
      unlockDesc: 'Reach 1,000 High Score',
      isUnlocked: (stats) => (stats.bestScore >= 1000)
    },
    'red-plasma': {
      id: 'red-plasma',
      name: 'Red Plasma',
      coreColor: '#ffffff',
      glowColor: '#ff0055',
      trailColor: '#ff2200',
      ringColor: '#ff4d6d',
      particles: '#fca5a5',
      unlockDesc: 'Survive for 60 Seconds',
      isUnlocked: (stats) => (stats.longestSurvival >= 60)
    },
    'cyan': {
      id: 'cyan',
      name: 'Hyper Cyan',
      coreColor: '#ffffff',
      glowColor: '#06b6d4',
      trailColor: '#0891b2',
      ringColor: '#67e8f9',
      particles: '#cffafe',
      unlockDesc: 'Reach a 3x Combo',
      isUnlocked: (stats) => (stats.highestCombo >= 3)
    },
    'pink-energy': {
      id: 'pink-energy',
      name: 'Pink Energy',
      coreColor: '#ffffff',
      glowColor: '#ff0077',
      trailColor: '#e11d48',
      ringColor: '#fb7185',
      particles: '#fbcfe8',
      unlockDesc: '10m Session Reward',
      isUnlocked: (stats, sessionMins) => (sessionMins >= 10 || (stats.claimedMilestones && stats.claimedMilestones.includes(3)))
    }
  };

  // Environmental Parallax Themes - Dynamic Escape World Progression
  const THEMES = [
    {
      name: 'Abandoned City',
      skyTop: '#030f17',
      skyBottom: '#0a2734',
      distant: '#061d27',
      mountains: '#0c3846',
      structures: '#0e4f5f',
      groundTop: '#00f0ff',
      groundBottom: '#041f27',
      gridColor: 'rgba(0, 240, 255, 0.25)',
      accent: '#00f0ff',
      particles: '#67e8f9'
    },
    {
      name: 'Underground Tunnel',
      skyTop: '#160803',
      skyBottom: '#341506',
      distant: '#240d04',
      mountains: '#4b1b08',
      structures: '#6a2609',
      groundTop: '#ff9900',
      groundBottom: '#220b03',
      gridColor: 'rgba(255, 153, 0, 0.25)',
      accent: '#ffaa00',
      particles: '#ffd700'
    },
    {
      name: 'Neon Laboratory',
      skyTop: '#02140e',
      skyBottom: '#052d1f',
      distant: '#032016',
      mountains: '#08402d',
      structures: '#0b5f44',
      groundTop: '#00ff88',
      groundBottom: '#032218',
      gridColor: 'rgba(0, 255, 136, 0.25)',
      accent: '#00ff88',
      particles: '#6ee7b7'
    },
    {
      name: 'Industrial Foundry',
      skyTop: '#1b0409',
      skyBottom: '#3a0914',
      distant: '#2a050d',
      mountains: '#580c1b',
      structures: '#7e1227',
      groundTop: '#ff3366',
      groundBottom: '#24040a',
      gridColor: 'rgba(255, 51, 102, 0.25)',
      accent: '#ff5500',
      particles: '#ff758f'
    },
    {
      name: 'High-Tech Energy Zone',
      skyTop: '#090317',
      skyBottom: '#1c083b',
      distant: '#140529',
      mountains: '#2d0f57',
      structures: '#481785',
      groundTop: '#b000ff',
      groundBottom: '#120424',
      gridColor: 'rgba(176, 0, 255, 0.25)',
      accent: '#e08aff',
      particles: '#d8b4fe'
    },
    {
      name: 'Quantum Overdrive',
      skyTop: '#04091a',
      skyBottom: '#0b1f44',
      distant: '#071632',
      mountains: '#0f3062',
      structures: '#184d95',
      groundTop: '#00f0ff',
      groundBottom: '#051833',
      gridColor: 'rgba(0, 240, 255, 0.3)',
      accent: '#ffffff',
      particles: '#e0f2fe'
    }
  ];

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  function lerpColor(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r}, ${g}, ${bl})`;
  }

  // ===================================================
  // CONTINUOUS BACKGROUND SYSTEM (PRELOADED & PRE-RENDERED)
  // Zero dynamic image/path allocations during gameplay.
  // Pre-renders and caches seamless repeating parallax layers
  // across all themes in memory before gameplay starts.
  // Enforces:
  // - Infinite seamless tiling [ Section A ][ Section A ][ Section A ]
  // - Mathematical continuity at seams: NO gaps, NO black frames, NO sudden jumps
  // - Ultra-fast GPU hardware blitting via ctx.drawImage
  // - Smooth alpha cross-fade between themes on level transitions
  // ===================================================
  class ContinuousBackgroundSystem {
    constructor() {
      this.themes = THEMES;
      this.cache = [];
      this.isReady = false;
      this.L1_WIDTH = 560;
      this.L1_HEIGHT = 260;
      this.L2_WIDTH = 600;
      this.L2_HEIGHT = 160;
      this.L3_WIDTH = 680;
      this.L3_HEIGHT = 220;
    }

    preloadAll() {
      if (this.isReady) return;
      for (let t = 0; t < this.themes.length; t++) {
        const theme = this.themes[t];
        this.cache[t] = {
          layer1: this.createLayer1Canvas(theme),
          layer2: this.createLayer2Canvas(theme),
          layer3: this.createLayer3Canvas(theme)
        };
      }
      this.isReady = true;
    }

    getThemeLayers(themeIdx) {
      if (!this.isReady) this.preloadAll();
      const idx = Math.max(0, Math.min(this.cache.length - 1, themeIdx || 0));
      return this.cache[idx] || this.cache[0];
    }

    createLayer1Canvas(theme) {
      const c = document.createElement('canvas');
      c.width = this.L1_WIDTH;
      c.height = this.L1_HEIGHT;
      const ctx = c.getContext('2d');
      if (!ctx) return c;

      const baseColor = theme.distant;
      ctx.fillStyle = baseColor;
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2;

      // 4 towers spaced exactly 140px apart: x = 35, 175, 315, 455 (seamless at 560)
      for (let i = 0; i < 4; i++) {
        const bx = i * 140;
        const towerTop = 50;

        // Triangular superstructure backdrop
        ctx.beginPath();
        ctx.moveTo(bx, this.L1_HEIGHT);
        ctx.lineTo(bx + 35, towerTop + 20);
        ctx.lineTo(bx + 70, this.L1_HEIGHT);
        ctx.fill();

        // Slim spire tower
        ctx.fillRect(bx + 35, towerTop, 18, this.L1_HEIGHT - towerTop);

        // Spire needle
        ctx.beginPath();
        ctx.moveTo(bx + 44, towerTop);
        ctx.lineTo(bx + 44, 4);
        ctx.stroke();

        // Subtle accent detail
        ctx.fillStyle = theme.accent;
        ctx.fillRect(bx + 43, towerTop + 14, 2, 40);
        ctx.fillStyle = baseColor;
      }

      return c;
    }

    createLayer2Canvas(theme) {
      const c = document.createElement('canvas');
      c.width = this.L2_WIDTH;
      c.height = this.L2_HEIGHT;
      const ctx = c.getContext('2d');
      if (!ctx) return c;

      ctx.fillStyle = theme.mountains;
      ctx.beginPath();
      ctx.moveTo(0, this.L2_HEIGHT);
      ctx.lineTo(0, 70);

      // Harmonically seamless curve: sin(2pi * x / 600) + sin(4pi * x / 600)
      // Connects x=0 to x=600 with zero step and zero derivative discontinuity
      for (let x = 0; x <= this.L2_WIDTH; x += 10) {
        const rad = (x / this.L2_WIDTH) * Math.PI * 2;
        const y = 65 + Math.sin(rad) * 26 + Math.sin(rad * 2) * 12;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(this.L2_WIDTH, this.L2_HEIGHT);
      ctx.closePath();
      ctx.fill();

      return c;
    }

    createLayer3Canvas(theme) {
      const c = document.createElement('canvas');
      c.width = this.L3_WIDTH;
      c.height = this.L3_HEIGHT;
      const ctx = c.getContext('2d');
      if (!ctx) return c;

      const buildings = [
        { x: 10, w: 55, h: 140 },
        { x: 85, w: 62, h: 175 },
        { x: 168, w: 48, h: 125 },
        { x: 236, w: 70, h: 160 },
        { x: 328, w: 56, h: 185 },
        { x: 406, w: 66, h: 135 },
        { x: 492, w: 54, h: 168 },
        { x: 566, w: 60, h: 150 }
      ];

      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];
        const bTop = this.L3_HEIGHT - b.h;

        // Building body
        ctx.fillStyle = theme.structures;
        ctx.fillRect(b.x, bTop, b.w, b.h);

        // Neon roof trim
        ctx.fillStyle = theme.accent;
        ctx.fillRect(b.x, bTop, b.w, 2.5);

        // Illuminated office window grids
        const winCols = Math.max(2, Math.floor((b.w - 12) / 14));
        const winRows = Math.min(7, Math.floor((b.h - 20) / 16));

        for (let r = 0; r < winRows; r++) {
          for (let cCol = 0; cCol < winCols; cCol++) {
            const isLit = ((i * 7 + r * 3 + cCol * 5) % 4) !== 0;
            if (isLit) {
              ctx.fillStyle = (r % 2 === 0) ? 'rgba(0, 240, 255, 0.42)' : 'rgba(255, 220, 100, 0.38)';
              ctx.fillRect(b.x + 8 + cCol * 13, bTop + 12 + r * 14, 6, 6);
            }
          }
        }
      }

      return c;
    }

    renderContinuousLayer(ctx, canvasTile, offset, yPos, screenWidth) {
      if (!canvasTile) return;
      const tileW = canvasTile.width;
      let startX = -(((offset % tileW) + tileW) % tileW);
      if (startX > 0) startX -= tileW;

      // Draw repeating continuous sections: [ Section A ][ Section A ][ Section A ]...
      // Seamlessly across the entire screen with ZERO gap and ZERO black frame
      for (let tx = startX; tx < screenWidth + tileW; tx += tileW) {
        ctx.drawImage(canvasTile, tx, yPos);
      }
    }

    renderLayer1Beacons(ctx, offset, yPos, screenWidth, accentColor) {
      const tileW = this.L1_WIDTH;
      let startX = -(((offset % tileW) + tileW) % tileW);
      if (startX > 0) startX -= tileW;

      for (let tx = startX; tx < screenWidth + tileW; tx += tileW) {
        for (let i = 0; i < 4; i++) {
          const bx = tx + i * 140 + 44;
          if (bx >= -10 && bx <= screenWidth + 10) {
            ctx.fillStyle = (i % 2 === 0) ? '#ff0055' : (accentColor || '#00f0ff');
            ctx.fillRect(bx - 1.5, yPos - 1.5, 3, 3);
          }
        }
      }
    }
  }

  // ===================================================
  // CENTRALIZED IN-GAME NOTIFICATION MANAGER
  // Enforces: Single active notification, priority preemption,
  // bounded queue (max 2), duplicate cooldown, and pointer transparency.
  // ===================================================
  class GameNotificationManager {
    constructor() {
      this.current = null;
      this.queue = [];
      this.timer = null;
      this.exitTimer = null;
      this.recentHistory = {}; // id -> timestamp
      this.bannerEl = null;
      this.pillEl = null;
      this.iconEl = null;
      this.titleEl = null;
      this.msgEl = null;
    }

    init() {
      this.bannerEl = document.getElementById('unified-notification-banner');
      if (!this.bannerEl) {
        this.bannerEl = document.createElement('div');
        this.bannerEl.id = 'unified-notification-banner';
        this.bannerEl.className = 'unified-notification-banner';
        this.bannerEl.setAttribute('aria-live', 'polite');
        this.bannerEl.style.display = 'none';
        document.body.appendChild(this.bannerEl);
      }

      this.pillEl = this.bannerEl.querySelector('.notif-pill');
      if (!this.pillEl) {
        this.pillEl = document.createElement('div');
        this.pillEl.className = 'notif-pill notif-medium';

        this.iconEl = document.createElement('span');
        this.iconEl.className = 'notif-icon';

        const body = document.createElement('div');
        body.className = 'notif-body';

        this.titleEl = document.createElement('span');
        this.titleEl.className = 'notif-title';

        this.msgEl = document.createElement('span');
        this.msgEl.className = 'notif-msg';

        body.appendChild(this.titleEl);
        body.appendChild(this.msgEl);

        this.pillEl.appendChild(this.iconEl);
        this.pillEl.appendChild(body);
        this.bannerEl.appendChild(this.pillEl);
      } else {
        this.iconEl = this.pillEl.querySelector('.notif-icon');
        this.titleEl = this.pillEl.querySelector('.notif-title');
        this.msgEl = this.pillEl.querySelector('.notif-msg');
      }
    }

    show(opts) {
      if (!opts || !opts.title) return;
      const id = opts.id || opts.title;
      const priority = opts.priority || 'MEDIUM'; // 'HIGH', 'MEDIUM', 'LOW'
      const duration = opts.duration || (priority === 'HIGH' ? 2000 : 1800);
      const icon = opts.icon || (priority === 'HIGH' ? '🏆' : '⚡');
      const message = opts.message || '';
      const now = performance.now();

      // Prune history older than 6 seconds to prevent memory buildup
      for (const k in this.recentHistory) {
        if (now - this.recentHistory[k] > 6000) {
          delete this.recentHistory[k];
        }
      }

      // Duplicate prevention cooldown (2.5s)
      if (this.recentHistory[id] && (now - this.recentHistory[id] < 2500)) {
        return;
      }

      const item = { id, priority, title: opts.title, message, icon, duration, timestamp: now };

      if (!this.bannerEl) this.init();

      if (this.current) {
        // High priority preempts lower priority immediately
        if (priority === 'HIGH' && this.current.priority !== 'HIGH') {
          this.dismissCurrent(() => {
            this.display(item);
          }, true);
          return;
        }

        // Drop duplicate if already queued
        if (this.queue.some(q => q.id === id)) return;

        // Bounded queue: max 2 items to prevent backlog
        if (this.queue.length >= 2) {
          if (priority === 'HIGH') {
            this.queue.pop();
            this.queue.push(item);
          }
          return;
        }

        this.queue.push(item);
        return;
      }

      this.display(item);
    }

    display(item) {
      if (!this.bannerEl || !this.pillEl) this.init();
      this.current = item;
      this.recentHistory[item.id] = performance.now();

      const priorityClass = item.priority === 'HIGH' ? 'notif-high' : 'notif-medium';
      if (this.pillEl) {
        this.pillEl.className = 'notif-pill ' + priorityClass;
      }
      if (this.iconEl) {
        this.iconEl.textContent = item.icon;
      }
      if (this.titleEl) {
        this.titleEl.textContent = item.title;
      }
      if (this.msgEl) {
        if (item.message) {
          this.msgEl.textContent = item.message;
          this.msgEl.style.display = 'block';
        } else {
          this.msgEl.style.display = 'none';
        }
      }

      this.bannerEl.style.display = 'block';
      this.bannerEl.classList.remove('notif-exit');
      this.bannerEl.classList.add('notif-show');

      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.dismissCurrent(() => {
          if (this.queue.length > 0) {
            const next = this.queue.shift();
            this.display(next);
          }
        });
      }, item.duration);
    }

    dismissCurrent(callback, immediate = false) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.exitTimer) {
        clearTimeout(this.exitTimer);
        this.exitTimer = null;
      }

      if (!this.bannerEl || !this.current) {
        this.current = null;
        if (callback) callback();
        return;
      }

      if (immediate) {
        this.bannerEl.style.display = 'none';
        this.bannerEl.classList.remove('notif-show', 'notif-exit');
        this.current = null;
        if (callback) callback();
        return;
      }

      this.bannerEl.classList.remove('notif-show');
      this.bannerEl.classList.add('notif-exit');
      this.exitTimer = setTimeout(() => {
        if (this.bannerEl) {
          this.bannerEl.style.display = 'none';
          this.bannerEl.classList.remove('notif-exit');
        }
        this.current = null;
        if (callback) callback();
      }, 200);
    }

    clearAll() {
      this.queue = [];
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.exitTimer) {
        clearTimeout(this.exitTimer);
        this.exitTimer = null;
      }
      if (this.bannerEl) {
        this.bannerEl.style.display = 'none';
        this.bannerEl.classList.remove('notif-show', 'notif-exit');
      }
      this.current = null;
    }
  }

  class Game {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) return;

      // Centralized in-game notification manager
      this.notificationManager = new GameNotificationManager();
      this.notificationManager.init();
      this._achievementBatchQueue = [];
      this._achievementBatchTimer = null;
      this._lastCoinBatchTime = 0;
      this._batchedCoins = 0;
      this._lastCoinFloating = null;
      this._lastNearMissTime = 0;

      // Virtual resolution
      this.width = 400;
      this.height = 700;
      this.scale = 1;
      // High-resolution mobile capping: Cap at 1.35 on phones to prevent fill-rate choke on 1440p screens (e.g. Galaxy S7)
      this.dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      this.needsResize = false;

      // Cached DOM Elements & Previous State tracking for zero-layout-thrash HUD updates
      this.dom = {};
      this._lastHUD = {
        score: -1,
        coins: -1,
        meters: -1,
        level: -1,
        combo: -1,
        powerupVisible: false,
        powerupType: null,
        powerupPct: -1,
        escapeEnergyPct: -1,
        escapeActive: false
      };
      this._lastSessionSec = -1;

      this.lastTime = performance.now();
      this.isLoopRunning = false;

      // Player Profile & Progression
      this.playerName = '';
      this.selectedOrbId = 'electric-blue';
      this.selectedShapeId = 'circle';
      this.selectedThemeIndex = -1; // -1 means auto-progression, or 0-5 locked
      this.tutorialSeen = false;
      this.themeMode = 'dark';
      this.hapticsEnabled = true;

      // Active tab in customization modal
      this.customizationTab = 'orbs';

      // Interactive Tutorial State (6 Learning Moments)
      this.tutorialStep = 1; // 1: Jump, 2: First Hurdle, 3: Coins, 4: Second Hurdle, 5: Double Jump, 6: Rhythm Run
      this.tutorialJumped = false;
      this.tutorialCoinsCollected = 0;
      this.tutorialDoubleJumped = false;
      this.tutorialStepCompleteTimer = 0;
      this.tutorialNextSpawnX = 0;
      this.tutorialStep6Timer = 0;
      this.tutorialReadyTimer = 0;

      this.stats = {
        totalRuns: 0,
        bestScore: 0,
        bestDistance: 0,
        totalCoins: 0,
        longestSurvival: 0,
        totalObstaclesAvoided: 0,
        totalPowerups: 0,
        highestCombo: 1,
        claimedMilestones: []
      };

      this.currentLevel = 1;
      this.navHistory = [];

      this.achievements = {
        firstRun: false,
        firstJump: false,
        coinCollector: false,
        hazardDodger: false,
        survivor: false,
        speedDemon: false,
        comboMaster: false,
        longRun: false
      };

      // Session Rewards Tracking
      this.sessionStartTime = Date.now();
      this.sessionSeconds = 0;
      this.sessionMilestones = [
        { id: 1, mins: 2, coins: 25, title: '2 Minutes in Orbit', rewardText: '+25 Energy Coins' },
        { id: 2, mins: 5, coins: 60, title: '5 Minutes Flow', rewardText: '+60 Energy Coins' },
        { id: 3, mins: 10, coins: 120, orb: 'pink-energy', title: '10 Minutes Master', rewardText: '+120 Coins & Pink Energy Orb' },
        { id: 4, mins: 15, coins: 250, title: '15 Minutes Legend', rewardText: '+250 Energy Coins' }
      ];

      this.gameSpeedSetting = 'normal';
      this.reducedMotion = false;
      this.facebookConnected = false;
      this.dailyMissionsData = null;
      this.dailyLoginData = null;

      this.loadStorage();
      this.initDailyMissions();
      this.initDailyLoginReward();
      this.initFacebookBridgeCallbacks();

      // Audio engine & Monetization
      this.sound = window.soundEngine;
      this.adManager = window.adManager;
      this.purchaseManager = window.purchaseManager;

      // Run data
      this.resetRunVariables();
      this.continuedThisRun = false;

      // Screen shake
      this.shakeDuration = 0;
      this.shakeIntensity = 0;

      // Continuous background caching system (preloaded in memory)
      this.bgSystem = new ContinuousBackgroundSystem();
      this.bgSystem.preloadAll();

      // Parallax background offsets (wrapping continuously to tile dimensions)
      this.bgOffset1 = 0;
      this.bgOffset2 = 0;
      this.bgOffset3 = 0;
      this.bgOffset4 = 0;
      this.bgOffset5 = 0;

      // Stars
      this.stars = [];
      for (let i = 0; i < 40; i++) {
        this.stars.push({
          x: Math.random() * 800,
          y: Math.random() * 400,
          size: Math.random() * 1.8 + 0.8,
          alpha: Math.random() * 0.7 + 0.3,
          twinkle: Math.random() * Math.PI * 2
        });
      }

      // Initial State determination: New user vs returning
      let validSavedName = null;
      try {
        let rawName = localStorage.getItem('crazyballrush_player_name');
        if (!rawName) rawName = localStorage.getItem('escaperun_player_name');
        if (typeof rawName === 'string') {
          const trimmed = rawName.trim();
          if (trimmed.length > 0 && trimmed !== 'null' && trimmed !== 'undefined') {
            validSavedName = trimmed.substring(0, 14);
          }
        }
      } catch (e) {
        console.warn('Storage read exception:', e);
      }

      if (validSavedName) {
        this.playerName = validSavedName;
        this.state = STATE.MENU;
      } else {
        this.playerName = '';
        this.state = STATE.WELCOME;
      }

      this.bindEvents();
      this.applyTheme(this.themeMode, false);
      this.updateOrbVisuals();
      this.resize();
      this.resetRunVariables();
      this.updateUI();

      // Start main game loop
      this.loop = this.loop.bind(this);
      this.startLoop();
    }

    startLoop() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.isLoopRunning = true;
      this.lastTime = performance.now();
      const step = (timestamp) => {
        if (!this.isLoopRunning) return;
        this.loop(timestamp);
        this.animFrameId = requestAnimationFrame(step);
      };
      this.animFrameId = requestAnimationFrame(step);
    }

    stopLoop() {
      this.isLoopRunning = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }

    loadStorage() {
      try {
        const getStorage = (key) => {
          try {
            let val = localStorage.getItem('crazyballrush_' + key);
            if (val === null) val = localStorage.getItem('escaperun_' + key);
            return val;
          } catch (_) { return null; }
        };

        const s = getStorage('stats');
        if (s) {
          try {
            const parsed = JSON.parse(s);
            if (parsed && typeof parsed === 'object') {
              if (typeof parsed.totalRuns === 'number' && isFinite(parsed.totalRuns)) this.stats.totalRuns = parsed.totalRuns;
              if (typeof parsed.bestScore === 'number' && isFinite(parsed.bestScore)) this.stats.bestScore = parsed.bestScore;
              if (typeof parsed.bestDistance === 'number' && isFinite(parsed.bestDistance)) this.stats.bestDistance = parsed.bestDistance;
              if (typeof parsed.totalCoins === 'number' && isFinite(parsed.totalCoins)) this.stats.totalCoins = parsed.totalCoins;
              if (typeof parsed.longestSurvival === 'number' && isFinite(parsed.longestSurvival)) this.stats.longestSurvival = parsed.longestSurvival;
              if (typeof parsed.totalObstaclesAvoided === 'number' && isFinite(parsed.totalObstaclesAvoided)) this.stats.totalObstaclesAvoided = parsed.totalObstaclesAvoided;
              if (typeof parsed.totalPowerups === 'number' && isFinite(parsed.totalPowerups)) this.stats.totalPowerups = parsed.totalPowerups;
              if (typeof parsed.highestCombo === 'number' && isFinite(parsed.highestCombo)) this.stats.highestCombo = Math.max(1, parsed.highestCombo);
              if (Array.isArray(parsed.claimedMilestones)) this.stats.claimedMilestones = parsed.claimedMilestones;
            }
          } catch (e) {
            console.warn('Invalid stats JSON:', e);
          }
        }
        if (!Array.isArray(this.stats.claimedMilestones)) {
          this.stats.claimedMilestones = [];
        }

        const a = getStorage('achievements');
        if (a) {
          try {
            const parsedA = JSON.parse(a);
            if (parsedA && typeof parsedA === 'object') {
              Object.assign(this.achievements, parsedA);
            }
          } catch (e) {
            console.warn('Invalid achievements JSON:', e);
          }
        }

        const h = getStorage('haptics');
        if (h !== null) this.hapticsEnabled = (h === 'true');

        const name = getStorage('player_name');
        if (typeof name === 'string') {
          const trimmed = name.trim();
          if (trimmed.length > 0 && trimmed !== 'null' && trimmed !== 'undefined') {
            this.playerName = trimmed.substring(0, 14);
          }
        }

        const orb = getStorage('selected_orb');
        if (orb && typeof orb === 'string' && ORB_STYLES[orb]) {
          this.selectedOrbId = orb;
        }

        const shape = getStorage('selected_shape');
        if (shape && typeof shape === 'string' && SHAPES[shape]) {
          this.selectedShapeId = shape;
        }

        const bg = getStorage('selected_theme_idx');
        if (bg !== null) {
          const parsedBg = parseInt(bg, 10);
          if (!isNaN(parsedBg)) this.selectedThemeIndex = parsedBg;
        }

        const tut = getStorage('tutorial_seen');
        if (tut !== null) this.tutorialSeen = (tut === 'true');

        const theme = getStorage('theme');
        if (theme === 'light' || theme === 'dark') {
          this.themeMode = theme;
        }

        const speedSetting = getStorage('game_speed');
        if (speedSetting === 'low' || speedSetting === 'normal' || speedSetting === 'high') {
          this.gameSpeedSetting = speedSetting;
        }

        const rm = getStorage('reduced_motion');
        if (rm !== null) this.reducedMotion = (rm === 'true');

        // Always require Facebook session verification from native Facebook SDK
        try {
          localStorage.removeItem('crazyballrush_fb_connected');
          localStorage.removeItem('crazyballrush_fb_username');
          localStorage.removeItem('escaperun_fb_connected');
          localStorage.removeItem('escaperun_fb_username');
        } catch (e) {}
        this.facebookConnected = false;
        this.facebookUserName = null;

        this.applyReducedMotion(this.reducedMotion, false);
      } catch (e) {
        console.warn('Storage read error handled safely:', e);
      }
    }

    saveStorage() {
      try {
        localStorage.setItem('crazyballrush_stats', JSON.stringify(this.stats));
        localStorage.setItem('crazyballrush_achievements', JSON.stringify(this.achievements));
        localStorage.setItem('crazyballrush_haptics', String(this.hapticsEnabled));
        if (this.playerName && this.playerName.trim().length > 0 && this.state !== STATE.WELCOME) {
          localStorage.setItem('crazyballrush_player_name', this.playerName.trim());
        }
        localStorage.setItem('crazyballrush_selected_orb', this.selectedOrbId);
        localStorage.setItem('crazyballrush_selected_shape', this.selectedShapeId);
        localStorage.setItem('crazyballrush_selected_theme_idx', String(this.selectedThemeIndex));
        localStorage.setItem('crazyballrush_tutorial_seen', String(this.tutorialSeen));
        localStorage.setItem('crazyballrush_theme', this.themeMode);
        localStorage.setItem('crazyballrush_game_speed', this.gameSpeedSetting);
        localStorage.setItem('crazyballrush_reduced_motion', String(this.reducedMotion));
      } catch (e) {
        console.warn('Storage save error handled safely:', e);
      }
    }

    applyReducedMotion(enabled, shouldSave = true) {
      this.reducedMotion = !!enabled;
      const container = document.getElementById('game-container');
      if (container) {
        container.classList.toggle('reduced-motion', this.reducedMotion);
      }
      const toggle = document.getElementById('setting-reduced-motion');
      if (toggle) toggle.checked = this.reducedMotion;
      if (shouldSave && this.state !== STATE.WELCOME) {
        this.saveStorage();
      }
    }

    getBaseSpeedForSetting() {
      if (this.gameSpeedSetting === 'low') return 230;
      if (this.gameSpeedSetting === 'high') return 330;
      return 275;
    }

    setGameSpeed(setting, shouldSave = true) {
      if (setting !== 'low' && setting !== 'normal' && setting !== 'high') return;
      this.gameSpeedSetting = setting;
      if (shouldSave && this.state !== STATE.WELCOME) {
        this.saveStorage();
      }

      ['low', 'normal', 'high'].forEach(s => {
        const btn = document.getElementById(`btn-speed-${s}`);
        if (btn) btn.classList.toggle('active', s === setting);
      });

      if (this.state === STATE.PLAYING) {
        const oldBase = this.baseSpeed;
        this.baseSpeed = this.getBaseSpeedForSetting();
        if (oldBase > 0) {
          const ratio = this.baseSpeed / oldBase;
          this.speed *= ratio;
        } else {
          this.speed = this.baseSpeed;
        }
        this.speedMultiplier = this.speed / this.baseSpeed;
      }

      this.triggerHaptic(15);
      if (this.sound) this.sound.playButton();
    }

    applyTheme(mode, shouldSave = true) {
      this.themeMode = mode;
      const container = document.getElementById('game-container');
      if (container) {
        container.classList.toggle('theme-light', mode === 'light');
      }
      const darkBtn = document.getElementById('btn-theme-dark');
      const lightBtn = document.getElementById('btn-theme-light');
      if (darkBtn && lightBtn) {
        darkBtn.classList.toggle('active', mode === 'dark');
        lightBtn.classList.toggle('active', mode === 'light');
      }
      if (shouldSave && this.state !== STATE.WELCOME) {
        this.saveStorage();
      }
    }

    getSelectedOrb() {
      return ORB_STYLES[this.selectedOrbId] || ORB_STYLES['electric-blue'];
    }

    updateOrbVisuals() {
      const orb = this.getSelectedOrb();
      const menuCore = document.getElementById('menu-orb-core');
      const menuRing = document.getElementById('menu-orb-ring');
      if (menuCore) {
        menuCore.style.background = `radial-gradient(circle, #ffffff 0%, ${orb.glowColor} 60%, ${orb.trailColor} 100%)`;
        menuCore.style.boxShadow = `0 0 35px ${orb.glowColor}`;
      }
      if (menuRing) {
        menuRing.style.borderColor = orb.glowColor;
      }

      // Profile avatar
      const profSlot = document.getElementById('profile-orb-preview');
      if (profSlot) {
        const pCore = profSlot.querySelector('.orb-preview-core');
        const pRing = profSlot.querySelector('.orb-ring-orbit');
        if (pCore) {
          pCore.style.background = `radial-gradient(circle, #ffffff 0%, ${orb.glowColor} 60%, ${orb.trailColor} 100%)`;
          pCore.style.boxShadow = `0 0 20px ${orb.glowColor}`;
        }
        if (pRing) pRing.style.borderColor = orb.glowColor;
      }

      // Guide prompt orb
      const promptCore = document.getElementById('prompt-orb-preview') || document.getElementById('prompt-orb-core');
      const promptRing = document.getElementById('prompt-orb-ring');
      if (promptCore) {
        promptCore.style.background = `radial-gradient(circle, #ffffff 0%, ${orb.glowColor} 60%, ${orb.trailColor} 100%)`;
        promptCore.style.boxShadow = `0 0 25px ${orb.glowColor}`;
      }
      if (promptRing) {
        promptRing.style.borderColor = orb.glowColor;
      }
    }

    resetRunVariables() {
      this.score = 0;
      this.coinsThisRun = 0;
      this.survivalTime = 0;
      this.distance = 0;
      this.currentLevel = 1;
      this.awardedLevelBonuses = {};
      this.reachedScoreMilestones = {};
      this.baseSpeed = this.getBaseSpeedForSetting();
      this.speed = this.baseSpeed;
      this.speedMultiplier = 1;
      this.themeIndex = 0;
      this.themeProgress = 0;

      // Ground plane
      this.groundY = 560;

      // Compute sleek, well-proportioned mobile ball radius
      this.playerRadius = Math.max(10, Math.min(12.5, (this.width || 400) * 0.03));

      // Player orb properties with refined squash/stretch & animations
      this.player = {
        x: Math.max(48, Math.round((this.width || 400) * 0.18)),
        y: this.groundY - this.playerRadius,
        radius: this.playerRadius,
        vy: 0,
        isGrounded: true,
        rotation: 0,
        rotationSpeed: 3.5,
        squashX: 1,
        squashY: 1,
        energyPulse: 0,
        coyoteTimer: 0,
        jumpBufferTimer: 0,
        invincibleTimer: 0,
        reviveShieldTimer: 0,
        jumpsRemaining: 2,
        motionTrail: []
      };

      // Jump parameters tuned for responsive, accessible mobile play
      this.gravity = 1420;
      this.jumpForce = -590;
      this.maxFallSpeed = 780;

      // Power-ups
      this.activePowerup = null;
      this.powerupTimer = 0;
      this.powerupDuration = 0;
      this.hasShield = false;

      // Combo system
      this.comboCount = 0;
      this.comboMultiplier = 1;
      this.comboTimer = 0;
      this.comboDuration = 3.5;

      // Escape Energy & Escape Mode
      this.escapeEnergy = 0;
      this.isEscapeMode = false;
      this.escapeModeTimer = 0;
      this.escapeModeDuration = 7.5;

      // Escape Events System (Rare, high-stakes progression-aware milestones)
      this.eventState = 'IDLE'; // 'IDLE', 'WARNING', 'ACTIVE'
      this.currentEvent = null;
      this.eventWarningTimer = 0;
      this.eventActiveTimer = 0;
      this.nextEventDistance = 1600; // First event triggers only after solid survival into Level 2 (1600m)
      this.eventCooldownTimer = 80.0; // Minimum 80 seconds gameplay cooldown
      if (this._eventAlertTimer) {
        clearTimeout(this._eventAlertTimer);
        this._eventAlertTimer = null;
      }
      const eventAlert = document.getElementById('hud-event-alert');
      if (eventAlert) {
        eventAlert.classList.remove('active');
        eventAlert.style.display = 'none';
      }

      // Near Miss Tracking & Milestones
      this.nearMissesThisRun = 0;
      this.nearMissMilestoneShown = false;
      this.coins100MilestoneShown = false;
      this.survival90MilestoneShown = false;

      // Level progression rewards
      this.awardedLevelBonuses = {};
      this.lastCoinCount = 0;
      this.celebrationParticles = [];
      this.levelTransitionGlow = 0;
      if (this._levelBannerTimer) {
        clearTimeout(this._levelBannerTimer);
        this._levelBannerTimer = null;
      }
      const transBanner = document.getElementById('level-transition-banner');
      if (transBanner) {
        transBanner.classList.remove('active');
        transBanner.style.display = 'none';
      }
      this.stopLevelConfetti();
      const levelModal = document.getElementById('level-complete-modal');
      if (levelModal) levelModal.classList.remove('active');

      // Collections & Object Pools (capped pools to prevent GC spikes across levels)
      if (!this.obstaclePool) this.obstaclePool = [];
      if (!this.coinPool) this.coinPool = [];
      if (!this._celebrationPool) this._celebrationPool = [];
      if (!this._floatingTextPool) this._floatingTextPool = [];

      // Recycle active objects into pool before clearing
      if (this.obstacles && this.obstacles.length > 0) {
        while (this.obstacles.length > 0 && this.obstaclePool.length < 50) {
          this.obstaclePool.push(this.obstacles.pop());
        }
      }
      if (this.collectibles && this.collectibles.length > 0) {
        while (this.collectibles.length > 0 && this.coinPool.length < 80) {
          const it = this.collectibles.pop();
          if (it && it.type === 'COIN') this.coinPool.push(it);
        }
      }

      this.platforms = [];
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.floatingTexts = [];

      // Clear any pending or active notification
      if (this.notificationManager) {
        this.notificationManager.clearAll();
      }

      this.nextSpawnDistance = 200;
      this.nextPlatformX = 0;

      // Initial wide platform
      this.platforms.push({
        x: 0,
        y: this.groundY,
        width: 1200,
        height: 200
      });
      this.nextPlatformX = 1200;

      // Reset camera and screen shake to ensure visual stability
      this.shakeDuration = 0;
      this.shakeIntensity = 0;
    }

    spawnObstacle(props) {
      if (!this.obstaclePool) this.obstaclePool = [];
      let obs;
      if (this.obstaclePool.length > 0) {
        obs = this.obstaclePool.pop();
        for (let k in obs) {
          if (obs.hasOwnProperty(k) && !props.hasOwnProperty(k)) {
            delete obs[k];
          }
        }
        for (let k in props) {
          obs[k] = props[k];
        }
      } else {
        obs = { ...props };
      }
      obs.counted = false;
      obs.nearMissChecked = false;
      this.obstacles.push(obs);
      return obs;
    }

    recycleObstacle(obs) {
      if (!obs) return;
      if (!this.obstaclePool) this.obstaclePool = [];
      if (this.obstaclePool.length < 50) {
        this.obstaclePool.push(obs);
      }
    }

    spawnCoin(x, y, isRiskBonus = false, bobTimer = 0) {
      if (!this.coinPool) this.coinPool = [];
      let coin;
      if (this.coinPool.length > 0) {
        coin = this.coinPool.pop();
        coin.type = 'COIN';
        coin.x = x;
        coin.y = y;
        coin.radius = 11;
        coin.isRiskBonus = !!isRiskBonus;
        coin.bobTimer = bobTimer;
      } else {
        coin = {
          type: 'COIN',
          x,
          y,
          radius: 11,
          isRiskBonus: !!isRiskBonus,
          bobTimer
        };
      }
      this.collectibles.push(coin);
      return coin;
    }

    recycleCoin(coin) {
      if (!coin || coin.type !== 'COIN') return;
      if (!this.coinPool) this.coinPool = [];
      if (this.coinPool.length < 80) {
        this.coinPool.push(coin);
      }
    }

    startPlay() {
      if (this.sound) this.sound.initContext();
      this.resetRunVariables();
      this.continuedThisRun = false;
      this.state = STATE.PLAYING;
      this.stats.totalRuns++;
      this.checkAchievement('firstRun', 'First Run', 'Began your infinite journey');
      if (this.sound) this.sound.startMusic();

      if (window.AnalyticsService) {
        window.AnalyticsService.track('game_started', {
          level: this.currentLevel,
          totalRuns: this.stats.totalRuns
        });
      }
      if (window.AdService) {
        window.AdService.preloadRewardedAd();
      }

      this.updateUI();
      this.triggerHaptic(20);
    }

    startTutorial(isNewUser = false) {
      if (this.sound) this.sound.initContext();
      this.shakeDuration = 0;
      this.shakeIntensity = 0;
      this.closeAllModals(true);
      this.resetRunVariables();
      this.shakeDuration = 0;
      this.shakeIntensity = 0;
      this.state = STATE.TUTORIAL;
      this.speed = 175;
      this.baseSpeed = 175;
      this.speedMultiplier = 1.0;
      this.tutorialStep = 1;
      this.tutorialJumped = false;
      this.tutorialCoinsCollected = 0;
      this.tutorialDoubleJumped = false;
      this.tutorialStep6Timer = 0;
      this.tutorialStepCompleteTimer = 0;
      this.tutorialNextSpawnX = 0;
      this.tutorialReadyTimer = isNewUser ? 0.75 : 0;

      // Ensure player physics & position are pristine and grounded
      this.player.radius = Math.max(10, Math.min(12.5, (this.width || 400) * 0.03));
      this.player.x = Math.max(48, Math.round((this.width || 400) * 0.18));
      this.player.y = this.groundY - this.player.radius;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsRemaining = 2;

      // Safe continuous platform
      this.platforms = [{
        x: 0,
        y: this.groundY,
        width: 4000,
        height: 200
      }];
      this.nextPlatformX = 4000;
      this.obstacles = [];
      this.collectibles = [];

      // Immediate canvas draw so player ball is visible before UI shows
      this.render();

      this.updateTutorialHUD();
      if (this.sound) this.sound.startMusic();
      this.updateUI();
      this.triggerHaptic(15);
    }

    finishTutorial(startImmediatePlay = true) {
      this.shakeDuration = 0;
      this.shakeIntensity = 0;
      this.tutorialSeen = true;
      this.saveStorage();
      if (this.sound && typeof this.sound.playTutorialSuccess === 'function') {
        this.sound.playTutorialSuccess();
      }
      this.checkAchievement('firstRun', 'First Run', 'Began your infinite journey');
      this.closeAllModals(true);
      if (startImmediatePlay) {
        this.startPlay();
      } else {
        this.state = STATE.MENU;
        this.updateUI();
      }
    }

    skipTutorial() {
      this.shakeDuration = 0;
      this.shakeIntensity = 0;
      this.tutorialSeen = true;
      this.saveStorage();
      this.triggerHaptic(20);
      this.closeAllModals(true);
      this.state = STATE.MENU;
      this.updateUI();
    }

    restart() {
      this.startPlay();
    }

    pauseGame() {
      if (this.state === STATE.PLAYING) {
        this.state = STATE.PAUSED;
        if (this.notificationManager) this.notificationManager.clearAll();
        this.floatingTexts = [];
        if (this.sound) this.sound.stopMusic();
        this.updateUI();
      }
    }

    resumeGame() {
      if (this.state === STATE.PAUSED) {
        this.state = STATE.PLAYING;
        this.lastTime = performance.now();
        if (this.sound && this.sound.musicEnabled) this.sound.startMusic();
        this.updateUI();
      }
    }

    setHapticFeedback(enabled, shouldSave = true) {
      this.hapticsEnabled = !!enabled;
      if (shouldSave) {
        try {
          localStorage.setItem('crazyballrush_haptics', String(this.hapticsEnabled));
        } catch (e) {}
      }
      const onBtn = document.getElementById('btn-haptic-on');
      const offBtn = document.getElementById('btn-haptic-off');
      const checkbox = document.getElementById('setting-haptics');
      if (onBtn) onBtn.classList.toggle('active', this.hapticsEnabled);
      if (offBtn) offBtn.classList.toggle('active', !this.hapticsEnabled);
      if (checkbox) checkbox.checked = this.hapticsEnabled;
      if (this.hapticsEnabled) {
        this.triggerHaptic('button');
      }
    }

    triggerHaptic(type = 18) {
      if (!this.hapticsEnabled) return;
      try {
        let pattern = 18;
        if (typeof type === 'number') {
          pattern = type;
        } else if (Array.isArray(type)) {
          pattern = type;
        } else if (typeof type === 'string') {
          switch (type) {
            case 'jump':
              pattern = 14;
              break;
            case 'double_jump':
              pattern = [12, 40, 18];
              break;
            case 'coin':
              pattern = 10;
              break;
            case 'near_miss':
              pattern = [15, 30, 15];
              break;
            case 'level_transition':
              pattern = [25, 40, 25, 40, 35];
              break;
            case 'achievement':
              pattern = [30, 50, 45];
              break;
            case 'game_over':
              pattern = [60, 50, 80];
              break;
            case 'powerup':
              pattern = 25;
              break;
            case 'button':
            case 'click':
              pattern = 8;
              break;
            default:
              pattern = 15;
          }
        }

        if (typeof window !== 'undefined' && window.AndroidHapticBridge) {
          if (type === 'click' || type === 'button') {
            window.AndroidHapticBridge.click();
            return;
          } else if (type === 'game_over') {
            window.AndroidHapticBridge.heavyImpact();
            return;
          } else if (typeof pattern === 'number') {
            window.AndroidHapticBridge.vibrate(pattern);
            return;
          } else if (Array.isArray(pattern)) {
            window.AndroidHapticBridge.vibrate(pattern[0] || 25);
            return;
          }
        }
        if (typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function') {
          window.navigator.vibrate(pattern);
        }
      } catch (e) {
        // Safe fail without throwing errors on unsupported browsers/devices
      }
    }

    spawnParticle(opts) {
      if (!opts) return;
      if (this.particles.length < 50) {
        this.particles.push({
          x: opts.x || 0,
          y: opts.y || 0,
          vx: opts.vx || 0,
          vy: opts.vy || 0,
          size: opts.size || 2.5,
          color: opts.color || '#00f0ff',
          alpha: (opts.alpha !== undefined) ? opts.alpha : 1.0,
          decay: (opts.decay !== undefined) ? opts.decay : 2.0,
          active: true
        });
      } else {
        let p = null;
        for (let i = 0; i < this.particles.length; i++) {
          if (!this.particles[i].active || this.particles[i].alpha <= 0) {
            p = this.particles[i];
            break;
          }
        }
        if (!p) p = this.particles[0];
        p.x = opts.x || 0;
        p.y = opts.y || 0;
        p.vx = opts.vx || 0;
        p.vy = opts.vy || 0;
        p.size = opts.size || 2.5;
        p.color = opts.color || '#00f0ff';
        p.alpha = (opts.alpha !== undefined) ? opts.alpha : 1.0;
        p.decay = (opts.decay !== undefined) ? opts.decay : 2.0;
        p.active = true;
      }
    }

    addScreenShake(intensity, duration = 0.25) {
      if (this.reducedMotion) return;
      this.shakeIntensity = intensity;
      this.shakeDuration = duration;
    }

    handleJumpInput() {
      if (this.state === STATE.WELCOME || this.state === STATE.GUIDE_PROMPT || this.state === STATE.GUIDE || this.state === STATE.REVIVING) {
        return;
      }
      if (this.state === STATE.MENU) {
        this.startPlay();
        return;
      }
      if (this.state === STATE.GAME_OVER) {
        this.restart();
        return;
      }
      if (this.state === STATE.PAUSED) {
        const levelModal = document.getElementById('level-complete-modal');
        if (levelModal && levelModal.classList.contains('active')) {
          this.resumeFromLevelComplete();
          return;
        }
        this.resumeGame();
        return;
      }
      if (this.state !== STATE.PLAYING && this.state !== STATE.TUTORIAL) return;

      // Ensure AudioContext is running immediately on interaction
      if (this.sound && typeof this.sound.initContext === 'function') {
        this.sound.initContext();
      }

      // Zero-latency jump execution if eligible
      if (this.player.isGrounded || this.player.coyoteTimer > 0 || (this.player.jumpsRemaining && this.player.jumpsRemaining > 0)) {
        this.executeJump();
      } else {
        // Buffer jump input if tapped slightly early before touchdown (180ms window)
        this.player.jumpBufferTimer = 0.18;
      }
    }

    executeJump() {
      const isDoubleJump = (!this.player.isGrounded && this.player.coyoteTimer <= 0);
      this.player.vy = isDoubleJump ? (this.jumpForce * 0.92) : this.jumpForce;
      this.player.isGrounded = false;
      this.player.coyoteTimer = 0;
      this.player.jumpBufferTimer = 0;
      this.player.jumpsRemaining = Math.max(0, (this.player.jumpsRemaining || 1) - 1);

      // Refined squash and stretch: stretch vertically
      this.player.squashX = isDoubleJump ? 0.82 : 0.78;
      this.player.squashY = isDoubleJump ? 1.22 : 1.30;

      // Track firstJump achievement
      this.checkAchievement('firstJump', 'First Jump', 'Leaped into the air successfully');

      // Tutorial progress: step 1 jump & step 5 double jump
      if (this.state === STATE.TUTORIAL) {
        if (this.tutorialStep === 1) {
          this.tutorialJumped = true;
        } else if (this.tutorialStep === 5 && isDoubleJump) {
          this.tutorialDoubleJumped = true;
        }
      }

      const orb = this.getSelectedOrb();
      const sparkCount = isDoubleJump ? 14 : 10;
      for (let i = 0; i < sparkCount; i++) {
        const ang = Math.PI * 0.5 + (Math.random() - 0.5) * (isDoubleJump ? 2.2 : 1.2);
        const spd = Math.random() * 160 + 60;
        this.spawnParticle({
          x: this.player.x,
          y: this.player.y + this.player.radius,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 4 + 2,
          color: isDoubleJump ? '#00f0ff' : orb.particles,
          alpha: 1,
          decay: Math.random() * 2.5 + 2.0
        });
      }

      if (this.sound) {
        if (isDoubleJump && typeof this.sound.playDoubleJump === 'function') {
          this.sound.playDoubleJump();
        } else {
          this.sound.playJump();
        }
      }
      this.triggerHaptic(isDoubleJump ? 22 : 15);
    }

    // REVIVED CONTINUE FLOW (Rewarded AdMob Integration)
    watchAdToContinue() {
      if (this.continuedThisRun) return;

      const showAdMessage = (msg, isError = true) => {
        const msgEl = document.getElementById('go-ad-message');
        if (msgEl) {
          msgEl.textContent = msg;
          msgEl.className = 'go-ad-message ' + (isError ? 'error' : 'info');
          msgEl.style.display = 'block';
          if (this.adMessageTimeout) clearTimeout(this.adMessageTimeout);
          this.adMessageTimeout = setTimeout(() => {
            if (msgEl) msgEl.style.display = 'none';
          }, 4000);
        }
      };

      const continueBtn = document.getElementById('btn-continue-go');
      const adService = window.AdService || this.adManager;

      if (!adService) {
        showAdMessage("Ad isn't available right now. Please try again.", true);
        return;
      }

      if (!adService.isRewardedAdReady()) {
        showAdMessage("Ad isn't available right now. Please try again.", true);
        adService.preloadRewardedAd();
        return;
      }

      if (continueBtn) {
        continueBtn.classList.add('loading');
      }

      const performRevive = () => {
        this.continuedThisRun = true;
        this.state = STATE.REVIVING;
        this.updateUI();

        if (window.AnalyticsService) {
          window.AnalyticsService.track('player_revived', {
            score: Math.floor(this.score),
            level: this.currentLevel
          });
        }

        // Safe positioning: reset vertical speed & clear nearby obstacles
        this.player.y = this.groundY - 24;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.squashX = 1;
        this.player.squashY = 1;

        // Clear hazards in front of player
        this.obstacles = this.obstacles.filter(o => o.x > this.width + 120);

        // Grant protective invincibility shield
        this.hasShield = true;
        this.player.invincibleTimer = 4.0;
        this.player.reviveShieldTimer = 4.0;

        // Visual Countdown Overlay
        const overlay = document.getElementById('revive-overlay');
        const numEl = document.getElementById('revive-number');
        if (overlay) overlay.classList.add('active');

        let count = 3;
        if (numEl) numEl.textContent = count;
        if (this.sound) this.sound.playCountdown();

        const cdTimer = setInterval(() => {
          count--;
          if (count > 0) {
            if (numEl) numEl.textContent = count;
            if (this.sound) this.sound.playCountdown();
          } else {
            clearInterval(cdTimer);
            if (numEl) numEl.textContent = 'RUN!';
            if (this.sound) this.sound.playRevive();
            setTimeout(() => {
              if (overlay) overlay.classList.remove('active');
              this.state = STATE.PLAYING;
              this.lastTime = performance.now();
              this.updateUI();
            }, 500);
          }
        }, 800);
      };

      adService.showRewardedAd({
        onReward: (amount, type) => {
          if (continueBtn) continueBtn.classList.remove('loading');
          performRevive();
        },
        onDismiss: (userDismissedEarly) => {
          if (continueBtn) continueBtn.classList.remove('loading');
          if (userDismissedEarly) {
            showAdMessage("Ad was closed early. Finish the video to earn a revive.", true);
          }
        },
        onAdFailed: (errorMsg) => {
          if (continueBtn) continueBtn.classList.remove('loading');
          showAdMessage(errorMsg || "Ad isn't available right now. Please try again.", true);
        }
      });
    }

    showFloatingText(text, x, y, color = '#00f0ff') {
      if (!this.floatingTexts) this.floatingTexts = [];
      if (!this._floatingTextPool) this._floatingTextPool = [];
      if (this.floatingTexts.length >= 4) {
        const discarded = this.floatingTexts.shift();
        if (this._floatingTextPool.length < 12) this._floatingTextPool.push(discarded);
      }
      let ft;
      if (this._floatingTextPool.length > 0) {
        ft = this._floatingTextPool.pop();
        ft.text = text;
        ft.x = x;
        ft.y = y;
        ft.color = color;
        ft.alpha = 1;
        ft.vy = -50;
      } else {
        ft = { text, x, y, color, alpha: 1, vy: -50 };
      }
      this.floatingTexts.push(ft);
    }

    checkAchievement(key, fallbackName, fallbackDesc) {
      if (!this.achievements[key]) {
        this.achievements[key] = true;
        const def = ACHIEVEMENTS_DEF[key] || {
          name: fallbackName || key,
          desc: fallbackDesc || '',
          icon: '🏆',
          rewardText: '+50 Coins'
        };

        if (def.coins) {
          this.stats.totalCoins += def.coins;
        }

        this.saveStorage();
        if (this.sound && typeof this.sound.playAchievement === 'function') {
          this.sound.playAchievement();
        }
        this.triggerHaptic(40);
        this.queueAchievementNotification(def);
      }
    }

    queueAchievementNotification(def) {
      if (!this._achievementBatchQueue) this._achievementBatchQueue = [];
      this._achievementBatchQueue.push(def);

      if (this._achievementBatchTimer) clearTimeout(this._achievementBatchTimer);
      this._achievementBatchTimer = setTimeout(() => {
        const count = this._achievementBatchQueue.length;
        if (count === 1) {
          const item = this._achievementBatchQueue[0];
          if (this.notificationManager) {
            this.notificationManager.show({
              id: 'ach_' + item.name,
              priority: 'HIGH',
              title: '🏆 ACHIEVEMENT UNLOCKED',
              message: `${item.name} • ${item.rewardText || '+Coins'}`,
              icon: item.icon || '🏆',
              duration: 2000
            });
          }
        } else if (count > 1) {
          if (this.notificationManager) {
            this.notificationManager.show({
              id: 'ach_multi_' + Date.now(),
              priority: 'HIGH',
              title: `🏆 ${count} ACHIEVEMENTS UNLOCKED!`,
              message: 'Check Achievements screen for details',
              icon: '🏆',
              duration: 2200
            });
          }
        }
        this._achievementBatchQueue = [];
        this._achievementBatchTimer = null;
      }, 300);
    }

    triggerAchievementBanner(def) {
      this.queueAchievementNotification(def);
    }

    showToast(title, desc, icon = '⚡') {
      if (this.notificationManager) {
        this.notificationManager.show({
          id: title,
          priority: 'MEDIUM',
          title: title,
          message: desc || '',
          icon: icon || '⚡',
          duration: 1800
        });
      }
    }

    // MAIN GAME LOOP (Single rAF loop)
    loop(timestamp) {
      if (!this.isLoopRunning) return;

      // Only resize when signaled by window events, eliminating layout thrashing
      if (this.needsResize) {
        this.needsResize = false;
        this.resize();
      }

      // Delta time clamped between 1ms and 45ms to protect physics against spikes
      const rawDt = (timestamp - this.lastTime) / 1000;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.045);
      this.lastTime = timestamp;

      // Adaptive Performance Monitoring (Rolling 60-frame time tracking)
      if (!this._frameTimes) this._frameTimes = [];
      this._frameTimes.push(rawDt * 1000);
      if (this._frameTimes.length > 60) this._frameTimes.shift();

      if (this._frameTimes.length >= 30) {
        let sum = 0;
        for (let i = 0; i < this._frameTimes.length; i++) sum += this._frameTimes[i];
        const avgMs = sum / this._frameTimes.length;
        if (avgMs > 22 && !this._autoAdaptiveLow) {
          this._autoAdaptiveLow = true;
        } else if (avgMs < 17 && this._autoAdaptiveLow) {
          this._autoAdaptiveLow = false;
        }
      }

      // Update session timer (memoized to run only once per second)
      this.updateSessionTimer();

      if (this.state === STATE.PLAYING) {
        // Delta-time based sub-stepping for consistent jump & collision physics on lower-end devices
        if (dt > 0.024) {
          const subDt = dt * 0.5;
          this.update(subDt);
          if (this.state === STATE.PLAYING) {
            this.update(subDt);
          }
        } else {
          this.update(dt);
        }
      } else if (this.state === STATE.TUTORIAL) {
        this.updateTutorial(dt);
      } else if (this.state === STATE.MENU || this.state === STATE.WELCOME || this.state === STATE.GUIDE_PROMPT) {
        this.updateMenuAnimation(dt);
      }

      this.render();
    }

    updateSessionTimer() {
      const nowSec = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      if (nowSec === this._lastSessionSec) return;
      this._lastSessionSec = nowSec;
      this.sessionSeconds = nowSec;

      const m = Math.floor(nowSec / 60);
      const s = nowSec % 60;
      const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      if (!this.dom.hudTimer) this.dom.hudTimer = document.getElementById('hud-session-timer');
      if (this.dom.hudTimer) this.dom.hudTimer.textContent = timeStr;

      if (!this.dom.modalTimer) this.dom.modalTimer = document.getElementById('session-modal-timer');
      if (this.dom.modalTimer) this.dom.modalTimer.textContent = timeStr;

      // Check for available unclaimed rewards
      let hasClaimable = false;
      const milestones = this.sessionMilestones;
      const claimed = this.stats.claimedMilestones;
      for (let i = 0; i < milestones.length; i++) {
        const milestone = milestones[i];
        const isClaimed = claimed && claimed.includes(milestone.id);
        if (!isClaimed && m >= milestone.mins) {
          hasClaimable = true;
          break;
        }
      }

      if (!this.dom.sessionBadge) this.dom.sessionBadge = document.getElementById('session-reward-badge');
      if (this.dom.sessionBadge) {
        this.dom.sessionBadge.style.display = hasClaimable ? 'inline-block' : 'none';
      }
    }

    updateMenuAnimation(dt) {
      // Smooth subtle parallax drifting in menu
      const idleSpeed = 60;
      this.bgOffset1 = (this.bgOffset1 + idleSpeed * 0.08 * dt) % 560;
      this.bgOffset2 = (this.bgOffset2 + idleSpeed * 0.20 * dt) % 600;
      this.bgOffset3 = (this.bgOffset3 + idleSpeed * 0.40 * dt) % 680;
      this.bgOffset4 = (this.bgOffset4 + idleSpeed * 0.65 * dt) % 400;

      this.themeProgress = (this.themeProgress + dt * 0.04) % 1;
      this.player.energyPulse = (this.player.energyPulse + dt * 3) % (Math.PI * 2);
      this.player.rotation += this.player.rotationSpeed * 0.6 * dt;
    }

    // GAMEPLAY UPDATE (dt)
    update(dt) {
      // 1. Survival time & distance
      this.survivalTime += dt;
      const currentSpeed = this.speed * (this.activePowerup === 'SPEED' ? 1.45 : (this.isEscapeMode ? 1.18 : 1));
      this.distance += currentSpeed * dt;
      const meters = Math.floor(this.distance / 10);

      // Distance-based Level progression check
      this.checkLevelProgression(meters);

      // Smooth distance-based speed progression (gradual and fair)
      const targetSpeed = this.getSpeedForDistance(meters);
      this.speed += (targetSpeed - this.speed) * Math.min(1, dt * 1.8);
      this.speedMultiplier = this.speed / this.baseSpeed;

      // Escape Mode countdown
      if (this.isEscapeMode) {
        this.escapeModeTimer -= dt;
        this.escapeEnergy = Math.max(0, (this.escapeModeTimer / this.escapeModeDuration) * 100);
        if (this.escapeModeTimer <= 0) {
          this.isEscapeMode = false;
          this.escapeEnergy = 0;
          this.showFloatingText('ESCAPE MODE COMPLETE', this.player.x, this.player.y - 40, '#ffd700');
        }
      }

      // Escape Events progression (Rare, non-overlapping, with cooldown)
      if (this.eventCooldownTimer > 0) {
        this.eventCooldownTimer -= dt;
      }
      if (this.eventState === 'IDLE') {
        if (meters >= this.nextEventDistance && this.eventCooldownTimer <= 0 && !this.isEscapeMode) {
          this.triggerEventWarning();
        }
      } else if (this.eventState === 'WARNING') {
        this.eventWarningTimer -= dt;
        if (this.eventWarningTimer <= 0) {
          this.startEventActive();
        }
      } else if (this.eventState === 'ACTIVE') {
        this.eventActiveTimer -= dt;
        if (this.eventActiveTimer <= 0) {
          this.completeEvent();
        }
      }

      // Check milestones
      if (this.survivalTime >= 60) {
        this.checkAchievement('survivor', 'Survivor', 'Survived for over 60 seconds');
      }
      if (this.survivalTime >= 90 && !this.survival90MilestoneShown) {
        this.survival90MilestoneShown = true;
        this.showMilestoneNotification('UNSTOPPABLE', '90s SURVIVAL STREAK! ⏱');
      }
      if (this.survivalTime >= 120) {
        this.checkAchievement('untouchable', 'Untouchable', 'Survived for over 2 minutes (120s)');
      }

      // Feature 21: Non-blocking Personal Best Score Milestones
      if (this.reachedScoreMilestones) {
        const milestones = [500, 1000, 2500, 5000, 10000];
        const curScore = Math.floor(this.score);
        for (let mi = 0; mi < milestones.length; mi++) {
          const m = milestones[mi];
          if (curScore >= m && !this.reachedScoreMilestones[m]) {
            this.reachedScoreMilestones[m] = true;
            this.showFloatingText(`MILESTONE: ${m.toLocaleString()}!`, this.player.x, this.player.y - 45, '#ffd700');
            this.showMilestoneNotification('SCORE MILESTONE', `${m.toLocaleString()} POINTS REACHED!`);
            if (this.sound && typeof this.sound.playCoin === 'function') {
              this.sound.playCoin();
            }
            this.triggerHaptic(20);
            break;
          }
        }
      }

      // 2. Score progression: Distance + Survival + Multiplier (doubled during Escape Mode)
      const escapeMultiplier = this.isEscapeMode ? 2.0 : 1.0;
      const scoreGain = (18 + this.speedMultiplier * 6) * dt * this.comboMultiplier * escapeMultiplier;
      this.score += scoreGain;

      // 3. Theme progression linked directly to currentLevel
      const targetTheme = ((this.currentLevel || 1) - 1) % THEMES.length;
      if (this.themeIndex !== targetTheme) {
        this.themeProgress += dt * 0.8;
        if (this.themeProgress >= 1) {
          this.themeIndex = targetTheme;
          this.themeProgress = 0;
        }
      } else {
        this.themeProgress = 0;
      }

      // 4. Power-up timer decrement
      if (this.activePowerup && this.powerupDuration > 0) {
        this.powerupTimer -= dt;
        if (this.powerupTimer <= 0) {
          if (this.activePowerup === 'SHIELD') {
            this.hasShield = false;
          }
          this.activePowerup = null;
        }
      }

      // Invincibility timers
      if (this.player.invincibleTimer > 0) {
        this.player.invincibleTimer -= dt;
      }
      if (this.player.reviveShieldTimer > 0) {
        this.player.reviveShieldTimer -= dt;
      }

      // 5. Combo countdown
      if (this.comboCount > 0) {
        this.comboTimer -= dt;
        if (this.comboTimer <= 0) {
          this.comboCount = 0;
          this.comboMultiplier = 1;
        }
      }

      // 6. Physics: Gravity & Vertical Velocity
      this.player.vy += this.gravity * dt;
      if (this.player.vy > this.maxFallSpeed) {
        this.player.vy = this.maxFallSpeed;
      }
      this.player.y += this.player.vy * dt;

      // Squash and stretch spring dampening
      this.player.squashX += (1 - this.player.squashX) * 12 * dt;
      this.player.squashY += (1 - this.player.squashY) * 12 * dt;

      // Fall stretch
      if (!this.player.isGrounded && this.player.vy > 120) {
        this.player.squashX = 0.88;
        this.player.squashY = 1.15;
      }

      // Dynamic rotation & energy pulse
      this.player.rotation += this.player.rotationSpeed * (this.speedMultiplier * 0.8) * dt;
      this.player.energyPulse = (this.player.energyPulse + dt * 4) % (Math.PI * 2);

      // 7. Ground / Platform Collision
      let onPlatform = false;
      const footY = this.player.y + this.player.radius;

      for (let plat of this.platforms) {
        if (this.player.x + 8 >= plat.x && this.player.x - 8 <= plat.x + plat.width) {
          if (footY >= plat.y && footY <= plat.y + 24 && this.player.vy >= 0) {
            this.player.y = plat.y - this.player.radius;
            this.player.vy = 0;
            if (!this.player.isGrounded) {
              // Landing impact compression
              this.player.squashX = 1.35;
              this.player.squashY = 0.72;
              if (this.sound) this.sound.playLand();

              const orb = this.getSelectedOrb();
              // Landing dust sparks
              for (let i = 0; i < 6; i++) {
                this.spawnParticle({
                  x: this.player.x + (Math.random() - 0.5) * 20,
                  y: plat.y,
                  vx: (Math.random() - 0.5) * 80,
                  vy: -Math.random() * 40,
                  size: Math.random() * 3 + 1.5,
                  color: orb.particles,
                  alpha: 0.8,
                  decay: 3.5
                });
              }
            }
            this.player.isGrounded = true;
            this.player.jumpsRemaining = 2;
            this.player.coyoteTimer = 0.12;
            onPlatform = true;
            break;
          }
        }
      }

      // Hard floor safety catch: Ball can NEVER sink or disappear below the ground runway
      const runwayFloorY = this.groundY - this.player.radius;
      if (!onPlatform && this.player.y >= runwayFloorY) {
        this.player.y = runwayFloorY;
        if (this.player.vy > 0) {
          if (!this.player.isGrounded) {
            this.player.squashX = 1.35;
            this.player.squashY = 0.72;
            if (this.sound) this.sound.playLand();
            const orb = this.getSelectedOrb();
            for (let i = 0; i < 6; i++) {
              this.spawnParticle({
                x: this.player.x + (Math.random() - 0.5) * 20,
                y: this.groundY,
                vx: (Math.random() - 0.5) * 80,
                vy: -Math.random() * 40,
                size: Math.random() * 3 + 1.5,
                color: orb.particles,
                alpha: 0.8,
                decay: 3.5
              });
            }
          }
          this.player.vy = 0;
        }
        this.player.isGrounded = true;
        this.player.jumpsRemaining = 2;
        this.player.coyoteTimer = 0.12;
        onPlatform = true;
      }

      if (!onPlatform) {
        this.player.isGrounded = false;
        this.player.coyoteTimer -= dt;
      }

      // Check buffered jump or coyote jump / double jump
      if (this.player.jumpBufferTimer > 0) {
        this.player.jumpBufferTimer -= dt;
        if (this.player.isGrounded || this.player.coyoteTimer > 0 || (this.player.jumpsRemaining && this.player.jumpsRemaining > 0)) {
          this.executeJump();
        }
      }

      // Out-of-bounds safety net: Detect invalid or NaN coordinates
      if (this.player.y > this.height || isNaN(this.player.y) || !isFinite(this.player.y)) {
        this.player.y = runwayFloorY;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.gameOver();
        return;
      }

      // Motion Trail (capped at 10 items for performance)
      this.player.motionTrail.unshift({
        x: this.player.x,
        y: this.player.y,
        radius: this.player.radius,
        alpha: 0.65
      });
      const maxTrail = this.activePowerup === 'SPEED' ? 12 : 6;
      while (this.player.motionTrail.length > maxTrail) {
        this.player.motionTrail.pop();
      }
      for (let t of this.player.motionTrail) {
        t.alpha -= dt * 3.5;
      }

      // Spawn world hazards and platforms
      this.spawnWorld(dt);

      // Scroll platforms (in-place pruning without allocation)
      const moveStep = currentSpeed * dt;
      for (let pi = this.platforms.length - 1; pi >= 0; pi--) {
        const p = this.platforms[pi];
        p.x -= moveStep;
        if (p.x + p.width <= -100) {
          this.platforms.splice(pi, 1);
        }
      }
      this.nextPlatformX -= moveStep;

      // Parallax offsets (continuous wrap to exact tile dimensions)
      this.bgOffset1 = (this.bgOffset1 + currentSpeed * 0.08 * dt) % 560;
      this.bgOffset2 = (this.bgOffset2 + currentSpeed * 0.20 * dt) % 600;
      this.bgOffset3 = (this.bgOffset3 + currentSpeed * 0.40 * dt) % 680;
      this.bgOffset4 = (this.bgOffset4 + currentSpeed * 0.65 * dt) % 400;
      this.bgOffset5 = (this.bgOffset5 + currentSpeed * 1.00 * dt) % 100;

      // Screen shake decay
      if (this.shakeDuration > 0) {
        this.shakeDuration -= dt;
      }

      // Obstacles update & collision
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= moveStep;

        if (obs.type === 'MOVING') {
          obs.time += dt * 3.2;
          obs.y = obs.baseY + Math.sin(obs.time) * obs.amp;
        }

        if (!obs.counted && obs.x + 30 < this.player.x) {
          obs.counted = true;
          this.stats.totalObstaclesAvoided++;
          this.addEscapeEnergy(3);
          if (this.stats.totalObstaclesAvoided >= 10) {
            this.checkAchievement('hazardDodger', 'Hazard Dodger', 'Successfully bypassed 10 laser hazards');
          }
        }

        // Near Miss Detection: narrow clearance without collision
        if (!obs.nearMissChecked && !obs.counted) {
          const obsLeft = obs.x;
          const obsRight = obs.x + (obs.width || (obs.radius * 2) || 20);
          const obsTop = obs.type === 'SPIKE' ? (obs.y - obs.height) : (obs.type === 'BLOCK' ? obs.y : (obs.y - obs.radius));
          const pX = this.player.x;
          const pY = this.player.y;
          const pR = this.player.radius;

          if (pX + pR >= obsLeft - 6 && pX - pR <= obsRight + 6) {
            const clearance = obsTop - (pY + pR);
            if (clearance >= 2 && clearance <= 28) {
              obs.nearMissChecked = true;
              this.triggerNearMiss(obs);
            }
          }
        }

        if (this.checkCollision(this.player, obs)) {
          // If speed boost active: crush hazard
          if (this.activePowerup === 'SPEED') {
            const remObs = this.obstacles.splice(i, 1)[0];
            this.recycleObstacle(remObs);
            if (this.sound) this.sound.playShieldDeflect();
            this.addScreenShake(8, 0.2);
            continue;
          }

          // If shield active
          if (this.hasShield || this.player.reviveShieldTimer > 0) {
            this.hasShield = false;
            this.player.reviveShieldTimer = 0;
            this.activePowerup = null;
            this.player.invincibleTimer = 1.8;
            if (this.sound) this.sound.playShieldBreak();
            this.showFloatingText('SHIELD BROKEN!', this.player.x, this.player.y - 45, '#ff0077');
            this.addScreenShake(10, 0.25);
            this.triggerHaptic(50);
            const remObs = this.obstacles.splice(i, 1)[0];
            this.recycleObstacle(remObs);
            continue;
          }

          // i-frames
          if (this.player.invincibleTimer > 0) {
            continue;
          }

          // Fatal collision
          this.gameOver();
          return;
        }

        if (obs.x < -120) {
          const remObs = this.obstacles.splice(i, 1)[0];
          this.recycleObstacle(remObs);
        }
      }

      // Collectibles update (High-speed optimized with bounding rejection and squared distance)
      const pX = this.player.x;
      const pY = this.player.y;
      const pRadius = this.player.radius;
      const isMagnetActive = (this.activePowerup === 'MAGNET' || this.isEscapeMode);
      const pullRadius = this.isEscapeMode ? 260 : 220;
      const pullRadiusSq = pullRadius * pullRadius;
      const now = performance.now();

      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const item = this.collectibles[i];
        item.x -= moveStep;
        item.bobTimer += dt * 4;

        if (item.x < -60) {
          const remItem = this.collectibles.splice(i, 1)[0];
          this.recycleCoin(remItem);
          continue;
        }

        const cdx = pX - item.x;
        // Fast horizontal rejection box: if item is beyond pull distance or far behind player, skip math
        if (cdx < -280 || cdx > 80) {
          continue;
        }

        const cdy = pY - item.y;
        if (cdy < -280 || cdy > 280) {
          continue;
        }

        const distSq = cdx * cdx + cdy * cdy;
        const touchRad = pRadius + item.radius;

        // Pickup collision (Zero square root!)
        if (distSq <= touchRad * touchRad) {
          if (item.type === 'COIN') {
            this.coinsThisRun++;
            this.stats.totalCoins++;
            const basePts = item.isRiskBonus ? 75 : 50;
            const pts = basePts * this.comboMultiplier * (this.isEscapeMode ? 2 : 1);
            this.score += pts;
            this.updateDailyMissionProgress('coins', 1);

            // Escape Energy addition (+6 for risk coins, +4 for regular)
            this.addEscapeEnergy(item.isRiskBonus ? 6 : 4);

            // Increment combo
            this.comboCount++;
            this.comboTimer = this.comboDuration;
            const newMult = Math.min(5, 1 + Math.floor(this.comboCount / 4));
            if (newMult > this.comboMultiplier) {
              this.comboMultiplier = newMult;
              if (this.comboMultiplier > this.stats.highestCombo) {
                this.stats.highestCombo = this.comboMultiplier;
              }
              if (this.sound) this.sound.playCombo(this.comboMultiplier);
            }

            if (this.sound) this.sound.playCoin();

            // Throttle haptic vibration during rapid coin streams
            if (!this._lastCoinHapticTime || (now - this._lastCoinHapticTime > 48)) {
              this.triggerHaptic(10);
              this._lastCoinHapticTime = now;
            }

            // Batched coin floating text
            if (this._lastCoinBatchTime && (now - this._lastCoinBatchTime < 420) && this._lastCoinFloating && this.floatingTexts.includes(this._lastCoinFloating)) {
              this._batchedCoins = (this._batchedCoins || 0) + (item.isRiskBonus ? 75 : (basePts * this.comboMultiplier));
              this._lastCoinFloating.text = `+${this._batchedCoins} COINS`;
              this._lastCoinFloating.alpha = 1.0;
              this._lastCoinFloating.x = item.x;
              this._lastCoinFloating.y = item.y - 12;
            } else {
              this._batchedCoins = item.isRiskBonus ? 75 : (basePts * this.comboMultiplier);
              const ft = {
                text: item.isRiskBonus ? '+75 BONUS!' : `+${this._batchedCoins}`,
                x: item.x,
                y: item.y - 10,
                color: item.isRiskBonus ? '#ffaa00' : '#ffd700',
                alpha: 1.0,
                vy: -50
              };
              if (this.floatingTexts.length >= 4) this.floatingTexts.shift();
              this.floatingTexts.push(ft);
              this._lastCoinFloating = ft;
            }
            this._lastCoinBatchTime = now;

            // Tactile coin sparkle burst (pooled particles)
            const sparkCount = this.reducedMotion ? 2 : (isMagnetActive ? 3 : 5);
            for (let sp = 0; sp < sparkCount; sp++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.random() * 70 + 30;
              this.spawnParticle({
                x: item.x,
                y: item.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                size: Math.random() * 2.6 + 1.4,
                color: item.isRiskBonus ? '#ffaa00' : '#ffd700',
                alpha: 1,
                decay: 3.8
              });
            }

            // Throttled HUD counter pop animation
            if (!this._lastCoinPopTime || (now - this._lastCoinPopTime > 240)) {
              this._lastCoinPopTime = now;
              const hudCoinsEl = (this.dom && this.dom.coins) ? this.dom.coins : document.getElementById('hud-coins');
              if (hudCoinsEl) {
                if (this._coinPopTimeout) clearTimeout(this._coinPopTimeout);
                hudCoinsEl.classList.remove('coin-pop');
                void hudCoinsEl.offsetWidth; // Force single reflow
                hudCoinsEl.classList.add('coin-pop');
                this._coinPopTimeout = setTimeout(() => {
                  hudCoinsEl.classList.remove('coin-pop');
                }, 180);
              }
            }

            if (!this.achievements.coinCollector && this.stats.totalCoins >= 50) {
              this.checkAchievement('coinCollector', 'Coin Collector', 'Collected 50 total coins');
            }
            if (!this.achievements.comboMaster && this.stats.highestCombo >= 3) {
              this.checkAchievement('comboMaster', 'Combo Master', 'Reached a 3x or higher combo');
            }
          } else {
            // Power-up pickup
            this.activePowerup = item.type;
            this.powerupTimer = 8.0;
            this.powerupDuration = 8.0;
            this.stats.totalPowerups++;

            if (item.type === 'SHIELD') {
              this.hasShield = true;
              if (this.sound) this.sound.playPowerup();
              this.showFloatingText('SHIELD CHARGED!', item.x, item.y - 20, '#00f0ff');
            } else if (item.type === 'SPEED') {
              if (this.sound) this.sound.playSpeedBoost();
              this.checkAchievement('speedDemon', 'Speed Demon', 'Triggered Supersonic Speed Boost');
              this.showFloatingText('SPEED BOOST!', item.x, item.y - 20, '#ffaa00');
            } else if (item.type === 'MAGNET') {
              if (this.sound) this.sound.playMagnet();
              this.showFloatingText('MAGNET ON!', item.x, item.y - 20, '#ff0077');
            }
            this.triggerHaptic(25);
          }

          const remItem = this.collectibles.splice(i, 1)[0];
          this.recycleCoin(remItem);
          continue;
        }

        // Magnet attraction (only computed for coins within pull range)
        if (isMagnetActive && item.type === 'COIN' && distSq < pullRadiusSq && distSq > 4) {
          const invDist = 1 / Math.sqrt(distSq);
          item.x += cdx * invDist * 520 * dt;
          item.y += cdy * invDist * 520 * dt;
        }
      }

      // Update Particles (capped pool)
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
      if (this.particles.length > 50) {
        this.particles.splice(0, this.particles.length - 50);
      }

      // Update Floating Texts (pooled)
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.alpha -= dt * 1.5;
        if (ft.alpha <= 0) {
          const remFt = this.floatingTexts.splice(i, 1)[0];
          if (!this._floatingTextPool) this._floatingTextPool = [];
          if (this._floatingTextPool.length < 12) this._floatingTextPool.push(remFt);
        }
      }

      // Update Celebration Particles (Confetti, Flower Petals, Stars - pooled)
      if (this.celebrationParticles && this.celebrationParticles.length > 0) {
        for (let i = this.celebrationParticles.length - 1; i >= 0; i--) {
          const cp = this.celebrationParticles[i];
          cp.x += cp.vx * dt;
          cp.y += cp.vy * dt;
          cp.alpha -= cp.decay * dt;

          if (cp.kind === 'confetti') {
            cp.wobble += cp.wobbleSpeed * dt;
            cp.rot += cp.rotSpeed * dt;
          } else if (cp.kind === 'petal') {
            cp.flutter += cp.flutterSpeed * dt;
            cp.x += Math.sin(cp.flutter) * 32 * dt; // gentle horizontal drift
          } else if (cp.kind === 'star') {
            cp.twinkle += dt * 7;
          }

          if (cp.alpha <= 0 || cp.y > (this.height || 600) + 40) {
            const remCp = this.celebrationParticles.splice(i, 1)[0];
            if (!this._celebrationPool) this._celebrationPool = [];
            if (this._celebrationPool.length < 50) this._celebrationPool.push(remCp);
          }
        }
        if (this.celebrationParticles.length > 35) {
          while (this.celebrationParticles.length > 35) {
            const remCp = this.celebrationParticles.shift();
            if (!this._celebrationPool) this._celebrationPool = [];
            if (this._celebrationPool.length < 50) this._celebrationPool.push(remCp);
          }
        }
      }

      // Decay top ambient celebration glow
      if (this.levelTransitionGlow > 0) {
        this.levelTransitionGlow = Math.max(0, this.levelTransitionGlow - dt * 1.6);
      }

      if (this.score >= 1500) {
        this.checkAchievement('longRun', 'Long Run', 'Scored over 1,500 points');
      }

      this.updateHUD();
    }

    // TUTORIAL MODE UPDATE LOOP
    updateTutorial(dt) {
      const currentSpeed = this.speed;

      // Screen shake decay (ensures visual stability in demo & training mode)
      if (this.shakeDuration > 0) {
        this.shakeDuration -= dt;
        if (this.shakeDuration <= 0) {
          this.shakeDuration = 0;
          this.shakeIntensity = 0;
        }
      }

      // Handle Ready Intro Timer
      if (this.tutorialReadyTimer > 0) {
        this.tutorialReadyTimer -= dt;
      }

      // Physics: Gravity & Vertical Velocity
      this.player.vy += this.gravity * dt;
      if (this.player.vy > this.maxFallSpeed) {
        this.player.vy = this.maxFallSpeed;
      }
      this.player.y += this.player.vy * dt;

      // Squash and stretch spring dampening
      this.player.squashX += (1 - this.player.squashX) * Math.min(1, dt * 14);
      this.player.squashY += (1 - this.player.squashY) * Math.min(1, dt * 14);

      // Fall stretch
      if (!this.player.isGrounded && this.player.vy > 120) {
        this.player.squashX = 0.88;
        this.player.squashY = 1.15;
      }

      // Dynamic rotation & energy pulse
      this.player.rotation += this.player.rotationSpeed * dt;
      this.player.energyPulse = (this.player.energyPulse + dt * 4) % (Math.PI * 2);

      // Ground / Platform Collision with landing squash & particles
      let onPlatform = false;
      const footY = this.player.y + this.player.radius;
      for (let plat of this.platforms) {
        if (
          this.player.x + 8 >= plat.x &&
          this.player.x - 8 <= plat.x + plat.width &&
          footY >= plat.y &&
          footY <= plat.y + 24 &&
          this.player.vy >= 0
        ) {
          this.player.y = plat.y - this.player.radius;
          this.player.vy = 0;
          if (!this.player.isGrounded) {
            // Landing impact compression
            this.player.squashX = 1.30;
            this.player.squashY = 0.75;
            if (this.sound) this.sound.playLand();

            const orb = this.getSelectedOrb();
            for (let i = 0; i < 5; i++) {
              this.spawnParticle({
                x: this.player.x + (Math.random() - 0.5) * 16,
                y: plat.y,
                vx: (Math.random() - 0.5) * 60,
                vy: -Math.random() * 30,
                size: Math.random() * 2.5 + 1.2,
                color: orb.particles,
                alpha: 0.8,
                decay: 3.5
              });
            }
          }
          this.player.isGrounded = true;
          this.player.jumpsRemaining = 2;
          onPlatform = true;
          break;
        }
      }
      if (!onPlatform) {
        this.player.isGrounded = false;
      }

      // Check for Tutorial Ball Fall / Void - Clean instant recovery
      if (this.player.y > this.groundY + 12 || this.player.y > (this.height || 640)) {
        this.recoverTutorialBall('fall');
        return;
      }

      // Jump buffer execution / double jump
      if (this.player.jumpBufferTimer > 0) {
        this.player.jumpBufferTimer -= dt;
        if (this.player.isGrounded || (this.player.jumpsRemaining && this.player.jumpsRemaining > 0)) {
          this.executeJump();
        }
      }

      // Motion Trail
      this.player.motionTrail.unshift({
        x: this.player.x,
        y: this.player.y,
        radius: this.player.radius,
        alpha: 0.55
      });
      while (this.player.motionTrail.length > 5) {
        this.player.motionTrail.pop();
      }
      for (let t of this.player.motionTrail) {
        t.alpha -= dt * 2.5;
      }

      // World scrolling
      const moveStep = currentSpeed * dt;
      for (let plat of this.platforms) {
        plat.x -= moveStep;
      }
      this.nextPlatformX -= moveStep;
      while (this.nextPlatformX < this.width + 1200) {
        const platWidth = 1200;
        this.platforms.push({
          x: this.nextPlatformX,
          y: this.groundY,
          width: platWidth,
          height: 200
        });
        this.nextPlatformX += platWidth;
      }
      // Prune tutorial platforms in place
      for (let pi = this.platforms.length - 1; pi >= 0; pi--) {
        if (this.platforms[pi].x + this.platforms[pi].width <= -100) {
          this.platforms.splice(pi, 1);
        }
      }

      // Parallax offsets (continuous wrap to exact tile dimensions)
      this.bgOffset1 = (this.bgOffset1 + currentSpeed * 0.08 * dt) % 560;
      this.bgOffset2 = (this.bgOffset2 + currentSpeed * 0.20 * dt) % 600;
      this.bgOffset3 = (this.bgOffset3 + currentSpeed * 0.40 * dt) % 680;
      this.bgOffset4 = (this.bgOffset4 + currentSpeed * 0.65 * dt) % 400;

      // Spawn specific tutorial challenges
      this.spawnTutorialWorld(dt);

      // Update obstacles & safe training collisions
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= moveStep;

        // Dynamic Banner Update based on distance to upcoming hurdle (memoized)
        if ((this.tutorialStep === 2 || this.tutorialStep === 4 || this.tutorialStep === 5) && !obs.counted) {
          const hurdleCenterX = obs.x + (obs.width * 0.5);
          const dist = hurdleCenterX - this.player.x;

          let newTitle = null;
          let newDesc = null;
          if (dist <= 260 && dist >= 80 && (this.player.isGrounded || this.player.jumpsRemaining > 0)) {
            newTitle = (this.tutorialStep === 5 ? 'DOUBLE JUMP NOW! ⚡' : 'JUMP NOW! ⚡');
            newDesc = (this.tutorialStep === 5 ? 'Tap in mid-air to clear the hazard' : 'Tap screen now to clear the hurdle');
          } else if (dist > 260) {
            if (this.tutorialStep === 2) newTitle = 'DODGE THE HURDLE';
            else if (this.tutorialStep === 4) newTitle = 'SECOND HURDLE';
            else if (this.tutorialStep === 5) newTitle = 'DOUBLE JUMP! ⚡';
            newDesc = 'Watch the arrow & time your leap';
          }

          if (newTitle && newTitle !== this._lastStepTitle) {
            this._lastStepTitle = newTitle;
            if (!this.dom.stepTitle) this.dom.stepTitle = document.getElementById('tutorial-step-title');
            if (this.dom.stepTitle) this.dom.stepTitle.textContent = newTitle;
          }
          if (newDesc && newDesc !== this._lastStepDesc) {
            this._lastStepDesc = newDesc;
            if (!this.dom.stepDesc) this.dom.stepDesc = document.getElementById('tutorial-step-desc');
            if (this.dom.stepDesc) this.dom.stepDesc.textContent = newDesc;
          }
        }

        // Count clear in tutorial
        if (!obs.counted && obs.x + obs.width < this.player.x) {
          obs.counted = true;
          if (this.tutorialStep === 2) {
            this.showFloatingText('PERFECT! ✓', this.player.x, this.player.y - 35, '#00ff88');
            this.triggerHaptic(15);
            for (let s = 0; s < 12; s++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.random() * 120 + 40;
              this.spawnParticle({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                size: Math.random() * 3.5 + 1.5,
                color: '#ffd700',
                alpha: 1,
                decay: 2.5
              });
            }
            this.advanceTutorialStep();
          } else if (this.tutorialStep === 4) {
            this.showFloatingText('GREAT CLEAR! ✓', this.player.x, this.player.y - 35, '#00ff88');
            this.triggerHaptic(15);
            this.advanceTutorialStep();
          } else if (this.tutorialStep === 5) {
            this.showFloatingText('DOUBLE JUMP MASTERED! ✓', this.player.x, this.player.y - 35, '#00ff88');
            this.triggerHaptic(20);
            this.advanceTutorialStep();
          }
        }

        // Training collision: Clean instant recovery with clear instructional retry
        if (this.checkCollision(this.player, obs)) {
          this.recoverTutorialBall('collision');
          return;
        }

        if (obs.x < -100) {
          const remObs = this.obstacles.splice(i, 1)[0];
          this.recycleObstacle(remObs);
        }
      }

      // Update Collectibles
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const item = this.collectibles[i];
        item.x -= moveStep;
        item.bobTimer += dt * 4;

        const cdx = this.player.x - item.x;
        const cdy = this.player.y - item.y;
        const dist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (dist < this.player.radius + item.radius) {
          if (item.type === 'COIN') {
            this.tutorialCoinsCollected++;
            this.stats.totalCoins++;
            if (this.sound) this.sound.playCoin();
            this.triggerHaptic(10);
            this.showFloatingText('+50', item.x, item.y - 10, '#ffd700');

            if (this.tutorialStep === 3) {
              this.updateTutorialHUD();
              if (this.tutorialCoinsCollected >= 3) {
                this.showFloatingText('COINS COLLECTED! ✓', this.player.x, this.player.y - 35, '#00ff88');
                this.triggerHaptic(20);
                this.advanceTutorialStep();
              }
            }
          }

          const remItem = this.collectibles.splice(i, 1)[0];
          this.recycleCoin(remItem);
          continue;
        }

        if (item.x < -60) {
          const remItem = this.collectibles.splice(i, 1)[0];
          this.recycleCoin(remItem);
        }
      }

      // Step 1 check: user leaped
      if (this.tutorialStep === 1 && this.tutorialJumped) {
        if (!this.tutorialStepCompleteTimer) this.tutorialStepCompleteTimer = 0.6;
        this.tutorialStepCompleteTimer -= dt;
        if (this.tutorialStepCompleteTimer <= 0) {
          this.showFloatingText('NICE JUMP! ✓', this.player.x, this.player.y - 35, '#00ff88');
          this.advanceTutorialStep();
        }
      }

      // Step 6 check: rhythm flow completion
      if (this.tutorialStep === 6) {
        this.tutorialStep6Timer = (this.tutorialStep6Timer || 0) + dt;
        if (this.tutorialStep6Timer >= 3.5) {
          this.advanceTutorialStep();
        }
      }

      // Update Particles & Floating Text
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.alpha -= dt * 1.5;
        if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
      }
    }

    spawnTutorialWorld(dt) {
      if (this.tutorialStep === 2 && this.obstacles.length === 0 && this.tutorialNextSpawnX <= 0) {
        // Step 2: Spawn first sleek jumpable hurdle ahead
        this.spawnObstacle({
          type: 'SPIKE',
          x: this.width + 120,
          y: this.groundY,
          width: 20,
          height: 20
        });
        this.tutorialNextSpawnX = 600;
      } else if (this.tutorialStep === 3 && this.collectibles.length === 0 && this.tutorialCoinsCollected < 3 && this.tutorialNextSpawnX <= 0) {
        // Step 3: Spawn clean sequence of 4 reachable energy coins in natural jump arc
        const baseX = this.width + 90;
        this.spawnCoin(baseX, this.groundY - 24, false, 0);
        this.spawnCoin(baseX + 45, this.groundY - 48, false, 0.8);
        this.spawnCoin(baseX + 90, this.groundY - 68, false, 1.6);
        this.spawnCoin(baseX + 135, this.groundY - 32, false, 2.4);
        this.tutorialNextSpawnX = 600;
      } else if (this.tutorialStep === 4 && this.obstacles.length === 0 && this.tutorialNextSpawnX <= 0) {
        // Step 4: Second hurdle with reward coins positioned behind it
        const hurdleX = this.width + 120;
        this.spawnObstacle({
          type: 'SPIKE',
          x: hurdleX,
          y: this.groundY,
          width: 20,
          height: 20
        });
        this.spawnCoin(hurdleX + 60, this.groundY - 24, false, 0.4);
        this.spawnCoin(hurdleX + 110, this.groundY - 24, false, 1.2);
        this.tutorialNextSpawnX = 600;
      } else if (this.tutorialStep === 5 && this.obstacles.length === 0 && this.tutorialNextSpawnX <= 0) {
        // Step 5: Double jump challenge - hurdle followed by elevated airborne coins
        const barrierX = this.width + 130;
        this.spawnObstacle({
          type: 'SPIKE',
          x: barrierX,
          y: this.groundY,
          width: 20,
          height: 20
        });
        this.spawnCoin(barrierX + 45, this.groundY - 86, false, 0.6);
        this.spawnCoin(barrierX + 95, this.groundY - 86, false, 1.4);
        this.tutorialNextSpawnX = 600;
      } else if (this.tutorialStep === 6) {
        // Step 6: Smooth runner rhythm section
        if (this.collectibles.length === 0 && (this.tutorialStep6Timer || 0) < 2.5) {
          const baseX = this.width + 90;
          for (let c = 0; c < 3; c++) {
            this.spawnCoin(baseX + (c * 48), this.groundY - 24, false, c * 0.6);
          }
        }
        if (this.obstacles.length === 0 && (this.tutorialStep6Timer || 0) > 1.0 && (this.tutorialStep6Timer || 0) < 2.2) {
          this.spawnObstacle({
            type: 'SPIKE',
            x: this.width + 140,
            y: this.groundY,
            width: 20,
            height: 20
          });
        }
      }

      if (this.tutorialNextSpawnX > 0) {
        this.tutorialNextSpawnX -= this.speed * dt;
      }
    }

    advanceTutorialStep() {
      this.tutorialStepCompleteTimer = 0;
      this.tutorialStep++;
      if (this.sound && typeof this.sound.playTutorialSuccess === 'function') {
        this.sound.playTutorialSuccess();
      }

      if (this.tutorialStep > 6) {
        // Training complete - show celebratory victory card
        const banner = document.getElementById('tutorial-callout') || document.getElementById('tutorial-compact-banner');
        const bottomBar = document.getElementById('tutorial-bottom-bar');
        const completeCard = document.getElementById('tutorial-completion-card');
        if (banner) banner.style.display = 'none';
        if (bottomBar) bottomBar.style.display = 'none';
        if (completeCard) completeCard.style.display = 'flex';
        this.tutorialSeen = true;
        this.saveStorage();
        this.triggerHaptic([30, 50, 30]);
      } else {
        this.tutorialNextSpawnX = 0;
        this.updateTutorialHUD();
      }
    }

    updateTutorialHUD() {
      const banner = document.getElementById('tutorial-callout') || document.getElementById('tutorial-compact-banner');
      const stepBadge = document.getElementById('tutorial-step-tag');
      const stepTitle = document.getElementById('tutorial-step-title');
      const stepDesc = document.getElementById('tutorial-step-desc');
      const handText = document.getElementById('tutorial-hand-text');
      const completeCard = document.getElementById('tutorial-completion-card');
      const bottomBar = document.getElementById('tutorial-bottom-bar');

      if (completeCard) completeCard.style.display = 'none';
      if (banner) banner.style.display = 'flex';
      if (bottomBar) bottomBar.style.display = 'flex';

      if (this.tutorialStep === 1) {
        if (stepBadge) stepBadge.textContent = 'TUTORIAL 1/6';
        if (stepTitle) stepTitle.textContent = 'TAP TO JUMP';
        if (stepDesc) stepDesc.textContent = 'Tap anywhere to jump';
        if (handText) handText.textContent = 'TAP ANYWHERE';
      } else if (this.tutorialStep === 2) {
        if (stepBadge) stepBadge.textContent = 'TUTORIAL 2/6';
        if (stepTitle) stepTitle.textContent = 'DODGE HURDLES';
        if (stepDesc) stepDesc.textContent = 'Tap to leap over approaching hurdles';
        if (handText) handText.textContent = 'JUMP OVER HURDLE';
      } else if (this.tutorialStep === 3) {
        if (stepBadge) stepBadge.textContent = 'TUTORIAL 3/6';
        if (stepTitle) stepTitle.textContent = 'COLLECT ENERGY COINS';
        if (stepDesc) stepDesc.textContent = 'Collect energy coins along your path';
        if (handText) handText.textContent = 'COLLECT COINS';
      } else if (this.tutorialStep === 4) {
        if (stepBadge) stepBadge.textContent = 'TUTORIAL 4/6';
        if (stepTitle) stepTitle.textContent = 'TIMED LEAP & REWARD';
        if (stepDesc) stepDesc.textContent = 'Clear the hurdle and collect coins';
        if (handText) handText.textContent = 'CLEAR & REWARD';
      } else if (this.tutorialStep === 5) {
        if (stepBadge) stepBadge.textContent = 'TUTORIAL 5/6';
        if (stepTitle) stepTitle.textContent = 'DOUBLE JUMP';
        if (stepDesc) stepDesc.textContent = 'Double jump for higher obstacles';
        if (handText) handText.textContent = 'DOUBLE TAP IN AIR';
      } else if (this.tutorialStep === 6) {
        if (stepBadge) stepBadge.textContent = 'TUTORIAL 6/6';
        if (stepTitle) stepTitle.textContent = 'YOU\'RE READY! ⚡';
        if (stepDesc) stepDesc.textContent = 'Find your rhythm and enjoy the run';
        if (handText) handText.textContent = 'FLOW FREELY';
      }
    }

    spawnWorld(dt) {
      this.nextSpawnDistance -= this.speed * dt;

      // Continuous solid runway platforms - eliminates sudden missing floor right at hurdles
      while (this.nextPlatformX < this.width + 1200) {
        const platWidth = 1200;
        this.platforms.push({
          x: this.nextPlatformX,
          y: this.groundY,
          width: platWidth,
          height: 200
        });
        this.nextPlatformX += platWidth;
      }

      // Physics-calibrated Hazard & Collectible spawning
      if (this.nextSpawnDistance <= 0) {
        this.generateHazardPattern();
        // Guarantees fair approach, reaction & landing clearance for each level
        const meters = Math.floor(this.distance / 10);
        const level = this.getLevelFromDistance(meters);
        let spacingFactor = 1.60;
        if (level === 2) spacingFactor = 1.50;
        else if (level === 3) spacingFactor = 1.45;
        else if (level >= 4) spacingFactor = 1.40;
        const minSpacing = Math.max(360, this.speed * spacingFactor);
        this.nextSpawnDistance = minSpacing + Math.random() * 65;
      }
    }

    pickCoinCount(minCount, maxCount) {
      const options = [];
      for (let c = minCount; c <= maxCount; c++) {
        if (c !== this.lastCoinCount) options.push(c);
      }
      const chosen = (options.length > 0)
        ? options[Math.floor(Math.random() * options.length)]
        : minCount;
      this.lastCoinCount = chosen;
      return chosen;
    }

    spawnCoinLine(startX, y = this.groundY - 22, count = 3, spacing = 36) {
      for (let i = 0; i < count; i++) {
        this.spawnCoin(startX + i * spacing, y, false, i * 0.4);
      }
    }

    spawnCoinArc(centerX, peakY = this.groundY - 65, count = 3, spacing = 36, depth = 32) {
      const startX = centerX - ((count - 1) * spacing) / 2;
      for (let i = 0; i < count; i++) {
        const norm = (count <= 1) ? 0 : (i / (count - 1) - 0.5) * 2; // -1 to +1
        const arcY = peakY + (norm * norm) * depth;
        this.spawnCoin(startX + i * spacing, Math.min(this.groundY - 22, arcY), false, i * 0.3);
      }
    }

    spawnCoinAscending(startX, startY = this.groundY - 22, endY = this.groundY - 70, count = 4, spacing = 36) {
      for (let i = 0; i < count; i++) {
        const progress = (count <= 1) ? 0 : i / (count - 1);
        const y = startY + (endY - startY) * progress;
        this.spawnCoin(startX + i * spacing, y, false, i * 0.35);
      }
    }

    spawnCoinDescending(startX, startY = this.groundY - 70, endY = this.groundY - 22, count = 4, spacing = 36) {
      for (let i = 0; i < count; i++) {
        const progress = (count <= 1) ? 0 : i / (count - 1);
        const y = startY + (endY - startY) * progress;
        this.spawnCoin(startX + i * spacing, y, false, i * 0.35);
      }
    }

    spawnCoinWave(startX, baseY = this.groundY - 24, count = 6, amplitude = 22, spacing = 36) {
      for (let i = 0; i < count; i++) {
        const waveAngle = (i / Math.max(1, count - 1)) * Math.PI;
        const y = baseY - Math.sin(waveAngle) * amplitude;
        this.spawnCoin(startX + i * spacing, y, false, i * 0.3);
      }
    }

    spawnCoinStaggered(startX, yLow = this.groundY - 22, yHigh = this.groundY - 48, count = 6, spacing = 36) {
      for (let i = 0; i < count; i++) {
        const y = (i % 2 === 0) ? yLow : yHigh;
        this.spawnCoin(startX + i * spacing, y, false, i * 0.4);
      }
    }

    spawnCoinTwoPart(startX, groundCount = 4, arcCount = 4, peakY = this.groundY - 70) {
      const spacing = 36;
      for (let i = 0; i < groundCount; i++) {
        this.spawnCoin(startX + i * spacing, this.groundY - 22, false, i * 0.3);
      }
      const arcStartX = startX + groundCount * spacing;
      const arcCenterX = arcStartX + ((arcCount - 1) * spacing) / 2;
      this.spawnCoinArc(arcCenterX, peakY, arcCount, spacing, 28);
    }

    spawnCoinCluster(centerX, centerY = this.groundY - 46, count = 5) {
      if (count <= 5) {
        const offsets = [
          { dx: 0, dy: 0 },
          { dx: -34, dy: 0 },
          { dx: 34, dy: 0 },
          { dx: 0, dy: -26 },
          { dx: 0, dy: 26 }
        ];
        offsets.forEach((off, i) => {
          this.spawnCoin(centerX + off.dx, Math.min(this.groundY - 22, Math.max(this.groundY - 110, centerY + off.dy)), false, i * 0.4);
        });
      } else {
        for (let i = 0; i < count; i++) {
          const dx = (i - Math.floor(count / 2)) * 32;
          const dy = -Math.abs(i - Math.floor(count / 2)) * 14;
          this.spawnCoin(centerX + dx, Math.min(this.groundY - 22, centerY + dy), false, i * 0.35);
        }
      }
    }

    spawnCoinTrail(startX, count = 8, spacing = 34) {
      for (let i = 0; i < count; i++) {
        const yOffset = Math.sin(i * 0.45) * 16;
        this.spawnCoin(startX + i * spacing, Math.min(this.groundY - 22, this.groundY - 26 - yOffset), false, i * 0.25);
      }
    }

    // RISK VS REWARD COIN SYSTEM
    // Safe Path: low, easily reachable coins before hurdle
    // Risk / Bonus Path: high-reward arc demanding well-timed jump over the obstacle
    spawnRiskRewardCoins(spawnX) {
      // Safe path: 2 accessible low coins
      for (let i = 0; i < 2; i++) {
        this.spawnCoin(spawnX - 95 + i * 28, this.groundY - 22, false, i * 0.3);
      }

      // Risk / Bonus path: 5 elevated high-reward coins
      const bonusCount = 5;
      const arcWidth = 140;
      for (let i = 0; i < bonusCount; i++) {
        const t = (i + 0.5) / bonusCount;
        const cx = spawnX - (arcWidth / 2) + t * arcWidth;
        const cy = (this.groundY - 72) + Math.sin(t * Math.PI) * -16;
        this.spawnCoin(cx, cy, true, i * 0.25);
      }
    }

    sanitizeCoinsAgainstObstacles() {
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const c = this.collectibles[i];
        if (c.type !== 'COIN') continue;
        for (const obs of this.obstacles) {
          if (obs.type === 'FLOATING' || obs.type === 'MOVING') {
            const dx = c.x - obs.x;
            const dy = c.y - obs.y;
            const r = (c.radius || 11) + (obs.radius || 11) + 12;
            if (dx * dx + dy * dy < r * r) {
              c.y = this.groundY - 22;
            }
          } else {
            const obsLeft = obs.x - 8;
            const obsRight = obs.x + (obs.width || 20) + 8;
            const obsTop = obs.y - (obs.height || 20) - 8;
            const obsBottom = obs.y + 6;
            if (c.x >= obsLeft && c.x <= obsRight && c.y >= obsTop && c.y <= obsBottom) {
              c.y = obsTop - 36;
            }
          }
        }
      }
    }

    generateHazardPattern() {
      const spawnX = this.width + 120;
      const roll = Math.random();
      const meters = Math.floor(this.distance / 10);
      const level = this.getLevelFromDistance(meters);

      // 1. DYNAMIC REWARD STRETCHES: Clean runway with rich varied coin patterns
      if (roll < 0.26) {
        if (level === 1) {
          const coinCount = this.pickCoinCount(3, 7); // 3, 4, 5, 6, 7
          const subRoll = Math.random();
          if (subRoll < 0.35) {
            this.spawnCoinWave(spawnX, this.groundY - 24, coinCount, 22);
          } else if (subRoll < 0.65) {
            this.spawnCoinStaggered(spawnX, this.groundY - 22, this.groundY - 48, coinCount);
          } else {
            this.spawnCoinLine(spawnX, this.groundY - 22, coinCount);
          }
          this.nextSpawnDistance += (coinCount * 36) + 40;
        } else if (level === 2) {
          const coinCount = this.pickCoinCount(4, 8); // 4, 5, 6, 7, 8
          const subRoll = Math.random();
          if (subRoll < 0.30) {
            this.spawnCoinWave(spawnX, this.groundY - 24, coinCount, 24);
          } else if (subRoll < 0.60) {
            const groundP = Math.floor(coinCount / 2);
            const arcP = coinCount - groundP;
            this.spawnCoinTwoPart(spawnX, groundP, arcP);
          } else if (subRoll < 0.82) {
            this.spawnCoinTrail(spawnX, coinCount);
          } else {
            this.spawnCoinCluster(spawnX + 60, this.groundY - 48, 5);
          }
          this.nextSpawnDistance += (coinCount * 36) + 50;
        } else if (level === 3) {
          const coinCount = this.pickCoinCount(5, 9); // 5, 6, 7, 8, 9
          const subRoll = Math.random();
          if (subRoll < 0.32) {
            this.spawnCoinTrail(spawnX, coinCount);
          } else if (subRoll < 0.62) {
            this.spawnCoinWave(spawnX, this.groundY - 24, coinCount, 26);
          } else if (subRoll < 0.82) {
            const gCount = Math.floor(coinCount / 2);
            this.spawnCoinTwoPart(spawnX, gCount, coinCount - gCount);
          } else {
            this.spawnCoinStaggered(spawnX, this.groundY - 22, this.groundY - 50, coinCount);
          }
          this.nextSpawnDistance += (coinCount * 36) + 60;
        } else {
          // Level 4, 5 & 6+: 5, 7, 8, 9, occasionally 10 coins!
          const coinCount = this.pickCoinCount(5, 10);
          const subRoll = Math.random();
          if (subRoll < 0.36) {
            this.spawnCoinTrail(spawnX, coinCount);
          } else if (subRoll < 0.68) {
            this.spawnCoinWave(spawnX, this.groundY - 24, coinCount, 28);
          } else if (subRoll < 0.86) {
            const gPart = Math.floor(coinCount / 2);
            this.spawnCoinTwoPart(spawnX, gPart, coinCount - gPart);
          } else {
            this.spawnCoinCluster(spawnX + 80, this.groundY - 50, 7);
          }
          this.nextSpawnDistance += (coinCount * 36) + 70;
        }

        // Power-up chance during reward stretch
        if (Math.random() < 0.18 && !this.activePowerup) {
          const types = ['SHIELD', 'SPEED', 'MAGNET'];
          const pType = types[Math.floor(Math.random() * types.length)];
          this.collectibles.push({
            type: pType,
            x: spawnX + 240,
            y: this.groundY - 68,
            radius: 16,
            bobTimer: Math.random() * 10
          });
        }
        return;
      }

      // 2. OBSTACLE PATTERNS WITH DYNAMIC, VARIED COIN ARRANGEMENTS
      if (level === 1) {
        // LEVEL 1 (0m - 500m): Friendly single hurdles with natural coin arcs or ramps
        const coinCount = this.pickCoinCount(3, 5); // 3, 4, 5 coins
        if (roll < 0.62) {
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX,
            y: this.groundY,
            width: 20,
            height: 20
          });
          if (Math.random() < 0.35) {
            this.spawnRiskRewardCoins(spawnX);
          } else {
            this.spawnCoinArc(spawnX, this.groundY - 65, coinCount);
          }
        } else {
          this.spawnObstacle({
            type: 'BLOCK',
            x: spawnX,
            y: this.groundY - 22,
            width: 22,
            height: 22
          });
          if (Math.random() < 0.5) {
            this.spawnCoinArc(spawnX, this.groundY - 65, coinCount);
          } else {
            this.spawnCoinAscending(spawnX - 60, this.groundY - 22, this.groundY - 68, coinCount);
          }
        }
      } else if (level === 2) {
        // LEVEL 2 (500m - 1000m): Sleek hurdles, varied ground lines, and floating mines
        if (roll < 0.48) {
          const coinCount = this.pickCoinCount(4, 7); // 4, 5, 6, 7 coins
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX,
            y: this.groundY,
            width: 20,
            height: 20
          });
          if (Math.random() < 0.35) {
            this.spawnRiskRewardCoins(spawnX);
          } else {
            this.spawnCoinArc(spawnX, this.groundY - 66, coinCount);
          }
        } else if (roll < 0.76) {
          const coinCount = this.pickCoinCount(4, 6);
          this.spawnObstacle({
            type: 'BLOCK',
            x: spawnX,
            y: this.groundY - 22,
            width: 22,
            height: 22
          });
          this.spawnCoinLine(spawnX + 45, this.groundY - 22, coinCount);
        } else {
          // Floating mine: runner dashes safely underneath on the ground
          const coinCount = this.pickCoinCount(4, 8); // 4, 5, 6, 7, 8 coins
          this.spawnObstacle({
            type: 'FLOATING',
            x: spawnX,
            y: this.groundY - 68,
            radius: 11
          });
          this.spawnCoinLine(spawnX - 55, this.groundY - 22, coinCount);
        }
      } else if (level === 3) {
        // LEVEL 3 (1000m - 1500m): Moving hurdles, richer 5-8 coin formations
        if (roll < 0.45) {
          const coinCount = this.pickCoinCount(5, 7); // 5, 6, 7 coins
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX,
            y: this.groundY,
            width: 20,
            height: 20
          });
          if (Math.random() < 0.35) {
            this.spawnRiskRewardCoins(spawnX);
          } else {
            this.spawnCoinArc(spawnX, this.groundY - 68, coinCount);
          }
        } else if (roll < 0.74) {
          const coinCount = this.pickCoinCount(5, 8); // 5, 6, 7, 8 coins
          this.spawnObstacle({
            type: 'FLOATING',
            x: spawnX,
            y: this.groundY - 68,
            radius: 11
          });
          this.spawnCoinLine(spawnX - 60, this.groundY - 22, coinCount);
        } else {
          const coinCount = this.pickCoinCount(5, 7);
          this.spawnObstacle({
            type: 'MOVING',
            x: spawnX,
            y: this.groundY - 70,
            baseY: this.groundY - 70,
            amp: 20,
            time: 0,
            radius: 11
          });
          this.spawnCoinArc(spawnX, this.groundY - 72, coinCount);
        }
      } else if (level === 4) {
        // LEVEL 4 (3200m - 4300m): Controlled double hurdles with fair physics-based spacing
        if (roll < 0.44) {
          const c1 = this.pickCoinCount(3, 5);
          const c2 = this.pickCoinCount(3, 5);
          const hurdleSpacing = Math.max(340, Math.round((this.speed || 280) * 1.05));
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX,
            y: this.groundY,
            width: 20,
            height: 20
          });
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX + hurdleSpacing,
            y: this.groundY,
            width: 20,
            height: 20
          });
          this.spawnCoinArc(spawnX, this.groundY - 65, c1);
          this.spawnCoinArc(spawnX + hurdleSpacing, this.groundY - 65, c2);
          this.nextSpawnDistance += (hurdleSpacing + 30);
        } else if (roll < 0.72) {
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX,
            y: this.groundY,
            width: 20,
            height: 20
          });
          const arcCount = this.pickCoinCount(4, 5);
          this.spawnCoinTwoPart(spawnX - 90, 3, arcCount); // 7 or 8 coins
        } else {
          const coinCount = this.pickCoinCount(6, 8);
          this.spawnObstacle({
            type: 'MOVING',
            x: spawnX,
            y: this.groundY - 70,
            baseY: this.groundY - 70,
            amp: 22,
            time: 0,
            radius: 11
          });
          this.spawnCoinLine(spawnX - 50, this.groundY - 22, coinCount);
        }
      } else {
        // LEVEL 5 & ENDLESS (4300m+): Progressive mastery, high-reward double arches with fair spacing
        if (roll < 0.42) {
          const c1 = this.pickCoinCount(4, 5);
          const c2 = this.pickCoinCount(4, 5);
          const hurdleSpacing = Math.max(350, Math.round((this.speed || 300) * 1.06));
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX,
            y: this.groundY,
            width: 20,
            height: 20
          });
          this.spawnObstacle({
            type: 'SPIKE',
            x: spawnX + hurdleSpacing,
            y: this.groundY,
            width: 20,
            height: 20
          });
          this.spawnCoinArc(spawnX, this.groundY - 68, c1);
          this.spawnCoinArc(spawnX + hurdleSpacing, this.groundY - 68, c2);
          this.nextSpawnDistance += (hurdleSpacing + 35);
        } else if (roll < 0.68) {
          const coinCount = this.pickCoinCount(6, 8);
          this.spawnObstacle({
            type: 'MOVING',
            x: spawnX,
            y: this.groundY - 70,
            baseY: this.groundY - 70,
            amp: 24,
            time: 0,
            radius: 11
          });
          this.spawnCoinArc(spawnX, this.groundY - 72, coinCount);
        } else if (roll < 0.86) {
          const coinCount = this.pickCoinCount(6, 9);
          this.spawnObstacle({
            type: 'FLOATING',
            x: spawnX,
            y: this.groundY - 68,
            radius: 11
          });
          this.spawnCoinLine(spawnX - 60, this.groundY - 22, coinCount);
        } else {
          const coinCount = this.pickCoinCount(5, 8);
          this.spawnObstacle({
            type: 'BLOCK',
            x: spawnX,
            y: this.groundY - 22,
            width: 22,
            height: 22
          });
          this.spawnCoinArc(spawnX, this.groundY - 68, coinCount);
        }
      }

      // Power-up chance placed at reachable height
      if (Math.random() < 0.16 && !this.activePowerup) {
        const types = ['SHIELD', 'SPEED', 'MAGNET'];
        const pType = types[Math.floor(Math.random() * types.length)];
        this.collectibles.push({
          type: pType,
          x: spawnX + 220,
          y: this.groundY - 68,
          radius: 16,
          bobTimer: Math.random() * 10
        });
      }

      // Ensure zero collisions between coins and obstacle bounding boxes
      this.sanitizeCoinsAgainstObstacles();
    }

    gameOver() {
      this.state = STATE.GAME_OVER;
      if (this.notificationManager) this.notificationManager.clearAll();
      this.floatingTexts = [];
      if (this.sound) {
        this.sound.stopMusic();
        this.sound.playDeath();
      }
      this.triggerHaptic(70);
      this.addScreenShake(14, 0.45);

      const orb = this.getSelectedOrb();
      // Death explosion particles
      for (let i = 0; i < 24; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 220 + 40;
        this.spawnParticle({
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 6 + 3,
          color: i % 2 === 0 ? orb.glowColor : '#ff0077',
          alpha: 1,
          decay: Math.random() * 2.0 + 1.2
        });
      }

      const finalScore = Math.floor(this.score);
      const isNewBest = finalScore > this.stats.bestScore;
      if (isNewBest) {
        this.stats.bestScore = finalScore;
      }
      const finalDistance = Math.floor(this.distance / 10);
      if (finalDistance > (this.stats.bestDistance || 0)) {
        this.stats.bestDistance = finalDistance;
      }
      if (this.survivalTime > this.stats.longestSurvival) {
        this.stats.longestSurvival = Math.floor(this.survivalTime);
      }
      this.saveStorage();

      this.updateDailyMissionProgress('score', finalScore, true);
      this.updateDailyMissionProgress('survival', Math.floor(this.survivalTime), true);

      if (window.AnalyticsService) {
        window.AnalyticsService.track('game_over', {
          score: finalScore,
          distance: finalDistance,
          level: this.currentLevel,
          survivalTime: Math.floor(this.survivalTime),
          isNewBest: isNewBest
        });
      }

      this.updateGameOverScreen(isNewBest);

      // Optional interstitial between runs
      if (this.adManager && !this.continuedThisRun && this.stats.totalRuns % 3 === 0) {
        setTimeout(() => {
          if (this.state === STATE.GAME_OVER) {
            this.adManager.showInterstitial();
          }
        }, 1200);
      }
    }

    checkCollision(player, obs) {
      if (obs.type === 'SPIKE') {
        const hitL = obs.x + 3;
        const hitR = obs.x + obs.width - 3;
        const hitT = obs.y - obs.height + 3;
        const hitB = obs.y - 1;

        const px = player.x;
        const py = player.y;
        const pr = player.radius * 0.72;

        const closestX = Math.max(hitL, Math.min(px, hitR));
        const closestY = Math.max(hitT, Math.min(py, hitB));
        const dx = px - closestX;
        const dy = py - closestY;
        return (dx * dx + dy * dy) < (pr * pr);
      } else if (obs.type === 'BLOCK') {
        const hitL = obs.x + 2;
        const hitR = obs.x + obs.width - 2;
        const hitT = obs.y + 2;
        const hitB = obs.y + obs.height - 1;

        const px = player.x;
        const py = player.y;
        const pr = player.radius * 0.75;

        const closestX = Math.max(hitL, Math.min(px, hitR));
        const closestY = Math.max(hitT, Math.min(py, hitB));
        const dx = px - closestX;
        const dy = py - closestY;
        return (dx * dx + dy * dy) < (pr * pr);
      } else if (obs.type === 'FLOATING' || obs.type === 'MOVING') {
        const dx = player.x - obs.x;
        const dy = player.y - obs.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (player.radius + obs.radius) * 0.75;
      }
      return false;
    }

    // RENDERING PIPELINE
    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.save();

      // Screen shake
      if (this.shakeDuration > 0) {
        const shakeX = (Math.random() - 0.5) * this.shakeIntensity;
        const shakeY = (Math.random() - 0.5) * this.shakeIntensity;
        ctx.translate(shakeX, shakeY);
      }

      // Parallax theme colors (honor user choice if chosen)
      const currentIdx = (this.selectedThemeIndex >= 0 && this.selectedThemeIndex < THEMES.length)
        ? this.selectedThemeIndex
        : this.themeIndex;
      const targetTheme = ((this.currentLevel || 1) - 1) % THEMES.length;
      const nextIdx = (this.selectedThemeIndex >= 0 && this.selectedThemeIndex < THEMES.length)
        ? this.selectedThemeIndex
        : targetTheme;
      const theme1 = THEMES[currentIdx];
      const theme2 = THEMES[nextIdx];
      const tp = (this.selectedThemeIndex >= 0) ? 0 : this.themeProgress;

      const skyTop = lerpColor(theme1.skyTop, theme2.skyTop, tp);
      const skyBottom = lerpColor(theme1.skyBottom, theme2.skyBottom, tp);
      const distColor = lerpColor(theme1.distant, theme2.distant, tp);
      const mountColor = lerpColor(theme1.mountains, theme2.mountains, tp);
      const structColor = lerpColor(theme1.structures, theme2.structures, tp);
      const groundTop = lerpColor(theme1.groundTop, theme2.groundTop, tp);
      const groundBottom = lerpColor(theme1.groundBottom, theme2.groundBottom, tp);
      const accent = lerpColor(theme1.accent, theme2.accent, tp);

      // 1. Sky Gradient & Stars & Cyber Moon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.82);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(1, skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Cyber Moon / Celestial Beacon in upper sky
      const moonX = w * 0.82;
      const moonY = h * 0.16;
      const moonGrad = ctx.createRadialGradient(moonX, moonY, 4, moonX, moonY, 38);
      moonGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      moonGrad.addColorStop(0.35, accent);
      moonGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.12)');
      moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 38, 0, Math.PI * 2);
      ctx.fill();

      // Cyber moon core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric twinkling stars
      for (let s of this.stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * (0.55 + Math.sin(this.survivalTime * 2 + s.twinkle) * 0.45)})`;
        ctx.fillRect((s.x - this.bgOffset1 * 0.2 + 800) % w, s.y, s.size, s.size);
      }

      // 2. Parallax Layers - Futuristic Neon Night City (Pre-rendered Continuous Canvas System)
      const currentThemeBg = this.bgSystem ? this.bgSystem.getThemeLayers(currentIdx) : null;
      const nextThemeBg = (this.bgSystem && tp > 0) ? this.bgSystem.getThemeLayers(nextIdx) : null;

      if (currentThemeBg) {
        // Layer 1 (Far background, slow): Distant towers & needle spires
        this.bgSystem.renderContinuousLayer(ctx, currentThemeBg.layer1, this.bgOffset1, this.groundY - 260, w);
        if (nextThemeBg && tp > 0) {
          ctx.globalAlpha = tp;
          this.bgSystem.renderContinuousLayer(ctx, nextThemeBg.layer1, this.bgOffset1, this.groundY - 260, w);
          ctx.globalAlpha = 1.0;
        }

        // Blinking red/cyan antenna beacon lights on spire needle tips
        const beaconBlink = Math.sin(this.survivalTime * 3.5) > 0.1;
        if (beaconBlink) {
          this.bgSystem.renderLayer1Beacons(ctx, this.bgOffset1, this.groundY - 256, w, accent);
        }

        // Layer 2 (Mid background, medium): Cyber Mountain / Low Ridge silhouette
        this.bgSystem.renderContinuousLayer(ctx, currentThemeBg.layer2, this.bgOffset2, this.groundY - 140, w);
        if (nextThemeBg && tp > 0) {
          ctx.globalAlpha = tp;
          this.bgSystem.renderContinuousLayer(ctx, nextThemeBg.layer2, this.bgOffset2, this.groundY - 140, w);
          ctx.globalAlpha = 1.0;
        }

        // Layer 3 (Closer background): Futuristic metropolis skyline with neon window grids
        this.bgSystem.renderContinuousLayer(ctx, currentThemeBg.layer3, this.bgOffset3, this.groundY - 180, w);
        if (nextThemeBg && tp > 0) {
          ctx.globalAlpha = tp;
          this.bgSystem.renderContinuousLayer(ctx, nextThemeBg.layer3, this.bgOffset3, this.groundY - 180, w);
          ctx.globalAlpha = 1.0;
        }
      }

      // Soft neon horizon glow strip above ground (cached)
      if (!this._horizGrad || this._horizGradY !== this.groundY) {
        this._horizGrad = ctx.createLinearGradient(0, this.groundY - 60, 0, this.groundY);
        this._horizGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        this._horizGrad.addColorStop(1, 'rgba(0, 240, 255, 0.08)');
        this._horizGradY = this.groundY;
      }
      ctx.fillStyle = this._horizGrad;
      ctx.fillRect(0, this.groundY - 60, w, 60);

      // 3. Ground Platforms & Neon Grid (single gradient allocation per frame)
      const platGrad = ctx.createLinearGradient(0, this.groundY, 0, this.groundY + 70);
      platGrad.addColorStop(0, groundTop);
      platGrad.addColorStop(1, groundBottom);

      for (let plat of this.platforms) {
        if (plat.x + plat.width < 0 || plat.x > w) continue;

        ctx.fillStyle = platGrad;
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

        // Neon Top Edge (fast layered stroke without GPU blur)
        ctx.fillStyle = 'rgba(0, 240, 255, 0.28)';
        ctx.fillRect(plat.x, plat.y - 1.5, plat.width, 6.5);
        ctx.fillStyle = accent;
        ctx.fillRect(plat.x, plat.y, plat.width, 3);

        // Endless runway aesthetic markings (cycles across all levels)
        const runwayStyle = ((this.currentLevel || 1) - 1) % 5;
        if (runwayStyle === 1) {
          // Amber cyber chevrons
          ctx.strokeStyle = 'rgba(255, 170, 0, 0.45)';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          const chevronOffset = (this.bgOffset3 % 60);
          for (let cx = plat.x - chevronOffset; cx < plat.x + plat.width; cx += 60) {
            if (cx >= plat.x && cx <= plat.x + plat.width - 20) {
              ctx.moveTo(cx, plat.y + 6);
              ctx.lineTo(cx + 10, plat.y + 14);
              ctx.lineTo(cx, plat.y + 22);
            }
          }
          ctx.stroke();
        } else if (runwayStyle === 2) {
          // Emerald/Cyan circuit nodes
          ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
          const nodeOffset = (this.bgOffset3 % 50);
          for (let nx = plat.x - nodeOffset; nx < plat.x + plat.width; nx += 50) {
            if (nx >= plat.x && nx <= plat.x + plat.width) {
              ctx.fillRect(nx, plat.y + 6, 8, 2.5);
            }
          }
        } else if (runwayStyle === 3) {
          // Golden hazard dashes
          ctx.fillStyle = 'rgba(255, 215, 0, 0.45)';
          const dashOffset = (this.bgOffset3 % 40);
          for (let dx = plat.x - dashOffset; dx < plat.x + plat.width; dx += 40) {
            if (dx >= plat.x && dx <= plat.x + plat.width) {
              ctx.fillRect(dx, plat.y + 7, 12, 2);
            }
          }
        } else if (runwayStyle === 4) {
          // Magenta laser frequency lines
          ctx.fillStyle = 'rgba(255, 0, 119, 0.5)';
          const pulseOffset = (this.bgOffset3 % 35);
          for (let px = plat.x - pulseOffset; px < plat.x + plat.width; px += 35) {
            if (px >= plat.x && px <= plat.x + plat.width) {
              ctx.fillRect(px, plat.y + 6, 14, 2.5);
            }
          }
        }

        // Perspective Ground Grid
        ctx.strokeStyle = theme1.gridColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let gx = plat.x - (this.bgOffset4 % 45); gx < plat.x + plat.width; gx += 45) {
          if (gx >= plat.x && gx <= plat.x + plat.width) {
            ctx.moveTo(gx, plat.y);
            ctx.lineTo(gx - 22, plat.y + 60);
          }
        }
        for (let gy = plat.y + 15; gy < plat.y + 60; gy += 15) {
          ctx.moveTo(plat.x, gy);
          ctx.lineTo(plat.x + plat.width, gy);
        }
        ctx.stroke();
      }

      // 4. Render Obstacles
      for (let obs of this.obstacles) {
        if (obs.x + 80 < 0 || obs.x - 80 > w) continue;

        if (obs.type === 'SPIKE') {
          ctx.save();
          // Sleek arcade trapezoidal barrier hurdle
          const hw = obs.width * 0.5;
          const cx = obs.x + hw;
          const topCapHalf = 3;
          const topY = obs.y - obs.height;

          const pylonGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x, topY);
          pylonGrad.addColorStop(0, '#1c0310');
          pylonGrad.addColorStop(0.5, '#850035');
          pylonGrad.addColorStop(1, '#ff0055');

          ctx.fillStyle = pylonGrad;
          ctx.strokeStyle = '#ff0077';
          ctx.lineWidth = 1.8;

          // Trapezoid geometry
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(cx - topCapHalf, topY);
          ctx.lineTo(cx + topCapHalf, topY);
          ctx.lineTo(obs.x + obs.width, obs.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Bright neon top highlight cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx - topCapHalf - 1, topY - 1, (topCapHalf * 2) + 2, 2.5);

          // Center neon indicator strip
          ctx.fillStyle = '#ff3388';
          ctx.fillRect(cx - 1, topY + 4, 2, obs.height - 6);

          // Base contact glow
          ctx.fillStyle = 'rgba(255, 0, 119, 0.4)';
          ctx.fillRect(obs.x - 2, obs.y - 1, obs.width + 4, 2);
          ctx.restore();
        } else if (obs.type === 'BLOCK') {
          ctx.save();
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#ff0077';
          ctx.lineWidth = 2.5;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          ctx.strokeStyle = 'rgba(255, 0, 119, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.moveTo(obs.x + obs.width, obs.y);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.stroke();
          ctx.restore();
        } else if (obs.type === 'FLOATING' || obs.type === 'MOVING') {
          ctx.save();
          ctx.translate(obs.x, obs.y);
          const time = performance.now() * 0.005;

          ctx.strokeStyle = '#ff0055';
          ctx.lineWidth = 2.5;
          ctx.fillStyle = '#260416';

          for (let s = 0; s < 6; s++) {
            const rot = time + (s * Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(rot) * (obs.radius + 8), Math.sin(rot) * (obs.radius + 8));
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 6 + Math.sin(time * 3) * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 5. Render Collectibles
      for (let item of this.collectibles) {
        if (item.x + 40 < 0 || item.x - 40 > w) continue;
        const cy = item.y + Math.sin(item.bobTimer) * 5;

        if (item.type === 'COIN') {
          const rawSpin = Math.cos(item.bobTimer * 2.5);
          const spin = Math.max(0.08, Math.abs(rawSpin));
          const radX = item.radius * spin;
          const radY = item.radius;

          if (item.isRiskBonus) {
            ctx.fillStyle = '#ff7700';
            ctx.beginPath();
            ctx.ellipse(item.x, cy, radX, radY, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffe066';
            ctx.beginPath();
            ctx.ellipse(item.x, cy, radX * 0.68, radY * 0.68, 0, 0, Math.PI * 2);
            ctx.fill();

            // Diamond flare glint
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(item.x, cy - radY * 0.42);
            ctx.lineTo(item.x + radX * 0.42, cy);
            ctx.lineTo(item.x, cy + radY * 0.42);
            ctx.lineTo(item.x - radX * 0.42, cy);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillStyle = '#ffaa00';
            ctx.beginPath();
            ctx.ellipse(item.x, cy, radX, radY, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff4a3';
            ctx.beginPath();
            ctx.ellipse(item.x, cy, radX * 0.65, radY * 0.65, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.save();
          ctx.translate(item.x, cy);
          let pColor = '#00f0ff';
          if (item.type === 'SPEED') pColor = '#ffaa00';
          if (item.type === 'MAGNET') pColor = '#ff0077';

          ctx.strokeStyle = pColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + 4, 0, Math.PI * 2);
          ctx.stroke();

          const pGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, item.radius);
          pGrad.addColorStop(0, '#ffffff');
          pGrad.addColorStop(0.7, pColor);
          pGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px Orbitron, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          let symbol = '🛡';
          if (item.type === 'SPEED') symbol = '⚡';
          if (item.type === 'MAGNET') symbol = '🧲';
          ctx.fillText(symbol, 0, 1);
          ctx.restore();
        }
      }

      // 6. Render Particles (ultra-fast quad blit)
      for (let p of this.particles) {
        if (p.alpha <= 0) continue;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
      }
      ctx.globalAlpha = 1.0;

      // 6.5 Render Celebratory Particles (Confetti, Flower Petals, Stars)
      if (this.celebrationParticles && this.celebrationParticles.length > 0) {
        for (let cp of this.celebrationParticles) {
          if (cp.alpha <= 0) continue;
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, cp.alpha));

          if (cp.kind === 'confetti') {
            ctx.translate(cp.x, cp.y);
            ctx.rotate((cp.rot * Math.PI) / 180);
            const scaleX = Math.cos(cp.wobble); // 3D tumbling flip
            ctx.scale(scaleX, 1);
            ctx.fillStyle = cp.color;
            ctx.fillRect(-cp.w / 2, -cp.h / 2, cp.w, cp.h);
          } else if (cp.kind === 'petal') {
            ctx.translate(cp.x, cp.y);
            ctx.rotate(Math.sin(cp.flutter) * 0.45);
            ctx.fillStyle = cp.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, cp.w, cp.h, 0.35, 0, Math.PI * 2);
            ctx.fill();
          } else if (cp.kind === 'star') {
            ctx.translate(cp.x, cp.y);
            const pulse = (Math.sin(cp.twinkle) * 0.25 + 1.0) * cp.size;
            ctx.fillStyle = cp.color;
            ctx.beginPath();
            ctx.moveTo(0, -pulse);
            ctx.lineTo(pulse * 0.26, -pulse * 0.26);
            ctx.lineTo(pulse, 0);
            ctx.lineTo(pulse * 0.26, pulse * 0.26);
            ctx.moveTo(0, pulse);
            ctx.lineTo(-pulse * 0.26, pulse * 0.26);
            ctx.lineTo(-pulse, 0);
            ctx.lineTo(-pulse * 0.26, -pulse * 0.26);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // Ambient top bloom glow during level transition
      if (this.levelTransitionGlow > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, this.levelTransitionGlow * 0.42);
        const glowGrad = ctx.createLinearGradient(0, 0, 0, 150);
        glowGrad.addColorStop(0, 'rgba(255, 170, 0, 0.45)');
        glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, this.width || 400, 150);
        ctx.restore();
      }

      // 7. Render Player Orb (rendered in playing, tutorial, paused, reviving)
      if (this.state === STATE.PLAYING || this.state === STATE.TUTORIAL || this.state === STATE.PAUSED || this.state === STATE.REVIVING) {
        this.renderPlayer(ctx);
      }

      // 8. Render Tutorial In-World Indicators & Warning Arrow
      if (this.state === STATE.TUTORIAL) {
        this.renderTutorialGuidance(ctx);
      }

      // 9. Render Floating Texts (crisp high-contrast stroke + fill without shadowBlur)
      if (this.floatingTexts.length > 0) {
        ctx.font = '900 15px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        for (let ft of this.floatingTexts) {
          if (ft.alpha <= 0) continue;
          ctx.globalAlpha = ft.alpha;
          ctx.strokeStyle = 'rgba(0, 5, 20, 0.88)';
          ctx.lineWidth = 3;
          ctx.strokeText(ft.text, ft.x, ft.y);
          ctx.fillStyle = ft.color;
          ctx.fillText(ft.text, ft.x, ft.y);
        }
        ctx.globalAlpha = 1.0;
      }

      // 10. Speed Boost Streaks
      if (this.activePowerup === 'SPEED') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 170, 0, 0.45)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 7; i++) {
          const ly = Math.random() * h;
          const lx = Math.random() * w;
          const len = Math.random() * 90 + 50;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx - len, ly);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();
    }

    renderTutorialGuidance(ctx) {
      const time = performance.now() * 0.005;

      // 1. Ready Intro Banner
      if (this.tutorialReadyTimer > 0) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 18px Orbitron, sans-serif';
        ctx.strokeStyle = 'rgba(0, 5, 20, 0.88)';
        ctx.lineWidth = 3;
        ctx.strokeText('READY? GET SET...', this.width * 0.5, 110);
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('READY? GET SET...', this.width * 0.5, 110);
        ctx.restore();
        return;
      }

      // 2. Hurdle Guidance: Dynamic arrow sequence pointing clearly toward upcoming hurdle
      if (this.tutorialStep === 2 || this.tutorialStep === 4 || this.tutorialStep === 5) {
        const obs = this.obstacles.find(o => !o.counted && o.x + o.width > this.player.x);
        if (obs) {
          const hurdleCenterX = obs.x + (obs.width * 0.5);
          const dist = hurdleCenterX - this.player.x;

          // Only display when hurdle is approaching
          if ((this.player.isGrounded || this.player.jumpsRemaining > 0) && dist > 50 && dist < 380) {
            const isJumpTiming = (dist <= 220);
            ctx.save();
            ctx.textAlign = 'center';

            // Smooth gentle floating pulse (no excessive movement)
            const pulse = Math.sin(time * (isJumpTiming ? 6 : 3)) * 2.5;
            const topOfHurdle = obs.y - obs.height;

            const glowColor = isJumpTiming ? '#ffd700' : '#00f0ff';
            const labelText = isJumpTiming ? (this.tutorialStep === 5 ? 'DOUBLE JUMP' : 'JUMP NOW') : 'HAZARD AHEAD';

            // Lower arrow pointing down toward hurdle
            const lowerArrowTip = topOfHurdle - 7 + pulse;
            const lowerArrowTop = lowerArrowTip - 11;

            // Center callout text
            const textY = lowerArrowTop - 8;

            // Upper arrow pointing down toward text
            const upperArrowTip = textY - 10;
            const upperArrowTop = upperArrowTip - 11;

            ctx.strokeStyle = glowColor;
            ctx.fillStyle = glowColor;

            // Sleek minimalist downward arrow drawing helper
            const drawMinimalArrow = (topY, tipY) => {
              ctx.lineWidth = 2.2;
              ctx.beginPath();
              ctx.moveTo(hurdleCenterX, topY);
              ctx.lineTo(hurdleCenterX, tipY);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(hurdleCenterX - 5, tipY - 5);
              ctx.lineTo(hurdleCenterX, tipY);
              ctx.lineTo(hurdleCenterX + 5, tipY - 5);
              ctx.stroke();
            };

            // 1. Upper arrow
            drawMinimalArrow(upperArrowTop, upperArrowTip);

            // 2. Center Text
            ctx.font = '800 11px Orbitron, sans-serif';
            ctx.fillText(labelText, hurdleCenterX, textY);

            // 3. Lower arrow
            drawMinimalArrow(lowerArrowTop, lowerArrowTip);

            ctx.restore();
          }
        }
      }
    }

    // POLISHED PLAYER / ORB RENDERING
    renderPlayer(ctx) {
      const p = this.player;
      const orb = this.getSelectedOrb();

      // 1. Motion Trail with orb's custom trail color
      for (let i = 0; i < p.motionTrail.length; i++) {
        const t = p.motionTrail[i];
        if (t.alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = t.alpha * 0.45;
        let trailCol = orb.trailColor;
        if (this.isEscapeMode) {
          trailCol = (i % 2 === 0) ? '#00f0ff' : '#ffd700';
        } else if (this.activePowerup === 'SPEED') {
          trailCol = '#ffaa00';
        }
        ctx.fillStyle = trailCol;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * (1 - i / p.motionTrail.length * 0.45), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(p.squashX, p.squashY);

      // Invincibility flicker
      if (p.invincibleTimer > 0 && Math.floor(performance.now() / 60) % 2 === 0) {
        ctx.globalAlpha = 0.35;
      }

      // 2. Dynamic Pulsing Energy Glow
      const pulseSize = (this.isEscapeMode ? 1.6 : 1.35) + Math.sin(p.energyPulse) * 0.12;
      const glowGrad = ctx.createRadialGradient(0, 0, p.radius * 0.25, 0, 0, p.radius * pulseSize);
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      let midGlow = orb.glowColor;
      if (this.isEscapeMode) midGlow = '#00f0ff';
      else if (this.activePowerup === 'SPEED') midGlow = 'rgba(255, 170, 0, 0.85)';
      glowGrad.addColorStop(0.35, midGlow);
      glowGrad.addColorStop(0.75, this.isEscapeMode ? '#ffd700' : orb.trailColor);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Escape Mode Outer Corona Ring
      if (this.isEscapeMode) {
        ctx.save();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius * 1.36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Orbiting Spark Ring
      ctx.save();
      ctx.rotate(p.rotation);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let s = 0; s < 4; s++) {
        const ang = (s * Math.PI / 2);
        ctx.moveTo(Math.cos(ang) * (p.radius * 0.25), Math.sin(ang) * (p.radius * 0.25));
        ctx.lineTo(Math.cos(ang) * (p.radius * 0.9), Math.sin(ang) * (p.radius * 0.9));
      }
      ctx.stroke();
      ctx.restore();

      // 4. Energetic Core & Shape
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
      coreGrad.addColorStop(0, orb.coreColor);
      coreGrad.addColorStop(0.45, this.isEscapeMode ? '#00f0ff' : (this.activePowerup === 'SPEED' ? '#ffaa00' : orb.glowColor));
      coreGrad.addColorStop(1, this.isEscapeMode ? '#ffd700' : orb.trailColor);
      ctx.fillStyle = coreGrad;

      const shapeId = this.selectedShapeId || 'circle';
      ctx.beginPath();
      if (shapeId === 'square') {
        const half = p.radius * 0.95;
        ctx.rect(-half, -half, half * 2, half * 2);
      } else if (shapeId === 'diamond') {
        const r = p.radius * 1.15;
        ctx.moveTo(0, -r);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r, 0);
        ctx.closePath();
      } else if (shapeId === 'hexagon') {
        const r = p.radius * 1.1;
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const hx = Math.cos(a) * r;
          const hy = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
      } else if (shapeId === 'star') {
        const spikes = 5;
        const outerR = p.radius * 1.25;
        const innerR = p.radius * 0.58;
        let rot = (Math.PI / 2) * 3;
        let step = Math.PI / spikes;
        ctx.moveTo(0, -outerR);
        for (let i = 0; i < spikes; i++) {
          let sx = Math.cos(rot) * outerR;
          let sy = Math.sin(rot) * outerR;
          ctx.lineTo(sx, sy);
          rot += step;
          sx = Math.cos(rot) * innerR;
          sy = Math.sin(rot) * innerR;
          ctx.lineTo(sx, sy);
          rot += step;
        }
        ctx.closePath();
      } else {
        // Default circle / sphere
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      }
      ctx.fill();

      // 5. Shield Bubble / Revival Aura
      if (this.hasShield || p.reviveShieldTimer > 0) {
        ctx.save();
        const sPulse = Math.sin(performance.now() * 0.009) * 2;
        const shieldR = p.radius + 6.5 + sPulse;
        ctx.strokeStyle = p.reviveShieldTimer > 0 ? '#ffaa00' : 'rgba(0, 240, 255, 0.9)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(0, 0, shieldR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = p.reviveShieldTimer > 0 ? 'rgba(255, 170, 0, 0.2)' : 'rgba(0, 240, 255, 0.15)';
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    updateLevelDistanceHUD(lvl, meters) {
      const d = this.dom;
      if (!d.levelTag) d.levelTag = document.getElementById('hud-level-tag');
      if (!d.distVal) d.distVal = document.getElementById('hud-dist-val');
      if (!d.levelDistEl) d.levelDistEl = document.getElementById('hud-level-dist');

      const levelStr = `L${lvl}`;
      const distStr = `${meters}m`;
      const combinedStr = `${levelStr} • ${distStr}`;

      if (d.levelTag) {
        if (d.levelTag.textContent !== levelStr) d.levelTag.textContent = levelStr;
      }
      if (d.distVal) {
        if (d.distVal.textContent !== distStr) d.distVal.textContent = distStr;
      }
      if (d.levelDistEl) {
        if (d.levelDistEl.textContent !== combinedStr) d.levelDistEl.textContent = combinedStr;
      }
    }

    // UI UPDATES (Memoized with zero layout thrash)
    updateHUD() {
      const d = this.dom;
      const last = this._lastHUD;

      // 1. Score (only update when whole number integer changes)
      const curScore = Math.floor(this.score);
      if (curScore !== last.score) {
        last.score = curScore;
        if (!d.scoreEl) d.scoreEl = document.getElementById('hud-score');
        if (d.scoreEl) d.scoreEl.textContent = curScore;
      }

      // 2. Coins (only update when run coin count changes)
      if (this.coinsThisRun !== last.coins) {
        last.coins = this.coinsThisRun;
        if (!d.coinsEl) d.coinsEl = document.getElementById('hud-coins');
        if (d.coinsEl) d.coinsEl.textContent = this.coinsThisRun;
      }

      // 3. Distance & Level (only update when meter or level changes)
      const meters = Math.floor(this.distance / 10);
      const lvl = this.getLevelFromDistance(meters);
      if (meters !== last.meters || lvl !== last.level) {
        last.meters = meters;
        last.level = lvl;
        this.updateLevelDistanceHUD(lvl, meters);
      }

      // 4. Combo Multiplier
      if (this.comboMultiplier !== last.combo) {
        last.combo = this.comboMultiplier;
        if (!d.comboBadge) d.comboBadge = document.getElementById('hud-combo');
        if (d.comboBadge) {
          if (this.comboMultiplier > 1) {
            d.comboBadge.style.display = 'inline-flex';
            d.comboBadge.textContent = `x${this.comboMultiplier} COMBO`;
          } else {
            d.comboBadge.style.display = 'none';
          }
        }
      }

      // 5. Power-up Card & Meter
      const isPowerActive = !!(this.activePowerup && this.powerupDuration > 0);
      const powerPct = isPowerActive ? Math.round(Math.max(0, (this.powerupTimer / this.powerupDuration) * 100)) : 0;
      if (isPowerActive !== last.powerupVisible || this.activePowerup !== last.powerupType || powerPct !== last.powerupPct) {
        last.powerupVisible = isPowerActive;
        last.powerupType = this.activePowerup;
        last.powerupPct = powerPct;

        if (!d.powerupCard) d.powerupCard = document.getElementById('hud-powerup');
        if (!d.powerupFill) d.powerupFill = document.getElementById('powerup-meter-fill');
        if (!d.powerupIcon) d.powerupIcon = document.getElementById('hud-powerup-icon');

        if (d.powerupCard && d.powerupFill && d.powerupIcon) {
          if (isPowerActive) {
            d.powerupCard.style.display = 'flex';
            d.powerupFill.style.width = `${powerPct}%`;
            if (this.activePowerup === 'SHIELD') {
              d.powerupIcon.textContent = '🛡';
              d.powerupFill.style.background = 'var(--cyan)';
            } else if (this.activePowerup === 'SPEED') {
              d.powerupIcon.textContent = '⚡';
              d.powerupFill.style.background = 'var(--amber)';
            } else if (this.activePowerup === 'MAGNET') {
              d.powerupIcon.textContent = '🧲';
              d.powerupFill.style.background = 'var(--magenta)';
            }
          } else {
            d.powerupCard.style.display = 'none';
          }
        }
      }

      // 6. Escape Energy Meter
      if (!d.escapeWrap) d.escapeWrap = document.getElementById('hud-escape-energy');
      if (!d.escapeFill) d.escapeFill = document.getElementById('hud-escape-energy-fill');
      if (!d.escapePct) d.escapePct = document.getElementById('hud-escape-energy-pct');
      if (!d.escapeLabel) d.escapeLabel = document.getElementById('hud-escape-energy-label');

      if (d.escapeWrap && d.escapeFill && d.escapePct) {
        if (this.state === STATE.PLAYING) {
          d.escapeWrap.style.display = 'block';
          const energyPct = Math.round(Math.min(100, Math.max(0, this.escapeEnergy || 0)));
          const isEscMode = !!this.isEscapeMode;
          const escSeconds = isEscMode ? Math.ceil(this.escapeModeTimer) : -1;

          if (energyPct !== last.escapeEnergyPct || isEscMode !== last.escapeActive || escSeconds !== last.escSeconds) {
            last.escapeEnergyPct = energyPct;
            last.escapeActive = isEscMode;
            last.escSeconds = escSeconds;

            d.escapeFill.style.width = `${energyPct}%`;
            if (isEscMode) {
              d.escapeWrap.classList.add('rush-active');
              d.escapeWrap.classList.add('escape-active');
              if (d.escapeLabel) d.escapeLabel.textContent = '⚡ RUSH MODE!';
              d.escapePct.textContent = `${escSeconds}s`;
            } else {
              d.escapeWrap.classList.remove('rush-active');
              d.escapeWrap.classList.remove('escape-active');
              if (d.escapeLabel) d.escapeLabel.textContent = '⚡ RUSH ENERGY';
              d.escapePct.textContent = `${energyPct}%`;
            }
          }
        } else {
          d.escapeWrap.style.display = 'none';
        }
      }
    }

    updateGameOverScreen(isNewBest) {
      this.updateUI();
      const finalScoreEl = document.getElementById('go-score');
      const bestScoreEl = document.getElementById('go-best');
      const coinsEl = document.getElementById('go-coins');
      const distEl = document.getElementById('go-dist');
      const survivalEl = document.getElementById('go-survival');
      const levelEl = document.getElementById('go-level');
      const bestDistEl = document.getElementById('go-best-dist');
      const newBestBadge = document.getElementById('go-new-best');
      const continueBtn = document.getElementById('btn-continue-go');

      if (finalScoreEl) finalScoreEl.textContent = Math.floor(this.score).toLocaleString();
      if (bestScoreEl) bestScoreEl.textContent = (this.stats.bestScore || 0).toLocaleString();
      if (coinsEl) coinsEl.textContent = `+${this.coinsThisRun || 0}`;
      if (distEl) distEl.textContent = `${Math.floor(this.distance / 10)}m`;
      if (survivalEl) survivalEl.textContent = `${Math.floor(this.survivalTime)}s`;
      if (levelEl) levelEl.textContent = `LEVEL ${this.currentLevel || 1}`;
      if (bestDistEl) bestDistEl.textContent = `${this.stats.bestDistance || 0}m`;

      if (newBestBadge) {
        newBestBadge.style.display = isNewBest ? 'inline-block' : 'none';
      }

      // Clear previous ad status message
      const msgEl = document.getElementById('go-ad-message');
      if (msgEl) msgEl.style.display = 'none';

      // One rewarded continue allowed per run
      if (continueBtn) {
        continueBtn.classList.remove('loading');
        if (!this.continuedThisRun) {
          continueBtn.style.display = 'flex';
          const adService = window.AdService || this.adManager;
          if (adService) {
            adService.preloadRewardedAd();
            const isReady = adService.isRewardedAdReady();
            continueBtn.style.opacity = isReady ? '1' : '0.85';
            const subTitle = document.getElementById('continue-ad-subtitle');
            if (subTitle) {
              subTitle.textContent = isReady
                ? 'One chance per run • Revives with shield'
                : 'Loading ad stream • One chance per run';
            }
          }
        } else {
          continueBtn.style.display = 'none';
        }
      }
    }

    closeAllModals(clearHistory = false) {
      if (clearHistory) {
        this.navHistory = [];
      }
      const modalIds = [
        'settings-modal',
        'level-complete-modal',
        'customization-modal',
        'session-reward-modal',
        'daily-reward-modal',
        'daily-missions-modal',
        'leaderboard-modal',
        'achievements-modal',
        'stats-modal',
        'guide-modal',
        'purchase-modal',
        'reset-confirm-modal'
      ];
      modalIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
      this.stopLevelConfetti();
    }

    getActiveModalId() {
      const modalIds = [
        'level-complete-modal',
        'reset-confirm-modal',
        'purchase-modal',
        'stats-modal',
        'settings-modal',
        'customization-modal',
        'achievements-modal',
        'daily-reward-modal',
        'daily-missions-modal',
        'session-reward-modal',
        'leaderboard-modal',
        'guide-modal'
      ];
      for (const id of modalIds) {
        const el = document.getElementById(id);
        if (el && el.classList.contains('active')) {
          return id;
        }
      }
      return null;
    }

    hasOpenModals() {
      return this.getActiveModalId() !== null;
    }

    closeCurrentModal() {
      const active = this.getActiveModalId();
      if (!active) return false;

      // Special case: level complete celebration modal resumes the run
      if (active === 'level-complete-modal') {
        this.resumeFromLevelComplete();
        return true;
      }

      // Special case: reset confirmation modal returns to settings
      if (active === 'reset-confirm-modal') {
        const c = document.getElementById('reset-confirm-modal');
        if (c) c.classList.remove('active');
        return true;
      }

      const activeEl = document.getElementById(active);
      if (activeEl) activeEl.classList.remove('active');

      if (this.navHistory && this.navHistory.length > 0) {
        const prevId = this.navHistory.pop();
        if (prevId && prevId !== active) {
          this.openModalById(prevId, false);
          return true;
        }
      }

      this.closeAllModals(true);
      if (this.state !== STATE.PLAYING && this.state !== STATE.PAUSED) {
        this.state = STATE.MENU;
      }
      this.updateUI();
      return true;
    }

    openModalById(id, pushHistory = true) {
      if (!id) return;
      const currentActive = this.getActiveModalId();
      if (pushHistory && currentActive && currentActive !== id) {
        if (!this.navHistory.includes(currentActive)) {
          this.navHistory.push(currentActive);
        }
      } else if (!pushHistory) {
        // Navigating back
      } else {
        this.navHistory = [];
      }

      this.closeAllModals(false);

      switch (id) {
        case 'settings-modal':
          this.renderSettingsModal();
          break;
        case 'stats-modal':
          this.renderStatsModal();
          break;
        case 'customization-modal':
          this.renderCustomizationModal();
          break;
        case 'achievements-modal':
          this.renderAchievementsModal();
          break;
        case 'daily-reward-modal':
          this.renderDailyRewardModal();
          break;
        case 'daily-missions-modal':
          this.renderDailyMissionsModal();
          break;
        case 'session-reward-modal':
          this.renderSessionRewardModal();
          break;
        case 'leaderboard-modal':
          this.renderLeaderboardModal();
          break;
        case 'guide-modal':
          this.renderGuideModal();
          break;
        default:
          const el = document.getElementById(id);
          if (el) el.classList.add('active');
          break;
      }
    }

    handleAndroidBack() {
      // 1. Any active modal gets closed / pops navigation history
      const activeModal = this.getActiveModalId();
      if (activeModal) {
        if (activeModal === 'level-complete-modal') {
          this.resumeFromLevelComplete();
          return true;
        }
        this.closeCurrentModal();
        return true;
      }

      // 2. In-game paused: resume play
      if (this.state === STATE.PAUSED) {
        this.resumeGame();
        return true;
      }

      // 3. In-game playing: pause
      if (this.state === STATE.PLAYING) {
        this.pauseGame();
        return true;
      }

      // 4. In tutorial: return to Menu
      if (this.state === STATE.TUTORIAL) {
        this.finishTutorial(false);
        this.state = STATE.MENU;
        this.updateUI();
        return true;
      }

      // 5. In game over: return to Menu
      if (this.state === STATE.GAME_OVER) {
        this.state = STATE.MENU;
        this.updateUI();
        return true;
      }

      // 6. In guide prompt or guide screen: return to Menu
      if (this.state === STATE.GUIDE_PROMPT || this.state === STATE.GUIDE) {
        this.state = STATE.MENU;
        this.updateUI();
        return true;
      }

      // 7. At Menu/Dashboard or Welcome: system handles exit/minimize
      return false;
    }

    getLevelFromDistance(meters) {
      if (meters < 1000) return 1;
      // Endless milestone progression: Level 2 at 1000m, Level 3 at 2100m, Level 4 at 3200m, ...
      return Math.floor((meters - 1000) / 1100) + 2;
    }

    getSpeedForDistance(meters) {
      let target = this.baseSpeed;
      if (meters < 1000) {
        // Level 1 (0m - 1000m): Smooth, welcoming, highly accessible pace
        target = 175 + (meters / 1000) * 30; // 175 -> 205
      } else if (meters < 2100) {
        // Level 2 (1000m - 2100m): Sunset runway rhythm
        target = 205 + ((meters - 1000) / 1100) * 33; // 205 -> 238
      } else if (meters < 3200) {
        // Level 3 (2100m - 3200m): Forest twilight speed
        target = 238 + ((meters - 2100) / 1100) * 32; // 238 -> 270
      } else if (meters < 4300) {
        // Level 4 (3200m - 4300m): Desert mirage flow
        target = 270 + ((meters - 3200) / 1100) * 30; // 270 -> 300
      } else if (meters < 5400) {
        // Level 5 (4300m - 5400m): Neon district rush
        target = 300 + ((meters - 4300) / 1100) * 30; // 300 -> 330
      } else {
        // Endless Levels (5400m+): Asymptotic smooth growth capping at 365px/s to guarantee 100% fair jump physics
        const past5400 = meters - 5400;
        target = Math.min(365, 330 + (past5400 / (past5400 + 4000)) * 35);
      }

      if (this.gameSpeedSetting === 'low') target *= 0.88;
      else if (this.gameSpeedSetting === 'high') target *= 1.12;

      return target;
    }

    checkLevelProgression(meters) {
      if (this.state !== STATE.PLAYING) return;
      const targetLevel = this.getLevelFromDistance(meters);
      const current = this.currentLevel || 1;
      if (targetLevel > current) {
        // Enforce strictly 1 level increment at a time to prevent any skipping
        const nextLevel = current + 1;
        this.currentLevel = nextLevel;
        this.completeLevel(current, nextLevel, meters);
      }
    }

    completeLevel(completedLevel, newLevel, meters) {
      if (!this.awardedLevelBonuses) this.awardedLevelBonuses = {};
      if (this.awardedLevelBonuses[completedLevel]) return; // Guard: prevent duplicate rewards
      this.awardedLevelBonuses[completedLevel] = true;

      // 1. Calculate bonus coins according to endless progression
      const bonuses = {
        1: 50,  // Level 1 complete (1000m) -> +50 coins
        2: 75,  // Level 2 complete (2100m) -> +75 coins
        3: 100, // Level 3 complete (3200m) -> +100 coins
        4: 150, // Level 4 complete (4300m) -> +150 coins
        5: 200, // Level 5 complete (5400m) -> +200 coins
        6: 250  // Level 6 complete (6500m) -> +250 coins
      };
      const bonusCoins = bonuses[completedLevel] || Math.min(500, 250 + (completedLevel - 6) * 40);

      // 2. Award bonus coins immediately to real player state
      this.stats.totalCoins = (this.stats.totalCoins || 0) + bonusCoins;
      this.coinsThisRun = (this.coinsThisRun || 0) + bonusCoins;
      this.stats.highestLevel = Math.max(this.stats.highestLevel || 1, newLevel);
      this.saveStorage();

      // 3. Clear immediate obstacles ahead so the runner has a clean, fair reaction window
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const o = this.obstacles[i];
        if (o.x >= this.player.x && o.x <= this.player.x + 300) {
          const remObs = this.obstacles.splice(i, 1)[0];
          this.recycleObstacle(remObs);
        }
      }

      // 4. Grant runner 1.6s invulnerability grace period to guarantee safe continuous transition
      this.player.invincibleTimer = Math.max(this.player.invincibleTimer || 0, 1.6);

      // 5. Smoothly transition background environment theme via continuous cross-fade
      this.themeProgress = 0.01;

      // 6. Achievements check
      if (newLevel >= 2) {
        this.checkAchievement('firstEscape', 'First Escape', 'Completed Level 1 and advanced');
      }
      if (newLevel >= 3) {
        this.checkAchievement('level3Master', 'Level 3 Explorer', 'Reached Level 3 distance milestone');
      }
      if (newLevel >= 5) {
        this.checkAchievement('speedRunner', 'Speed Runner', 'Reached Level 5 in a continuous run');
      }
      if (newLevel >= 10) {
        this.checkAchievement('masterRunner', 'Master Runner', 'Reached Level 10 mastery');
      }

      // 7. Update UI & HUD immediately
      this.updateHUD();
      const profCoins = document.getElementById('stat-total-coins');
      if (profCoins) profCoins.textContent = this.stats.totalCoins;
      const menuCoins = document.getElementById('menu-coins');
      if (menuCoins) menuCoins.textContent = this.stats.totalCoins;

      // 8. Seamless level transition celebration:
      // Game continues playing seamlessly! NO pause, NO stop, continuous run!
      this.showSeamlessLevelCelebration(completedLevel, newLevel, bonusCoins, meters);
    }

    showSeamlessLevelCelebration(completedLevel, newLevel, bonusCoins, meters) {
      // Audio & Haptics fanfare (respects sound/haptic toggles)
      if (this.sound) {
        if (typeof this.sound.playLevelUp === 'function') {
          this.sound.playLevelUp();
        } else if (typeof this.sound.playAchievement === 'function') {
          this.sound.playAchievement();
        }
      }
      this.triggerHaptic([35, 45, 70]);

      const levelEnvNames = [
        'Abandoned City',
        'Sunset Runway',
        'Neon Laboratory',
        'Industrial Foundry',
        'High-Tech Energy Zone',
        'Quantum Overdrive',
        'Orbital Station',
        'Cyber Sanctuary',
        'Singularity Core',
        'Hyper Velocity Zone',
        'Chronos Overdrive',
        'Nebula Outpost'
      ];
      const nextEnvName = levelEnvNames[(newLevel - 1) % levelEnvNames.length];

      // 1. Show floating text above runner
      this.showFloatingText(`LEVEL ${newLevel}! ⚡`, this.player.x, this.player.y - 44, '#00f0ff');

      // 2. Trigger brief ambient bloom glow at top of screen
      this.levelTransitionGlow = 1.0;

      // 3. Centralized non-blocking high-priority celebration banner
      if (this.notificationManager) {
        this.notificationManager.show({
          id: 'level_' + newLevel,
          priority: 'HIGH',
          title: `🎉 LEVEL ${newLevel} REACHED!`,
          message: `${nextEnvName.toUpperCase()} • +${bonusCoins} BONUS COINS`,
          icon: '🏁',
          duration: 1800
        });
      }

      // 4. Spawn lightweight celebratory particles (confetti, flower petals, stars)
      this.spawnCelebrationParticles();
    }

    spawnCelebrationParticles() {
      if (!this.celebrationParticles) this.celebrationParticles = [];
      if (!this._celebrationPool) this._celebrationPool = [];

      // Recycle existing celebration particles into pool before new burst
      while (this.celebrationParticles.length > 0) {
        const cp = this.celebrationParticles.pop();
        if (this._celebrationPool.length < 50) this._celebrationPool.push(cp);
      }

      const getParticle = (kind, x, y, vx, vy, alpha, decay, extra) => {
        let p = (this._celebrationPool.length > 0) ? this._celebrationPool.pop() : {};
        p.kind = kind;
        p.x = x;
        p.y = y;
        p.vx = vx;
        p.vy = vy;
        p.alpha = alpha;
        p.decay = decay;
        for (let k in extra) {
          p[k] = extra[k];
        }
        return p;
      };

      const w = this.width || 400;

      if (this.reducedMotion) {
        // Reduced motion: subtle glow sparkles only
        for (let i = 0; i < 6; i++) {
          this.celebrationParticles.push(getParticle('star', Math.random() * w, Math.random() * 120 + 20, 0, 20, 0.8, 0.7, {
            size: 3,
            color: '#ffd700',
            twinkle: Math.random() * Math.PI
          }));
        }
        return;
      }

      const colors = ['#ffd700', '#ff3366', '#00f0ff', '#00ff88', '#ffaa00', '#b388ff'];
      const petalColors = ['#ff85a1', '#ffb3c6', '#ffcbf2', '#ffe5ec', '#ffd166'];

      // 1. Confetti pieces (18 items) - tumbling colorful slips
      for (let i = 0; i < 18; i++) {
        this.celebrationParticles.push(getParticle('confetti', Math.random() * w, -10 - Math.random() * 40, (Math.random() - 0.5) * 55, Math.random() * 95 + 85, 1.0, 0.58, {
          w: Math.random() * 5 + 6,
          h: Math.random() * 4 + 4,
          color: colors[i % colors.length],
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 7 + 4,
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 9
        }));
      }

      // 2. Flower petals (12 items) - organic fluttering petals
      for (let i = 0; i < 12; i++) {
        this.celebrationParticles.push(getParticle('petal', Math.random() * w, -15 - Math.random() * 35, (Math.random() - 0.5) * 35, Math.random() * 70 + 60, 0.95, 0.54, {
          w: Math.random() * 3 + 4,
          h: Math.random() * 4 + 6,
          color: petalColors[i % petalColors.length],
          flutter: Math.random() * Math.PI * 2,
          flutterSpeed: Math.random() * 3.5 + 2.5
        }));
      }

      // 3. Twinkle Stars / Sparkles (8 items) - 4-point radiant bursts
      for (let i = 0; i < 8; i++) {
        this.celebrationParticles.push(getParticle('star', w * 0.5 + (Math.random() - 0.5) * Math.min(260, w * 0.7), 65 + Math.random() * 45, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 50 - 15, 1.0, 0.68, {
          size: Math.random() * 4 + 4,
          color: i % 2 === 0 ? '#ffffff' : '#ffd700',
          twinkle: Math.random() * Math.PI * 2
        }));
      }
    }

    // ==========================================
    // SIGNATURE GAMEPLAY SYSTEMS IMPLEMENTATION
    // ==========================================

    // 1. ESCAPE ENERGY & ESCAPE MODE
    addEscapeEnergy(amount) {
      if (this.isEscapeMode) return;
      this.escapeEnergy = Math.min(100, (this.escapeEnergy || 0) + amount);
      if (this.escapeEnergy >= 100) {
        this.activateEscapeMode();
      }
    }

    activateEscapeMode() {
      this.isEscapeMode = true;
      this.escapeEnergy = 100;
      this.escapeModeTimer = this.escapeModeDuration;
      this.stats.totalEscapeModesActivated = (this.stats.totalEscapeModesActivated || 0) + 1;

      if (this.sound && typeof this.sound.playEscapeMode === 'function') {
        this.sound.playEscapeMode();
      }
      this.triggerHaptic([40, 60, 90]);
      this.showFloatingText('⚡ ESCAPE MODE ACTIVATED! ⚡', this.player.x, this.player.y - 48, '#00f0ff');
      if (this.notificationManager) {
        this.notificationManager.show({
          id: 'escape_mode',
          priority: 'HIGH',
          title: '⚡ ESCAPE MODE ACTIVATED',
          message: '2X SCORE OVERDRIVE',
          icon: '⚡',
          duration: 1500
        });
      }

      // Tactical burst particles
      const count = this.reducedMotion ? 8 : 16;
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        const spd = Math.random() * 90 + 50;
        this.spawnParticle({
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 3 + 2,
          color: i % 2 === 0 ? '#00f0ff' : '#ffd700',
          alpha: 1,
          decay: 2.5
        });
      }
    }

    // 2. NEAR MISS SYSTEM
    triggerNearMiss(obs) {
      const now = performance.now();
      const isCooldown = (this._lastNearMissTime && (now - this._lastNearMissTime < 1100));
      this._lastNearMissTime = now;

      this.nearMissesThisRun = (this.nearMissesThisRun || 0) + 1;
      this.stats.totalNearMisses = (this.stats.totalNearMisses || 0) + 1;
      const bonusScore = 150 * (this.isEscapeMode ? 2 : 1);
      this.score += bonusScore;
      this.addEscapeEnergy(8);

      if (!isCooldown) {
        if (this.sound && typeof this.sound.playNearMiss === 'function') {
          this.sound.playNearMiss();
        }
        this.triggerHaptic(20);
        this.showFloatingText('🔥 NEAR MISS! +150', this.player.x, this.player.y - 32, '#ffaa00');
      }

      // Near miss particle flare
      const pCount = this.reducedMotion ? 4 : 8;
      for (let i = 0; i < pCount; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 70 + 40;
        this.spawnParticle({
          x: this.player.x,
          y: this.player.y + (Math.random() - 0.5) * 10,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 2.5 + 1.5,
          color: Math.random() < 0.5 ? '#ffaa00' : '#ff0055',
          alpha: 1,
          decay: 3.5
        });
      }
    }

    // 3. ESCAPE EVENTS SYSTEM
    triggerEventWarning() {
      const eventTypes = [
        { type: 'SECURITY_ALERT', title: '⚠ SECURITY ALERT', sub: 'SURGE GRID DETECTED' },
        { type: 'FLOOR_COLLAPSE', title: '⚠ FLOOR COLLAPSE', sub: 'FAULT LINE DESTABILIZED' },
        { type: 'ESCAPE_SURGE', title: '🚨 ESCAPE EVENT', sub: 'CORE VOLTAGE SURGE' }
      ];
      this.currentEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      this.eventState = 'WARNING';
      this.eventWarningTimer = 2.0;

      if (this.sound && typeof this.sound.playEventAlert === 'function') {
        this.sound.playEventAlert();
      }
      this.triggerHaptic([30, 40]);

      const banner = document.getElementById('hud-event-alert');
      const titleEl = document.getElementById('event-alert-title');
      const subEl = document.getElementById('event-alert-sub');
      if (banner && titleEl && subEl) {
        titleEl.textContent = this.currentEvent.title;
        subEl.textContent = this.currentEvent.sub;
        banner.style.display = 'block';
        banner.classList.add('active');
      }
    }

    startEventActive() {
      this.eventState = 'ACTIVE';
      this.eventActiveTimer = 7.0; // 7 seconds event duration

      const subEl = document.getElementById('event-alert-sub');
      if (subEl) {
        subEl.textContent = 'EVENT ACTIVE — SURVIVE THE RUN!';
      }

      // Spawn a special event reward arc / high-reward formation
      const spawnX = (this.width || 400) + 120;
      this.spawnCoinWave(spawnX, this.groundY - 30, 8, 26);
    }

    completeEvent() {
      this.eventState = 'IDLE';
      const meters = Math.floor(this.distance / 10);
      // Rare progression-aware pacing: next event 1700m - 2500m later
      this.nextEventDistance = meters + 1700 + Math.floor(Math.random() * 800);
      this.eventCooldownTimer = 90.0; // Minimum 90 seconds continuous survival cooldown
      this.currentEvent = null;

      const banner = document.getElementById('hud-event-alert');
      if (banner) {
        banner.classList.remove('active');
        banner.style.display = 'none';
      }

      this.showFloatingText('EVENT SURVIVED! +750', this.player.x, this.player.y - 40, '#00f0ff');
      this.score += 750;
      this.addEscapeEnergy(25);
      if (this.sound && typeof this.sound.playCoin === 'function') {
        this.sound.playCoin();
      }
      this.triggerHaptic([30, 50]);
    }

    // 4. PERSONAL MILESTONES NOTIFICATION
    showMilestoneNotification(badgeText, mainText) {
      if (this.notificationManager) {
        this.notificationManager.show({
          id: badgeText + '_' + mainText,
          priority: 'MEDIUM',
          title: badgeText,
          message: mainText,
          icon: '🏁',
          duration: 1600
        });
      }
    }

    showLevelCompleteCelebration(completedLevel, newLevel, bonusCoins, meters) {
      // Audio & Haptics fanfare
      if (this.sound) {
        if (typeof this.sound.playAchievement === 'function') {
          this.sound.playAchievement();
        } else if (typeof this.sound.playTutorialSuccess === 'function') {
          this.sound.playTutorialSuccess();
        }
        setTimeout(() => {
          if (this.sound && typeof this.sound.playReward === 'function') {
            this.sound.playReward();
          }
        }, 360);
      }
      this.triggerHaptic([50, 75, 120]);

      const levelEnvNames = {
        1: 'Green Valley',
        2: 'Sunset Runway',
        3: 'Forest Twilight',
        4: 'Desert Mirage',
        5: 'Neon District',
        6: 'Quantum Overdrive'
      };
      const nextEnvName = levelEnvNames[newLevel] || 'Hyper Zone';

      // Populate Celebration Modal data
      const lvlNumEl = document.getElementById('celebration-level-name') || document.getElementById('celebration-level-num');
      if (lvlNumEl) lvlNumEl.textContent = `LEVEL ${completedLevel} CLEARED`;

      const bonusCoinsEl = document.getElementById('celebration-bonus-coins');
      if (bonusCoinsEl) bonusCoinsEl.textContent = `+${bonusCoins} COINS`;

      const distEl = document.getElementById('celebration-stat-dist');
      if (distEl) distEl.textContent = `${meters}m`;

      const runCoinsEl = document.getElementById('celebration-stat-run-coins');
      if (runCoinsEl) runCoinsEl.textContent = `${this.coinsThisRun}`;

      const nextNameEl = document.getElementById('celebration-next-name');
      if (nextNameEl) nextNameEl.textContent = `LEVEL ${newLevel}: ${nextEnvName.toUpperCase()}`;

      const nextDescEl = document.getElementById('celebration-next-desc');
      if (nextDescEl) {
        const descs = {
          2: 'Amber Glow • Faster Pace • Glowing Chevrons (1000m - 2100m)',
          3: 'Forest Twilight • Floating Electro-Mines (2100m - 3200m)',
          4: 'Desert Mirage • High-Reward Double Arches (3200m - 4300m)',
          5: 'Neon District • Velocity Surge & Pulsing Lasers (4300m - 5400m)',
          6: 'Quantum Overdrive • Maximum Reflex Challenge (5400m - 6500m)'
        };
        nextDescEl.textContent = descs[newLevel] || 'Maximum Velocity • Extreme Reflexes';
      }

      // Start celebratory confetti particles
      this.startLevelConfetti();

      // Open celebration modal
      this.openModalById('level-complete-modal', false);
    }

    resumeFromLevelComplete() {
      // Cleanly dismiss modal and confetti
      this.stopLevelConfetti();
      const modal = document.getElementById('level-complete-modal');
      if (modal) modal.classList.remove('active');

      // Grant runner 2.0s invulnerability grace period to guarantee safe restart
      this.player.invincibleTimer = Math.max(this.player.invincibleTimer || 0, 2.0);

      // Return state to playing & resume music
      this.state = STATE.PLAYING;
      if (this.sound) {
        this.sound.startMusic();
        if (typeof this.sound.playPowerup === 'function') {
          this.sound.playPowerup();
        }
      }

      this.triggerHaptic(25);
      this.showFloatingText('GO!', this.player.x, this.player.y - 45, '#00ff88');
      this.updateUI();
      this.updateHUD();
    }

    startLevelConfetti() {
      this.stopLevelConfetti();
      const canvas = document.getElementById('level-confetti-canvas') || document.getElementById('celebration-confetti-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth || 400;
      const height = rect.height || window.innerHeight || 600;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const colors = ['#ffd700', '#ffaa00', '#00e5ff', '#ff3366', '#00ff88', '#b388ff', '#ffffff'];
      const particles = [];
      const count = 24;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: -15 - Math.random() * (height * 0.35),
          vx: (Math.random() - 0.5) * 2.0,
          vy: 2.2 + Math.random() * 3.2,
          size: 5 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
          wobble: Math.random() * 10
        });
      }

      let startTime = performance.now();
      const animate = (now) => {
        if (!this._confettiAnimId) return;
        if (now - startTime > 2400) {
          this.stopLevelConfetti();
          return;
        }

        ctx.clearRect(0, 0, width, height);
        let anyVisible = false;
        for (const p of particles) {
          p.x += p.vx + Math.sin(p.wobble) * 0.7;
          p.y += p.vy;
          p.wobble += 0.08;
          p.rotation += p.rotSpeed;
          if (p.y < height + 30) anyVisible = true;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }

        if (anyVisible) {
          this._confettiAnimId = requestAnimationFrame(animate);
        } else {
          this.stopLevelConfetti();
        }
      };

      this._confettiAnimId = requestAnimationFrame(animate);
    }

    stopLevelConfetti() {
      if (this._confettiAnimId) {
        cancelAnimationFrame(this._confettiAnimId);
        this._confettiAnimId = null;
      }
      const c1 = document.getElementById('level-confetti-canvas');
      if (c1) {
        const ctx1 = c1.getContext('2d');
        if (ctx1) ctx1.clearRect(0, 0, c1.width, c1.height);
      }
      const c2 = document.getElementById('celebration-confetti-canvas');
      if (c2) {
        const ctx2 = c2.getContext('2d');
        if (ctx2) ctx2.clearRect(0, 0, c2.width, c2.height);
      }
    }

    recoverTutorialBall(reason = 'fall') {
      // 1. Reset ball coordinates & physics immediately
      this.player.radius = Math.max(10, Math.min(12.5, (this.width || 400) * 0.03));
      this.player.x = Math.max(48, Math.round((this.width || 400) * 0.18));
      this.player.y = this.groundY - this.player.radius;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsRemaining = 2;
      this.player.invincibleTimer = 1.2;
      this.player.squashX = 1.0;
      this.player.squashY = 1.0;
      this.player.motionTrail = [];

      // 2. Ensure continuous solid platform runway spanning backwards and forwards
      this.platforms = [{
        x: -200,
        y: this.groundY,
        width: (this.width || 400) + 3000,
        height: 200
      }];
      this.nextPlatformX = (this.width || 400) + 2800;

      // 3. Clear active obstacles & give safe buffer
      this.obstacles = [];
      this.tutorialNextSpawnX = 140;
      this.tutorialJumped = false;
      this.tutorialStepCompleteTimer = 0;

      if (this.tutorialStep === 3) {
        this.collectibles = [];
        this.tutorialCoinsCollected = 0;
      }

      // 4. Instructional feedback
      if (this.sound && typeof this.sound.playLand === 'function') {
        this.sound.playLand();
      }
      this.triggerHaptic([30, 40]);
      this.showFloatingText('TRY AGAIN! TAP TO JUMP', this.player.x, this.player.y - 38, '#00f0ff');

      // 5. Update tutorial HUD to reflect current step instructions
      this.updateTutorialHUD();

      // 6. Force immediate render so player sees the ball instantly
      this.render();
    }

    updateUI() {
      const welcomeScreen = document.getElementById('welcome-screen');
      const guidePromptScreen = document.getElementById('guide-prompt-screen');
      const guideModal = document.getElementById('guide-modal');
      const menuScreen = document.getElementById('menu-screen');
      const pauseScreen = document.getElementById('pause-screen');
      const gameOverScreen = document.getElementById('gameover-screen');
      const hud = document.getElementById('ui-layer');
      const menuBest = document.getElementById('menu-best-score');
      const menuName = document.getElementById('menu-player-name');

      if (menuBest) menuBest.textContent = this.stats.bestScore;
      const displayName = (this.playerName && this.playerName.trim()) ? this.playerName.trim().toUpperCase() : 'RUNNER';
      if (menuName) menuName.textContent = displayName;

      if (this.state === STATE.PLAYING || this.state === STATE.WELCOME || this.state === STATE.TUTORIAL) {
        this.closeAllModals(true);
      }

      if (welcomeScreen) welcomeScreen.classList.toggle('active', this.state === STATE.WELCOME);
      if (guidePromptScreen) guidePromptScreen.classList.toggle('active', this.state === STATE.GUIDE_PROMPT);
      if (guideModal && this.state !== STATE.GUIDE) guideModal.classList.remove('active');
      if (menuScreen) menuScreen.classList.toggle('active', this.state === STATE.MENU);
      if (pauseScreen) pauseScreen.classList.toggle('active', this.state === STATE.PAUSED);
      if (gameOverScreen) gameOverScreen.classList.toggle('active', this.state === STATE.GAME_OVER);
      if (hud) hud.style.display = (this.state === STATE.PLAYING) ? 'flex' : 'none';

      const tutOverlay = document.getElementById('tutorial-hud-overlay');
      if (tutOverlay) {
        tutOverlay.classList.toggle('active', this.state === STATE.TUTORIAL);
      }

      this.updateOrbVisuals();
    }

    handleWelcomeContinue() {
      const input = document.getElementById('input-player-name');
      const errorEl = document.getElementById('name-input-error');
      if (!input) return;

      const raw = input.value || '';
      const trimmed = raw.trim().replace(/\s+/g, ' ');

      if (!trimmed || trimmed.length === 0) {
        if (errorEl) {
          errorEl.textContent = 'Please enter your name';
          errorEl.style.display = 'block';
        }
        input.classList.add('input-error');
        input.focus();
        return;
      }

      if (errorEl) errorEl.style.display = 'none';
      input.classList.remove('input-error');

      this.playerName = trimmed.substring(0, 14);
      try {
        localStorage.setItem('crazyballrush_player_name', this.playerName);
      } catch (err) {
        console.warn('Storage save exception:', err);
      }
      this.saveStorage();

      const menuName = document.getElementById('menu-player-name');
      if (menuName) menuName.textContent = this.playerName.toUpperCase();
      const statName = document.getElementById('stat-player-name');
      if (statName) statName.textContent = this.playerName;

      input.blur();

      // Flow: If returning user who completed tutorial, go to MENU.
      // If NEW USER: IMMEDIATELY start the interactive tutorial mini-level!
      if (this.tutorialSeen) {
        this.state = STATE.MENU;
        this.updateUI();
      } else {
        this.startTutorial(true);
      }
    }

    // MODAL DIALOGS
    renderCustomizationModal() {
      const modal = document.getElementById('customization-modal');
      if (!modal) return;
      const list = document.getElementById('orb-list-container');
      list.innerHTML = '';

      // Update tab buttons active state
      const tabOrbs = document.getElementById('tab-custom-orbs');
      const tabShapes = document.getElementById('tab-custom-shapes');
      const tabBgs = document.getElementById('tab-custom-backgrounds');

      if (tabOrbs) tabOrbs.classList.toggle('active', this.customizationTab === 'orbs');
      if (tabShapes) tabShapes.classList.toggle('active', this.customizationTab === 'shapes');
      if (tabBgs) tabBgs.classList.toggle('active', this.customizationTab === 'backgrounds');

      const sessionMins = Math.floor(this.sessionSeconds / 60);

      if (this.customizationTab === 'orbs') {
        // Render 7 Orbs
        Object.values(ORB_STYLES).forEach(orb => {
          const isUnlocked = orb.isUnlocked(this.stats, sessionMins);
          const isSelected = this.selectedOrbId === orb.id;

          const card = document.createElement('div');
          card.className = `orb-card ${isSelected ? 'selected' : ''}`;

          let statusBtnClass = 'locked';
          let statusBtnText = 'LOCKED';
          if (isSelected) {
            statusBtnClass = 'equipped';
            statusBtnText = 'SELECTED';
          } else if (isUnlocked) {
            statusBtnClass = 'unlocked';
            statusBtnText = 'SELECT';
          }

          card.innerHTML = `
            <div class="orb-card-left">
              <div class="orb-avatar-circle" style="color: ${orb.glowColor}; background: radial-gradient(circle, #fff 0%, ${orb.glowColor} 70%);">
                <div class="orb-avatar-inner" style="background: radial-gradient(circle, #fff, ${orb.trailColor});"></div>
              </div>
              <div class="orb-card-meta">
                <div class="orb-card-name" style="color: ${orb.glowColor};">${orb.name}</div>
                <div class="orb-card-desc">${isUnlocked ? '✓ UNLOCKED' : orb.unlockDesc}</div>
              </div>
            </div>
            <button class="orb-select-btn ${statusBtnClass}" data-id="${orb.id}">
              ${statusBtnText}
            </button>
          `;

          const btn = card.querySelector('.orb-select-btn');
          if (btn && isUnlocked && !isSelected) {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              this.selectedOrbId = orb.id;
              this.saveStorage();
              if (this.sound) this.sound.playButton();
              this.updateOrbVisuals();
              this.renderCustomizationModal();
            });
          }

          list.appendChild(card);
        });
      } else if (this.customizationTab === 'shapes') {
        // Render Geometric Shapes
        Object.values(SHAPES).forEach(shape => {
          let isUnlocked = (shape.id === 'circle');
          if (shape.id === 'square' && (this.achievements.survivor || this.achievements.untouchable)) isUnlocked = true;
          if (shape.id === 'diamond' && this.achievements.firstJump) isUnlocked = true;
          if (shape.id === 'hexagon' && this.achievements.hazardDodger) isUnlocked = true;
          if (shape.id === 'star' && this.achievements.comboMaster) isUnlocked = true;

          const isSelected = this.selectedShapeId === shape.id;

          const card = document.createElement('div');
          card.className = `orb-card ${isSelected ? 'selected' : ''}`;

          let statusBtnClass = 'locked';
          let statusBtnText = 'LOCKED';
          if (isSelected) {
            statusBtnClass = 'equipped';
            statusBtnText = 'SELECTED';
          } else if (isUnlocked) {
            statusBtnClass = 'unlocked';
            statusBtnText = 'SELECT';
          }

          card.innerHTML = `
            <div class="orb-card-left">
              <div class="orb-avatar-circle" style="color: var(--cyan); background: rgba(0, 240, 255, 0.1); border: 2px solid var(--cyan); font-size: 1.4rem;">
                ${shape.symbol}
              </div>
              <div class="orb-card-meta">
                <div class="orb-card-name" style="color: var(--cyan);">${shape.name}</div>
                <div class="orb-card-desc">${isUnlocked ? '✓ UNLOCKED' : shape.desc}</div>
              </div>
            </div>
            <button class="orb-select-btn ${statusBtnClass}" data-id="${shape.id}">
              ${statusBtnText}
            </button>
          `;

          const btn = card.querySelector('.orb-select-btn');
          if (btn && isUnlocked && !isSelected) {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              this.selectedShapeId = shape.id;
              this.saveStorage();
              if (this.sound) this.sound.playButton();
              this.renderCustomizationModal();
            });
          }

          list.appendChild(card);
        });
      } else if (this.customizationTab === 'backgrounds') {
        // Render 6 Parallax Background Themes
        // Default (auto-cycle)
        const isAutoSelected = this.selectedThemeIndex === -1;
        const autoCard = document.createElement('div');
        autoCard.className = `orb-card ${isAutoSelected ? 'selected' : ''}`;
        autoCard.innerHTML = `
          <div class="orb-card-left">
            <div class="orb-avatar-circle" style="background: linear-gradient(135deg, #00ff88, #ff0077, #00f0ff); font-size: 1.2rem;">
              🔄
            </div>
            <div class="orb-card-meta">
              <div class="orb-card-name" style="color: #fff;">Dynamic Auto-Cycle</div>
              <div class="orb-card-desc">Seamlessly transitions across all zones during your run</div>
            </div>
          </div>
          <button class="orb-select-btn ${isAutoSelected ? 'equipped' : 'unlocked'}">
            ${isAutoSelected ? 'SELECTED' : 'SELECT'}
          </button>
        `;
        const autoBtn = autoCard.querySelector('.orb-select-btn');
        if (autoBtn && !isAutoSelected) {
          autoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectedThemeIndex = -1;
            this.saveStorage();
            if (this.sound) this.sound.playButton();
            this.renderCustomizationModal();
          });
        }
        list.appendChild(autoCard);

        THEMES.forEach((theme, idx) => {
          let isUnlocked = (idx === 0); // Green Valley default
          if (idx === 1 && this.achievements.coinCollector) isUnlocked = true; // Sunset
          if (idx === 2 && this.achievements.survivor) isUnlocked = true; // Forest
          if (idx === 3 && this.achievements.speedDemon) isUnlocked = true; // Desert
          if (idx === 4) isUnlocked = true; // Neon Night
          if (idx === 5 && this.achievements.longRun) isUnlocked = true; // Futuristic City

          const isSelected = (this.selectedThemeIndex === idx);

          const card = document.createElement('div');
          card.className = `orb-card ${isSelected ? 'selected' : ''}`;

          let statusBtnClass = 'locked';
          let statusBtnText = 'LOCKED';
          let descText = 'Locked';
          if (idx === 1) descText = 'Reward for Coin Collector';
          if (idx === 2) descText = 'Reward for Survivor (60s)';
          if (idx === 3) descText = 'Reward for Speed Demon';
          if (idx === 5) descText = 'Reward for Orbit Master (1500 pts)';

          if (isSelected) {
            statusBtnClass = 'equipped';
            statusBtnText = 'SELECTED';
          } else if (isUnlocked) {
            statusBtnClass = 'unlocked';
            statusBtnText = 'SELECT';
          }

          card.innerHTML = `
            <div class="orb-card-left">
              <div class="orb-avatar-circle" style="background: linear-gradient(180deg, ${theme.skyTop}, ${theme.groundTop}); border: 1px solid ${theme.accent};">
              </div>
              <div class="orb-card-meta">
                <div class="orb-card-name" style="color: ${theme.accent};">${theme.name}</div>
                <div class="orb-card-desc">${isUnlocked ? '✓ UNLOCKED' : descText}</div>
              </div>
            </div>
            <button class="orb-select-btn ${statusBtnClass}">
              ${statusBtnText}
            </button>
          `;

          const btn = card.querySelector('.orb-select-btn');
          if (btn && isUnlocked && !isSelected) {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              this.selectedThemeIndex = idx;
              this.saveStorage();
              if (this.sound) this.sound.playButton();
              this.renderCustomizationModal();
            });
          }

          list.appendChild(card);
        });
      }

      modal.classList.add('active');
    }

    openCustomizationModal() {
      this.openModalById('customization-modal', true);
    }

    closeCustomizationModal() {
      this.closeCurrentModal();
    }

    renderSessionRewardModal() {
      const modal = document.getElementById('session-reward-modal');
      if (!modal) return;

      const list = document.getElementById('session-milestones-container');
      list.innerHTML = '';
      const sessionMins = Math.floor(this.sessionSeconds / 60);

      this.sessionMilestones.forEach(m => {
        const isClaimed = this.stats.claimedMilestones && this.stats.claimedMilestones.includes(m.id);
        const isReached = sessionMins >= m.mins;

        const item = document.createElement('div');
        item.className = 'session-milestone-item';

        let btnHtml = '';
        if (isClaimed) {
          btnHtml = `<span style="color: var(--text-dim); font-size: 0.8rem; font-weight: 700;">CLAIMED ✓</span>`;
        } else if (isReached) {
          btnHtml = `<button class="btn-primary btn-claim" data-id="${m.id}" style="width: auto; padding: 6px 14px; font-size: 0.8rem; margin: 0;">CLAIM</button>`;
        } else {
          btnHtml = `<span style="color: var(--text-dim); font-size: 0.8rem;">IN ${m.mins - sessionMins}m</span>`;
        }

        item.innerHTML = `
          <div class="milestone-meta">
            <div class="milestone-icon">${isClaimed ? '🎁' : (isReached ? '✨' : '⏳')}</div>
            <div>
              <div class="milestone-title">${m.title}</div>
              <div class="milestone-reward">${m.rewardText}</div>
            </div>
          </div>
          <div>${btnHtml}</div>
        `;

        const claimBtn = item.querySelector('.btn-claim');
        if (claimBtn) {
          claimBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.stats.claimedMilestones.push(m.id);
            this.stats.totalCoins += m.coins;
            if (m.orb) {
              this.showToast('ORB UNLOCKED!', 'Pink Energy Orb is now ready to equip!');
            }
            if (this.sound) this.sound.playReward();
            this.saveStorage();
            this.renderSessionRewardModal();
            this.updateSessionTimer();
          });
        }

        list.appendChild(item);
      });

      modal.classList.add('active');
    }

    openSessionRewardModal() {
      this.openModalById('session-reward-modal', true);
    }

    closeSessionRewardModal() {
      this.closeCurrentModal();
    }

    renderStatsModal() {
      try {
        const m = document.getElementById('stats-modal');
        if (!m) return;
        const setSafeText = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        };
        setSafeText('stat-player-name', this.playerName || 'Runner');
        const currentDist = Math.floor((this.distance || 0) / 10);
        const bestDist = (this.stats && typeof this.stats.bestDistance === 'number') ? this.stats.bestDistance : Math.floor((this.stats.bestScore || 0) / 4);
        const activeLevel = (this.state === STATE.PLAYING || this.state === STATE.PAUSED) ? (this.currentLevel || 1) : this.getLevelFromDistance(bestDist);
        setSafeText('stat-player-level', `LEVEL ${activeLevel} RUNNER`);
        setSafeText('stat-total-runs', this.stats.totalRuns || 0);
        setSafeText('stat-best-score', this.stats.bestScore || 0);
        setSafeText('stat-best-distance', `${bestDist}m`);
        setSafeText('stat-current-distance', `${currentDist}m`);
        setSafeText('stat-total-coins', this.stats.totalCoins || 0);
        setSafeText('stat-longest-survival', `${this.stats.longestSurvival || 0}s`);
        setSafeText('stat-highest-level', `Level ${this.stats.highestLevel || activeLevel || 1}`);
        setSafeText('stat-tutorial-status', this.tutorialSeen ? 'COMPLETED ✓' : 'PENDING');
        setSafeText('stat-obstacles-avoided', this.stats.totalObstaclesAvoided || 0);
        setSafeText('stat-highest-combo', `x${this.stats.highestCombo || 1}`);

        const sessionMins = Math.floor(this.sessionSeconds / 60);
        let unlockedBalls = 0;
        Object.values(ORB_STYLES).forEach(orb => {
          if (typeof orb.isUnlocked === 'function' && orb.isUnlocked(this.stats, sessionMins)) unlockedBalls++;
        });
        setSafeText('stat-unlocked-orbs', `Orbs: ${unlockedBalls}/7`);
        setSafeText('stat-balls-unlocked', `${unlockedBalls}/7`);

        let unlockedThemes = 0;
        THEMES.forEach((t, idx) => {
          let isUnlocked = (idx === 0);
          if (idx === 1 && this.achievements.coinCollector) isUnlocked = true;
          if (idx === 2 && this.achievements.survivor) isUnlocked = true;
          if (idx === 3 && this.achievements.speedDemon) isUnlocked = true;
          if (idx === 4) isUnlocked = true;
          if (idx === 5 && this.achievements.longRun) isUnlocked = true;
          if (isUnlocked) unlockedThemes++;
        });
        setSafeText('stat-themes-unlocked', `${unlockedThemes}/6`);

        let unlockedShapes = 0;
        Object.values(SHAPES).forEach(s => {
          let isUnlocked = (s.id === 'circle');
          if (s.id === 'square' && (this.achievements.survivor || this.achievements.untouchable)) isUnlocked = true;
          if (s.id === 'diamond' && this.achievements.firstJump) isUnlocked = true;
          if (s.id === 'hexagon' && this.achievements.hazardDodger) isUnlocked = true;
          if (s.id === 'star' && this.achievements.comboMaster) isUnlocked = true;
          if (isUnlocked) unlockedShapes++;
        });
        setSafeText('stat-shapes-unlocked', `${unlockedShapes}/${Object.keys(SHAPES).length}`);

        let unlockedAchievements = 0;
        Object.keys(ACHIEVEMENTS_DEF).forEach(k => {
          if (this.achievements[k]) unlockedAchievements++;
        });
        setSafeText('stat-achievements-unlocked', `${unlockedAchievements}/${Object.keys(ACHIEVEMENTS_DEF).length}`);

        this.updateOrbVisuals();
        this.updateFacebookUI();
        m.classList.add('active');
      } catch (err) {
        console.error('Error in renderStatsModal:', err);
        const m = document.getElementById('stats-modal');
        if (m) m.classList.add('active');
      }
    }

    openStatsModal() {
      this.openModalById('stats-modal', true);
    }

    closeStatsModal() {
      this.closeCurrentModal();
    }

    renderAchievementsModal() {
      const m = document.getElementById('achievements-modal');
      if (!m) return;
      const list = document.getElementById('achievements-container');
      if (!list) return;
      list.innerHTML = '';

      Object.values(ACHIEVEMENTS_DEF).forEach(def => {
        const unlocked = !!this.achievements[def.key];
        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? 'unlocked' : ''}`;
        item.innerHTML = `
          <div class="ach-icon-box" style="font-size: 1.2rem;">${unlocked ? (def.icon || '✓') : '🔒'}</div>
          <div class="ach-info" style="flex: 1;">
            <div class="ach-name" style="color: ${unlocked ? 'var(--emerald)' : '#fff'};">${def.name}</div>
            <div class="ach-desc">${def.desc}</div>
            <div style="font-size: 0.75rem; color: ${unlocked ? 'var(--cyan)' : 'var(--text-dim)'}; margin-top: 2px;">
              Reward: ${def.rewardText}
            </div>
          </div>
          ${unlocked ? `<button class="btn-share-ach btn-secondary" data-key="${def.key}" style="width: auto; padding: 4px 10px; font-size: 0.75rem; margin-bottom: 0;">📤 SHARE</button>` : ''}
        `;
        list.appendChild(item);
      });

      list.querySelectorAll('.btn-share-ach').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const key = btn.getAttribute('data-key');
          this.shareAchievement(key);
        });
      });

      m.classList.add('active');
    }

    openAchievementsModal() {
      this.openModalById('achievements-modal', true);
    }

    closeAchievementsModal() {
      this.closeCurrentModal();
    }

    updateFacebookUI() {
      const isConnected = !!(this.facebookConnected && this.facebookUserName);
      const userText = isConnected ? `Connected as ${this.facebookUserName}` : 'Not Connected';
      const btnText = isConnected ? 'Disconnect' : 'Connect Facebook';

      // Settings screen
      const fbLabel = document.getElementById('fb-status-label');
      const fbBtn = document.getElementById('btn-toggle-facebook');
      if (fbLabel) {
        fbLabel.textContent = userText;
        fbLabel.style.color = isConnected ? 'var(--emerald)' : 'var(--text-dim)';
      }
      if (fbBtn) {
        fbBtn.textContent = btnText;
        if (isConnected) {
          fbBtn.style.borderColor = 'rgba(255, 0, 85, 0.4)';
          fbBtn.style.color = 'var(--magenta)';
        } else {
          fbBtn.style.borderColor = 'rgba(24, 119, 242, 0.6)';
          fbBtn.style.color = '#fff';
        }
      }

      // Profile modal
      const fbProfLabel = document.getElementById('fb-profile-status-label');
      const fbProfBtn = document.getElementById('btn-toggle-facebook-profile');
      if (fbProfLabel) {
        fbProfLabel.textContent = userText;
        fbProfLabel.style.color = isConnected ? 'var(--emerald)' : 'var(--text-dim)';
      }
      if (fbProfBtn) {
        fbProfBtn.textContent = btnText;
        if (isConnected) {
          fbProfBtn.style.borderColor = 'rgba(255, 0, 85, 0.4)';
          fbProfBtn.style.color = 'var(--magenta)';
        } else {
          fbProfBtn.style.borderColor = 'rgba(24, 119, 242, 0.6)';
          fbProfBtn.style.color = '#fff';
        }
      }
    }

    updateFacebookSettingsUI() {
      this.updateFacebookUI();
    }

    renderSettingsModal() {
      const m = document.getElementById('settings-modal');
      if (!m) return;
      const soundCheck = document.getElementById('setting-sound');
      const musicCheck = document.getElementById('setting-music');
      const hapticCheck = document.getElementById('setting-haptics');
      const motionCheck = document.getElementById('setting-reduced-motion');
      if (soundCheck && this.sound) soundCheck.checked = !!this.sound.soundEnabled;
      if (musicCheck && this.sound) musicCheck.checked = !!this.sound.musicEnabled;
      if (hapticCheck) hapticCheck.checked = !!this.hapticsEnabled;
      if (motionCheck) motionCheck.checked = !!this.reducedMotion;

      const onBtn = document.getElementById('btn-haptic-on');
      const offBtn = document.getElementById('btn-haptic-off');
      if (onBtn) onBtn.classList.toggle('active', this.hapticsEnabled);
      if (offBtn) offBtn.classList.toggle('active', !this.hapticsEnabled);

      this.updateFacebookUI();

      ['low', 'normal', 'high'].forEach(s => {
        const btn = document.getElementById(`btn-speed-${s}`);
        if (btn) btn.classList.toggle('active', s === this.gameSpeedSetting);
      });

      const darkBtn = document.getElementById('btn-theme-dark');
      const lightBtn = document.getElementById('btn-theme-light');
      if (darkBtn && lightBtn) {
        darkBtn.classList.toggle('active', this.themeMode === 'dark');
        lightBtn.classList.toggle('active', this.themeMode === 'light');
      }

      m.classList.add('active');
    }

    openSettingsModal() {
      this.openModalById('settings-modal', true);
    }

    closeSettingsModal() {
      this.closeCurrentModal();
    }

    // =========================================================
    // DAILY MISSIONS ENGINE
    // =========================================================
    getTodayDateString() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    initDailyMissions() {
      const today = this.getTodayDateString();
      try {
        let stored = localStorage.getItem('crazyballrush_daily_missions');
        if (!stored) stored = localStorage.getItem('escaperun_daily_missions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.date === today && Array.isArray(parsed.missions)) {
            this.dailyMissionsData = parsed;
            this.updateMissionsBadge();
            return;
          }
        }
      } catch (e) {
        console.warn('Error reading daily missions:', e);
      }

      this.dailyMissionsData = {
        date: today,
        missions: [
          {
            id: 'daily_coins_50',
            type: 'coins',
            title: 'Collect 50 Energy Coins',
            icon: '⚡',
            target: 50,
            current: 0,
            rewardCoins: 50,
            claimed: false
          },
          {
            id: 'daily_score_1000',
            type: 'score',
            title: 'Reach Score of 1,000',
            icon: '🎯',
            target: 1000,
            current: 0,
            rewardCoins: 75,
            claimed: false
          },
          {
            id: 'daily_survive_60',
            type: 'survival',
            title: 'Survive for 60 Seconds',
            icon: '⏱️',
            target: 60,
            current: 0,
            rewardCoins: 100,
            claimed: false
          }
        ]
      };
      this.saveDailyMissions();
      this.updateMissionsBadge();
    }

    saveDailyMissions() {
      try {
        if (this.dailyMissionsData) {
          localStorage.setItem('crazyballrush_daily_missions', JSON.stringify(this.dailyMissionsData));
        }
      } catch (e) {}
    }

    updateDailyMissionProgress(type, amount, isMax = false) {
      if (!this.dailyMissionsData || !this.dailyMissionsData.missions) return;
      let changed = false;
      this.dailyMissionsData.missions.forEach(m => {
        if (m.type === type && !m.claimed) {
          const prev = m.current;
          if (isMax) {
            m.current = Math.max(m.current, amount);
          } else {
            m.current += amount;
          }
          if (m.current > m.target) m.current = m.target;
          if (m.current !== prev) changed = true;
          if (m.current >= m.target && prev < m.target) {
            this.showToast('MISSION READY!', m.title, '📋');
            if (this.sound && typeof this.sound.playAchievement === 'function') {
              this.sound.playAchievement();
            }
          }
        }
      });
      if (changed) {
        this.saveDailyMissions();
        this.updateMissionsBadge();
      }
    }

    updateMissionsBadge() {
      const badge = document.getElementById('daily-missions-badge');
      if (!badge || !this.dailyMissionsData) return;
      const hasClaimable = this.dailyMissionsData.missions.some(m => !m.claimed && m.current >= m.target);
      badge.style.display = hasClaimable ? 'inline-block' : 'none';
    }

    renderDailyMissionsModal() {
      const m = document.getElementById('daily-missions-modal');
      if (!m || !this.dailyMissionsData) return;
      const container = document.getElementById('daily-missions-container');
      if (!container) return;
      container.innerHTML = '';

      this.dailyMissionsData.missions.forEach(mission => {
        const pct = Math.min(100, Math.round((mission.current / mission.target) * 100));
        const isComplete = mission.current >= mission.target;
        const card = document.createElement('div');
        card.className = `daily-mission-card ${isComplete ? 'completed' : ''}`;
        card.innerHTML = `
          <div class="daily-mission-header">
            <div class="daily-mission-title-wrap">
              <span class="daily-mission-icon">${mission.icon}</span>
              <span class="daily-mission-title">${mission.title}</span>
            </div>
            <span class="daily-mission-reward-badge">+${mission.rewardCoins} ⚡</span>
          </div>
          <div class="daily-mission-progress-bar-wrap">
            <div class="daily-mission-progress-bar" style="width: ${pct}%;"></div>
          </div>
          <div class="daily-mission-footer">
            <span class="daily-mission-count">${mission.current} / ${mission.target}</span>
            ${mission.claimed
              ? '<span class="mission-claimed-tag">✓ COMPLETED</span>'
              : (isComplete
                  ? `<button class="btn-claim-mission" data-id="${mission.id}">CLAIM</button>`
                  : `<span style="font-size: 0.8rem; color: var(--text-dim);">${pct}%</span>`
                )
            }
          </div>
        `;
        container.appendChild(card);
      });

      container.querySelectorAll('.btn-claim-mission').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          this.claimDailyMission(id);
        });
      });

      m.classList.add('active');
    }

    openDailyMissionsModal() {
      this.openModalById('daily-missions-modal', true);
    }

    claimDailyMission(id) {
      if (!this.dailyMissionsData) return;
      const mission = this.dailyMissionsData.missions.find(m => m.id === id);
      if (!mission || mission.claimed || mission.current < mission.target) return;

      mission.claimed = true;
      this.stats.totalCoins += mission.rewardCoins;
      this.saveStorage();
      this.saveDailyMissions();
      this.updateMissionsBadge();
      this.triggerHaptic([30, 40, 60]);
      if (this.sound) this.sound.playReward();
      this.showToast('MISSION CLAIMED!', `+${mission.rewardCoins} Energy Coins`, '🎁');
      this.renderDailyMissionsModal();
    }

    closeDailyMissionsModal() {
      this.closeCurrentModal();
    }

    // =========================================================
    // DAILY LOGIN REWARD ENGINE
    // =========================================================
    initDailyLoginReward() {
      try {
        let stored = localStorage.getItem('crazyballrush_daily_login');
        if (!stored) stored = localStorage.getItem('escaperun_daily_login');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            this.dailyLoginData = parsed;
          }
        }
      } catch (e) {}

      if (!this.dailyLoginData) {
        this.dailyLoginData = {
          lastClaimDate: '',
          dayStreak: 1
        };
      }

      this.dailyLoginRewards = [
        { day: 1, coins: 50, title: 'Day 1', icon: '⚡' },
        { day: 2, coins: 80, title: 'Day 2', icon: '🔋' },
        { day: 3, coins: 120, title: 'Day 3', icon: '💎' },
        { day: 4, coins: 160, title: 'Day 4', icon: '✨' },
        { day: 5, coins: 200, title: 'Day 5', icon: '🌟' },
        { day: 6, coins: 250, title: 'Day 6', icon: '🚀' },
        { day: 7, coins: 400, title: 'Day 7 Super Pack', icon: '👑' }
      ];

      this.updateDailyLoginBadge();
    }

    saveDailyLogin() {
      try {
        if (this.dailyLoginData) {
          localStorage.setItem('crazyballrush_daily_login', JSON.stringify(this.dailyLoginData));
        }
      } catch (e) {}
    }

    isDailyRewardAvailable() {
      if (!this.dailyLoginData) return false;
      const today = this.getTodayDateString();
      return this.dailyLoginData.lastClaimDate !== today;
    }

    updateDailyLoginBadge() {
      const badge = document.getElementById('daily-login-badge');
      if (badge) {
        badge.style.display = this.isDailyRewardAvailable() ? 'inline-block' : 'none';
      }
    }

    renderDailyRewardModal() {
      const m = document.getElementById('daily-reward-modal');
      if (!m) return;
      const grid = document.getElementById('daily-rewards-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const today = this.getTodayDateString();
      const isClaimedToday = this.dailyLoginData.lastClaimDate === today;
      const currentDay = this.dailyLoginData.dayStreak || 1;

      this.dailyLoginRewards.forEach(item => {
        const isCurrent = item.day === currentDay;
        const isPast = item.day < currentDay || (isCurrent && isClaimedToday);
        const slot = document.createElement('div');
        slot.className = `daily-reward-slot ${item.day === 7 ? 'day-7' : ''} ${isCurrent && !isClaimedToday ? 'active-today' : ''} ${isPast ? 'claimed-slot' : ''}`;
        slot.innerHTML = `
          <div class="daily-reward-slot-day">${item.title}</div>
          <div class="daily-reward-slot-icon">${item.icon}</div>
          <div class="daily-reward-slot-coins">+${item.coins}</div>
          <div style="font-size: 0.65rem; color: ${isPast ? 'var(--emerald)' : (isCurrent && !isClaimedToday ? 'var(--amber)' : 'var(--text-dim)')};">
            ${isPast ? '✓ CLAIMED' : (isCurrent && !isClaimedToday ? 'READY' : 'LOCKED')}
          </div>
        `;
        grid.appendChild(slot);
      });

      const claimBtn = document.getElementById('btn-claim-daily-reward');
      if (claimBtn) {
        if (isClaimedToday) {
          claimBtn.disabled = true;
          claimBtn.style.opacity = '0.5';
          claimBtn.style.cursor = 'default';
          claimBtn.textContent = 'CLAIMED TODAY ✓';
        } else {
          claimBtn.disabled = false;
          claimBtn.style.opacity = '1';
          claimBtn.style.cursor = 'pointer';
          const rewardAmount = (this.dailyLoginRewards.find(r => r.day === currentDay) || this.dailyLoginRewards[0]).coins;
          claimBtn.textContent = `CLAIM +${rewardAmount} COINS`;
        }
      }

      m.classList.add('active');
    }

    openDailyRewardModal() {
      this.openModalById('daily-reward-modal', true);
    }

    claimDailyReward() {
      if (!this.isDailyRewardAvailable()) return;
      const currentDay = this.dailyLoginData.dayStreak || 1;
      const reward = this.dailyLoginRewards.find(r => r.day === currentDay) || this.dailyLoginRewards[0];

      this.stats.totalCoins += reward.coins;
      this.dailyLoginData.lastClaimDate = this.getTodayDateString();
      this.dailyLoginData.dayStreak = (currentDay >= 7) ? 1 : currentDay + 1;

      this.saveStorage();
      this.saveDailyLogin();
      this.updateDailyLoginBadge();
      this.triggerHaptic([40, 50, 80]);
      if (this.sound) this.sound.playReward();
      this.showToast('DAILY REWARD CLAIMED!', `+${reward.coins} Energy Coins added!`, '🎁');
      this.renderDailyRewardModal();
    }

    closeDailyRewardModal() {
      this.closeCurrentModal();
    }

    // =========================================================
    // LEADERBOARD ENGINE
    // =========================================================
    renderLeaderboardModal() {
      const m = document.getElementById('leaderboard-modal');
      if (!m) return;
      const container = document.getElementById('leaderboard-container');
      if (!container) return;
      container.innerHTML = '';

      const champions = [
        { name: 'CyberAce', score: 5430 },
        { name: 'NeonViper', score: 4820 },
        { name: 'PulseRunner', score: 3950 },
        { name: 'CircuitSurfer', score: 2800 },
        { name: 'VoidDasher', score: 2150 },
        { name: 'NexusGlider', score: 1650 }
      ];

      const playerBest = this.stats.bestScore || 0;
      const playerName = this.playerName || 'Runner';
      const playerEntry = { name: `YOU (${playerName})`, score: playerBest, isPlayer: true };

      const allEntries = [...champions, playerEntry];
      allEntries.sort((a, b) => b.score - a.score);

      allEntries.forEach((entry, idx) => {
        const rank = idx + 1;
        const isPlayer = !!entry.isPlayer;
        let rankBadge = `${rank}.`;
        let rankClass = '';
        if (rank === 1) { rankBadge = '🥇'; rankClass = 'top-1'; }
        else if (rank === 2) { rankBadge = '🥈'; rankClass = 'top-2'; }
        else if (rank === 3) { rankBadge = '🥉'; rankClass = 'top-3'; }

        const row = document.createElement('div');
        row.className = `leaderboard-row ${isPlayer ? 'player-row' : ''}`;
        row.innerHTML = `
          <div class="leaderboard-row-left">
            <span class="leaderboard-rank-badge ${rankClass}">${rankBadge}</span>
            <span class="leaderboard-name">${entry.name}</span>
          </div>
          <span class="leaderboard-score">${entry.score.toLocaleString()}</span>
        `;
        container.appendChild(row);
      });

      m.classList.add('active');
    }

    openLeaderboardModal() {
      this.openModalById('leaderboard-modal', true);
    }

    closeLeaderboardModal() {
      this.closeCurrentModal();
    }

    // =========================================================
    // SOCIAL & FACEBOOK & SHARING ENGINE
    // =========================================================
    getFacebookBridge() {
      if (typeof window !== 'undefined' && window.AndroidFacebookBridge) {
        return window.AndroidFacebookBridge;
      }
      if (typeof AndroidFacebookBridge !== 'undefined' && AndroidFacebookBridge) {
        return AndroidFacebookBridge;
      }
      if (typeof globalThis !== 'undefined' && globalThis.AndroidFacebookBridge) {
        return globalThis.AndroidFacebookBridge;
      }
      return null;
    }

    initFacebookBridgeCallbacks() {
      // Always initialize as disconnected until real Facebook SDK verifies active session
      this.facebookConnected = false;
      this.facebookUserName = null;
      this.updateFacebookSettingsUI();

      window.onFacebookAuthSuccess = (userData) => {
        if (userData && userData.connected && userData.name) {
          this.facebookConnected = true;
          this.facebookUserName = userData.name;
          this.updateFacebookSettingsUI();
          const displayName = userData.firstName || userData.name;
          this.showToast('FACEBOOK CONNECTED!', `Welcome, ${displayName}!`, '✓');
        }
      };

      window.onFacebookAuthCancel = () => {
        this.facebookConnected = false;
        this.facebookUserName = null;
        this.updateFacebookSettingsUI();
        this.showToast('FACEBOOK LOGIN', 'Login cancelled', 'ℹ️');
      };

      window.onFacebookAuthError = (errorMessage) => {
        this.facebookConnected = false;
        this.facebookUserName = null;
        this.updateFacebookSettingsUI();
        this.showToast('FACEBOOK ERROR', errorMessage || 'Could not connect to Facebook', '⚠️');
      };

      window.onFacebookLogout = (notifyUser = false) => {
        const wasConnected = this.facebookConnected;
        this.facebookConnected = false;
        this.facebookUserName = null;
        this.updateFacebookSettingsUI();
        if (wasConnected && notifyUser) {
          this.showToast('FACEBOOK DISCONNECTED', 'Account unlinked', 'ℹ️');
        }
      };

      // Query native Facebook SDK session status
      const bridge = this.getFacebookBridge();
      if (bridge && typeof bridge.getLoginStatus === 'function') {
        try {
          bridge.getLoginStatus();
        } catch (e) {
          console.warn('Bridge getLoginStatus error:', e);
        }
      }
    }

    toggleFacebook() {
      const bridge = this.getFacebookBridge();
      if (bridge && typeof bridge.login === 'function' && typeof bridge.logout === 'function') {
        if (this.facebookConnected) {
          bridge.logout();
        } else {
          this.showToast('CONNECTING...', 'Opening Facebook Login...', '⚡');
          bridge.login();
        }
        return;
      }

      // If running in browser preview outside of Android APK, do NOT simulate connection
      this.facebookConnected = false;
      this.facebookUserName = null;
      this.updateFacebookSettingsUI();
      this.showToast('FACEBOOK LOGIN', 'Native Facebook Login requires running the Android APK.', 'ℹ️');
    }

    shareScore(scoreToShare = null) {
      const score = scoreToShare !== null ? scoreToShare : (this.score || this.stats.bestScore || 0);
      const text = `I just scored ${Math.floor(score).toLocaleString()} in Crazy Ball Rush! Can you beat my score?`;
      const url = window.location.href;

      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({
          title: 'Crazy Ball Rush - Score Challenge',
          text: text,
          url: url
        }).catch(err => {
          if (err.name !== 'AbortError') {
            this.fallbackShare(text, url);
          }
        });
      } else {
        this.fallbackShare(text, url);
      }
    }

    shareAchievement(key) {
      const def = ACHIEVEMENTS_DEF[key];
      if (!def) return;
      const text = `I unlocked the '${def.name}' achievement in Crazy Ball Rush! ${def.desc}`;
      const url = window.location.href;

      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({
          title: 'Crazy Ball Rush - Achievement Unlocked',
          text: text,
          url: url
        }).catch(err => {
          if (err.name !== 'AbortError') {
            this.fallbackShare(text, url);
          }
        });
      } else {
        this.fallbackShare(text, url);
      }
    }

    challengeFriends() {
      const best = this.stats.bestScore || 0;
      const text = `Can you beat my Crazy Ball Rush high score of ${best.toLocaleString()}? Leaping hazards in the cyber flow!`;
      const url = window.location.href;

      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({
          title: 'Crazy Ball Rush - Challenge',
          text: text,
          url: url
        }).catch(err => {
          if (err.name !== 'AbortError') {
            this.fallbackShare(text, url);
          }
        });
      } else {
        this.fallbackShare(text, url);
      }
    }

    fallbackShare(text, url) {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      try {
        window.open(fbUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(`${text} ${url}`);
          this.showToast('COPIED TO CLIPBOARD!', 'Share it with your friends!', '📋');
        } else {
          this.showToast('SHARE CHALLENGE', text, '📤');
        }
      }
    }

    // =========================================================
    // MODAL NAVIGATION STACK SYSTEM
    // =========================================================
    openModalById(id, pushToHistory = true) {
      const modal = document.getElementById(id);
      if (!modal) return;
      if (!this.navHistory) this.navHistory = [];
      if (pushToHistory) {
        if (this.navHistory.length === 0 || this.navHistory[this.navHistory.length - 1] !== id) {
          this.navHistory.push(id);
        }
      }
      if (id === 'customization-modal') this.renderCustomizationModal();
      else if (id === 'stats-modal') this.renderStatsModal();
      else if (id === 'settings-modal') this.renderSettingsModal();
      else if (id === 'achievements-modal') this.renderAchievementsModal();
      else if (id === 'session-reward-modal') this.renderSessionRewardModal();
      else if (id === 'daily-missions-modal') this.renderDailyMissionsModal();
      else if (id === 'daily-reward-modal') this.renderDailyRewardModal();
      else if (id === 'leaderboard-modal') this.renderLeaderboardModal();
      else if (id === 'guide-modal') this.renderGuideModal();
      else if (id === 'new-user-modal') this.renderNewUserModal();
      else modal.classList.add('active');
    }

    closeCurrentModal() {
      if (!this.navHistory) this.navHistory = [];
      const currentId = this.navHistory.pop();
      if (currentId) {
        const modal = document.getElementById(currentId);
        if (modal) modal.classList.remove('active');
      }
      if (this.navHistory.length > 0) {
        const prevId = this.navHistory[this.navHistory.length - 1];
        const prevModal = document.getElementById(prevId);
        if (prevModal) {
          prevModal.classList.add('active');
          if (prevId === 'settings-modal') this.renderSettingsModal();
          else if (prevId === 'stats-modal') this.renderStatsModal();
        }
      }
    }

    closeAllModals(clearHistory = true) {
      if (clearHistory) this.navHistory = [];
      document.querySelectorAll('.screen-overlay').forEach(el => {
        if (el.id !== 'welcome-screen' && el.id !== 'guide-prompt-screen' && el.id !== 'menu-screen' && el.id !== 'pause-screen' && el.id !== 'gameover-screen') {
          el.classList.remove('active');
        }
      });
    }

    // =========================================================
    // NEW USER PROFILE REGISTRATION FLOW
    // =========================================================
    renderNewUserModal() {
      const modal = document.getElementById('new-user-modal');
      if (modal) modal.classList.add('active');
    }

    openNewUserModal() {
      const input = document.getElementById('input-new-user-name');
      const errorEl = document.getElementById('new-user-error-msg');
      if (input) {
        input.value = '';
        input.classList.remove('input-error');
      }
      if (errorEl) {
        errorEl.style.display = 'none';
      }
      this.openModalById('new-user-modal', true);
      if (input) {
        setTimeout(() => {
          try { input.focus(); } catch (_) {}
        }, 150);
      }
    }

    closeNewUserModal() {
      const input = document.getElementById('input-new-user-name');
      if (input) {
        try { input.blur(); } catch (_) {}
      }
      this.closeCurrentModal();
    }

    archiveCurrentProfile() {
      try {
        if (!this.playerName || !this.playerName.trim()) return;
        const currentProfileData = {
          playerName: this.playerName.trim(),
          stats: JSON.parse(JSON.stringify(this.stats || {})),
          achievements: JSON.parse(JSON.stringify(this.achievements || {})),
          selectedOrbId: this.selectedOrbId,
          selectedShapeId: this.selectedShapeId,
          selectedThemeIndex: this.selectedThemeIndex,
          archivedAt: Date.now()
        };
        let archivedList = [];
        let raw = localStorage.getItem('crazyballrush_archived_profiles');
        if (!raw) raw = localStorage.getItem('escaperun_archived_profiles');
        if (raw) {
          try { archivedList = JSON.parse(raw) || []; } catch (_) {}
        }
        if (!Array.isArray(archivedList)) archivedList = [];
        archivedList = archivedList.filter(p => p.playerName !== this.playerName.trim());
        archivedList.push(currentProfileData);
        if (archivedList.length > 10) archivedList.shift();
        localStorage.setItem('crazyballrush_archived_profiles', JSON.stringify(archivedList));
      } catch (err) {
        console.warn('Error archiving profile:', err);
      }
    }

    handleCreateNewUserProfile() {
      const input = document.getElementById('input-new-user-name');
      const errorEl = document.getElementById('new-user-error-msg');
      if (!input) return;

      const raw = input.value || '';
      const trimmed = raw.trim().replace(/\s+/g, ' ');

      if (!trimmed || trimmed.length === 0) {
        if (errorEl) {
          errorEl.textContent = 'Please enter your name.';
          errorEl.style.display = 'block';
        }
        input.classList.add('input-error');
        input.focus();
        return;
      }

      if (errorEl) errorEl.style.display = 'none';
      input.classList.remove('input-error');

      // 1. Preserve/archive existing profile data safely
      this.archiveCurrentProfile();

      // 2. Initialize new user starting data
      this.playerName = trimmed.substring(0, 14);
      this.stats = {
        totalRuns: 0,
        bestScore: 0,
        bestDistance: 0,
        totalCoins: 0,
        longestSurvival: 0,
        totalObstaclesAvoided: 0,
        totalPowerups: 0,
        highestCombo: 1,
        claimedMilestones: []
      };
      this.achievements = {
        firstRun: false,
        firstJump: false,
        coinCollector: false,
        hazardDodger: false,
        survivor: false,
        speedDemon: false,
        comboMaster: false,
        longRun: false
      };
      this.selectedOrbId = 'electric-blue';
      this.selectedShapeId = 'circle';
      this.selectedThemeIndex = -1;
      this.tutorialSeen = false;

      // 3. Save new profile to local storage
      this.saveStorage();

      // 4. Update UI references
      const menuName = document.getElementById('menu-player-name');
      if (menuName) menuName.textContent = this.playerName.toUpperCase();
      const statName = document.getElementById('stat-player-name');
      if (statName) statName.textContent = this.playerName;

      try { input.blur(); } catch (_) {}

      // 5. Close all modals
      this.closeAllModals(true);

      // 6. Toast confirmation
      this.showToast('NEW PROFILE CREATED!', `Welcome, ${this.playerName}!`, '👤');

      // 7. Start interactive tutorial -> continuous gameplay run for new user
      this.startTutorial(true);
    }

    renderGuideModal() {
      const m = document.getElementById('guide-modal');
      if (m) m.classList.add('active');
    }

    openGuideModal() {
      this.openModalById('guide-modal', true);
    }

    closeGuideModal() {
      this.tutorialSeen = true;
      this.saveStorage();
      this.closeCurrentModal();
    }

    resize() {
      if (!this.canvas || !this.ctx) return;
      const container = document.getElementById('game-container');
      const cw = (container && container.clientWidth) || window.innerWidth || document.documentElement.clientWidth || 360;
      const ch = (container && container.clientHeight) || window.innerHeight || document.documentElement.clientHeight || 640;
      if (ch <= 0 || cw <= 0) return;

      this.scale = ch / this.height;
      if (!isFinite(this.scale) || this.scale <= 0) this.scale = 1;
      this.width = cw / this.scale;
      if (!isFinite(this.width) || this.width <= 0) this.width = 400;

      const targetW = Math.max(1, Math.floor(cw * this.dpr));
      const targetH = Math.max(1, Math.floor(ch * this.dpr));
      if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
        this.canvas.width = targetW;
        this.canvas.height = targetH;
      }
      const sw = cw + 'px';
      const sh = ch + 'px';
      if (this.canvas.style.width !== sw) this.canvas.style.width = sw;
      if (this.canvas.style.height !== sh) this.canvas.style.height = sh;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.scale * this.dpr, this.scale * this.dpr);

      // Compute sleek, well-proportioned mobile ball radius
      this.playerRadius = Math.max(10, Math.min(12.5, this.width * 0.03));
      if (this.player) {
        this.player.radius = this.playerRadius;
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => { this.needsResize = true; }, { passive: true });
      window.addEventListener('orientationchange', () => { setTimeout(() => { this.needsResize = true; }, 100); }, { passive: true });

      const gameContainer = document.getElementById('game-container');

      // Jump pointer down handler
      const handleTrigger = (e) => {
        if (!e) return;
        if (e.target && (
          e.target.closest('button') ||
          e.target.closest('input') ||
          e.target.closest('textarea') ||
          e.target.closest('.switch') ||
          e.target.closest('.modal-card') ||
          e.target.closest('.screen-overlay.active') ||
          e.target.closest('#toast-container') ||
          e.target.closest('.hud-top') ||
          e.target.closest('.btn-tutorial-skip') ||
          e.target.closest('#tutorial-completion-card')
        )) {
          return;
        }
        if (this.state === STATE.PLAYING || this.state === STATE.TUTORIAL) {
          if (e.cancelable) e.preventDefault();
          this.handleJumpInput();
        }
      };

      if (gameContainer) {
        gameContainer.addEventListener('pointerdown', handleTrigger, { passive: false });
      }

      // Keyboard support: Space = Jump, P = Pause, R = Restart
      window.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        const isInputFocused = (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) ||
                               (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable));
        if (isInputFocused) {
          if (e.key === 'Enter') {
            if (e.target && e.target.id === 'input-player-name') {
              e.preventDefault();
              this.handleWelcomeContinue();
            }
          }
          // Never trigger jump or preventDefault while typing in input!
          return;
        }

        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          this.handleJumpInput();
        } else if (e.code === 'KeyP' || e.code === 'Escape') {
          e.preventDefault();
          if (this.state === STATE.PLAYING) this.pauseGame();
          else if (this.state === STATE.PAUSED) this.resumeGame();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          if (this.state === STATE.GAME_OVER || this.state === STATE.PAUSED) {
            this.restart();
          }
        }
      });

      const bindBtn = (id, fn) => {
        const btn = typeof id === 'string' ? document.getElementById(id) : id;
        if (!btn) return;

        let startX = 0;
        let startY = 0;
        let isTouchMoved = false;
        let lastTrigger = 0;

        btn.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches.length === 1) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isTouchMoved = false;
          }
        }, { passive: true });

        btn.addEventListener('touchmove', (e) => {
          if (e.touches && e.touches.length === 1) {
            const dx = Math.abs(e.touches[0].clientX - startX);
            const dy = Math.abs(e.touches[0].clientY - startY);
            if (dx > 8 || dy > 8) {
              isTouchMoved = true;
            }
          }
        }, { passive: true });

        btn.addEventListener('click', (e) => {
          if (isTouchMoved) {
            isTouchMoved = false;
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            return;
          }

          const now = Date.now();
          if (now - lastTrigger < 250) {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            return;
          }
          lastTrigger = now;

          if (e) e.stopPropagation();

          if (this.sound) {
            if (typeof this.sound.initContext === 'function') this.sound.initContext();
            if (typeof this.sound.playButton === 'function') this.sound.playButton();
          }

          fn();
        });
      };

      // Registration screen keyboard adaptation
      const nameInput = document.getElementById('input-player-name');
      const welcomeScreen = document.getElementById('welcome-screen');

      const updateRegistrationKeyboardState = () => {
        if (!welcomeScreen || !welcomeScreen.classList.contains('active')) return;
        const isFocused = document.activeElement === nameInput;
        const vv = window.visualViewport;
        const isKeyboardUp = isFocused || (vv && vv.height < (window.innerHeight || document.documentElement.clientHeight) * 0.82);

        if (isKeyboardUp) {
          welcomeScreen.classList.add('keyboard-open');
          if (nameInput && isFocused) {
            setTimeout(() => {
              nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 60);
          }
        } else {
          welcomeScreen.classList.remove('keyboard-open');
        }
      };

      if (nameInput) {
        nameInput.addEventListener('focus', () => {
          if (welcomeScreen) welcomeScreen.classList.add('keyboard-open');
          setTimeout(() => {
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 80);
        });

        nameInput.addEventListener('blur', () => {
          setTimeout(() => {
            const vv = window.visualViewport;
            const isKeyboardUp = vv && vv.height < (window.innerHeight || document.documentElement.clientHeight) * 0.82;
            if (!isKeyboardUp && welcomeScreen) {
              welcomeScreen.classList.remove('keyboard-open');
            }
          }, 150);
        });

        nameInput.addEventListener('input', () => {
          const err = document.getElementById('name-input-error');
          if (err) err.style.display = 'none';
          nameInput.classList.remove('input-error');
        });
      }

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateRegistrationKeyboardState, { passive: true });
        window.visualViewport.addEventListener('scroll', updateRegistrationKeyboardState, { passive: true });
      }

      // 1. First-Time Welcome Screen bindings
      bindBtn('btn-welcome-continue', () => {
        this.handleWelcomeContinue();
      });

      // 2. Guide Prompt Screen bindings
      bindBtn('btn-prompt-tutorial', () => {
        this.startTutorial();
      });

      bindBtn('btn-prompt-guide', () => {
        this.openGuideModal();
      });

      bindBtn('btn-prompt-skip', () => {
        this.tutorialSeen = true;
        this.saveStorage();
        this.state = STATE.MENU;
        this.updateUI();
      });

      bindBtn('btn-close-guide', () => this.closeGuideModal());

      // Tutorial HUD Overlay Controls
      bindBtn('btn-skip-tutorial-run', () => {
        this.skipTutorial();
      });

      bindBtn('btn-tutorial-finish', () => {
        this.finishTutorial(true);
      });

      // 3. Menu Screen bindings
      bindBtn('btn-play', () => this.startPlay());
      bindBtn('btn-tutorial-menu', () => this.startTutorial());
      bindBtn('btn-daily-missions-menu', () => this.openDailyMissionsModal());
      bindBtn('btn-daily-reward-menu', () => this.openDailyRewardModal());
      bindBtn('btn-leaderboard-menu', () => this.openLeaderboardModal());
      bindBtn('btn-orb-customization', () => this.openCustomizationModal());
      bindBtn('btn-session-reward-menu', () => this.openSessionRewardModal());
      bindBtn('btn-achievements', () => this.openAchievementsModal());
      bindBtn('btn-stats', () => this.openStatsModal());
      bindBtn('btn-profile', () => this.openStatsModal());
      bindBtn('menu-player-name', () => this.openStatsModal());
      bindBtn('btn-settings', () => this.openSettingsModal());

      // Customization modal tab buttons
      bindBtn('tab-custom-orbs', () => {
        this.customizationTab = 'orbs';
        this.openCustomizationModal();
      });
      bindBtn('tab-custom-shapes', () => {
        this.customizationTab = 'shapes';
        this.openCustomizationModal();
      });
      bindBtn('tab-custom-backgrounds', () => {
        this.customizationTab = 'backgrounds';
        this.openCustomizationModal();
      });

      // 4. In-Game HUD bindings
      bindBtn('btn-pause-hud', () => this.pauseGame());
      const sessionPill = document.getElementById('hud-session-pill');
      if (sessionPill) {
        sessionPill.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openSessionRewardModal();
        });
      }

      // 5. Pause & Game Over Screen bindings
      bindBtn('btn-resume', () => this.resumeGame());
      bindBtn('btn-restart-pause', () => this.restart());
      bindBtn('btn-settings-pause', () => this.openSettingsModal());
      bindBtn('btn-menu-pause', () => {
        this.state = STATE.MENU;
        this.updateUI();
      });
      bindBtn('btn-continue-go', () => this.watchAdToContinue());
      bindBtn('btn-restart-go', () => this.restart());
      bindBtn('btn-share-go', () => this.shareScore(this.score));
      bindBtn('btn-challenge-go', () => this.challengeFriends());
      bindBtn('btn-menu-go', () => {
        this.state = STATE.MENU;
        this.updateUI();
      });

      // 6. Modals
      bindBtn('btn-continue-level', () => this.resumeFromLevelComplete());
      bindBtn('btn-close-stats', () => this.closeStatsModal());
      bindBtn('btn-share-profile', () => this.shareScore(this.stats.bestScore));
      bindBtn('btn-close-achievements', () => this.closeAchievementsModal());
      bindBtn('btn-close-settings', () => this.closeSettingsModal());
      bindBtn('btn-close-customization', () => this.closeCustomizationModal());
      bindBtn('btn-close-session-reward', () => this.closeSessionRewardModal());

      // Daily Missions & Daily Reward & Leaderboard modal bindings
      bindBtn('btn-close-daily-missions', () => this.closeDailyMissionsModal());
      bindBtn('btn-claim-daily-reward', () => this.claimDailyReward());
      bindBtn('btn-close-daily-reward', () => this.closeDailyRewardModal());
      bindBtn('btn-challenge-friends-lb', () => this.challengeFriends());
      bindBtn('btn-close-leaderboard', () => this.closeLeaderboardModal());

      // Profile edit name button
      bindBtn('btn-edit-name', () => {
        const newName = prompt('Enter Runner Name:', this.playerName);
        if (newName && newName.trim()) {
          this.playerName = newName.trim().substring(0, 14);
          this.saveStorage();
          const nameEl = document.getElementById('stat-player-name');
          if (nameEl) nameEl.textContent = this.playerName;
          const menuNameEl = document.getElementById('menu-player-name');
          if (menuNameEl) menuNameEl.textContent = this.playerName.toUpperCase();
        }
      });

      // Settings toggles & buttons
      const soundToggle = document.getElementById('setting-sound');
      if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
          if (this.sound) this.sound.setSoundEnabled(e.target.checked);
        });
      }
      const musicToggle = document.getElementById('setting-music');
      if (musicToggle) {
        musicToggle.addEventListener('change', (e) => {
          if (this.sound) this.sound.setMusicEnabled(e.target.checked);
        });
      }
      const hapticToggle = document.getElementById('setting-haptics');
      if (hapticToggle) {
        hapticToggle.addEventListener('change', (e) => {
          this.setHapticFeedback(e.target.checked);
        });
      }
      bindBtn('btn-haptic-on', () => this.setHapticFeedback(true));
      bindBtn('btn-haptic-off', () => this.setHapticFeedback(false));
      const motionToggle = document.getElementById('setting-reduced-motion');
      if (motionToggle) {
        motionToggle.addEventListener('change', (e) => {
          this.applyReducedMotion(e.target.checked);
        });
      }

      // Facebook & Social buttons
      bindBtn('btn-toggle-facebook', () => this.toggleFacebook());
      bindBtn('btn-toggle-facebook-profile', () => this.toggleFacebook());
      bindBtn('btn-challenge-friends-settings', () => this.challengeFriends());
      // Training & Run Test / Demo Mode button
      bindBtn('btn-replay-tutorial', () => {
        this.closeAllModals(true);
        this.startTutorial();
      });
      bindBtn('btn-run-test-mode', () => {
        this.closeAllModals(true);
        this.startTutorial();
      });

      // Theme toggle buttons
      bindBtn('btn-theme-dark', () => this.applyTheme('dark'));
      bindBtn('btn-theme-light', () => this.applyTheme('light'));

      // Game Speed toggle buttons
      bindBtn('btn-speed-low', () => this.setGameSpeed('low'));
      bindBtn('btn-speed-normal', () => this.setGameSpeed('normal'));
      bindBtn('btn-speed-high', () => this.setGameSpeed('high'));

      // Extra settings actions
      bindBtn('btn-settings-profile', () => {
        this.openStatsModal();
      });
      bindBtn('btn-settings-orb', () => {
        this.openCustomizationModal();
      });
      bindBtn('btn-settings-guide', () => {
        this.openGuideModal();
      });
      bindBtn('btn-settings-remove-ads', () => {
        const modal = document.getElementById('purchase-modal');
        if (modal) modal.classList.add('active');
      });
      bindBtn('btn-purchase-cancel', () => {
        const modal = document.getElementById('purchase-modal');
        if (modal) modal.classList.remove('active');
      });
      bindBtn('btn-purchase-confirm', () => {
        const modal = document.getElementById('purchase-modal');
        if (modal) modal.classList.remove('active');
        const billing = window.BillingService || this.purchaseManager;
        if (billing) {
          billing.purchaseRemoveAds({
            onSuccess: () => {
              this.showToast('PREMIUM ACTIVE', 'All ads permanently removed!');
            },
            onError: (err) => {
              this.showToast('PLAY STORE', err);
            }
          });
        }
      });
      // Register As New User keyboard adaptation & bindings
      const newNameInput = document.getElementById('input-new-user-name');
      const newUserModal = document.getElementById('new-user-modal');

      const updateNewUserKeyboardState = () => {
        if (!newUserModal || !newUserModal.classList.contains('active')) return;
        const isFocused = document.activeElement === newNameInput;
        const vv = window.visualViewport;
        const isKeyboardUp = isFocused || (vv && vv.height < (window.innerHeight || document.documentElement.clientHeight) * 0.82);

        if (isKeyboardUp) {
          newUserModal.classList.add('keyboard-open');
          if (newNameInput && isFocused) {
            setTimeout(() => {
              try { newNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
            }, 60);
          }
        } else {
          newUserModal.classList.remove('keyboard-open');
        }
      };

      if (newNameInput) {
        newNameInput.addEventListener('focus', () => {
          if (newUserModal) newUserModal.classList.add('keyboard-open');
          setTimeout(() => {
            try { newNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
          }, 80);
        });

        newNameInput.addEventListener('blur', () => {
          setTimeout(() => {
            const vv = window.visualViewport;
            const isKeyboardUp = vv && vv.height < (window.innerHeight || document.documentElement.clientHeight) * 0.82;
            if (!isKeyboardUp && newUserModal) {
              newUserModal.classList.remove('keyboard-open');
            }
          }, 150);
        });

        newNameInput.addEventListener('input', () => {
          const err = document.getElementById('new-user-error-msg');
          if (err) err.style.display = 'none';
          newNameInput.classList.remove('input-error');
        });

        newNameInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleCreateNewUserProfile();
          }
        });
      }

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateNewUserKeyboardState, { passive: true });
        window.visualViewport.addEventListener('scroll', updateNewUserKeyboardState, { passive: true });
      }

      // Register As New User button bindings
      bindBtn('btn-profile-new-user', () => this.openNewUserModal());
      bindBtn('btn-settings-new-user', () => this.openNewUserModal());
      bindBtn('btn-submit-new-user', () => this.handleCreateNewUserProfile());
      bindBtn('btn-cancel-new-user', () => this.closeNewUserModal());

      bindBtn('btn-settings-restore', () => {
        const billing = window.BillingService || this.purchaseManager;
        if (billing) {
          billing.restorePurchases({
            onSuccess: () => this.showToast('PURCHASE RESTORED', 'Premium unlocked successfully!'),
            onNoneFound: () => this.showToast('PURCHASES', 'No past purchases found.')
          });
        }
      });
      bindBtn('btn-settings-reset', () => {
        const confirmModal = document.getElementById('reset-confirm-modal');
        if (confirmModal) confirmModal.classList.add('active');
      });

      // Reset Confirmation modal (Restarts current run ONLY - keeps player profile & stats safe)
      bindBtn('btn-confirm-reset', () => {
        const confirmModal = document.getElementById('reset-confirm-modal');
        if (confirmModal) confirmModal.classList.remove('active');
        this.closeSettingsModal();
        this.restart();
      });
      bindBtn('btn-cancel-reset', () => {
        const confirmModal = document.getElementById('reset-confirm-modal');
        if (confirmModal) confirmModal.classList.remove('active');
      });

      // Tap backdrop outside modal card to close
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.closeAllModals();
            if (this.state === STATE.GUIDE) {
              this.tutorialSeen = true;
              this.saveStorage();
              this.state = STATE.MENU;
              this.updateUI();
            }
          }
        });
      });
    }
  }

  // Initialize on load safely across environments
  function bootGame() {
    if (!window.crazyBallRushGame) {
      try {
        window.crazyBallRushGame = new Game();
        window.escapeRunGame = window.crazyBallRushGame; // Backwards-compatible alias for any external bridge
      } catch (err) {
        console.error('Crazy Ball Rush initialization error:', err);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootGame);
  } else {
    bootGame();
  }
  window.addEventListener('load', bootGame);
})();
