import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Briefcase,
  Star,
  Shield,
  Users,
  TrendingUp,
  Target,
  Building2,
  UserCheck,
} from "lucide-react";

// Content varies based on signup context (if on signup page, we can show role-specific content)
const getContentForContext = (isSignup: boolean) => {
  if (!isSignup) {
    // Default content for login page
    return {
      features: [
        {
          icon: Shield,
          title: "Secure & Reliable",
          description: "Enterprise-grade security for your contracts and data",
        },
        {
          icon: Users,
          title: "Client Management",
          description: "Organize and manage all your clients in one place",
        },
        {
          icon: TrendingUp,
          title: "Track Revenue",
          description: "Monitor your income and business growth",
        },
      ],
      testimonial: {
        content:
          "ContractPro has revolutionized how I manage my business. The automated invoicing and contract management saves me hours every week.",
        author: "Sarah Johnson",
        role: "Business Owner",
        rating: 5,
      },
      headline: "Manage contracts & invoices",
      subheadline: "like a pro",
      description:
        "Streamline your business with automated invoicing, e-signature integration, and comprehensive project management.",
      subtitle: "Business Manager",
    };
  }

  // Content for signup page - more general
  return {
    features: [
      {
        icon: Target,
        title: "Project Success",
        description: "From freelancers to clients, manage projects efficiently",
      },
      {
        icon: Building2,
        title: "Business Growth",
        description: "Tools that scale with your business needs",
      },
      {
        icon: UserCheck,
        title: "Collaboration",
        description: "Connect freelancers with clients seamlessly",
      },
    ],
    testimonial: {
      content:
        "Whether you're a freelancer or looking to hire talent, ContractPro makes project management simple and efficient.",
      author: "Alex Chen",
      role: "Platform User",
      rating: 5,
    },
    headline: "Your project management",
    subheadline: "solution",
    description:
      "Join thousands of freelancers and clients who trust ContractPro for their project and contract management needs.",
    subtitle: "Project Platform",
  };
};

export function AuthLayout() {
  const location = useLocation();
  const isSignup = location.pathname.includes("/signup");
  const content = getContentForContext(isSignup);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">ContractPro</h1>
              <p className="text-sm text-muted-foreground">
                {content.subtitle}
              </p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {content.headline}{" "}
              <span className="text-primary">{content.subheadline}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              {content.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-12">
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex gap-1 mb-4">
              {[...Array(content.testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <blockquote className="text-muted-foreground mb-4">
              "{content.testimonial.content}"
            </blockquote>
            <div>
              <div className="font-semibold text-foreground">
                {content.testimonial.author}
              </div>
              <div className="text-sm text-muted-foreground">
                {content.testimonial.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 lg:flex-shrink-0 lg:w-[480px] flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">ContractPro</h1>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
