import React from "react";
import { BarChart3, Download, Calendar, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export function Reports() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Reports
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Export and analyze your business data
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Reports & Analytics Coming Soon
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              This feature will include comprehensive reporting with revenue
              analytics, client performance, and PDF export capabilities.
            </p>
            <Button className="mt-6">Request Early Access</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
