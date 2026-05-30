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
  initBackgroundCanvas();
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
  if (savedTheme === 'dark') {
    setTheme('dark');
  } else if (savedTheme === 'light') {
    setTheme('light');
  } else {
    // If no preference exists, default to light mode
    setTheme('light');
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
        
        // Custom trigger for skill dot animations once their parent card is visible
        if (entry.target.classList.contains('skills-category')) {
          animateSkillDots(entry.target);
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

  function animateSkillDots(categoryElement) {
    const cards = categoryElement.querySelectorAll('.skill-card');
    cards.forEach(card => {
      const dots = card.querySelectorAll('.dot');
      const targetLevel = parseInt(card.getAttribute('data-level') || '0', 10);
      dots.forEach((dot, index) => {
        if (index < targetLevel) {
          setTimeout(() => {
            dot.classList.add('active');
          }, index * 120);
        }
      });
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
        window.activeSectionId = id;
        
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
    submitBtn.innerText = 'Opening Mail Client...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Trigger redirection after a brief delay for modern visual feedback
    setTimeout(() => {
      // Restore button status
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      
      // Construct mailto link with pre-filled details for direct email delivery
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const mailtoBody = encodeURIComponent(
        `Hi Krishnan,\n\n` +
        `You have received a new contact inquiry from your portfolio website:\n\n` +
        `----------------------------------------\n` +
        `Sender Name: ${name}\n` +
        `Sender Email: ${email}\n` +
        `Subject: ${subject}\n` +
        `----------------------------------------\n\n` +
        `Message:\n${message}\n\n` +
        `Best regards,\n` +
        `${name}`
      );
      
      const mailtoUrl = `mailto:krishnannarayanan2001@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      // Redirect to mail client
      window.location.href = mailtoUrl;
      
      // Show elegant positive feedback
      showStatus('Success! Opening your default mail client to complete the message submission to krishnannarayanan2001@gmail.com...', 'success');
      form.reset();
    }, 800);
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

/* ==========================================
   7. ANIMATED CANVAS BACKGROUND SYSTEM
   ========================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Core configurations
  let particleCount = 75;
  const particles = [];
  
  // Section-aware interactive settings (will ease smoothly)
  let speedFactor = 0.5;
  let maxDistance = 110;
  let targetSpeedFactor = 0.5;
  let targetMaxDistance = 110;

  // Initialize activeSectionId
  window.activeSectionId = 'hero';

  // Handle window resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Class Definition
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.radius = Math.random() * 3 + 2;
    }

    update() {
      // Apply the dynamic speed factor
      this.x += this.vx * speedFactor;
      this.y += this.vy * speedFactor;

      // Boundary bouncing
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(color) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  // Populate particles array
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation render loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Get current theme parameters
    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Choose theme colors (Teal for light theme, glowing Teal/Cyan for dark theme)
    const particleColor = isLightMode ? 'rgba(13, 148, 136, 0.55)' : 'rgba(20, 240, 200, 0.65)';
    const lineColor = isLightMode ? 'rgba(13, 148, 136, ' : 'rgba(20, 240, 200, ';

    // Transition settings smoothly according to current active content section
    const currentSection = window.activeSectionId || 'hero';
    if (currentSection === 'accomplishments' || currentSection === 'skills') {
      targetSpeedFactor = 0.85; // Faster, higher data flows
      targetMaxDistance = 135;  // Highly connected node mesh
    } else if (currentSection === 'contact') {
      targetSpeedFactor = 0.3;  // Slower, calming ambient drift
      targetMaxDistance = 90;   // Minimal connection tracks
    } else {
      targetSpeedFactor = 0.5;  // Standard pace
      targetMaxDistance = 110;
    }

    // Ease variables towards targets (linear interpolation)
    speedFactor += (targetSpeedFactor - speedFactor) * 0.05;
    maxDistance += (targetMaxDistance - maxDistance) * 0.05;

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw(particleColor);
    });

    // Draw mesh connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          // Calculate opacity based on proximity (further = fainter)
          const alpha = (1 - dist / maxDistance) * (isLightMode ? 0.25 : 0.38);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 1.35;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Initiate loops
  render();
}
