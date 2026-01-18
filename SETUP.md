# CampusRepublic Setup Guide

## Quick Start

1. **Set up Supabase Database**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - In the SQL Editor, run the SQL from `database-schema.sql`
   - Copy your project URL and anon key

2. **Update Configuration**
   - Open `src/app.js`
   - Update `CONFIG.SUPABASE_URL` and `CONFIG.SUPABASE_KEY` with your Supabase credentials

3. **Run the Application**
   - Open `index.html` in a browser
   - Or use a local server:
     ```bash
     # Python
     python -m http.server 8000
     
     # Node.js
     npx serve
     
     # PHP
     php -S localhost:8000
     ```

## Database Setup

The database schema includes:

- **profiles** - User profiles extending Supabase auth
- **posts** - Posts/content with voting
- **comments** - Nested comment system
- **votes** - Upvote/downvote tracking
- **communities** - Campus communities/hubs
- **publications** - Substack-like publications
- **subscriptions** - User subscriptions
- **notifications** - User notifications
- **bookmarks** - Saved posts
- **tags** - Content tags

## Features Implemented

✅ User authentication
✅ Post creation and management
✅ Voting system (upvote/downvote)
✅ Comments system
✅ Communities
✅ Publications (Substack-like)
✅ Real-time updates
✅ Notifications
✅ User profiles

## Next Steps

- Add rich text editor
- Implement search functionality
- Add user profile pages
- Enhance notifications
- Add image uploads
- Implement moderation tools

## Troubleshooting

**CORS Errors**: Make sure you're running from a local server, not file://

**Database Errors**: Verify your Supabase credentials and that the schema has been applied

**Module Errors**: The app uses ES6 modules - make sure your server supports them

