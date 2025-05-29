// Smooth Scrolling Component with Lenis
// Provides smooth scrolling for desktop devices, disabled for touch devices
(function() {
    'use strict';

    let smoothEnabled = false;

    // Device detection - determine once at initialization
    const deviceDetector = {
        isTouchDevice() {
            // Check for touch capability
            const hasTouch = 'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0 || 
                           navigator.msMaxTouchPoints > 0;
            
            // Check user agent for mobile/tablet indicators
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            
            // Check screen size (tablets/mobile typically have smaller screens)
            const isSmallScreen = window.innerWidth <= 1024;
            
            // If any touch indicators are present, consider it a touch device
            return hasTouch || isMobileUA || (hasTouch && isSmallScreen);
        },

        init() {
            // Set smooth scrolling based on device type
            smoothEnabled = !this.isTouchDevice();
            console.log(`Smooth scrolling ${smoothEnabled ? 'enabled' : 'disabled'} for ${this.isTouchDevice() ? 'touch' : 'desktop'} device`);
        }
    };

    // Initialize device detection first
    deviceDetector.init();

    const config = {
        lerp: smoothEnabled ? 0.12 : 1,
        smoothWheel: smoothEnabled,
        syncTouch: false,
        touchMultiplier: 0,
        wheelMultiplier: 1,
        infinite: false
    };

    const selectors = {
        popup: '.t-popup_show',
        candidates: ['.t-form__inputsbox', '.t-slds__items-wrapper', '.t-gallery__item-wrapper', '.t-popup__content', '.t-popup__td-content', '.t-popup__container', '.t-rec[data-record-type="604"] .t604__maincontainer'],
        anchors: 'a[href^="#"]',
        wrappers: '.t396__elem[data-elem-type="button"]',
        triggers: ['a[href^="#popup"]', 'a[href^="#order"]', 'div[data-tooltip-hook]', '.js-gallery-zoom-trigger', '.t-submit[href^="#"]', '[data-popup-hook*="#popup"]']
    };

    class TildaController {
        constructor() {
            this.lenis = null;
            this.popups = new Map();
            this.stoppedByPopup = false;
            this.rafId = null;
            this.observer = null;
            this.destroyed = false;
            this.init();
        }

        init() {
            this.lenis = new Lenis(config);
            this.startRAF();
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        startRAF() {
            const raf = (time) => {
                if (this.destroyed) return;
                this.lenis?.raf(time);
                this.popups.forEach(instance => instance?.raf(time));
                this.rafId = requestAnimationFrame(raf);
            };
            this.rafId = requestAnimationFrame(raf);
        }

        setup() {
            this.reconcilePopups();
            setTimeout(() => this.reconcilePopups(), 500);
            this.setupEvents();
            this.setupObserver();
        }

        setupEvents() {
            // Use capture phase to intercept anchor clicks before other handlers
            document.body.addEventListener('click', (e) => {
                this.handleAnchor(e);
                this.handlePopupTrigger(e);
            }, { capture: true });
            
            // Also prevent default anchor behavior on mousedown for extra safety
            document.body.addEventListener('mousedown', (e) => {
                const anchor = this.findAnchor(e.target);
                if (anchor) {
                    const href = anchor.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                    }
                }
            }, { capture: true });
        }

        handleAnchor(e) {
            const anchor = this.findAnchor(e.target);
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // Prevent default behavior immediately for all hash links
            if (href.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (href === '#') {
                this.lenis?.scrollTo(0);
                // Don't update hash immediately to prevent jump
                setTimeout(() => {
                    if (window.location.hash !== '') {
                        history.replaceState(null, null, window.location.pathname + window.location.search);
                    }
                }, 100);
            } else if (href.startsWith('#') && href.length > 1) {
                this.scrollToAnchor(href);
            }
        }

        findAnchor(target) {
            let anchor = target.closest(selectors.anchors);
            if (anchor) return anchor;

            const wrapper = target.closest(selectors.wrappers);
            return wrapper?.querySelector(selectors.anchors);
        }

        scrollToAnchor(href) {
            const name = href.substring(1);
            let target = document.querySelector(href) || document.querySelector(`a[name="${name}"]`);
            
            if (!target) {
                const popup = document.querySelector(`[data-tooltip-hook*="${href}"]`) || 
                            document.querySelector(`#rec${name}`) ||
                            document.querySelector(`.t-popup[data-tooltip-hook*="${name}"]`);
                if (popup) return;
            }

            if (target && this.lenis) {
                // Ensure smooth scrolling is active
                if (this.stoppedByPopup) {
                    this.lenis.start();
                }
                
                // Scroll smoothly to target
                this.lenis.scrollTo(target, {
                    offset: 0,
                    duration: smoothEnabled ? 1.2 : 0,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    onComplete: () => {
                        // Update hash only after scroll is complete
                        if (window.location.hash !== href) {
                            history.replaceState(null, null, window.location.pathname + window.location.search + href);
                        }
                        
                        // Resume popup state if needed
                        if (this.stoppedByPopup && this.popups.size > 0) {
                            this.lenis.stop();
                        }
                    }
                });
            }
        }

        handlePopupTrigger(e) {
            const trigger = e.target.closest(selectors.triggers.join(', '));
            if (trigger) {
                setTimeout(() => this.reconcilePopups(), 250);
            }
        }

        setupObserver() {
            this.observer = new MutationObserver(() => this.reconcilePopups());
            this.observer.observe(document.body, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['style', 'class']
            });
        }

        reconcilePopups() {
            if (this.destroyed) return;
            this.cleanupPopups();
            this.createPopups();
            this.manageGlobal();
        }

        cleanupPopups() {
            this.popups.forEach((instance, element) => {
                const popup = element.closest('.t-popup');
                if (!document.body.contains(element) || !popup?.classList.contains('t-popup_show')) {
                    instance?.destroy();
                    this.popups.delete(element);
                }
            });
        }

        createPopups() {
            document.querySelectorAll(selectors.popup).forEach(popup => {
                if (this.hasPopup(popup)) return;
                const scrollable = this.findScrollable(popup);
                if (scrollable) {
                    // Use the same config as main Lenis instance
                    const instance = new Lenis({ wrapper: scrollable, content: scrollable, ...config });
                    this.popups.set(scrollable, instance);
                }
            });
        }

        findScrollable(popup) {
            for (const sel of selectors.candidates) {
                const candidate = popup.querySelector(sel);
                if (candidate && this.isScrollable(candidate)) return candidate;
                if (candidate) {
                    for (const child of candidate.children) {
                        if (this.isScrollable(child)) return child;
                    }
                }
            }
            return this.isScrollable(popup) ? popup : null;
        }

        isScrollable(el) {
            if (!el) return false;
            const style = getComputedStyle(el);
            return ['scroll', 'auto'].some(v => style.overflowY === v || style.overflowX === v);
        }

        hasPopup(popup) {
            return Array.from(this.popups.keys()).some(el => el === popup || popup.contains(el));
        }

        manageGlobal() {
            const hasPopups = this.popups.size > 0;
            if (hasPopups && !this.stoppedByPopup) {
                this.lenis?.stop();
                this.stoppedByPopup = true;
            } else if (!hasPopups && this.stoppedByPopup) {
                this.lenis?.start();
                this.stoppedByPopup = false;
            }
        }

        destroy() {
            this.destroyed = true;
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.lenis?.destroy();
            this.popups.forEach(instance => instance?.destroy());
            this.observer?.disconnect();
        }
    }

    const controller = new TildaController();
    window.TildaController = {
        destroy: () => controller?.destroy(),
        getInstance: () => controller
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => controller?.destroy());

})(); 