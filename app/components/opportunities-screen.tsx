import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Filter,
  Search,
  Building2,
} from "lucide-react";
import { useState } from "react";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Part-time" | "Full-time" | "Volunteer";
  salary?: string;
  description: string;
  postedAt: string;
  deadline: string;
  isSaved: boolean;
}

export function OpportunitiesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: "1",
      title: "Software Engineering Intern",
      company: "Tech Corp Inc.",
      location: "Remote",
      type: "Internship",
      salary: "$25/hr",
      description:
        "Join our dynamic team for a summer internship. Work on real projects with experienced mentors. Requirements: CS major, knowledge of React and Node.js.",
      postedAt: "2 days ago",
      deadline: "March 1, 2026",
      isSaved: false,
    },
    {
      id: "2",
      title: "Campus Ambassador",
      company: "StudentHub",
      location: "On Campus",
      type: "Part-time",
      salary: "$15/hr",
      description:
        "Represent StudentHub on campus. Organize events, promote our services, and build community. Flexible hours, great for students!",
      postedAt: "5 days ago",
      deadline: "February 15, 2026",
      isSaved: true,
    },
    {
      id: "3",
      title: "Research Assistant",
      company: "University Research Lab",
      location: "Science Building",
      type: "Part-time",
      salary: "$18/hr",
      description:
        "Assist with ongoing research in artificial intelligence and machine learning. Perfect for CS or Math majors looking to gain research experience.",
      postedAt: "1 week ago",
      deadline: "January 30, 2026",
      isSaved: false,
    },
    {
      id: "4",
      title: "Volunteer Tutor",
      company: "Community Learning Center",
      location: "Downtown",
      type: "Volunteer",
      description:
        "Help local high school students with math and science subjects. 5-10 hours per week. Great for building your resume and giving back!",
      postedAt: "3 days ago",
      deadline: "Rolling",
      isSaved: false,
    },
  ]);

  const types = ["all", "Internship", "Part-time", "Full-time", "Volunteer"];

  const handleSave = (oppId: string) => {
    setOpportunities(
      opportunities.map((opp) =>
        opp.id === oppId ? { ...opp, isSaved: !opp.isSaved } : opp
      )
    );
  };

  const filteredOpportunities =
    selectedFilter === "all"
      ? opportunities
      : opportunities.filter((opp) => opp.type === selectedFilter);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Opportunities</h1>
              <p className="text-sm text-muted-foreground">
                {filteredOpportunities.length} opportunities available
              </p>
            </div>
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
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="p-4 space-y-4">
        {filteredOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-card rounded-2xl border border-border p-5 space-y-4 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      opp.type === "Internship"
                        ? "bg-primary/10 text-primary"
                        : opp.type === "Volunteer"
                        ? "bg-success/10 text-success"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {opp.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {opp.postedAt}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-1">{opp.title}</h3>

                <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{opp.company}</span>
                </div>
              </div>

              <button
                onClick={() => handleSave(opp.id)}
                className={`p-2 rounded-full transition-colors ${
                  opp.isSaved
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${opp.isSaved ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{opp.location}</span>
              </div>

              {opp.salary && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>{opp.salary}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Deadline: {opp.deadline}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {opp.description}
            </p>

            {/* Action Button */}
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
