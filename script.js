// DOM Elements
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav a');
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

// Draggable circles functionality for multiple elements

const draggableElements = document.querySelectorAll('.draggable-bg');
let isDragging = false;
let currentDraggedElement = null;
let hasBeenDragged = new Set();
let startX, startY;
let currentX = 0, currentY = 0;
let velocityX = 0, velocityY = 0;
let lastX = 0, lastY = 0;
let animationId = null;

// Initialize draggable functionality for all elements
draggableElements.forEach(element => {
  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    currentDraggedElement = element;
    hasBeenDragged.add(element);
    element.classList.add('dragging');
    element.classList.remove('smooth-levitate'); // Remove smooth levitation when starting to drag
    
    // Cancel any ongoing animation
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    // Get current position relative to the container
    const container = document.querySelector('.circles-container');
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // Calculate current position relative to container
    currentX = elementRect.left - containerRect.left;
    currentY = elementRect.top - containerRect.top;
    
    // Calculate mouse offset from element
    startX = e.clientX - elementRect.left;
    startY = e.clientY - elementRect.top;
    lastX = e.clientX;
    lastY = e.clientY;
    
    e.preventDefault();
  });

  // Prevent context menu on right click
  element.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
});

document.addEventListener('mouseup', () => {
  if (isDragging && currentDraggedElement) {
    isDragging = false;
    currentDraggedElement.classList.remove('dragging');
    
    // If the element has been dragged, permanently stop levitation
    if (hasBeenDragged.has(currentDraggedElement)) {
      currentDraggedElement.classList.add('no-levitate');
    }
    
    // Start gentle floating animation
    animateToStop();
    currentDraggedElement = null;
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !currentDraggedElement) return;
  e.preventDefault();

  // Calculate velocity for smooth deceleration
  velocityX = e.clientX - lastX;
  velocityY = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;

  // Get container position for relative positioning
  const container = document.querySelector('.circles-container');
  const containerRect = container.getBoundingClientRect();
  
  // Calculate new position relative to container
  currentX = e.clientX - containerRect.left - startX;
  currentY = e.clientY - containerRect.top - startY;

  // Apply smooth movement
  currentDraggedElement.style.left = `${currentX}px`;
  currentDraggedElement.style.top = `${currentY}px`;
});

function animateToStop() {
  const friction = 0.97; // Smoother friction to prevent glitching
  const element = currentDraggedElement; // Store reference before it becomes null
  
  function animate() {
    if (Math.abs(velocityX) < 0.005 && Math.abs(velocityY) < 0.005) {
      // Animation complete - immediately resume original levitation for ALL circles
      if (element) {
        element.classList.remove('no-levitate');
      }
      return; // Stop animation when velocity is very low
    }
    
    velocityX *= friction;
    velocityY *= friction;
    
    currentX += velocityX;
    currentY += velocityY;
    
    if (element) {
      element.style.left = `${currentX}px`;
      element.style.top = `${currentY}px`;
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
}

// Header Scroll Effect
function handleScroll() {
    const scrollPosition = window.scrollY;
    
    // Add/remove header background on scroll
    if (scrollPosition > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Smooth Scrolling for Navigation
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Link Highlighting
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const navLink = navLinks[index];
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Video Player Enhancements
function setupVideoPlayers() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Pause other videos when one starts playing
        video.addEventListener('play', () => {
            videos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        });
        
        // Add loading state
        video.addEventListener('loadstart', () => {
            const container = video.closest('.video-container');
            container.classList.add('loading');
        });
        
        video.addEventListener('canplay', () => {
            const container = video.closest('.video-container');
            container.classList.remove('loading');
        });
        
        // Error handling
        video.addEventListener('error', () => {
            const container = video.closest('.video-container');
            container.innerHTML = '<div class="video-error">Video temporarily unavailable</div>';
        });
    });
}

// Statistics Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000; // 2 seconds
    const stepTime = 50; // Update every 50ms
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '');
        }
    }, stepTime);
}

// Instructor and Student Card Interactions
function setupCardInteractions() {
    const instructorCards = document.querySelectorAll('.instructor-card');
    const studentCards = document.querySelectorAll('.student-card');
    
    // Add hover effects for instructor cards
    instructorCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const avatar = card.querySelector('.avatar-gif');
            if (avatar) {
                avatar.style.transform = 'scale(1.1)';
                avatar.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const avatar = card.querySelector('.avatar-gif');
            if (avatar) {
                avatar.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add click interactions for student cards
    studentCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

// Lazy Loading for Images and Videos
function setupLazyLoading() {
    const lazyElements = document.querySelectorAll('img[data-src], video[data-src]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                }
                
                lazyObserver.unobserve(element);
            }
        });
    }, { rootMargin: '50px' });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// Button Click Handlers
function setupButtonHandlers() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add ripple effect
            createRipple(e, button);
            
            // Handle specific button actions
            if (button.textContent.includes('Explore')) {
                scrollToSection('#classes');
            } else if (button.textContent.includes('Get Notified')) {
                handleNotificationSignup();
            } else if (button.textContent.includes('Learn More')) {
                handleLearnMore();
            }
        });
    });
}

function createRipple(event, button) {
    const ripple = document.createElement('div');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        const headerHeight = header.offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function handleNotificationSignup() {
    // Simulate notification signup
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Signing up...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Thank you!';
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }, 1500);
}

function handleLearnMore() {
    // Scroll to overview section
    scrollToSection('#overview');
}

// Mobile Menu Toggle (if needed in future)
function setupMobileMenu() {
    // Placeholder for mobile menu functionality
    // Can be expanded if mobile menu is added to HTML
}

// Performance Optimization
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

// Optimized scroll handler
const debouncedScrollHandler = debounce(() => {
    handleScroll();
    updateActiveNavLink();
}, 10);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    setupIntersectionObserver();
    setupVideoPlayers();
    animateCounters();
    setupCardInteractions();
    setupLazyLoading();
    setupButtonHandlers();
    setupMobileMenu();
    
    // Add scroll event listener
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Add resize event listener for responsive adjustments
    window.addEventListener('resize', debounce(() => {
        // Handle any resize-specific logic here
    }, 250));
    
    // Add classes for initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause all videos when page is not visible
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.paused) {
                video.pause();
                video.dataset.wasPlaying = 'true';
            }
        });
    } else {
        // Resume videos that were playing before
        const videos = document.querySelectorAll('video[data-was-playing="true"]');
        videos.forEach(video => {
            video.play();
            delete video.dataset.wasPlaying;
        });
    }
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// Export functions for potential external use
window.FloereGuildSite = {
    scrollToSection,
    animateCounter,
    createRipple
};
