// Fidelia Atelier Website JavaScript - Luxury Enhanced

function isUsableImageSource(source) {
  if (typeof source !== 'string') return false;

  const trimmedSource = source.trim();
  if (!trimmedSource || /^(REPLACE_WITH_|SOURCE_HERE_)/i.test(trimmedSource)) return false;

  try {
    const protocol = new URL(trimmedSource, document.baseURI).protocol;
    return ['http:', 'https:', 'file:'].includes(protocol);
  } catch {
    return false;
  }
}

function applyImageSource(image, source, placeholder) {
  image.classList.add('is-pending');
  image.setAttribute('aria-hidden', 'true');
  if (!isUsableImageSource(source)) return;

  image.addEventListener('load', function() {
    image.classList.remove('is-pending');
    image.removeAttribute('aria-hidden');
    if (placeholder) placeholder.classList.add('has-image');
  }, { once: true });

  image.addEventListener('error', function() {
    image.removeAttribute('src');
    image.classList.add('is-pending');
    image.setAttribute('aria-hidden', 'true');
    if (placeholder) placeholder.classList.remove('has-image');
  }, { once: true });

  image.src = source.trim();
}

function createImageSlot(source, category, index) {
  const slot = document.createElement('figure');
  slot.className = 'image-source-slot';

  const image = document.createElement('img');
  image.className = 'configured-image';
  image.alt = `${category} image ${index + 1}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  slot.appendChild(image);
  applyImageSource(image, source, slot);

  return slot;
}

function initializeCentralImages() {
  const expectedCounts = { courseCatalog: 11, promo: 7, services: 18 };

  Object.keys(expectedCounts).forEach(category => {
    const sources = IMAGE_SOURCES[category];
    const expectedCount = expectedCounts[category];

    if (!Array.isArray(sources) || sources.length !== expectedCount) {
      console.error(`Image configuration error: ${category} must contain exactly ${expectedCount} sources.`);
      return;
    }

    const usedIndexes = new Set();
    document.querySelectorAll(`[data-image-category="${category}"]`).forEach(placeholder => {
      const index = Number(placeholder.getAttribute('data-image-index'));
      if (!Number.isInteger(index) || index < 0 || index >= sources.length) {
        console.error(`Image configuration error: invalid ${category} image index.`, placeholder);
        return;
      }

      const image = document.createElement('img');
      image.className = 'configured-image';
      image.alt = `${category} image ${index + 1}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      placeholder.appendChild(image);
      applyImageSource(image, sources[index], placeholder);
      usedIndexes.add(index);
    });

    document.querySelectorAll(`[data-image-gallery="${category}"]`).forEach(gallery => {
      sources.forEach((source, index) => {
        if (!usedIndexes.has(index)) {
          gallery.appendChild(createImageSlot(source, category, index));
        }
      });
    });
  });

  document.querySelectorAll('[data-central-image="branding.logo"]').forEach(logo => {
    applyImageSource(logo, IMAGE_SOURCES.branding.logo);
  });

  const favicon = document.getElementById('siteFavicon');
  if (favicon && isUsableImageSource(IMAGE_SOURCES.branding.favicon)) {
    favicon.href = IMAGE_SOURCES.branding.favicon.trim();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initializeCentralImages();
  
  // Mobile Menu Toggle Functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
      
      // Prevent body scroll when menu is open
      if (mobileMenu.classList.contains('active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    });
  }
  
  // Beauty Concern Selector (Interactive Find Your Solution)
  const concernButtons = document.querySelectorAll('.concern-btn');
  const solutionCards = document.querySelectorAll('.solution-card');
  
  if (concernButtons.length > 0 && solutionCards.length > 0) {
    concernButtons.forEach(button => {
      button.addEventListener('click', function() {
        const concern = this.getAttribute('data-concern');
        
        // Update active button
        concernButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding solution card
        solutionCards.forEach(card => {
          const solution = card.getAttribute('data-solution');
          card.classList.remove('active');
          
          if (solution === concern) {
            setTimeout(() => {
              card.classList.add('active');
            }, 150);
          }
        });
      });
    });
  }
  
  // FAQ Accordion Functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        const isOpen = item.hasAttribute('open');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.removeAttribute('open');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.removeAttribute('open');
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.setAttribute('open', '');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
  
  // Enhanced Smooth Scrolling with improved positioning
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or external link
      if (href === '#' || href.startsWith('http')) return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const announcementBar = document.querySelector('.announcement-bar');
        const announcementHeight = announcementBar ? announcementBar.offsetHeight : 0;
        
        const targetRect = targetElement.getBoundingClientRect();
        const targetPosition = targetRect.top + window.pageYOffset - navbarHeight - announcementHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Enhanced Navbar Scroll Effect
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class for styling
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Enhanced hide/show navbar logic
    if (scrollTop > lastScrollTop && scrollTop > 150) {
      // Scrolling down - hide navbar
      navbar.style.transform = 'translateY(-100%)';
      navbar.style.transition = 'transform 0.3s ease-in-out';
    } else {
      // Scrolling up - show navbar
      navbar.style.transform = 'translateY(0)';
      navbar.style.transition = 'transform 0.3s ease-in-out';
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Enhanced Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.card, .hero-content, .section, .philosophy-pillar, .solution-card');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Floating WhatsApp Button Enhancement
  const floatingWhatsapp = document.getElementById('floatingWhatsapp');
  
  if (floatingWhatsapp) {
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 300) {
        floatingWhatsapp.style.opacity = '1';
        floatingWhatsapp.style.transform = 'scale(1)';
      } else {
        floatingWhatsapp.style.opacity = '0.7';
        floatingWhatsapp.style.transform = 'scale(0.9)';
      }
    });
    
    // Add click tracking (optional analytics)
    floatingWhatsapp.addEventListener('click', function() {
      // Add analytics tracking here if needed
      console.log('WhatsApp floating button clicked');
    });
  }
  
  // Grid Layout Enhancement for Services
  const serviceGrids = document.querySelectorAll('.grid-3');
  serviceGrids.forEach(grid => {
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    grid.style.justifyContent = 'center';
  });
  
});

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  .floating-whatsapp {
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .solution-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .faq-answer {
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
document.head.appendChild(style);

// Enhanced Utility Functions
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav-links a[href^="#"]');
  
  let current = '';
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollTop >= sectionTop - 200 && scrollTop < sectionTop + sectionHeight - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Enhanced Loading Animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  // Trigger hero animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add('animate-in');
    }, 100);
  }
  
  // Initialize first solution card
  const firstConcernBtn = document.querySelector('.concern-btn');
  if (firstConcernBtn) {
    setTimeout(() => {
      firstConcernBtn.click();
    }, 500);
  }
});

// Performance optimization - Debounced scroll handler
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll-heavy functions
const debouncedUpdateActiveNavLink = debounce(updateActiveNavLink, 50);
window.addEventListener('scroll', debouncedUpdateActiveNavLink);