# Smooth Scrolling Component

An intelligent smooth scrolling component for Tilda websites that automatically adapts to different input devices (mouse vs trackpad) and provides seamless integration with Tilda's popup system.

## 📁 Component Files

- **CSS**: `css/smooth-scrolling.css` - Minimal CSS reset
- **JavaScript**: `js/smooth-scrolling.js` - Main component logic
- **Template**: `templates/smooth-scrolling-template.html` - Implementation guide

## 🌐 GitHub Pages URLs

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub details:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/smooth_scrolling/css/smooth-scrolling.css
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/smooth_scrolling/js/smooth-scrolling.js
```

## 📋 Implementation in Tilda

### Method 1: External Files (Recommended)

Add this to your site's `<head>` section or T123 block:

```html
<!-- Required: Lenis library -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.3/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.3.3/dist/lenis.min.js"></script>

<!-- Component files -->
<link rel="stylesheet" href="https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/smooth_scrolling/css/smooth-scrolling.css">
<script src="https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/smooth_scrolling/js/smooth-scrolling.js"></script>
```

### Method 2: All-in-One Block

Copy the complete code from `all-in-one-example.html` and paste into a T123 block.

## ⚙️ Features

### 🖱️ **Adaptive Scrolling**
- **Mouse**: Smooth eased scrolling for precise control
- **Trackpad**: Direct/instant scrolling for natural feel
- **Touch**: Optimized for mobile devices

### 🔗 **Enhanced Navigation**
- **Anchor Links**: Smooth scrolling to page sections
- **Hash Support**: Proper URL hash management
- **Button Integration**: Works with Tilda button components

### 🪟 **Popup Integration**
- **Auto-detection**: Finds scrollable popup content
- **Dynamic Management**: Starts/stops scrolling as popups open/close
- **Memory Cleanup**: Prevents memory leaks

### 🧠 **Smart Detection**
- **Input Recognition**: Distinguishes between mouse wheel and trackpad
- **Real-time Adaptation**: Changes behavior instantly
- **Performance Optimized**: Minimal overhead

## 🔧 Configuration

### Scrolling Parameters

Edit the `config` object in `js/smooth-scrolling.js`:

```javascript
const config = {
    lerp: 0.08,           // Smoothing amount (0-1, lower = smoother)
    smoothWheel: true,    // Enable smooth wheel scrolling
    syncTouch: false,     // Disable touch sync for better mobile
    touchMultiplier: 0,   // Touch scroll multiplier
    infinite: false       // Disable infinite scroll
};
```

### Input Detection Sensitivity

Modify the detection logic in the `detector.detect()` method:

```javascript
// More aggressive mouse detection
if (absY > 50 || (absX === 0 && absY > 20)) method = 'mouse';
else if (absX > 2) method = 'trackpad';
// Adjust these values for different sensitivity
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