import React from "react";
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  Calendar,
  DollarSign,
  Star,
  Clock,
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
import { Progress } from "../../components/ui/progress";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";

// Mock data - in real app this would come from API
const projects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    description:
      "Complete responsive e-commerce platform with payment integration",
    freelancer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      rating: 4.9,
    },
    status: "In Progress",
    progress: 75,
    budget: 5000,
    deadline: "2024-02-15",
    category: "Web Development",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    description: "Modern and intuitive mobile app design for iOS and Android",
    freelancer: {
      name: "Mike Chen",
      avatar: "/placeholder.svg",
      rating: 4.8,
    },
    status: "In Progress",
    progress: 60,
    budget: 3500,
    deadline: "2024-02-28",
    category: "Design",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    title: "Brand Identity Package",
    description:
      "Complete brand identity including logo, colors, and guidelines",
    freelancer: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg",
      rating: 5.0,
    },
    status: "In Progress",
    progress: 30,
    budget: 2000,
    deadline: "2024-03-10",
    category: "Branding",
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    title: "SEO Optimization",
    description: "Complete SEO audit and optimization for existing website",
    freelancer: {
      name: "John Doe",
      avatar: "/placeholder.svg",
      rating: 4.7,
    },
    status: "Completed",
    progress: 100,
    budget: 1500,
    deadline: "2024-01-25",
    category: "Marketing",
    createdAt: "2024-01-05",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function Projects() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your active and completed projects
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search projects..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Investment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,000</div>
            <p className="text-xs text-muted-foreground">Budget allocated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.85</div>
            <p className="text-xs text-muted-foreground">Freelancer rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={project.freelancer.avatar} />
                      <AvatarFallback>
                        {project.freelancer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {project.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(project.status)}
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-3">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>by</span>
                          <span className="font-medium text-foreground">
                            {project.freelancer.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{project.freelancer.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Due:{" "}
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            Budget: ${project.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {project.status === "In Progress" && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {project.status === "In Progress" && (
                    <Button variant="ghost" size="sm">
                      Message
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No projects yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start by posting your first project to find talented freelancers.
          </p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Post Your First Project
          </Button>
        </Card>
      )}
    </div>
  );
}
