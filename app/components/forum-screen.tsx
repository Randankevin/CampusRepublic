import {
  TrendingUp,
  MessageCircle,
  ArrowUp,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  comments: number;
  category: string;
  isUpvoted: boolean;
}

export function ForumScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "1",
      title: "Best Study Spots on Campus?",
      content:
        "Looking for recommendations for quiet places to study. The main library is always packed during finals week. Any hidden gems you all know about?",
      author: "@sarah_m",
      timestamp: "2 hours ago",
      upvotes: 67,
      comments: 89,
      category: "General",
      isUpvoted: false,
    },
    {
      id: "2",
      title: "Anyone interested in starting a Gaming Club?",
      content:
        "I'd love to create a gaming club for casual and competitive players. We could organize tournaments and weekly meetups. Who's in?",
      author: "@gamer_joe",
      timestamp: "5 hours ago",
      upvotes: 142,
      comments: 56,
      category: "Clubs",
      isUpvoted: true,
    },
    {
      id: "3",
      title: "Tips for First-Year Students",
      content:
        "Starting your first year can be overwhelming. Here are some tips that helped me: 1) Join clubs early, 2) Build relationships with professors, 3) Don't skip breakfast...",
      author: "@senior_student",
      timestamp: "1 day ago",
      upvotes: 453,
      comments: 123,
      category: "Advice",
      isUpvoted: false,
    },
    {
      id: "4",
      title: "Lost and Found: Blue Backpack",
      content:
        "Found a blue backpack near the engineering building yesterday. Has some textbooks and a laptop inside. DM me to claim it!",
      author: "@helpful_sam",
      timestamp: "2 days ago",
      upvotes: 28,
      comments: 15,
      category: "Lost & Found",
      isUpvoted: false,
    },
  ]);

  const categories = [
    "all",
    "General",
    "Clubs",
    "Advice",
    "Lost & Found",
    "Housing",
  ];

  const handleUpvote = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
              isUpvoted: !post.isUpvoted,
            }
          : post
      )
    );
  };

  const filteredPosts =
    selectedFilter === "all"
      ? posts
      : posts.filter((post) => post.category === selectedFilter);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Forum</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="p-4 space-y-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-card rounded-xl border border-border p-4 space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              {/* Upvote Button */}
              <button
                onClick={() => handleUpvote(post.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  post.isUpvoted
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-xs font-medium">{post.upvotes}</span>
              </button>

              {/* Post Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.timestamp}
                  </span>
                </div>

                <h3 className="font-semibold text-lg leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">
                    {post.author}
                  </span>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
