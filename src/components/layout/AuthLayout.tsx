import React from "react";
import { Outlet } from "react-router-dom";
import { Briefcase, Star, Shield, Users, TrendingUp } from "lucide-react";

const features = [
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
];

const testimonial = {
  content:
    "ContractPro has revolutionized how I manage my freelance business. The automated invoicing and contract management saves me hours every week.",
  author: "Sarah Johnson",
  role: "Freelance Designer",
  rating: 5,
};

export function AuthLayout() {
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
              <p className="text-sm text-muted-foreground">Invoice Manager</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Manage contracts & invoices{" "}
              <span className="text-primary">like a pro</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Streamline your freelance business with automated invoicing,
              e-signature integration, and comprehensive client management.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-12">
            {features.map((feature, index) => (
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
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <blockquote className="text-muted-foreground mb-4">
              "{testimonial.content}"
            </blockquote>
            <div>
              <div className="font-semibold text-foreground">
                {testimonial.author}
              </div>
              <div className="text-sm text-muted-foreground">
                {testimonial.role}
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
