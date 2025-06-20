import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../lib/auth/context";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Contracts",
    href: "/contracts",
    icon: FileText,
    badge: "3",
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: Receipt,
    badge: "5",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">
            ContractPro
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Invoice Manager
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400",
                )}
              />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400",
                )}
              />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <LogOut className="w-5 h-5 text-slate-400" />
          <span>Logout</span>
        </Button>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
