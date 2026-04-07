/* ============================================================
   TGR.Waves — Main Script
   ============================================================ */

/* ── NAV: ELEMENTS ── */
const mainNav      = document.getElementById('main-nav');
const navProgress  = document.getElementById('navProgress');
const scrollCue    = document.getElementById('scrollCue');
const navToggle    = document.getElementById('navToggle');
const navOverlay   = document.getElementById('navOverlay');
const navLinks     = document.getElementById('navLinks');
const navPillText  = document.getElementById('navPillText');
const navSectionPill = document.getElementById('navSectionPill');

/* ── NAV: SCROLL PROGRESS + COMPACT MODE ── */
function onScroll() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (navProgress) navProgress.style.width = pct + '%';

  if (mainNav) {
    mainNav.classList.toggle('nav--scrolled', scrollTop > 60);
  }

  if (scrollCue) {
    scrollCue.classList.toggle('cue--hidden', scrollTop > 80);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── NAV: ACTIVE SECTION DETECTION ── */
const sectionIds = ['overview', 'structure', 'legal', 'roadmap', 'artists', 'financials', 'checklist'];
const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const navLinkEls = navLinks ? [...navLinks.querySelectorAll('a[data-section]')] : [];

const sectionLabels = {
  overview:    'Overview',
  structure:   'Structure',
  legal:       'Legal',
  roadmap:     'Roadmap',
  artists:     'Artists',
  financials:  'Financials',
  checklist:   'Checklist',
};

let activeSection = null;

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    if (id === activeSection) return;
    activeSection = id;

    // Update desktop link active states
    navLinkEls.forEach(a => {
      a.classList.toggle('nav-active', a.dataset.section === id);
    });

    // Update section pill
    if (navPillText && navSectionPill) {
      navPillText.textContent = sectionLabels[id] || id;
      navSectionPill.classList.add('pill--visible');
    }
  });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

sectionEls.forEach(el => sectionObserver.observe(el));

/* ── NAV: MOBILE OVERLAY TOGGLE ── */
function openOverlay() {
  navOverlay.classList.add('overlay--open');
  navOverlay.setAttribute('aria-hidden', 'false');
  navToggle.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  navOverlay.classList.remove('overlay--open');
  navOverlay.setAttribute('aria-hidden', 'true');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (navToggle && navOverlay) {
  navToggle.addEventListener('click', () => {
    navOverlay.classList.contains('overlay--open') ? closeOverlay() : openOverlay();
  });

  // Close on overlay link click
  navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeOverlay);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlay();
  });
}

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// Stagger siblings
reveals.forEach(el => {
  const siblings = el.parentElement.querySelectorAll('.reveal');
  siblings.forEach((sib, j) => {
    sib.style.transitionDelay = (j * 0.08) + 's';
  });
});

/* ── REVENUE BARS ANIMATION ── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.rev-bar').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, i * 100);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const revSection = document.getElementById('revBars');
if (revSection) barObserver.observe(revSection);
