import {
  User,
  Settings,
  BookmarkCheck,
  Heart,
  MessageSquare,
  Trophy,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface UserProfileProps {
  onBack: () => void;
  onLogout?: () => void;
}

export function UserProfile({ onBack, onLogout }: UserProfileProps) {
  const stats = [
    { label: "Posts", value: "24" },
    { label: "Following", value: "156" },
    { label: "Followers", value: "892" },
    { label: "Points", value: "1.2k" },
  ];

  const menuItems = [
    { icon: BookmarkCheck, label: "Saved Items", count: 12 },
    { icon: Heart, label: "Liked Posts", count: 45 },
    { icon: MessageSquare, label: "My Posts", count: 24 },
    { icon: Trophy, label: "Achievements", count: 8 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Profile Banner */}
      <div className="relative h-40 bg-gradient-to-br from-primary to-accent">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
        >
          ← Back
        </button>
        <button className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-16 pb-6">
        <div className="flex items-end space-x-4 mb-6">
          <div className="w-28 h-28 bg-white rounded-3xl border-4 border-background shadow-lg flex items-center justify-center">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
          <div className="flex-1 pb-2">
            <h2 className="text-2xl font-semibold">Alex Johnson</h2>
            <p className="text-muted-foreground">Computer Science '26</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-semibold text-lg">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            CS student passionate about AI and web development. Tech enthusiast
            and coffee lover ☕
          </p>
        </div>

        {/* Edit Profile Button */}
        <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity mb-6">
          Edit Profile
        </button>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {item.count}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 p-4 mt-6 border-2 border-destructive text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
