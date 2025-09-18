// DOM Elements
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav a');
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');


// Video Section Beginning - ENHANCED IN-PLACE PLAYBACK SYSTEM

        // VIDEO HANDLER - Enhanced for true one-click mobile playback
        function playVideo(container) {
            const videoId = container.getAttribute('data-video-id');
            if (!videoId) {
                console.log('No video ID found for container');
                return;
            }
            
            console.log('Playing video with ID:', videoId);
            
            // Check if this video is already playing
            const wasAlreadyPlaying = container.classList.contains('playing');
            
            // Stop all other videos
            document.querySelectorAll('.video-container.playing').forEach(other => {
                if (other !== container) {
                    stopVideo(other);
                }
            });
            
            // If this video was already playing, just stop it
            if (wasAlreadyPlaying) {
                stopVideo(container);
                return;
            }
            
            // Start the video with enhanced approach
            const iframe = container.querySelector('.video-iframe');
            if (iframe) {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                                ('ontouchstart' in window) || 
                                (navigator.maxTouchPoints > 0);
                
                if (isMobile) {
                    // For mobile, create a more direct approach
                    handleMobileVideoPlay(container, iframe, videoId);
                } else {
                    // Desktop behavior
                    iframe.src = `https://drive.google.com/file/d/${videoId}/preview`;
                    container.classList.add('playing');
                }
                console.log('Video started playing');
            } else {
                console.log('No iframe found in container');
            }
        }

        // Simplified mobile video handler - direct iframe replacement
        function handleMobileVideoPlay(container, iframe, videoId) {
            // Add loading state
            container.classList.add('loading');
            
            // Create a new iframe with mobile-optimized URL
            const newIframe = document.createElement('iframe');
            newIframe.className = 'video-iframe';
            newIframe.src = `https://drive.google.com/file/d/${videoId}/preview?usp=sharing`;
            newIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            newIframe.allowFullscreen = true;
            newIframe.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                background: #000;
                object-fit: cover;
                transform: scale(1.15);
                transform-origin: center;
            `;
            
            // Replace the old iframe
            iframe.parentNode.replaceChild(newIframe, iframe);
            
            // Mark as playing immediately
            container.classList.remove('loading');
            container.classList.add('playing');
        }

        // STOP VIDEO
        function stopVideo(container) {
            const iframe = container.querySelector('.video-iframe');
            const videoId = container.getAttribute('data-video-id');
            
            container.classList.remove('playing', 'loading');
            
            // Reset iframe to initial state
            if (iframe && videoId) {
                iframe.src = `https://drive.google.com/file/d/${videoId}/preview`;
            }
        }

        // FULLSCREEN FUNCTIONALITY
        function toggleFullscreen(container) {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }

        // OPEN IN GOOGLE DRIVE
        function openInGoogleDrive(container) {
            const videoId = container.getAttribute('data-video-id');
            if (videoId) {
                const driveUrl = `https://drive.google.com/file/d/${videoId}/view`;
                window.open(driveUrl, '_blank');
            }
        }

        function showError(container, message) {
            const errorMsg = container.querySelector('.error-message');
            if (errorMsg) {
                container.classList.remove('loading', 'playing');
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
                
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
            }
        }

        // Initialize carousel functionality
        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.getElementById('videoCarousel');
            if (!carousel) return;
            
            // Add smooth scrolling
            carousel.style.scrollBehavior = 'smooth';
            
            // Add click event listeners to all video containers
            const videoContainers = document.querySelectorAll('.video-container');
            
            videoContainers.forEach((container) => {
                let touchStarted = false;
                let clickHandled = false;
                
                // Touch start handler for mobile
                container.addEventListener('touchstart', function(e) {
                    touchStarted = true;
                    clickHandled = false;
                }, { passive: true });
                
                // Touch end handler for mobile - this is the main trigger
                container.addEventListener('touchend', function(e) {
                    if (touchStarted && !clickHandled) {
                        e.preventDefault();
                        e.stopPropagation();
                        clickHandled = true;
                        playVideo(container);
                        touchStarted = false;
                    }
                }, { passive: false });
                
                // Click handler for desktop and as fallback
                container.addEventListener('click', function(e) {
                    // Only handle click if it wasn't a touch event
                    if (!clickHandled) {
                        e.preventDefault();
                        e.stopPropagation();
                        clickHandled = true;
                        playVideo(container);
                    }
                });
                
                // Prevent context menu on long press
                container.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Handle touch cancel
                container.addEventListener('touchcancel', function(e) {
                    touchStarted = false;
                    clickHandled = false;
                });
            });
            
            // Add keyboard controls CHANGE END VIDEOS
            document.addEventListener('keydown', function(e) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    
                    const playingVideo = document.querySelector('.video-container.playing');
                    if (playingVideo) {
                        stopVideo(playingVideo);
                    } else {
                        const firstVisibleVideo = document.querySelector('.video-container');
                        if (firstVisibleVideo) {
                            playVideo(firstVisibleVideo);
                        }
                    }
                }
            });
            
            // Optional: Add arrow navigation
            // You can add navigation arrows here if needed
        });

        // Handle clicks outside videos to stop playback
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.video-container')) {
                // Clicked outside any video container
                document.querySelectorAll('.video-container.playing').forEach(container => {
                    // Don't stop videos when clicking on other UI elements
                    // This is optional - remove if you want videos to keep playing
                });
            }
        });

        // Pause videos when page becomes hidden
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                document.querySelectorAll('.video-container.playing').forEach(container => {
                    stopVideo(container);
                });
            }
        });

        // Handle fullscreen changes
        document.addEventListener('fullscreenchange', function() {
            console.log('=== FULLSCREEN CHANGE ===');
            if (!document.fullscreenElement) {
                // Exited fullscreen - ensure all videos are in normal state
                document.querySelectorAll('.video-container').forEach(container => {
                    container.classList.remove('fullscreen');
                });
            }
        });

        // Handle webkit fullscreen changes
        document.addEventListener('webkitfullscreenchange', function() {
            console.log('=== WEBKIT FULLSCREEN CHANGE ===');
            if (!document.webkitFullscreenElement) {
                // Exited fullscreen - ensure all videos are in normal state
                document.querySelectorAll('.video-container').forEach(container => {
                    container.classList.remove('fullscreen');
                });
            }
        });

