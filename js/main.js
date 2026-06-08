(() => {
  'use strict';

  /* config.jsonから差し替え */
  const loadConfig = async () => {
    try {
      const res = await fetch('data/config.json');
      if (!res.ok) return;
      const cfg = await res.json();
      document.querySelectorAll('[data-cfg]').forEach((el) => {
        const path = el.dataset.cfg.split('.');
        let val = cfg;
        for (const k of path) val = val?.[k];
        if (val !== undefined && val !== null) el.textContent = val;
      });
      document.querySelectorAll('[data-cfg-href]').forEach((el) => {
        const path = el.dataset.cfgHref.split('.');
        let val = cfg;
        for (const k of path) val = val?.[k];
        if (val) el.setAttribute('href', val);
      });
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
  const boot = () => {
    loadConfig();
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
