import React from "react";
import { useAuth } from "../../lib/auth/context";
import { FreelancerDashboard } from "./FreelancerDashboard";
import { ClientDashboard } from "./ClientDashboard";

export function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "client":
      return <ClientDashboard />;
    case "freelancer":
    case "admin":
    default:
      return <FreelancerDashboard />;
  }
}
