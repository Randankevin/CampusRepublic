# Campus Republic PWA

A Progressive Web App version of Campus Republic - a campus community platform where students can share experiences, ask questions, and connect with peers.

## Features

- **Forum/Feed**: Share posts, view discussions, upvote content
- **Events**: Browse and manage campus events
- **Opportunities**: Find internships, jobs, and volunteer positions
- **User Profile**: Manage your profile and settings
- **PWA Support**: Install as a standalone app, works offline
- **Responsive Design**: Works on all devices (mobile, tablet, desktop)

## Installation & Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Set source branch to `main` and folder to `/(root)` 
4. The CI/CD workflow will automatically build and deploy

### Self-Hosted

1. Build the project: `npm run build`
2. Upload contents of `dist/` folder to your web server
3. Ensure your server serves `index.html` for all routes (SPA routing)
4. Make sure HTTPS is enabled (required for PWA)

### Important: Subdirectory Deployment

If deploying to a subdirectory (e.g., `example.com/campusrepublic/`), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/campusrepublic/',
  // ... rest of config
})
```

Also update the service worker registration in `index.html` scope:

```json
{
  "start_url": "/campusrepublic/",
  "scope": "/campusrepublic/",
  // ...
}
```

## PWA Features

- **Installable**: Add to home screen on mobile or install as app on desktop
- **Offline Support**: Service worker caches essential files
- **App Manifest**: Full PWA manifest for native app experience
- **Responsive**: Optimized for all screen sizes

## Project Structure

```
├── app/
│   ├── App.tsx              # Main app component
│   ├── components/
│   │   ├── main-app.tsx     # Main application layout
│   │   ├── forum-screen.tsx # Forum/feed component
│   │   ├── events-screen.tsx
│   │   ├── opportunities-screen.tsx
│   │   ├── user-profile.tsx
│   │   └── ui/              # Reusable UI components
│   └── styles/
├── src/
│   └── main.tsx            # React entry point
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker
├── index.html              # HTML entry point
└── vite.config.ts          # Vite configuration
```

## License

See ATTRIBUTIONS.md for details.
