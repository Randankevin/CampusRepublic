import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Heart,
  Share2,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  image: string;
  category: string;
  description: string;
  organizer: string;
  isRsvped: boolean;
}

interface EventsScreenProps {
  onBack: () => void;
}

export function EventsScreen({ onBack }: EventsScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Spring Festival 2026",
      date: "Jan 25, 2026",
      time: "2:00 PM - 8:00 PM",
      location: "Main Quad",
      attendees: 892,
      maxAttendees: 1000,
      image:
        "https://images.unsplash.com/photo-1735713212111-e39b9cbcdbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZXZlbnQlMjBjb25jZXJ0fGVufDF8fHx8MTc2OTE3NTU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Festival",
      description:
        "Join us for live music performances, delicious food trucks, carnival games, and exciting activities! Featuring local bands and student performances.",
      organizer: "Student Union",
      isRsvped: false,
    },
    {
      id: "2",
      title: "Tech Workshop: AI & ML Basics",
      date: "Jan 27, 2026",
      time: "3:00 PM - 5:00 PM",
      location: "Engineering Building, Room 204",
      attendees: 45,
      maxAttendees: 50,
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBzdHVkeWluZ3xlbnwxfHx8fDE3NjkxNTc4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Workshop",
      description:
        "Learn the fundamentals of Artificial Intelligence and Machine Learning. Hands-on session with real-world examples. Laptops required.",
      organizer: "CS Club",
      isRsvped: true,
    },
    {
      id: "3",
      title: "Basketball Championship Finals",
      date: "Jan 28, 2026",
      time: "6:00 PM - 9:00 PM",
      location: "University Sports Arena",
      attendees: 2340,
      maxAttendees: 3000,
      image:
        "https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wdXMlMjBldmVudCUyMGNyb3dkfGVufDF8fHx8MTc2OTE3NTU0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Sports",
      description:
        "Don't miss the thrilling championship finals! Cheer for our team as they compete for the title. Free entry for students with ID.",
      organizer: "Athletics Department",
      isRsvped: false,
    },
    {
      id: "4",
      title: "Career Fair 2026",
      date: "Feb 2, 2026",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center Hall",
      attendees: 567,
      image:
        "https://images.unsplash.com/photo-1632834380561-d1e05839a33a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjYW1wdXN8ZW58MXx8fHwxNzY5MTY5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Career",
      description:
        "Meet recruiters from top companies. Bring your resume and dress professionally. Over 100 employers attending!",
      organizer: "Career Services",
      isRsvped: false,
    },
  ]);

  const categories = ["all", "Festival", "Workshop", "Sports", "Career"];

  const handleRsvp = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, isRsvped: !event.isRsvped } : event
      )
    );
    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        isRsvped: !selectedEvent.isRsvped,
      });
    }
  };

  const filteredEvents =
    selectedFilter === "all"
      ? events
      : events.filter((event) => event.category === selectedFilter);

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Image */}
        <div className="relative h-72">
          <ImageWithFallback
            src={selectedEvent.image}
            alt={selectedEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium">
              {selectedEvent.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {selectedEvent.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              by {selectedEvent.organizer}
            </p>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CalendarIcon className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{selectedEvent.date}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.time}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{selectedEvent.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">
                  {selectedEvent.attendees} attending
                  {selectedEvent.maxAttendees &&
                    ` / ${selectedEvent.maxAttendees} max`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About this event</h3>
            <p className="text-muted-foreground leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => handleRsvp(selectedEvent.id)}
              className={`flex-1 py-4 rounded-xl font-medium transition-colors ${
                selectedEvent.isRsvped
                  ? "bg-success text-success-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {selectedEvent.isRsvped ? "✓ Going" : "RSVP Now"}
            </button>
            <button className="p-4 border-2 border-border rounded-xl hover:bg-muted transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-4 border-2 border-border rounded-xl hover:bg-muted transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Events</h1>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Filter className="w-5 h-5" />
            </button>
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

      {/* Events List */}
      <div className="p-4 space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="relative h-40">
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                {event.category}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg leading-tight">
                {event.title}
              </h3>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRsvp(event.id);
                }}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  event.isRsvped
                    ? "bg-success/10 text-success border-2 border-success"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {event.isRsvped ? "✓ Going" : "RSVP"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
