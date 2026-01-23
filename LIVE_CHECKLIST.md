
# Going Live Checklist ✅

## Pre-Deployment Checklist

### Code Quality
- [ ] All errors resolved (`npm run build` succeeds)
- [ ] No console warnings or errors when running locally
- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Tested on mobile devices (iOS and Android)
- [ ] All navigation links work
- [ ] All UI components display correctly

### PWA Features
- [ ] Service worker registers successfully
- [ ] Install button appears on supported browsers
- [ ] App can be installed to home screen
- [ ] Offline mode works (test by going offline)
- [ ] Manifest.json is valid (check DevTools > Application > Manifest)
- [ ] Icons display correctly

### Performance
- [ ] Build size is reasonable
- [ ] Page load time is acceptable
- [ ] No memory leaks (check DevTools > Memory)
- [ ] Lighthouse PWA score is 90+

### Deployment Configuration
- [ ] HTTPS is enabled on production domain ⚠️ REQUIRED
- [ ] Environment variables configured if needed
- [ ] Service worker scope matches deployment path
- [ ] Manifest start_url matches deployment path

## Deployment Steps

### Step 1: Build Production Version
```bash
npm run build
```

### Step 2: Choose Your Platform

**GitHub Pages:**
```bash
git push origin main
# Automatic deployment via CI/CD
```

**Netlify:**
```bash
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
vercel --prod
```

**Self-Hosted:**
1. Upload `dist/` folder to server
2. Configure server for SPA routing
3. Enable HTTPS

### Step 3: Post-Deployment Verification

#### Immediate Checks
- [ ] Site loads at production URL
- [ ] HTTPS is active (🔒 in address bar)
- [ ] No mixed content warnings
- [ ] Manifest.json loads successfully
- [ ] Service worker registers

#### PWA Features
- [ ] Install button appears on Chrome/Edge
- [ ] "Add to Home Screen" works on mobile
- [ ] App installs and launches correctly
- [ ] Offline mode works
- [ ] Cached resources load from cache (check Network tab)

#### Functionality
- [ ] All pages accessible
- [ ] Forum feed displays posts
- [ ] Events screen shows events
- [ ] Opportunities section loads
- [ ] User profile works
- [ ] Navigation between tabs works
- [ ] Clicking upvotes/interactions works

#### DevTools Checks
- [ ] Application > Manifest shows valid manifest
- [ ] Application > Service Workers shows active service worker
- [ ] Application > Storage shows Cache Storage with cached files
- [ ] Network tab shows assets served from cache
- [ ] Console has no errors

### Step 4: Mobile Testing

#### Android
- [ ] Open in Chrome
- [ ] Install prompt appears
- [ ] App installs to home screen
- [ ] Launches as standalone app
- [ ] Works offline

#### iOS
- [ ] Open in Safari
- [ ] Use Share > Add to Home Screen
- [ ] App appears on home screen
- [ ] Launches in full screen (no Safari UI)
- [ ] Status bar color matches theme

## Ongoing Maintenance

### Weekly
- [ ] Monitor for errors in browser console
- [ ] Check analytics/usage
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review service worker behavior
- [ ] Check cache hit rates

### As Needed
- [ ] Deploy bug fixes with `npm run build` + push
- [ ] Clear old caches if making major updates
- [ ] Update manifest.json if changing branding
- [ ] Update service worker if adding new cache strategies

## Rollback Plan

If deployment has issues:

1. Revert code to last known good version
2. Run `npm run build` locally
3. Test locally
4. Redeploy to production

Since the service worker caches assets, users may still see old versions. To force cache clear:
- Users can go to Settings > Clear Cache on the app
- Or manually clear browser cache

## Performance Targets

- **Lighthouse PWA Score**: 90+
- **Lighthouse Performance Score**: 80+
- **Initial Load Time**: < 3 seconds
- **Offline Response**: < 100ms (from cache)

## Support

If issues occur:

1. Check browser DevTools:
   - Console tab for errors
   - Network tab for failed requests
   - Application tab for service worker/cache status

2. Review logs on server (if self-hosted)

3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting

---

Last Updated: January 23, 2026
