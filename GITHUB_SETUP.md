# Push to GitHub - Quick Instructions

## 1️⃣ Create GitHub Repository

Go to https://github.com/new and create a new repository:
- Name: `CampusRepublic` (or your preferred name)
- Description: "Campus Republic PWA - Progressive Web App for campus community"
- Visibility: Public (to deploy with GitHub Pages)
- Don't initialize with README, .gitignore, or license (we have our own)

After creating, GitHub will show you the commands to push existing code.

## 2️⃣ Add Remote and Push

Copy and run these commands (replace YOUR_USERNAME and YOUR_REPO):

```bash
cd "c:\Users\voke\Documents\Ghostcodes\CR"

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

git branch -M main

git push -u origin main
```

Example:
```bash
git remote add origin https://github.com/randankevin/CampusRepublic.git
git branch -M main
git push -u origin main
```

## 3️⃣ Enable GitHub Pages

After pushing:
1. Go to your GitHub repository
2. Settings > Pages
3. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: main, /(root)
4. Click Save

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## 4️⃣ Done! 🎉

The GitHub Actions workflow will automatically build and deploy your app on every push to main.

---

Need help? Let me know and I can guide you through any step!
