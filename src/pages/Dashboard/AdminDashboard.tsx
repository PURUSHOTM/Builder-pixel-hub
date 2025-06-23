import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  Receipt,
  DollarSign,
  Shield,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Building2,
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
import { DashboardApi } from "../../lib/api/client";
import { toast } from "sonner";

// Mock data - in real app this would come from API
const platformStats = {
  totalUsers: 2847,
  totalFreelancers: 1623,
  totalClients: 1224,
  activeProjects: 342,
  totalRevenue: 485960,
  monthlyRevenue: 68420,
  pendingApprovals: 23,
  systemHealth: 99.8,
};

const userGrowthData = [
  { month: "Jan", freelancers: 1250, clients: 890 },
  { month: "Feb", freelancers: 1340, clients: 950 },
  { month: "Mar", freelancers: 1420, clients: 1020 },
  { month: "Apr", freelancers: 1510, clients: 1080 },
  { month: "May", freelancers: 1580, clients: 1150 },
  { month: "Jun", freelancers: 1623, clients: 1224 },
];

const revenueData = [
  { month: "Jan", revenue: 52000 },
  { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 61000 },
  { month: "Apr", revenue: 63000 },
  { month: "May", revenue: 66000 },
  { month: "Jun", revenue: 68420 },
];

const projectStatusData = [
  { name: "Active", value: 342, color: "#059669" },
  { name: "Completed", value: 1256, color: "#3b82f6" },
  { name: "On Hold", value: 89, color: "#f59e0b" },
  { name: "Cancelled", value: 43, color: "#ef4444" },
];

const recentActivity = [
  {
    id: 1,
    type: "user_verification",
    title: "User verified",
    description: "New freelancer: Alex Chen verified",
    time: "15 minutes ago",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "payment_processed",
    title: "Payment processed",
    description: "Platform fee: $1,250 collected",
    time: "1 hour ago",
    icon: DollarSign,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "dispute_resolved",
    title: "Dispute resolved",
    description: "Project #P-2847 dispute closed",
    time: "3 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 4,
    type: "system_alert",
    title: "System maintenance",
    description: "Scheduled maintenance completed",
    time: "6 hours ago",
    icon: Settings,
    color: "text-purple-600",
  },
];

const pendingApprovals = [
  {
    id: 1,
    type: "Profile verification",
    user: "Jennifer Rodriguez",
    userType: "Freelancer",
    submitted: "2 hours ago",
    priority: "high",
  },
  {
    id: 2,
    type: "Payout request",
    user: "TechCorp Inc.",
    userType: "Client",
    submitted: "4 hours ago",
    priority: "medium",
  },
  {
    id: 3,
    type: "Dispute escalation",
    user: "Project #P-2851",
    userType: "Project",
    submitted: "1 day ago",
    priority: "high",
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard ⚡
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor platform performance, manage users, and oversee operations.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Activity className="w-4 h-4" />
            System Status
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Shield className="w-4 h-4" />
            Admin Tools
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {platformStats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">+147 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Platform Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${platformStats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+15.2%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {platformStats.activeProjects}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Building2 className="h-4 w-4 text-purple-600" />
              <span className="text-purple-600 font-medium">
                {(
                  (platformStats.activeProjects /
                    (platformStats.totalFreelancers +
                      platformStats.totalClients)) *
                  100
                ).toFixed(1)}
                % utilization
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approvals
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {platformStats.pendingApprovals}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Shield className="h-4 w-4 text-amber-600" />
              <span className="text-amber-600 font-medium">
                {platformStats.systemHealth}% uptime
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
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
                  dataKey="freelancers"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Freelancers"
                />
                <Bar
                  dataKey="clients"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  name="Clients"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectStatusData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg bg-slate-100 ${activity.color}`}
                  >
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View all activity
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {approval.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {approval.user} • {approval.userType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {approval.submitted}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        approval.priority === "high"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {approval.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View all approvals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2 bg-primary hover:bg-primary/90">
              <Users className="w-5 h-5" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-muted"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm">Security Center</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-muted"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">System Settings</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-muted"
            >
              <Receipt className="w-5 h-5" />
              <span className="text-sm">Financial Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