// Video Section End

// Draggable emoji functionality for student bricks
const draggableEmojis = document.querySelectorAll('.brick-emoji');
let isDraggingEmoji = false;
let currentDraggedEmoji = null;
let hasBeenDraggedEmoji = new Set();
let emojiStartX, emojiStartY;
let emojiCurrentX = 0, emojiCurrentY = 0;
let emojiVelocityX = 0, emojiVelocityY = 0;
let emojiLastX = 0, emojiLastY = 0;
let emojiAnimationId = null;

// Initialize draggable functionality for emojis
draggableEmojis.forEach(emoji => {
  // Mouse events
  emoji.addEventListener('mousedown', (e) => {
    startEmojiDrag(e, emoji);
  });

  // Touch events for mobile
  emoji.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startEmojiDrag(mouseEvent, emoji);
  });

  // Prevent context menu on right click
  emoji.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
});

function startEmojiDrag(e, emoji) {
  isDraggingEmoji = true;
  currentDraggedEmoji = emoji;
  hasBeenDraggedEmoji.add(emoji);
  emoji.style.animation = 'none';
  emoji.style.transform = 'scale(1.1)';
  
  // Cancel any ongoing animation
  if (emojiAnimationId) {
    cancelAnimationFrame(emojiAnimationId);
    emojiAnimationId = null;
  }
  
  // Get current position relative to the brick
  const brick = emoji.closest('.student-brick');
  const brickRect = brick.getBoundingClientRect();
  const emojiRect = emoji.getBoundingClientRect();
  
  // Calculate current position relative to brick
  emojiCurrentX = emojiRect.left - brickRect.left;
  emojiCurrentY = emojiRect.top - brickRect.top;
  
  // Calculate mouse offset from emoji
  emojiStartX = e.clientX - emojiRect.left;
  emojiStartY = e.clientY - emojiRect.top;
  emojiLastX = e.clientX;
  emojiLastY = e.clientY;
  
  e.preventDefault();
}

// Mouse events for emojis
document.addEventListener('mouseup', () => {
  if (isDraggingEmoji && currentDraggedEmoji) {
    endEmojiDrag();
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isDraggingEmoji || !currentDraggedEmoji) return;
  e.preventDefault();
  handleEmojiMove(e.clientX, e.clientY);
});

// Touch events for emojis
document.addEventListener('touchend', () => {
  if (isDraggingEmoji && currentDraggedEmoji) {
    endEmojiDrag();
  }
});

document.addEventListener('touchmove', (e) => {
  if (!isDraggingEmoji || !currentDraggedEmoji) return;
  e.preventDefault();
  const touch = e.touches[0];
  handleEmojiMove(touch.clientX, touch.clientY);
});

function endEmojiDrag() {
  isDraggingEmoji = false;
  currentDraggedEmoji.style.transform = 'scale(1)';
  
  // Start gentle floating animation
  animateEmojiToStop();
  currentDraggedEmoji = null;
}

