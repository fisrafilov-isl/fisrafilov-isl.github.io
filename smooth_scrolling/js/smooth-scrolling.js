// Smooth Scrolling Component with Lenis
// Provides adaptive smooth scrolling that adjusts based on input device
(function() {
    'use strict';

    let smoothEnabled = true;
    let lastInput = 'mouse';
    let currentInputMode = 'mouse'; // Track current mode for immediate prevention

    const detector = {
        detect(e) {
            let method = 'unknown';
            
            if (e.type === 'wheel') {
                const { deltaX, deltaY } = e;
                const absY = Math.abs(deltaY);
                const absX = Math.abs(deltaX);

                // Less aggressive detection to prevent constant switching
                if (absY > 80 || (absX === 0 && absY > 40)) method = 'mouse';
                else if (absX > 5) method = 'trackpad';
                else if (absY < 10 && e.deltaMode === 0) method = 'trackpad';
                else method = absY > 50 ? 'mouse' : 'trackpad';

                // Only update if there's a significant change to prevent flickering
                currentInputMode = method;
            } else if (e.type.startsWith('pointer')) {
                method = e.pointerType === 'mouse' ? 'mouse' : 'touch';
                currentInputMode = method;
            } else if (e.type.startsWith('touch')) {
                method = 'touch';
                currentInputMode = method;
            }

            // Add debouncing to prevent rapid switching
            if (method !== 'unknown' && method !== lastInput) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    lastInput = method;
                    this.update(method);
                }, 50);
            }
        },

        update(method) {
            const shouldSmooth = method === 'mouse';
            if (shouldSmooth === smoothEnabled) return;
            
            smoothEnabled = shouldSmooth;
            const controller = window.TildaController?.getInstance();
            if (!controller) return;

            if (!controller.stoppedByPopup && controller.lenis) {
                if (shouldSmooth) {
                    // More responsive settings for mouse with higher lerp
                    controller.lenis.options.lerp = 0.12; // Increased for more responsiveness
                    controller.lenis.options.smoothWheel = true;
                    controller.lenis.options.wheelMultiplier = 1;
                } else {
                    // Keep some smoothing even for trackpad but make it very responsive
                    controller.lenis.options.lerp = 0.8; // Much higher for near-instant response
                    controller.lenis.options.smoothWheel = true;
                    controller.lenis.options.wheelMultiplier = 1.2;
                }
            }
            controller.updatePopups();
        },

        init() {
            // Use passive: false to allow preventDefault if needed
            document.addEventListener('wheel', e => {
                // Prevent any potential conflicts with native scrolling
                if (smoothEnabled) {
                    e.preventDefault();
                }
                this.detect(e);
            }, { passive: false });
            document.addEventListener('pointerdown', e => this.detect(e), { passive: true });
            document.addEventListener('touchstart', e => this.detect(e), { passive: true });
        }
    };

    const config = {
        lerp: 0.12,
        smoothWheel: true,
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
                    const options = { 
                        ...config, 
                        lerp: smoothEnabled ? 0.12 : 0.8, // Use improved lerp values
                        smoothWheel: true, // Always keep smooth wheel enabled
                        wheelMultiplier: smoothEnabled ? 1 : 1.2
                    };
                    const instance = new Lenis({ wrapper: scrollable, content: scrollable, ...options });
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

        updatePopups() {
            this.popups.forEach(instance => {
                if (instance?.options) {
                    instance.options.lerp = smoothEnabled ? 0.12 : 0.8; // Use improved lerp values
                    instance.options.smoothWheel = true; // Always keep smooth wheel enabled
                    instance.options.wheelMultiplier = smoothEnabled ? 1 : 1.2;
                }
            });
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

    // Initialize input detector and controller
    detector.init();
    
    const controller = new TildaController();
    window.TildaController = {
        destroy: () => controller?.destroy(),
        getInstance: () => controller
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => controller?.destroy());

})(); 