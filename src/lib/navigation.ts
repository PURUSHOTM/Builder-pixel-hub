import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  HelpCircle,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

// Navigation items for different user roles
const freelancerNavigation: NavigationItem[] = [
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
    name: "Projects",
    href: "/projects",
    icon: Briefcase,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Contracts",
    href: "/contracts",
    icon: FileText,
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: Receipt,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

const clientNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Briefcase,
  },
  {
    name: "Freelancers",
    href: "/freelancers",
    icon: UserCheck,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Contracts",
    href: "/contracts",
    icon: FileText,
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: Receipt,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

const adminNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Briefcase,
  },
  {
    name: "Contracts",
    href: "/contracts",
    icon: FileText,
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: Receipt,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "System",
    href: "/system",
    icon: Settings,
  },
];

// Bottom navigation items (shared across all roles)
export const bottomNavigation: NavigationItem[] = [
  {
    name: "Help Center",
    href: "/help",
    icon: HelpCircle,
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: BookOpen,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

/**
 * Get navigation items based on user role
 */
export function getNavigationForRole(
  role: "freelancer" | "client" | "admin",
): NavigationItem[] {
  switch (role) {
    case "freelancer":
      return freelancerNavigation;
    case "client":
      return clientNavigation;
    case "admin":
      return adminNavigation;
    default:
      return freelancerNavigation; // Default fallback
  }
}

/**
 * Get display name for user roles
 */
export function getRoleDisplayName(
  role: "freelancer" | "client" | "admin",
): string {
  switch (role) {
    case "freelancer":
      return "Freelancer";
    case "client":
      return "Client";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
}

/**
 * Get color classes for user roles (for badges/indicators)
 */
export function getRoleColor(role: "freelancer" | "client" | "admin"): string {
  switch (role) {
    case "freelancer":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "client":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "admin":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
  }
}
