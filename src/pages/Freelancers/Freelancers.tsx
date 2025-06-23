import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  MessageSquare,
  Heart,
  Briefcase,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Mock data - in real app this would come from API
const freelancers = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Full-Stack Web Developer",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 75,
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    description:
      "Experienced full-stack developer with 8+ years of expertise in modern web technologies. Specialized in building scalable web applications and e-commerce platforms.",
    completedProjects: 89,
    responseTime: "1 hour",
    availability: "Available",
    featured: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    title: "UI/UX Designer",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 94,
    hourlyRate: 65,
    location: "New York, NY",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    description:
      "Creative UI/UX designer passionate about creating intuitive and beautiful user experiences. Expert in mobile-first design and design systems.",
    completedProjects: 156,
    responseTime: "2 hours",
    availability: "Available",
    featured: false,
  },
  {
    id: 3,
    name: "Emma Wilson",
    title: "Brand Identity Designer",
    avatar: "/placeholder.svg",
    rating: 5.0,
    reviewCount: 73,
    hourlyRate: 80,
    location: "London, UK",
    skills: ["Branding", "Logo Design", "Illustration", "Brand Strategy"],
    description:
      "Award-winning brand designer helping businesses create memorable and impactful brand identities. 10+ years of experience with Fortune 500 companies.",
    completedProjects: 67,
    responseTime: "30 minutes",
    availability: "Busy",
    featured: true,
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    title: "Mobile App Developer",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 112,
    hourlyRate: 70,
    location: "Austin, TX",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    description:
      "Mobile development specialist with expertise in cross-platform solutions. Built 50+ mobile apps with millions of downloads.",
    completedProjects: 78,
    responseTime: "1 hour",
    availability: "Available",
    featured: false,
  },
  {
    id: 5,
    name: "Lisa Zhang",
    title: "Digital Marketing Expert",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 55,
    location: "Toronto, Canada",
    skills: ["SEO", "PPC", "Social Media", "Analytics"],
    description:
      "Results-driven digital marketer with proven track record of increasing online visibility and ROI. Google Ads and Facebook certified.",
    completedProjects: 134,
    responseTime: "3 hours",
    availability: "Available",
    featured: false,
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Data Science",
  "DevOps",
];

export function Freelancers() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [savedFreelancers, setSavedFreelancers] = useState<number[]>([]);

  const toggleSave = (freelancerId: number) => {
    setSavedFreelancers((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId],
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Busy":
        return "bg-yellow-100 text-yellow-800";
      case "Unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Find Freelancers
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover talented professionals for your projects
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Heart className="w-4 h-4" />
          Saved ({savedFreelancers.length})
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search freelancers by skills, name, or location..."
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Freelancers
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Ready to work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Platform average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Hourly Rate
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$68</div>
            <p className="text-xs text-muted-foreground">Per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5h</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Freelancers Grid */}
      <div className="grid gap-6">
        {freelancers.map((freelancer) => (
          <Card
            key={freelancer.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Avatar and Featured Badge */}
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={freelancer.avatar} />
                    <AvatarFallback>
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {freelancer.featured && (
                    <div className="absolute -top-1 -right-1">
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 text-xs"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Top
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {freelancer.name}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {freelancer.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSave(freelancer.id)}
                        className={
                          savedFreelancers.includes(freelancer.id)
                            ? "text-red-500"
                            : ""
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${savedFreelancers.includes(freelancer.id) ? "fill-current" : ""}`}
                        />
                      </Button>
                      <Badge
                        variant="secondary"
                        className={getAvailabilityColor(
                          freelancer.availability,
                        )}
                      >
                        {freelancer.availability}
                      </Badge>
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center gap-6 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{freelancer.rating}</span>
                      <span>({freelancer.reviewCount} reviews)</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{freelancer.location}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${freelancer.hourlyRate}/hr</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Responds in {freelancer.responseTime}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {freelancer.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {freelancer.completedProjects} projects completed
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Button>
                      <Button size="sm" className="gap-2">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          Load More Freelancers
        </Button>
      </div>
    </div>
  );
}
