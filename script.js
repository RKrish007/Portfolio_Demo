/**
 * Krishnan Narayanan - Portfolio & Resume website interactive script
 * Features:
 * - Theme Switcher (Dark/Light persistent state)
 * - Reveal-on-scroll animations (Intersection Observer)
 * - Dynamic Skill-bar loading animations
 * - Scrollspy Active Nav Indicator
 * - Mobile Navigation Sidebar Drawer
 * - Contact Form Handler with simulated AJAX visual states
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollAnimations();
  initScrollspy();
  initContactForm();
  initCurrentYear();
});

/* ==========================================
   1. THEME SWITCHER LOGIC
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-switcher-btn');
  const iconLight = document.getElementById('theme-icon-light');
  const iconDark = document.getElementById('theme-icon-dark');
  
  if (!themeToggleBtn) return;

  // Retrieve previous choice or system default
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme === 'light') {
    setTheme('light');
  } else if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    // If no preference exists, follow system default
    setTheme(systemPrefersDark ? 'dark' : 'light');
  }

  // Toggle theme click listener
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Toggle corresponding SVGs
    if (theme === 'light') {
      iconLight.style.display = 'block';
      iconDark.style.display = 'none';
    } else {
      iconLight.style.display = 'none';
      iconDark.style.display = 'block';
    }
  }

  // Monitor system color scheme changes dynamically
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/* ==========================================
   2. MOBILE NAVIGATION OVERLAY MENU
   ========================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('main-navigation');
  
  if (!toggleBtn || !navLinksContainer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a navigation item is clicked
  const navLinks = navLinksContainer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside of the header region
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#site-header') && navLinksContainer.classList.contains('open')) {
      closeMenu();
    }
  });

  function openMenu() {
    navLinksContainer.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    // Change menu icon to "X" close
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    `;
  }

  function closeMenu() {
    navLinksContainer.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    // Change back to burger icon
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    `;
  }
}

/* ==========================================
   3. REVEAL-ON-SCROLL & SKILL LOADING
   ========================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Custom trigger for skill bar animations once their parent card is visible
        if (entry.target.classList.contains('skills-category')) {
          animateSkillBars(entry.target);
        }
        
        // Stop observing once animated to preserve resources
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: '0px 0px -40px 0px' // Offset triggers slightly
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  function animateSkillBars(categoryElement) {
    const cards = categoryElement.querySelectorAll('.skill-card');
    cards.forEach(card => {
      const fillBar = card.querySelector('.skill-bar-fill');
      const targetPercent = card.getAttribute('data-percentage') || '0';
      if (fillBar) {
        fillBar.style.width = `${targetPercent}%`;
      }
    });
  }
}

/* ==========================================
   4. SCROLLSPY (ACTIVE NAV INDICATOR)
   ========================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  if (!sections.length || !navLinks.length) return;

  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0.35, // Trigger when 35% of the section is visible
    rootMargin: '-80px 0px -40% 0px' // Adjust for sticky header height
  });

  sections.forEach(section => {
    scrollspyObserver.observe(section);
  });
}

/* ==========================================
   5. CONTACT FORM HANDLER WITH FEEDBACK STATES
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form-instance');
  const statusBanner = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('contact-submit-btn');
  
  if (!form || !statusBanner || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous status
    statusBanner.style.display = 'none';
    statusBanner.className = 'form-status';
    statusBanner.innerText = '';

    // Validate inputs
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all the required input fields before sending.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showStatus('Please specify a valid email address.', 'error');
      return;
    }

    // Interactive button loading state
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Sending Message...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate network server delay of 1.5 seconds
    setTimeout(() => {
      // Restore button status
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      
      // Show elegant positive feedback
      showStatus('Thank you, Krishnan! Your message has been sent successfully. I will get back to you shortly.', 'success');
      form.reset();
    }, 1500);
  });

  function showStatus(msg, statusType) {
    statusBanner.innerText = msg;
    statusBanner.classList.add(statusType);
    
    // Smooth scroll down to the banner inside the form
    statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
}

/* ==========================================
   6. DYNAMIC CURRENT YEAR
   ========================================== */
function initCurrentYear() {
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString();
  }
}
