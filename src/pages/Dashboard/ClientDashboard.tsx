import React from "react";
import {
  TrendingUp,
  Users,
  Briefcase,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Star,
  MessageSquare,
  FileText,
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
import { Progress } from "../../components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data - in real app this would come from API
const stats = {
  activeProjects: 8,
  completedProjects: 15,
  totalSpent: 32400,
  monthlySpent: 4200,
  activeFreelancers: 5,
  pendingPayments: 2,
};

const projectData = [
  { month: "Jan", completed: 2, active: 3 },
  { month: "Feb", completed: 3, active: 4 },
  { month: "Mar", completed: 1, active: 5 },
  { month: "Apr", completed: 4, active: 6 },
  { month: "May", completed: 2, active: 8 },
  { month: "Jun", completed: 3, active: 8 },
];

const budgetData = [
  { name: "Completed", value: 75, color: "#059669" },
  { name: "In Progress", value: 60, color: "#d97706" },
  { name: "Planned", value: 40, color: "#64748b" },
];

const activeProjects = [
  {
    id: 1,
    title: "E-commerce Website",
    freelancer: "Sarah Johnson",
    progress: 85,
    deadline: "2024-02-15",
    budget: 5000,
    status: "In Progress",
  },
  {
    id: 2,
    title: "Mobile App Design",
    freelancer: "Mike Chen",
    progress: 60,
    deadline: "2024-02-28",
    budget: 3500,
    status: "In Progress",
  },
  {
    id: 3,
    title: "Brand Identity",
    freelancer: "Emma Wilson",
    progress: 30,
    deadline: "2024-03-10",
    budget: 2000,
    status: "In Progress",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "project_completed",
    title: "Project completed",
    description: "Website Development by John Doe",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "payment_made",
    title: "Payment processed",
    description: "$2,500 paid to Sarah Johnson",
    time: "1 day ago",
    icon: CreditCard,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "milestone_reached",
    title: "Milestone reached",
    description: "Mobile App - Design Phase Complete",
    time: "2 days ago",
    icon: Star,
    color: "text-yellow-600",
  },
  {
    id: 4,
    type: "message_received",
    title: "New message",
    description: "Update from Emma Wilson",
    time: "3 days ago",
    icon: MessageSquare,
    color: "text-purple-600",
  },
];

const topFreelancers = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Web Development",
    rating: 4.9,
    projects: 3,
    avatar: "/placeholder.svg",
    totalEarned: 12500,
  },
  {
    id: 2,
    name: "Mike Chen",
    specialty: "UI/UX Design",
    rating: 4.8,
    projects: 2,
    avatar: "/placeholder.svg",
    totalEarned: 8500,
  },
  {
    id: 3,
    name: "Emma Wilson",
    specialty: "Branding",
    rating: 5.0,
    projects: 1,
    avatar: "/placeholder.svg",
    totalEarned: 3500,
  },
];

export function ClientDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Project Dashboard 🎯
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your projects, track progress, and collaborate with
            freelancers.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Meeting
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
            <Briefcase className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.activeProjects}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">+2 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Projects
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.completedProjects}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+3 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Investment
            </CardTitle>
            <CreditCard className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${stats.totalSpent.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-primary font-medium">
                ${stats.monthlySpent.toLocaleString()}
              </span>
              <span className="text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Freelancers
            </CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.activeFreelancers}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-purple-600" />
              <span className="text-purple-600 font-medium">
                4.8 avg rating
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  className="text-slate-500"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="text-slate-500"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="completed"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />
                <Bar
                  dataKey="active"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Active"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-slate-500">
                      {item.value}%
                    </span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {project.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        by {project.freelancer}
                      </p>
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <span>Budget: ${project.budget.toLocaleString()}</span>
                    <span>
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View all projects
            </Button>
          </CardContent>
        </Card>

        {/* Top Freelancers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Freelancers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={freelancer.avatar} />
                    <AvatarFallback>
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{freelancer.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {freelancer.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {freelancer.specialty} • {freelancer.projects} projects
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${freelancer.totalEarned.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      total earned
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              Find more freelancers
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted"
              >
                <div className={`p-2 rounded-lg bg-white ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Post Project</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-muted"
            >
              <Users className="w-5 h-5" />
              <span className="text-sm">Find Freelancers</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-muted"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Schedule Meeting</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-muted"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm">Review Contracts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
