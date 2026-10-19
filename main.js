/* ==========================================================================
   Zilu Zheng — Aerospace Engineering Portfolio
   Shared Script (main.js)
   ========================================================================== */

(function () {
  'use strict';

  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  function getSavedTheme() {
    try {
      return localStorage.getItem('zz-portfolio-theme');
    } catch (e) {
      return null;
    }
  }

  function setSavedTheme(theme) {
    try {
      localStorage.setItem('zz-portfolio-theme', theme);
    } catch (e) {}
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeBtn) {
        themeBtn.textContent = 'Theme: Dark';
        themeBtn.setAttribute('aria-pressed', 'true');
      }
    } else {
      root.removeAttribute('data-theme');
      if (themeBtn) {
        themeBtn.textContent = 'Theme: Light';
        themeBtn.setAttribute('aria-pressed', 'false');
      }
    }
  }

  applyTheme(getSavedTheme() || 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      setSavedTheme(nextTheme);
    });
  }

  const menuBtn = document.getElementById('mobile-menu-btn');
  const siteNav = document.getElementById('site-nav');

  if (menuBtn && siteNav) {
    menuBtn.addEventListener('click', function () {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('is-open', !expanded);
      menuBtn.textContent = !expanded ? 'Close' : 'Menu';
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  const viewers = document.querySelectorAll('model-viewer');
  viewers.forEach(function (viewer) {
    const frame = viewer.closest('.viewer-frame');
    const hint = frame ? frame.querySelector('.viewer-hint') : null;
    if (!hint) return;
    function hideHint() {
      hint.classList.add('is-hidden');
    }
    viewer.addEventListener('pointerdown', hideHint, { once: true });
    viewer.addEventListener('wheel', hideHint, { once: true, passive: true });
    viewer.addEventListener('touchstart', hideHint, { once: true, passive: true });
  });

  const modelSwitchBtns = document.querySelectorAll('[data-model-target]');
  modelSwitchBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const viewerId = btn.getAttribute('data-model-target');
      const modelSrc = btn.getAttribute('data-model-src');
      const badgeText = btn.getAttribute('data-model-label');
      const viewer = document.getElementById(viewerId);
      if (viewer && modelSrc) {
        viewer.setAttribute('src', modelSrc);
      }
      const badge = document.getElementById(viewerId + '-badge');
      if (badge && badgeText) {
        badge.innerHTML = badgeText;
      }
      const group = btn.closest('.viewer-tabs');
      if (group) {
        group.querySelectorAll('.viewer-tab-btn').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
      }
    });
  });
})();
