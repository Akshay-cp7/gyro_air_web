// GyroAir Landing Page with Interactive Gyroscope Visualization

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeDownload();
    initializeFAQ();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeButtonEffects();
    initializeGyroscopeAnimation();
    initializeAccessibility();
    createSecurityWarningModal(); // Add this new function
});

// Create Security Warning Modal with Real Screenshot
function createSecurityWarningModal() {
    // Create modal HTML with actual screenshot
    const modalHTML = `
    <div id="securityModal" class="security-modal" style="display: none;">
        <div class="modal-backdrop" onclick="closeSecurityModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <div class="warning-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Security Notice - Windows SmartScreen Warning</h3>
                <button class="modal-close" onclick="closeSecurityModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="warning-preview">
                    <div class="screenshot-container">
                        <img src="screenshot_gyroair.PNG" alt="Windows SmartScreen Security Warning Dialog" class="security-screenshot" />
                        <div class="screenshot-overlay">
                            <div class="overlay-badge">
                                <i class="fas fa-eye"></i>
                                <span>Expected Warning</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h4><i class="fas fa-info-circle"></i> Why does this happen?</h4>
                    <p>Windows SmartScreen shows this warning because we're not yet a verified publisher with Microsoft. This is normal for new software and doesn't mean the file is unsafe.</p>

                    <div class="solution-steps">
                        <h5><i class="fas fa-lightbulb"></i> How to proceed:</h5>
                        <ol>
                            <li>When you see this dialog, click <strong>"More info"</strong> (if available)</li>
                            <li>Then click <strong>"Run anyway"</strong> to install GyroAir</li>
                            <li>You may need to allow it through Windows Firewall</li>
                            <li>If no "More info" link, click <strong>"Run"</strong> directly</li>
                        </ol>
                    </div>

                    <div class="safety-note">
                        <h5><i class="fas fa-lock"></i> Safety Assurance</h5>
                        <ul>
                            <li>✓ GyroAir is completely open-source</li>
                            <li>✓ No malware, no data collection</li>
                            <li>✓ Code is publicly available for inspection</li>
                            <li>✓ No internet connection required after setup</li>
                            <li>✓ Works entirely on your local Wi-Fi network</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeSecurityModal()">
                    <i class="fas fa-arrow-left"></i>
                    Cancel Download
                </button>
                <button class="btn-primary" onclick="proceedWithDownload()">
                    <i class="fas fa-download"></i>
                    I Understand, Download Anyway
                </button>
            </div>
        </div>
    </div>
    `;

    // Insert modal into document
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Show Security Modal
function showSecurityModal() {
    const modal = document.getElementById('securityModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Focus on modal header or close button instead of bottom button
        const modalHeader = modal.querySelector('.modal-header h3');
        const closeButton = modal.querySelector('.modal-close');
        if (modalHeader) {
            modalHeader.setAttribute('tabindex', '-1');
            modalHeader.focus();
        } else if (closeButton) {
            closeButton.focus();
        }

        trackEvent('security_modal_shown', 'download_warning');
    }
}


// Close Security Modal
function closeSecurityModal() {
    const modal = document.getElementById('securityModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';

        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);

        // Track event
        trackEvent('security_modal_closed', 'user_cancelled');
    }
}

// Proceed with actual download
function proceedWithDownload() {
    closeSecurityModal();

    // Show brief confirmation
    if (window.announceToScreenReader) {
        window.announceToScreenReader('Download starting...');
    }

    // Proceed with actual download
    actuallyDownloadFile();

    // Track event
    trackEvent('download_proceeded', 'after_warning');
}

// Actual download function
function actuallyDownloadFile() {
    const downloadUrl = 'https://raw.githubusercontent.com/Akshay-cp7/gyro_air/main/dist/GyroAir.exe';

    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'GyroAir.exe';
    link.style.display = 'none';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success notification
    showDownloadNotification();
}

// Show download success notification
function showDownloadNotification() {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>Download Started!</strong>
                <p>GyroAir.exe is being downloaded to your Downloads folder</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Modified Download Button Functionality
function initializeDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadBtnMain = document.getElementById('downloadBtnMain');

    function handleDownload(button) {
        if (!button) return;

        // Show security warning modal instead of direct download
        showSecurityModal();

        // Track event
        trackEvent('download_initiated', 'security_warning_shown');
    }

    // Attach click handlers
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleDownload(downloadBtn);
        });
    }

    if (downloadBtnMain) {
        downloadBtnMain.addEventListener('click', (e) => {
            e.preventDefault();
            handleDownload(downloadBtnMain);
        });
    }
}

