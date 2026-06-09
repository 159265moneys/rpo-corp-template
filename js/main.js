(() => {
  'use strict';

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const withBreaks = (value) => escapeHtml(value).replace(/\n/g, '<br>');

  const get = (obj, path) => {
    let val = obj;
    for (const k of path.split('.')) val = val?.[k];
    return val;
  };

  const iconSvg = (type = 'document', className = '') => {
    const cls = className ? ` class="${className}"` : '';
    const icons = {
      truck: `<svg${cls} viewBox="0 0 100 80" fill="none"><path d="M5 60 L5 20 L60 20 L60 40 L80 40 L95 60 L95 70 L85 70 A8 8 0 0 1 71 70 L40 70 A8 8 0 0 1 26 70 L5 70 Z" stroke="currentColor" stroke-width="3"/><circle cx="33" cy="70" r="6" fill="currentColor"/><circle cx="78" cy="70" r="6" fill="currentColor"/></svg>`,
      warehouse: `<svg${cls} viewBox="0 0 100 80" fill="none"><path d="M5 30 L50 5 L95 30 L95 75 L5 75 Z" stroke="currentColor" stroke-width="3"/><path d="M30 75 L30 45 L70 45 L70 75" stroke="currentColor" stroke-width="3"/><path d="M50 45 L50 75" stroke="currentColor" stroke-width="3"/></svg>`,
      office: `<svg${cls} viewBox="0 0 100 80" fill="none"><rect x="10" y="15" width="80" height="55" rx="4" stroke="currentColor" stroke-width="3"/><path d="M10 30 L90 30" stroke="currentColor" stroke-width="3"/><circle cx="20" cy="22" r="2" fill="currentColor"/><circle cx="28" cy="22" r="2" fill="currentColor"/><path d="M25 45 L75 45 M25 55 L60 55" stroke="currentColor" stroke-width="3"/></svg>`,
      person: `<svg${cls} viewBox="0 0 100 100" fill="none"><circle cx="50" cy="38" r="20" stroke="currentColor" stroke-width="2"/><path d="M20 100 C20 75 35 65 50 65 C65 65 80 75 80 100" stroke="currentColor" stroke-width="2"/></svg>`,
      calendar: `<svg${cls} viewBox="0 0 40 40" fill="none"><rect x="6" y="10" width="28" height="22" rx="2" stroke="currentColor" stroke-width="2"/><path d="M6 16 L34 16 M14 6 L14 14 M26 6 L26 14" stroke="currentColor" stroke-width="2"/></svg>`,
      star: `<svg${cls} viewBox="0 0 40 40" fill="none"><path d="M20 6 L24 16 L34 17 L26 24 L29 34 L20 28 L11 34 L14 24 L6 17 L16 16 Z" stroke="currentColor" stroke-width="2"/></svg>`,
      home: `<svg${cls} viewBox="0 0 40 40" fill="none"><path d="M8 32 L8 18 L20 8 L32 18 L32 32 Z" stroke="currentColor" stroke-width="2"/><path d="M16 32 L16 22 L24 22 L24 32" stroke="currentColor" stroke-width="2"/></svg>`,
      clock: `<svg${cls} viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="currentColor" stroke-width="2"/><path d="M20 10 L20 20 L26 24" stroke="currentColor" stroke-width="2"/></svg>`,
      document: `<svg${cls} viewBox="0 0 40 40" fill="none"><rect x="6" y="8" width="28" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M14 16 L26 16 M14 22 L26 22 M14 28 L22 28" stroke="currentColor" stroke-width="2"/></svg>`,
      health: `<svg${cls} viewBox="0 0 40 40" fill="none"><path d="M20 6 C13 14 13 22 20 30 C27 22 27 14 20 6 Z" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="32" r="2" fill="currentColor"/></svg>`,
      people: `<svg${cls} viewBox="0 0 40 40" fill="none"><circle cx="14" cy="18" r="6" stroke="currentColor" stroke-width="2"/><circle cx="26" cy="18" r="6" stroke="currentColor" stroke-width="2"/><path d="M6 34 C6 26 12 24 20 24 C28 24 34 26 34 34" stroke="currentColor" stroke-width="2"/></svg>`,
    };
    return icons[type] || icons.document;
  };

  const tableRows = (rows = []) => rows.map((row) => (
    `<tr><th>${escapeHtml(row.label)}</th><td>${withBreaks(row.value)}</td></tr>`
  )).join('');

  const renderSampleNotice = (notice) => {
    const existing = document.querySelector('.sample-notice');
    if (existing) existing.remove();
    document.body.classList.remove('has-sample-notice');
    if (!notice?.enabled) return;

    const el = document.createElement('aside');
    el.className = 'sample-notice';
    el.setAttribute('aria-label', 'サンプルサイトの注記');
    el.innerHTML = `
      <div class="sample-notice__label">${escapeHtml(notice.label || 'サンプル')}</div>
      <div class="sample-notice__text">${escapeHtml(notice.text || '')}</div>
    `;
    document.body.appendChild(el);
    document.body.classList.add('has-sample-notice');
  };

  const renderRecruitConfig = (cfg) => {
    const recruit = cfg.recruit || {};

    if (Array.isArray(recruit.positions) && recruit.positions.length) {
      const root = document.querySelector('.position-tabs');
      if (root) {
        root.innerHTML = `
          <div class="position-tabs__nav">
            ${recruit.positions.map((item, index) => `
              <button class="position-tabs__btn${index === 0 ? ' is-active' : ''}" data-tab="${escapeHtml(item.id)}">
                ${escapeHtml(item.navTitle || item.title)}
                <small>${escapeHtml(item.navSub || item.label || item.id)}</small>
              </button>
            `).join('')}
          </div>
          ${recruit.positions.map((item, index) => `
            <div class="position-tabs__panel${index === 0 ? ' is-active' : ''}" data-tab="${escapeHtml(item.id)}">
              <div class="position-panel">
                <div class="position-panel__visual" style="background-image:url('${escapeHtml(item.image)}');">
                  ${iconSvg(item.icon || 'truck', 'position-panel__visual-icon')}
                  <div class="position-panel__visual-label">${escapeHtml(item.label || item.navSub || item.id)}</div>
                </div>
                <div class="position-panel__detail">
                  <h3 class="position-panel__title">${escapeHtml(item.title)}</h3>
                  <p class="position-panel__lead">${escapeHtml(item.lead)}</p>
                  <table class="position-panel__table">${tableRows(item.rows)}</table>
                </div>
              </div>
            </div>
          `).join('')}
        `;
      }
    }

    if (Array.isArray(recruit.voices) && recruit.voices.length) {
      const root = document.querySelector('.voices');
      if (root) {
        root.innerHTML = recruit.voices.map((item, index) => `
          <article class="voice-card fade-up${index ? ` fade-up--delay-${Math.min(index, 3)}` : ''}">
            <div class="voice-card__visual" style="background-image:url('${escapeHtml(item.image)}');">
              ${iconSvg('person', 'voice-card__visual-icon')}
              <div class="voice-card__meta">
                <div class="voice-card__role">${escapeHtml(item.role)}</div>
                <div class="voice-card__name">${escapeHtml(item.name)}<small>${escapeHtml(item.nameEn || '')}</small></div>
              </div>
            </div>
            <div class="voice-card__body">
              <h3 class="voice-card__catch">${withBreaks(item.catch)}</h3>
              <p class="voice-card__text">${escapeHtml(item.text)}</p>
            </div>
          </article>
        `).join('');
      }
    }

    if (Array.isArray(recruit.dayFlow) && recruit.dayFlow.length) {
      const root = document.querySelector('.day-flow__track');
      if (root) {
        root.innerHTML = recruit.dayFlow.map((item) => `
          <div class="day-flow__step has-photo">
            <div class="day-flow__photo" style="background-image:url('${escapeHtml(item.image)}');"></div>
            <span class="day-flow__time">${escapeHtml(item.time)}</span>
            <span class="day-flow__dot"></span>
            <h4 class="day-flow__title">${escapeHtml(item.title)}</h4>
            <p class="day-flow__text">${escapeHtml(item.text)}</p>
          </div>
        `).join('');
      }
    }

    if (Array.isArray(recruit.benefits) && recruit.benefits.length) {
      const root = document.querySelector('.benefits');
      if (root) {
        root.innerHTML = recruit.benefits.map((item, index) => `
          <div class="benefit-card fade-up${index % 4 ? ` fade-up--delay-${index % 4}` : ''}">
            ${iconSvg(item.icon || 'document', 'benefit-card__icon')}
            <h3 class="benefit-card__title">${escapeHtml(item.title)}</h3>
            <p class="benefit-card__text">${escapeHtml(item.text)}</p>
          </div>
        `).join('');
      }
    }

    if (Array.isArray(recruit.faq) && recruit.faq.length) {
      const root = document.querySelector('.faq');
      if (root) {
        root.innerHTML = recruit.faq.map((item) => `
          <div class="faq__item">
            <button class="faq__q">
              <span class="faq__q-mark">Q</span>
              <span class="faq__q-text">${escapeHtml(item.q)}</span>
              <span class="faq__q-toggle"></span>
            </button>
            <div class="faq__a">
              <div class="faq__a-inner">${escapeHtml(item.a)}</div>
            </div>
          </div>
        `).join('');
      }
    }
  };

  /* config.jsonから差し替え */
  const loadConfig = async () => {
    try {
      const res = await fetch('data/config.json');
      if (!res.ok) return;
      const cfg = await res.json();
      if (cfg.page?.title) document.title = cfg.page.title;
      if (cfg.page?.description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', cfg.page.description);
      }
      document.querySelectorAll('[data-cfg]').forEach((el) => {
        const val = get(cfg, el.dataset.cfg);
        if (val !== undefined && val !== null) el.textContent = val;
      });
      document.querySelectorAll('[data-cfg-html]').forEach((el) => {
        const val = get(cfg, el.dataset.cfgHtml);
        if (val !== undefined && val !== null) el.innerHTML = withBreaks(val);
      });
      document.querySelectorAll('[data-cfg-href]').forEach((el) => {
        const val = get(cfg, el.dataset.cfgHref);
        if (val) el.setAttribute('href', val);
      });
      document.querySelectorAll('[data-cfg-bg]').forEach((el) => {
        const val = get(cfg, el.dataset.cfgBg);
        if (val) el.style.backgroundImage = `url('${val}')`;
      });
      renderRecruitConfig(cfg);
      renderSampleNotice(cfg.sampleNotice);
    } catch (e) {
      /* ローカルfile://で開いた場合のフォールバック。HTMLのデフォルト値を使う。 */
    }
  };

  /* ヘッダー：スクロール検知 */
  const initHeader = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => {
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  /* モバイルメニュー */
  const initMobileMenu = () => {
    const btn = document.querySelector('.header__menu-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.body.classList.toggle('is-menu-open');
    });
    document.querySelectorAll('.header__nav a').forEach((a) => {
      a.addEventListener('click', () => {
        document.body.classList.remove('is-menu-open');
      });
    });
  };

  /* スクロール連動フェードアップ */
  const initFadeUp = () => {
    const targets = document.querySelectorAll('.fade-up');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    targets.forEach((el) => io.observe(el));
  };

  /* 数字カウントアップ */
  const initCounters = () => {
    const els = document.querySelectorAll('[data-counter]');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach((el) => {
        el.textContent = el.dataset.counter;
      });
      return;
    }
    const animate = (el) => {
      const target = parseFloat(el.dataset.counter);
      const decimals = (el.dataset.counter.split('.')[1] || '').length;
      const duration = 1600;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const val = target * easeOut(t);
        el.textContent = val.toFixed(decimals);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  };

  /* 採用ページタブ切替 */
  const initTabs = () => {
    const tabs = document.querySelectorAll('.position-tabs');
    tabs.forEach((tabRoot) => {
      const btns = tabRoot.querySelectorAll('.position-tabs__btn');
      const panels = tabRoot.querySelectorAll('.position-tabs__panel');
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.tab;
          btns.forEach((b) => b.classList.toggle('is-active', b === btn));
          panels.forEach((p) => p.classList.toggle('is-active', p.dataset.tab === id));
        });
      });
    });
  };

  /* FAQアコーディオン */
  const initFaq = () => {
    document.querySelectorAll('.faq__q').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq__item');
        const ans = item.querySelector('.faq__a');
        const open = item.classList.toggle('is-open');
        if (open) {
          ans.style.maxHeight = ans.scrollHeight + 'px';
        } else {
          ans.style.maxHeight = '0px';
        }
      });
    });
  };

  /* 1日の流れ：スクロール連動でドット光らせる */
  const initDayFlow = () => {
    const steps = document.querySelectorAll('.day-flow__step');
    if (!steps.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.5 });
    steps.forEach((el) => io.observe(el));
  };

  /* マーキー：内容を倍にしてシームレス化 */
  const initMarquee = () => {
    document.querySelectorAll('.marquee__track').forEach((track) => {
      track.innerHTML += track.innerHTML;
    });
  };

  /* アンカーリンクのスムーススクロール（ヘッダー分オフセット） */
  const initSmoothAnchor = () => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerH,
          behavior: 'smooth',
        });
      });
    });
  };

  /* 起動 */
  const boot = async () => {
    await loadConfig();
    initHeader();
    initMobileMenu();
    initFadeUp();
    initCounters();
    initTabs();
    initFaq();
    initDayFlow();
    initMarquee();
    initSmoothAnchor();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
