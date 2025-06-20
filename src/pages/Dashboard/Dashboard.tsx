import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Receipt,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
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
  totalRevenue: 45850,
  monthlyRevenue: 12300,
  totalClients: 28,
  activeContracts: 15,
  pendingInvoices: 8,
  overdueInvoices: 3,
};

const revenueData = [
  { month: "Jan", revenue: 8500, invoices: 12 },
  { month: "Feb", revenue: 9200, invoices: 15 },
  { month: "Mar", revenue: 7800, invoices: 10 },
  { month: "Apr", revenue: 10500, invoices: 18 },
  { month: "May", revenue: 12300, invoices: 22 },
  { month: "Jun", revenue: 11200, invoices: 19 },
];

const contractStatusData = [
  { name: "Signed", value: 8, color: "#22c55e" },
  { name: "Pending", value: 5, color: "#f59e0b" },
  { name: "Draft", value: 2, color: "#94a3b8" },
];

const recentActivity = [
  {
    id: 1,
    type: "invoice_paid",
    title: "Invoice #INV-001 paid",
    description: "Acme Corp - $2,500",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "contract_signed",
    title: "Contract signed",
    description: "John Doe - Web Development",
    time: "1 day ago",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "invoice_overdue",
    title: "Invoice overdue",
    description: "Tech Solutions - $1,800",
    time: "2 days ago",
    icon: AlertCircle,
    color: "text-red-600",
  },
  {
    id: 4,
    type: "client_added",
    title: "New client added",
    description: "Digital Marketing Inc.",
    time: "3 days ago",
    icon: Users,
    color: "text-purple-600",
  },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: "Contract expires",
    client: "Acme Corp",
    date: "Tomorrow",
    type: "contract",
    urgent: true,
  },
  {
    id: 2,
    title: "Invoice due",
    client: "Tech Solutions",
    date: "In 3 days",
    type: "invoice",
    urgent: false,
  },
  {
    id: 3,
    title: "Payment reminder",
    client: "Digital Marketing",
    date: "In 5 days",
    type: "reminder",
    urgent: false,
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            This Month
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700">
            <Plus className="w-4 h-4" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Monthly Revenue
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">+8.2%</span>
              <span className="text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Clients
            </CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalClients}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-purple-600 font-medium">+3 new</span>
              <span className="text-slate-500">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Invoices
            </CardTitle>
            <Receipt className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.pendingInvoices}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 font-medium">
                {stats.overdueInvoices} overdue
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
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
                  dataKey="revenue"
                  fill="url(#gradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contract Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractStatusData.map((item) => (
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
                    data={contractStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {contractStatusData.map((entry, index) => (
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
              <Clock className="w-5 h-5" />
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
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
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

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {deadline.title}
                    </p>
                    <p className="text-sm text-slate-500">{deadline.client}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={deadline.urgent ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {deadline.date}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View all deadlines
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-700">
              <Plus className="w-5 h-5" />
              <span className="text-sm">New Invoice</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-slate-50"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm">New Contract</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-slate-50"
            >
              <Users className="w-5 h-5" />
              <span className="text-sm">Add Client</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-slate-50"
            >
              <BarChart className="w-5 h-5" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