// Interactive Gyroscope Animation
function initializeGyroscopeAnimation() {
    const gyroContainer = document.querySelector('.gyroscope-container');
    const gyroX = document.getElementById('gyroX');
    const gyroY = document.getElementById('gyroY');
    const gyroZ = document.getElementById('gyroZ');

    if (!gyroContainer) return;

    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    // Mouse interaction
    gyroContainer.addEventListener('mouseenter', () => {
        isHovering = true;
        gyroContainer.style.transition = 'transform 0.3s ease';
    });

    gyroContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        gyroContainer.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
        updateGyroReadings(0, 0, 0);
    });

    gyroContainer.addEventListener('mousemove', (e) => {
        if (!isHovering) return;

        const rect = gyroContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX = (e.clientX - centerX) / rect.width * 40; // Max 40 degrees
        mouseY = (e.clientY - centerY) / rect.height * -40; // Inverted Y

        const rotateX = Math.max(-30, Math.min(30, mouseY));
        const rotateY = Math.max(-30, Math.min(30, mouseX));
        const rotateZ = Math.sin(Date.now() * 0.001) * 5; // Subtle Z rotation

        gyroContainer.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        updateGyroReadings(rotateX, rotateY, rotateZ);
    });

    // Update gyroscope readings display
    function updateGyroReadings(x, y, z) {
        if (gyroX) gyroX.textContent = x.toFixed(1) + '°';
        if (gyroY) gyroY.textContent = y.toFixed(1) + '°';
        if (gyroZ) gyroZ.textContent = z.toFixed(1) + '°';
    }

    // Automated gyroscope readings animation when not hovering
    function animateReadings() {
        if (!isHovering) {
            const time = Date.now() * 0.001;
            const x = Math.sin(time * 0.7) * 15;
            const y = Math.cos(time * 0.5) * 12;
            const z = Math.sin(time * 0.3) * 8;
            updateGyroReadings(x, y, z);
        }
        requestAnimationFrame(animateReadings);
    }

    animateReadings();

    // Touch device support
    if ('ontouchstart' in window) {
        let touchStartX = 0;
        let touchStartY = 0;

        gyroContainer.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isHovering = true;
        });

        gyroContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isHovering) return;

            const touch = e.touches[0];
            const deltaX = (touch.clientX - touchStartX) * 0.2;
            const deltaY = (touch.clientY - touchStartY) * -0.2;

            const rotateX = Math.max(-30, Math.min(30, deltaY));
            const rotateY = Math.max(-30, Math.min(30, deltaX));

            gyroContainer.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            updateGyroReadings(rotateX, rotateY, 0);
        });

        gyroContainer.addEventListener('touchend', () => {
            isHovering = false;
            gyroContainer.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
            updateGyroReadings(0, 0, 0);
        });
    }

    // Add performance optimization
    const rafCallback = throttle(() => {
        if (isHovering) {
            // Trigger reflow only when necessary
            gyroContainer.getBoundingClientRect();
        }
    }, 16); // 60fps

    window.addEventListener('scroll', rafCallback);
}

// FAQ Accordion Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all FAQ items with animation
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');

                    // Smooth scroll to FAQ item if needed
                    setTimeout(() => {
                        const rect = item.getBoundingClientRect();
                        if (rect.bottom > window.innerHeight) {
                            item.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest'
                            });
                        }
                    }, 300);
                }

                // Track FAQ interaction
                trackEvent('faq_click', question.textContent.trim());
            });

            // Add keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
                trackEvent('navigation_click', targetId);
            }
        });
    });
}

// Scroll Animations with Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.feature-card, .setup-step, .faq-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll([
        '.features-section',
        '.setup-section', 
        '.download-section',
        '.faq-section'
    ].join(','));

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .feature-card,
        .setup-step,
        .faq-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s ease-out;
        }

        .feature-card.animate-in,
        .setup-step.animate-in,
        .faq-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Enhanced Button Effects
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.cta-primary, .download-primary, .cta-secondary');

    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 100;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });

        // Add focus enhancement
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid rgba(102, 126, 234, 0.5)';
            this.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Add CSS for ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 0.6;
            }
            to {
                transform: scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #667eea;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s ease;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.id = 'main-content';
        heroSection.setAttribute('tabindex', '-1');
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Handle Enter/Space on interactive elements
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('faq-question')) {
            e.preventDefault();
            e.target.click();
        }

        // Handle Escape key
        if (e.key === 'Escape') {
            // Close security modal
            closeSecurityModal();

            // Close any open modals or dropdowns
            const activeElements = document.querySelectorAll('.active');
            activeElements.forEach(element => {
                if (element.classList.contains('faq-item')) {
                    element.classList.remove('active');
                }
            });
        }
    });

    // Add ARIA labels and descriptions
    const gyroContainer = document.querySelector('.gyroscope-container');
    if (gyroContainer) {
        gyroContainer.setAttribute('role', 'img');
        gyroContainer.setAttribute('aria-label', 'Interactive gyroscope visualization showing 3D rotation axes');
    }

    // Add live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    document.body.appendChild(liveRegion);

    // Store reference for announcements
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Event Tracking
function trackEvent(eventName, eventData) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'user_interaction',
            event_label: eventData,
            value: 1
        });
    }

    // Console logging for development
    console.log(`Event tracked: ${eventName}`, eventData);
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    window.addEventListener('load', function() {
        // Use requestIdleCallback if available
        const scheduleWork = window.requestIdleCallback || setTimeout;
        scheduleWork(() => {
            if ('performance' in window) {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page loaded in ${pageLoadTime}ms`);
                trackEvent('performance', `page_load_${Math.round(pageLoadTime)}ms`);
            }
        });
    });
}

// Error Handling
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Script error:', e.error);
        trackEvent('error', e.error ? e.error.toString() : 'Unknown script error');
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        trackEvent('error', `Promise rejection: ${e.reason || 'Unknown'}`);
    });
}

// Initialize performance monitoring and error handling
initializePerformanceMonitoring();
initializeErrorHandling();

// Export functions for external use
window.GyroAir = {
    // Core functions
    initializeDownload,
    initializeFAQ,
    initializeGyroscopeAnimation,

    // Security functions
    showSecurityModal,
    closeSecurityModal,

    // Utilities
    debounce,
    throttle,
    trackEvent,

    // Accessibility
    announceToScreenReader: () => window.announceToScreenReader,

    // Version
    version: '1.0.0'
};

// Initialize all systems
console.log('GyroAir Landing Page v1.0.0 loaded successfully');
