import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, Menu, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../lib/auth/context";

// Page titles mapping
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/contracts": "Contracts",
  "/invoices": "Invoices",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = React.useState(false);

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{currentTitle}</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name?.split(" ")[0]}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="hidden lg:block relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 w-48 xl:w-64 bg-muted border-border"
          />
        </div>

        {/* Search button for mobile/tablet */}
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Search className="w-5 h-5" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hidden sm:flex"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <Badge className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 p-0 text-[10px] sm:text-xs bg-red-500 text-white flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 max-w-[calc(100vw-2rem)]"
          >
            <DropdownMenuLabel className="font-semibold">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start p-4">
              <div className="font-medium">Invoice #INV-001 is overdue</div>
              <div className="text-sm text-slate-500">
                Client: Acme Corp - Due: 2 days ago
              </div>
              <div className="text-xs text-slate-400 mt-1">2 hours ago</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start p-4">
              <div className="font-medium">Contract signed by John Doe</div>
              <div className="text-sm text-slate-500">
                Project Agreement - $5,000
              </div>
              <div className="text-xs text-slate-400 mt-1">1 day ago</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start p-4">
              <div className="font-medium">New client added</div>
              <div className="text-sm text-slate-500">Tech Solutions Inc.</div>
              <div className="text-xs text-slate-400 mt-1">3 days ago</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary hover:text-primary/80">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full p-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">
                  {user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
