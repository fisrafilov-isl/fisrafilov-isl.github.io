# Smooth Scrolling Component

A smooth scrolling component for Tilda websites that provides enhanced scrolling experiences with intelligent device detection and seamless integration with Tilda's popup system.

## 📁 Component Files

- **CSS**: `css/smooth-scrolling.css` - Minimal CSS reset
- **CSS (Minified)**: `css/smooth-scrolling.min.css` - Production-ready version
- **JavaScript**: `js/smooth-scrolling.js` - Main component logic
- **JavaScript (Minified)**: `js/smooth-scrolling.min.js` - Production-ready version
- **Template**: `templates/smooth-scrolling-template.html` - Implementation guide
- **All-in-One**: `all-in-one-example.html` - Complete implementation in single file

## 🌐 GitHub Pages URLs

**Live URLs (Standard):**

```
https://fisrafilov-isl.github.io/smooth_scrolling/css/smooth-scrolling.css
https://fisrafilov-isl.github.io/smooth_scrolling/js/smooth-scrolling.js
```

**Live URLs (Minified - Recommended for Production):**

```
https://fisrafilov-isl.github.io/smooth_scrolling/css/smooth-scrolling.min.css
https://fisrafilov-isl.github.io/smooth_scrolling/js/smooth-scrolling.min.js
```

## 📋 Implementation in Tilda

### Method 1: External Files (Recommended)

Add this to your site's `<head>` section or T123 block:

```html
<!-- Required: Lenis library -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.3/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.3.3/dist/lenis.min.js"></script>

<!-- Component files -->
<link rel="stylesheet" href="https://fisrafilov-isl.github.io/smooth_scrolling/css/smooth-scrolling.min.css">
<script src="https://fisrafilov-isl.github.io/smooth_scrolling/js/smooth-scrolling.min.js"></script>
```

### Method 2: All-in-One Block

Copy the complete code from `all-in-one-example.html` and paste into a T123 block. This contains the same functionality as the external files but in a single, self-contained block.

## ⚙️ Features

### 🖱️ **Smart Device Detection**
- **Desktop**: Smooth eased scrolling enabled (lerp: 0.12)
- **Touch Devices**: Direct scrolling for optimal mobile experience
- **Detection Method**: Comprehensive device detection using multiple indicators:
  - Touch capability detection
  - User agent analysis
  - Screen size consideration

### 🔗 **Enhanced Navigation**
- **Anchor Links**: Smooth scrolling to page sections
- **Hash Support**: Proper URL hash management
- **Button Integration**: Works with Tilda button components

### 🪟 **Popup Integration**
- **Auto-detection**: Finds scrollable popup content
- **Dynamic Management**: Starts/stops scrolling as popups open/close
- **Memory Cleanup**: Prevents memory leaks

### 🧠 **Performance Optimization**
- **One-time Detection**: Device type determined once at initialization
- **Minimal Overhead**: No continuous input monitoring
- **Memory Efficient**: Automatic cleanup and resource management

## 🔧 Configuration

### Scrolling Parameters

Edit the `config` object in `js/smooth-scrolling.js` or in the all-in-one template:

```javascript
const config = {
    lerp: smoothEnabled ? 0.12 : 1,  // Smoothing for desktop only
    smoothWheel: smoothEnabled,      // Based on device detection
    syncTouch: false,               // Touch sync disabled
    touchMultiplier: 0,             // Touch multiplier
    wheelMultiplier: 1,             // Wheel multiplier
    infinite: false                 // Disable infinite scroll
};
```

### Device Detection Sensitivity

Modify the detection logic in the `deviceDetector.isTouchDevice()` method:

```javascript
// Adjust screen size threshold for tablets
const isSmallScreen = window.innerWidth <= 1024; // Change this value

// Add custom user agent patterns
const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|your-pattern/i.test(userAgent);
```

### Popup Selectors

Update `selectors.candidates` to include custom popup content:

```javascript
const selectors = {
    popup: '.t-popup_show',
    candidates: [
        '.t-form__inputsbox',
        '.t-slds__items-wrapper', 
        '.t-gallery__item-wrapper',
        '.t-popup__content',
        '.t-popup__td-content',
        '.t-popup__container',
        '.your-custom-popup-content' // Add your selectors
    ],
    // ... other selectors
};
```

## 🎯 Integration Notes

### **Site-wide Installation**
For best results, add the component to your site's global settings rather than individual pages.

### **Tilda Compatibility**
- ✅ Works with all Tilda blocks
- ✅ Compatible with Zero Block (T396)
- ✅ Supports Tilda popups and forms
- ✅ Handles dynamic content loading

### **Performance**
- 🚀 Uses `requestAnimationFrame` for smooth rendering
- 🧹 Automatic cleanup on page unload
- 💾 Minimal memory footprint

## 🔍 API Reference

The component exposes a global `TildaController` object:

```javascript
// Get the controller instance
const controller = window.TildaController.getInstance();

// Manually destroy (usually not needed)
window.TildaController.destroy();

// Access Lenis instance directly
controller.lenis.scrollTo(target);
controller.lenis.stop();
controller.lenis.start();
```

## 🐛 Troubleshooting

### **Scrolling Not Working**
1. Check browser console for errors
2. Verify Lenis library loaded before component
3. Ensure no CSS `overflow: hidden` on body/html

### **Conflicting with Other Scripts**
1. Load this component last
2. Check for other smooth scroll libraries
3. Verify no CSS `scroll-behavior` conflicts

### **Popup Issues**
1. Check popup selectors in `selectors.candidates`
2. Verify popup has proper scrollable content
3. Test popup opening/closing sequence

### **Device Detection Issues**
1. Check console for device detection logs
2. Test on different devices to verify behavior
3. Adjust detection thresholds if needed

## 📝 Browser Support

- ✅ **Chrome/Edge**: Full support
- ✅ **Firefox**: Full support  
- ✅ **Safari**: Full support
- ✅ **Mobile**: Touch-optimized

## 🔄 Updates

To update the component:
1. Edit files in the `smooth_scrolling/` folder
2. Commit and push to GitHub
3. Changes go live automatically on GitHub Pages

## ⚠️ Important Notes

- **Dependencies**: Requires Lenis library
- **Load Order**: Must load after Lenis, before DOM ready
- **Conflicts**: May conflict with other smooth scroll solutions
- **Performance**: Uses RAF loop - monitor performance on low-end devices
- **Implementation**: Choose external files for modularity, all-in-one for simplicity

## 🚀 Performance Metrics

- **File Size**: ~8KB unminified, ~3KB minified
- **CPU Usage**: Minimal (device detection once, RAF loop only)
- **Memory**: Low footprint with automatic cleanup
- **Compatibility**: Works across all modern browsers and devices

## 🔄 Version History

- **v1.0**: Initial device detection implementation
- **v1.1**: Added minified files and improved popup handling
- **v1.2**: Enhanced device detection and documentation
- **v1.3**: Unified implementation across all templates 