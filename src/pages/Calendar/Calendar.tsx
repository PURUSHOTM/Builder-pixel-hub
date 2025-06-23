import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Video,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";

// Mock data - in real app this would come from API
const events = [
  {
    id: 1,
    title: "Project Kickoff Meeting",
    type: "meeting",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "1 hour",
    attendees: [
      { name: "Sarah Johnson", avatar: "/placeholder.svg" },
      { name: "You", avatar: "/placeholder.svg" },
    ],
    location: "Zoom Meeting",
    description: "Initial project discussion and requirements gathering",
    priority: "high",
  },
  {
    id: 2,
    title: "Design Review",
    type: "review",
    date: "2024-02-18",
    time: "2:00 PM",
    duration: "30 minutes",
    attendees: [
      { name: "Mike Chen", avatar: "/placeholder.svg" },
      { name: "You", avatar: "/placeholder.svg" },
    ],
    location: "Google Meet",
    description: "Review initial design mockups and provide feedback",
    priority: "medium",
  },
  {
    id: 3,
    title: "Website Launch",
    type: "deadline",
    date: "2024-02-25",
    time: "End of Day",
    duration: "All day",
    attendees: [
      { name: "Sarah Johnson", avatar: "/placeholder.svg" },
      { name: "You", avatar: "/placeholder.svg" },
    ],
    location: "Remote",
    description: "Final website deployment and go-live",
    priority: "high",
  },
  {
    id: 4,
    title: "Weekly Check-in",
    type: "meeting",
    date: "2024-02-22",
    time: "11:00 AM",
    duration: "15 minutes",
    attendees: [
      { name: "Emma Wilson", avatar: "/placeholder.svg" },
      { name: "You", avatar: "/placeholder.svg" },
    ],
    location: "Phone Call",
    description: "Brief progress update and next steps discussion",
    priority: "low",
  },
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "meeting":
      return "bg-blue-100 text-blue-800";
    case "deadline":
      return "bg-red-100 text-red-800";
    case "review":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-l-red-500";
    case "medium":
      return "border-l-yellow-500";
    case "low":
      return "border-l-green-500";
    default:
      return "border-l-gray-500";
  }
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function Calendar() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState(currentDate);

  // Get upcoming events (next 7 days)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Manage your meetings, deadlines, and schedule
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {viewMode === "month"
                ? "Month View"
                : viewMode === "week"
                  ? "Week View"
                  : "Day View"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Calendar Component
              </h3>
              <p className="text-muted-foreground">
                This would be replaced with a full calendar component showing
                events, meetings, and deadlines in {viewMode} view.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 bg-muted/20 ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={getEventTypeColor(event.type)}
                    >
                      {event.type}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.duration}</span>
                    </div>

                    {event.location.includes("Zoom") ||
                    event.location.includes("Meet") ? (
                      <div className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {event.attendees.length} attendees
                      </span>
                    </div>
                    <div className="flex -space-x-1">
                      {event.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar
                          key={index}
                          className="h-6 w-6 border-2 border-background"
                        >
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback className="text-xs">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {upcomingEvents.length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">
                  No upcoming events
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your calendar is clear for the next week
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Scheduled events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meetings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Team meetings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Deadlines
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Project deadlines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Free Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8h</div>
            <p className="text-xs text-muted-foreground">Available today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
