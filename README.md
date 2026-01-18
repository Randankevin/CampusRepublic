# CampusRepublic 🎓

A Reddit and Substack-inspired platform for campus students to communicate, share ideas, and socialize.

## Features

### Reddit-like Features
- **Posts & Voting**: Create posts with upvote/downvote system
- **Comments**: Nested comment threads
- **Communities**: Join and create campus communities/hubs
- **Hot Algorithm**: Posts ranked by engagement and recency
- **Categories**: Organize content by type (memes, academic, blogs, etc.)

### Substack-like Features
- **Publications**: Create and manage your own publication/blog
- **Subscriptions**: Follow publications and communities
- **Newsletter-style Posts**: Long-form content with rich text
- **User Profiles**: Showcase your content and achievements

### Additional Features
- **Real-time Updates**: Live feed updates using Supabase Realtime
- **User Authentication**: Secure auth with Supabase
- **Notifications**: Get notified about interactions
- **Bookmarks**: Save posts for later
- **Search**: Find posts, users, and communities
- **University Filtering**: Filter content by your university
- **Anonymous Posting**: Option to post anonymously

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL + Realtime + Auth)
- **Styling**: Custom CSS with modern design
- **Database**: PostgreSQL with Row Level Security

## Project Structure

```
CampusRepublic/
├── index.html              # Main HTML file
├── src/
│   ├── app.js             # Main application logic
│   ├── auth.js            # Authentication functions
│   ├── posts.js           # Post management
│   ├── comments.js        # Comment system
│   ├── votes.js           # Voting system
│   ├── communities.js     # Community management
│   ├── publications.js    # Publication features
│   ├── notifications.js   # Notification system
│   └── utils.js           # Utility functions
├── styles/
│   └── main.css           # Main stylesheet
├── database-schema.sql     # Database schema
└── README.md              # This file
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CampusRepublic
   ```

2. **Set up Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `database-schema.sql` in your Supabase SQL editor
   - Get your project URL and anon key

3. **Configure Supabase**
   - Update the Supabase URL and key in `src/app.js`

4. **Open the application**
   - Simply open `index.html` in a browser or use a local server

## Database Schema

The database includes tables for:
- `profiles` - User profiles
- `communities` - Campus communities/hubs
- `publications` - User publications
- `posts` - Posts/content
- `comments` - Comments and replies
- `votes` - Upvotes/downvotes
- `subscriptions` - User subscriptions
- `follows` - User follows
- `notifications` - User notifications
- `bookmarks` - Saved posts
- `tags` - Content tags

See `database-schema.sql` for complete schema with indexes and triggers.

## Features in Detail

### Posts
- Create posts with title, content, category, and university
- Support for anonymous posting
- Rich text content (HTML)
- Voting system
- Comment threads
- Hot score algorithm for trending

### Communities
- Create and join communities
- Community-specific feeds
- Member counts and statistics
- University-based communities

### Publications
- Create your own publication
- Manage subscribers
- Publish long-form content
- Newsletter-style distribution

### User Profiles
- Customizable profiles
- Karma system
- Activity feed
- Follow/follower system

## Contributing

This is a student project. Feel free to contribute ideas and improvements!

## License

MIT License