function handleEmojiMove(clientX, clientY) {
  // Calculate velocity for smooth deceleration
  emojiVelocityX = clientX - emojiLastX;
  emojiVelocityY = clientY - emojiLastY;
  emojiLastX = clientX;
  emojiLastY = clientY;

  // Get brick position for relative positioning
  const brick = currentDraggedEmoji.closest('.student-brick');
  const brickRect = brick.getBoundingClientRect();
  
  // Calculate new position relative to brick
  emojiCurrentX = clientX - brickRect.left - emojiStartX;
  emojiCurrentY = clientY - brickRect.top - emojiStartY;

  // Apply smooth movement
  currentDraggedEmoji.style.left = `${emojiCurrentX}px`;
  currentDraggedEmoji.style.top = `${emojiCurrentY}px`;
}

function animateEmojiToStop() {
  const friction = 0.95; // Smooth friction for emojis
  const emoji = currentDraggedEmoji; // Store reference before it becomes null
  
  function animate() {
    if (Math.abs(emojiVelocityX) < 0.01 && Math.abs(emojiVelocityY) < 0.01) {
      // Animation complete - resume gentle floating
      if (emoji) {
        emoji.style.animation = 'gentle-float 3s ease-in-out infinite';
      }
      return; // Stop animation when velocity is very low
    }
    
    emojiVelocityX *= friction;
    emojiVelocityY *= friction;
    
    emojiCurrentX += emojiVelocityX;
    emojiCurrentY += emojiVelocityY;
    
    if (emoji) {
      emoji.style.left = `${emojiCurrentX}px`;
      emoji.style.top = `${emojiCurrentY}px`;
    }
    
    emojiAnimationId = requestAnimationFrame(animate);
  }
  
  animate();
}

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
  // Mouse events
  element.addEventListener('mousedown', (e) => {
    startDrag(e, element);
  });

  // Touch events for mobile
  element.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrag(mouseEvent, element);
  });

  // Prevent context menu on right click
  element.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
});

function startDrag(e, element) {
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
}

// Mouse events
document.addEventListener('mouseup', () => {
  if (isDragging && currentDraggedElement) {
    endDrag();
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !currentDraggedElement) return;
  e.preventDefault();
  handleMove(e.clientX, e.clientY);
});

// Touch events
document.addEventListener('touchend', () => {
  if (isDragging && currentDraggedElement) {
    endDrag();
  }
});

document.addEventListener('touchmove', (e) => {
  if (!isDragging || !currentDraggedElement) return;
  e.preventDefault();
  const touch = e.touches[0];
  handleMove(touch.clientX, touch.clientY);
});

function endDrag() {
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

function handleMove(clientX, clientY) {
  // Calculate velocity for smooth deceleration
  velocityX = clientX - lastX;
  velocityY = clientY - lastY;
  lastX = clientX;
  lastY = clientY;

  // Get container position for relative positioning
  const container = document.querySelector('.circles-container');
  const containerRect = container.getBoundingClientRect();
  
  // Calculate new position relative to container
  currentX = clientX - containerRect.left - startX;
  currentY = clientY - containerRect.top - startY;

  // Apply smooth movement
  currentDraggedElement.style.left = `${currentX}px`;
  currentDraggedElement.style.top = `${currentY}px`;
}

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
            e.preventDefault();
            
            // Handle specific button actions
            if (button.textContent.includes('Explore')) {
                scrollToSection('#classes');
            } else if (button.textContent.includes('Apply to Summer Guild')) {
                window.open('https://www.researchnycalumni.org/news/college/389/389-CUNY-Tech-Equity-2025-Summer-Guild-Student-Application', '_blank');
            } else if (button.textContent.includes('About Floreo Labs')) {
                window.open('https://www.floreolabs.org/post/floreo-cuny-partner-to-deliver-summer-guild-program', '_blank');
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
        const targetPosition = section.offsetTop - headerHeight + 50; // Reduced offset for better centering
        
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

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Toggle mobile menu - simplified for better mobile support
    function toggleMobileMenu() {
        mobileNav.classList.toggle('active');
        mobileMenuToggle.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
    }
    
    // Click event for mobile menu toggle
    mobileMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Touch event for mobile menu toggle
    mobileMenuToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking on links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            mobileNav.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
            
            // Handle navigation after closing menu
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight + 50;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileNav.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });
    
    // Also close on touch outside
    document.addEventListener('touchend', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileNav.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
            mobileNav.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });
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
    // setupVideoPlayers(); // Removed - conflicts with our custom iframe video system
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
