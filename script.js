// Enhanced Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });

  // Theme Management
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  }

  // Mobile Menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.querySelectorAll('span').forEach(span => span.classList.remove('active'));
        }
      }
    });
  });

  // Navbar background on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
      }
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.8)';
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
      }
    }
  });

  // Animated Statistics
  function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current);
      }, 16);
    });
  }

  // Project Carousel
  let currentProject = 0;
  const projectCards = document.querySelectorAll('.project-card');
  const projectIndicators = document.querySelectorAll('.project-indicator');
  const totalProjects = projectCards.length;

  function showProject(index) {
    // Remove active class from all projects and indicators
    projectCards.forEach(card => card.classList.remove('active'));
    projectIndicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current project and indicator
    projectCards[index].classList.add('active');
    projectIndicators[index].classList.add('active');
    
    currentProject = index;
  }

  // Next/Previous buttons
  document.querySelector('.project-nav.next').addEventListener('click', () => {
    currentProject = (currentProject + 1) % totalProjects;
    showProject(currentProject);
  });

  document.querySelector('.project-nav.prev').addEventListener('click', () => {
    currentProject = (currentProject - 1 + totalProjects) % totalProjects;
    showProject(currentProject);
  });

  // Indicator clicks
  projectIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showProject(index);
    });
  });

  // Auto-advance projects (optional)
  setInterval(() => {
    currentProject = (currentProject + 1) % totalProjects;
    showProject(currentProject);
  }, 5000); // Change project every 5 seconds

  // Form Handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Notification System
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 400px;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === 'home') {
          animateStatistics();
        }
      }
    });
  }, observerOptions);

  // Observe elements
  const homeSection = document.querySelector('#home');
  if (homeSection) observer.observe(homeSection);

  // Particles.js Background
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#2563eb'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.1,
          random: true
        },
        size: {
          value: 3,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#2563eb',
          opacity: 0.1,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        }
      },
      retina_detect: true
    });
  }

  // Initialize the first project
  showProject(0);

  // Add CSS for mobile menu animation
  const style = document.createElement('style');
  style.textContent = `
    .nav-links.active {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: var(--bg-card);
      border-top: 1px solid var(--border);
      padding: 1rem 0;
    }
    
    .mobile-menu-btn span.active:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    
    .mobile-menu-btn span.active:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-menu-btn span.active:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  `;
  document.head.appendChild(style);
});
