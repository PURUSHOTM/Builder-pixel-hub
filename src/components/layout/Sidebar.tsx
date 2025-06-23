import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { LogOut, Briefcase } from "lucide-react";
import { useAuth } from "../../lib/auth/context";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  getNavigationForRole,
  bottomNavigation,
  getRoleDisplayName,
  getRoleColor,
} from "../../lib/navigation";

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

  // Get navigation items based on user role
  const navigation = user ? getNavigationForRole(user.role) : [];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">ContractPro</h1>
          <p className="text-xs text-muted-foreground">
            {user?.role === "client"
              ? "Project Manager"
              : user?.role === "admin"
                ? "Admin Portal"
                : "Invoice Manager"}
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
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground",
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
      <div className="px-4 py-4 border-t border-border space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="w-5 h-5 text-muted-foreground" />
          <span>Logout</span>
        </Button>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              {user?.role && (
                <Badge
                  variant="secondary"
                  className={cn("text-xs", getRoleColor(user.role))}
                >
                  {getRoleDisplayName(user.role)}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
