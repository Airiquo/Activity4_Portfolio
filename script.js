/* ==========================================================
   script.js
   Interactive features:
   1. Dark / light mode toggle (remembers the choice)
   2. Hamburger menu for mobile navigation
   3. Highlights the nav link of the section in view
   ========================================================== */

// Grab the elements we need once, up front
const root = document.documentElement;                 // <html> element, holds data-theme
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.site-nav a');

/* ---------- 1. DARK / LIGHT MODE ---------- */

// Apply a theme ("light" or "dark") and update the button text
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  // The button shows the theme you will switch TO
  themeLabel.textContent = theme === 'dark' ? 'light' : 'dark';
}

// Read the saved theme; fall back to the visitor's system preference
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (error) {
    // localStorage can be blocked, so ignore the error and continue
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Switch between themes when the button is clicked and save the choice
function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (error) {
    // Saving is optional, so ignore failures
  }
}

applyTheme(getInitialTheme());
themeToggle.addEventListener('click', toggleTheme);

/* ---------- 2. HAMBURGER MENU ---------- */

// Open or close the mobile menu and keep aria-expanded in sync
function setMenu(open) {
  siteNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', function () {
  setMenu(!siteNav.classList.contains('open'));
});

// Close the menu after a link is tapped
navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    setMenu(false);
  });
});

/* ---------- 3. ACTIVE LINK ON SCROLL ---------- */

// Watch each section and mark its nav link as active while it is in view
const sections = document.querySelectorAll('main section, footer[id]');
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(function (section) {
  observer.observe(section);
});

// Keep the footer year up to date
document.getElementById('year').textContent = new Date().getFullYear();
