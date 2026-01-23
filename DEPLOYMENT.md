# Deployment Guide for Campus Republic PWA

## Overview

Campus Republic is now a fully functional Progressive Web App (PWA) that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service
- Self-hosted servers

## Before Going Live

### 1. Ensure HTTPS is Enabled
PWAs require HTTPS to function. This is mandatory for service workers to register.

### 2. Verify Manifest
The app includes a PWA manifest at `/public/manifest.json` with:
- ✅ App name and branding
- ✅ Icons for home screen installation
- ✅ Start URL and scope configuration
- ✅ Display mode set to standalone

### 3. Service Worker
The service worker (`/public/sw.js`) provides:
- ✅ Offline support with cache-first strategy
- ✅ Asset caching
- ✅ Network fallback

## Deployment Steps

### Option 1: GitHub Pages (Recommended for this repo)

```bash
# 1. Update your git remote if not already done
git remote add origin https://github.com/yourusername/CampusRepublic.git

# 2. Build the project
npm run build

# 3. Commit and push
git add .
git commit -m "PWA build ready for deployment"
git push -u origin main

# 4. In GitHub repo settings:
# - Go to Settings > Pages
# - Select "Deploy from a branch"
# - Choose "main" and "/(root)" folder
# - Click Save
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build the project
- Deploy to GitHub Pages

Your app will be available at: `https://yourusername.github.io/CampusRepublic/`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 4: Self-Hosted Server

1. Build the project: `npm run build`
2. Upload the contents of the `dist/` folder to your web server
3. Configure your server to serve `index.html` for all routes (important for SPA routing)
4. Ensure HTTPS is enabled

#### Nginx Example:
```nginx
server {
    listen 443 ssl http2;
    server_name campusrepublic.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/campus-republic/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Example:
```apache
<VirtualHost *:443>
    ServerName campusrepublic.yourdomain.com
    DocumentRoot /var/www/campus-republic/dist

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    <Directory /var/www/campus-republic/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## Testing the PWA

### Before Deployment
```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` and check:
- ✅ Install button appears (in Chrome DevTools > Application > Manifest)
- ✅ Service worker registers (in Chrome DevTools > Application > Service Workers)
- ✅ All pages load correctly
- ✅ Offline functionality works

### After Deployment (HTTPS required)

1. **Desktop (Chrome/Edge):**
   - Click install button in address bar, or
   - Right-click > Install app

2. **Mobile:**
   - Android: Share menu > "Add to Home Screen" or install button
   - iOS: Share menu > "Add to Home Screen"

## Troubleshooting

### "Install button not showing"
- ✅ Ensure site is served over HTTPS
- ✅ Verify manifest.json is accessible at `/manifest.json`
- ✅ Check DevTools > Application > Manifest for errors
- ✅ Ensure manifest has valid name, short_name, icons, and start_url

### "Service worker not registering"
- ✅ Confirm HTTPS is enabled
- ✅ Check that `/sw.js` is accessible
- ✅ Look for errors in DevTools > Application > Service Workers
- ✅ Clear cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### "Offline not working"
- ✅ Service worker must be registered successfully
- ✅ Check DevTools > Application > Cache Storage for cached files
- ✅ Verify network connectivity in DevTools > Network tab

## Important Security Notes

1. **HTTPS Required**: PWA features will not work without HTTPS
2. **Service Worker Scope**: Defaults to root `/`. Adjust in manifest.json if needed
3. **Cache Management**: Service worker caches assets indefinitely. New builds will be served to users after they clear cache or service worker updates

## Performance Tips

- Build output is already optimized (~55KB gzipped JavaScript)
- CSS is minified and Tree-shaken (~15KB gzipped)
- Images use fallback mechanism for reliability
- Consider adding a cache invalidation strategy for long-term deployment

## Next Steps

1. ✅ Build complete and tested
2. ⏳ Choose deployment platform
3. ⏳ Enable HTTPS (mandatory for PWA)
4. ⏳ Deploy to production
5. ⏳ Test installation on mobile and desktop
6. ⏳ Monitor service worker updates

---

For more info, see [README.md](../README.md)
