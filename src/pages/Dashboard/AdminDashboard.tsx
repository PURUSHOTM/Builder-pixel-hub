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

// Activity type icon mapping
const getActivityIcon = (type: string) => {
  switch (type) {
    case "user_verification":
      return UserCheck;
    case "payment_processed":
      return DollarSign;
    case "dispute_resolved":
      return CheckCircle;
    case "system_alert":
      return Settings;
    case "contract_signed":
      return FileText;
    case "invoice_paid":
      return Receipt;
    default:
      return Activity;
  }
};

// Activity type color mapping
const getActivityColor = (type: string) => {
  switch (type) {
    case "user_verification":
      return "text-green-600";
    case "payment_processed":
      return "text-blue-600";
    case "dispute_resolved":
      return "text-green-600";
    case "system_alert":
      return "text-purple-600";
    case "contract_signed":
      return "text-blue-600";
    case "invoice_paid":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

// Format time ago
const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return "1 day ago";
  return `${Math.floor(diffInHours / 24)} days ago`;
};

export function AdminDashboard() {
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    activeProjects: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingApprovals: 0,
    systemHealth: 0,
  });
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch admin dashboard data
        const [statsResponse, activityResponse] = await Promise.all([
          DashboardApi.getAdminStats(),
          DashboardApi.getRecentActivity(),
        ]);

        if (statsResponse.success) {
          setPlatformStats(statsResponse.data);

          // Create mock user growth data based on current stats
          const stats = statsResponse.data;
          const growth = [
            {
              month: "Jan",
              freelancers: Math.floor(stats.totalFreelancers * 0.7),
              clients: Math.floor(stats.totalClients * 0.7),
            },
            {
              month: "Feb",
              freelancers: Math.floor(stats.totalFreelancers * 0.75),
              clients: Math.floor(stats.totalClients * 0.75),
            },
            {
              month: "Mar",
              freelancers: Math.floor(stats.totalFreelancers * 0.8),
              clients: Math.floor(stats.totalClients * 0.8),
            },
            {
              month: "Apr",
              freelancers: Math.floor(stats.totalFreelancers * 0.85),
              clients: Math.floor(stats.totalClients * 0.85),
            },
            {
              month: "May",
              freelancers: Math.floor(stats.totalFreelancers * 0.92),
              clients: Math.floor(stats.totalClients * 0.92),
            },
            {
              month: "Jun",
              freelancers: stats.totalFreelancers,
              clients: stats.totalClients,
            },
          ];
          setUserGrowthData(growth);

          // Create project status data
          const projectStatus = [
            { name: "Active", value: stats.activeProjects, color: "#059669" },
            {
              name: "Completed",
              value: stats.activeProjects * 4,
              color: "#3b82f6",
            },
            {
              name: "On Hold",
              value: Math.floor(stats.activeProjects * 0.2),
              color: "#f59e0b",
            },
            {
              name: "Cancelled",
              value: Math.floor(stats.activeProjects * 0.1),
              color: "#ef4444",
            },
          ];
          setProjectStatusData(projectStatus);
        }

        if (activityResponse.success) {
          // Format activity data for admin view
          const formattedActivity = activityResponse.data
            .slice(0, 4)
            .map((activity: any) => ({
              ...activity,
              icon: getActivityIcon(activity.type),
              color: getActivityColor(activity.type),
              time: formatTimeAgo(activity.timestamp),
            }));
          setRecentActivity(formattedActivity);
        }

        // Mock pending approvals
        const mockApprovals = [
          {
            id: 1,
            type: "Profile verification",
            user: "New Freelancer",
            userType: "Freelancer",
            submitted: "2 hours ago",
            priority: "high",
          },
          {
            id: 2,
            type: "Payout request",
            user: "Active Client",
            userType: "Client",
            submitted: "4 hours ago",
            priority: "medium",
          },
          {
            id: 3,
            type: "Contract dispute",
            user: "Project Issue",
            userType: "Project",
            submitted: "1 day ago",
            priority: "high",
          },
        ];
        setPendingApprovals(mockApprovals);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
        toast.error("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
