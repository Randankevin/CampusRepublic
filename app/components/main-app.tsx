import {
  Home,
  Calendar,
  MessageSquare,
  Briefcase,
  Bell,
  Search,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  User,
} from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EventsScreen } from "./events-screen";
import { ForumScreen } from "./forum-screen";
import { OpportunitiesScreen } from "./opportunities-screen";
import { UserProfile } from "./user-profile";

interface MainAppProps {
  onLogout?: () => void;
}

type TabType = "home" | "events" | "forum" | "opportunities" | "profile";

interface Post {
  id: string;
  type: "news" | "event" | "forum" | "opportunity";
  title: string;
  excerpt: string;
  image?: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
  category?: string;
}

export function MainApp({ onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const posts: Post[] = [
    {
      id: "1",
      type: "news",
      title: "New Library Wing Opens Next Week",
      excerpt:
        "The state-of-the-art study spaces feature modern amenities and 24/7 access for students...",
      image:
        "https://images.unsplash.com/photo-1707065634977-ad779c889242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wdXMlMjBidWlsZGluZyUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzY5MTc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      author: "Campus News",
      timestamp: "2 hours ago",
      likes: 234,
      comments: 45,
      category: "News",
    },
    {
      id: "2",
      type: "event",
      title: "Spring Festival 2026",
      excerpt:
        "Join us for live music, food trucks, and activities this Saturday at the Main Quad!",
      image:
        "https://images.unsplash.com/photo-1735713212111-e39b9cbcdbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZXZlbnQlMjBjb25jZXJ0fGVufDF8fHx8MTc2OTE3NTU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      author: "Student Union",
      timestamp: "5 hours ago",
      likes: 892,
      comments: 156,
      category: "Events",
    },
    {
      id: "3",
      type: "forum",
      title: "Best Study Spots on Campus?",
      excerpt:
        "Looking for recommendations for quiet places to study. The main library is always packed...",
      author: "@sarah_m",
      timestamp: "1 day ago",
      likes: 67,
      comments: 89,
      category: "Discussion",
    },
    {
      id: "4",
      type: "opportunity",
      title: "Summer Internship at Tech Corp",
      excerpt:
        "Seeking computer science students for paid summer internships. Applications due March 1st.",
      author: "Career Services",
      timestamp: "3 days ago",
      likes: 445,
      comments: 72,
      category: "Internships",
    },
  ];

  // Render based on active tab
  if (activeTab === "events") {
    return <EventsScreen onBack={() => setActiveTab("home")} />;
  }

  if (activeTab === "forum") {
    return <ForumScreen />;
  }

  if (activeTab === "opportunities") {
    return <OpportunitiesScreen />;
  }

  if (activeTab === "profile") {
    return <UserProfile onBack={() => setActiveTab("home")} onLogout={onLogout} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-semibold">Campus Republic</h1>
            <p className="text-sm text-muted-foreground">Good morning, Alex!</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-xs text-white flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-4">
        <div className="flex space-x-3 overflow-x-auto no-scrollbar">
          <button className="flex-shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Trending
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
            Following
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
            Clubs
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
            Sports
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="space-y-4 p-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              {post.image && (
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.timestamp}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="text-sm text-muted-foreground">{post.author}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <BookmarkPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border max-w-md mx-auto">
        <div className="flex items-center justify-around p-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              activeTab === "home"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              activeTab === "events"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Events</span>
          </button>

          <button
            onClick={() => setActiveTab("forum")}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              activeTab === "forum"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs font-medium">Forum</span>
          </button>

          <button
            onClick={() => setActiveTab("opportunities")}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              activeTab === "opportunities"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="w-6 h-6" />
            <span className="text-xs font-medium">Jobs</span>
          </button>
        </div>
      </div>
    </div>
  );
}