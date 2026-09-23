// MMTC Media — Main JavaScript

// --- Lenis Smooth Scroll ---
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// --- GSAP Animations ---
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero animations
  gsap.from('.hero-badge', { opacity: 0, scale: 0.8, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' });
  gsap.from('.hero-title', { opacity: 0, y: 40, duration: 0.8, delay: 0.4, ease: 'power3.out' });
  gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 0.6, ease: 'power3.out' });
  gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.8, delay: 0.8, ease: 'power3.out' });

  // Section scroll reveals
  gsap.utils.toArray('.reveal').forEach(section => {
    gsap.from(section, {
      scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'
    });
  });

  // Stagger cards
  gsap.utils.toArray('.grid').forEach(grid => {
    const cards = grid.children;
    gsap.from(cards, {
      scrollTrigger: { trigger: grid, start: 'top 85%' },
      opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });
  });

  // Navbar scroll effect
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      if (self.direction === 1 && self.scroll() > 80) {
        navbar.classList.add('scrolled');
      } else if (self.scroll() <= 80) {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

// --- Navigation ---
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileClose = document.querySelector('.mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');

  if (!hamburger) return;

  function openMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const filename = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === filename || (filename === '' && href === 'index.html') || (filename === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initGSAP();
  initNavbar();
  setActiveNavLink();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

// --- Theme Toggle Logic ---
function initTheme() {
  const savedTheme = localStorage.getItem("mmtc-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  
  if (savedTheme === "light" || (!savedTheme && prefersLight)) {
    document.body.classList.add("light-theme");
  }
  
  updateThemeIcons();

  const toggleBtns = document.querySelectorAll(".theme-toggle");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      const isLight = document.body.classList.contains("light-theme");
      localStorage.setItem("mmtc-theme", isLight ? "light" : "dark");
      updateThemeIcons();
    });
  });
}

function updateThemeIcons() {
  const isLight = document.body.classList.contains("light-theme");
  const toggleBtns = document.querySelectorAll(".theme-toggle");
  toggleBtns.forEach(btn => {
    // We use lucide.createIcons() to re-render the icon
    btn.innerHTML = `<i data-lucide="${isLight ? "moon" : "sun"}"></i>`;
  });
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Call initTheme on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}

