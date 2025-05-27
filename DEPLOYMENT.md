# GitHub Pages Deployment Guide

## 📋 Initial Setup

### 1. Create Repository
```bash
# Initialize repository if not already done
git init
git add .
git commit -m "Initial commit: Grade Calculator component"
```

### 2. Connect to GitHub
```bash
# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch
6. Click **Save**

## 🌐 Your Live URLs

After deployment, your files will be available at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/grade_calc/css/grade-calculator.css
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/grade_calc/js/grade-calculator.js
```

## 🔄 Making Updates

### Update Component Logic
```bash
# Edit files in grade_calc/ folder
git add .
git commit -m "Update grade calculator logic"
git push origin main
```

Changes will be live within **1-2 minutes** of pushing to GitHub.

## 📁 Adding New Components

1. Create new folder: `new_component/`
2. Add structure: `css/`, `js/`, `templates/`
3. Update main README.md with new URLs
4. Commit and push changes

## 🔧 Folder Structure Benefits

✅ **Multiple Projects**: Each component in its own folder  
✅ **Clean URLs**: Predictable paths for easy integration  
✅ **Organization**: Clear separation of components  
✅ **Scalability**: Easy to add new components  

## 🚨 Important Notes

- **GitHub Pages can take 5-10 minutes** for first deployment
- **Updates are usually live within 1-2 minutes**
- **Custom domains**: You can add your own domain in repository settings
- **HTTPS**: GitHub Pages automatically provides SSL certificates

## 📋 Integration in Tilda

### Method 1: External Files
```html
<link rel="stylesheet" href="https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/grade_calc/css/grade-calculator.css">
<script src="https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/grade_calc/js/grade-calculator.js"></script>

<!-- HTML template content here -->
```

### Method 2: All-in-One
Copy contents from `grade_calc/all-in-one-example.html` into T123 block.

## 🎯 Testing

1. **Test locally**: Open HTML files in browser
2. **Test GitHub URLs**: Wait for deployment, then test URLs
3. **Test in Tilda**: Add T123 block with external files
4. **Verify functionality**: Check if calculator works properly 