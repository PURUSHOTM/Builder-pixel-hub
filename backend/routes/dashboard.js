import express from "express";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Contract from "../models/Contract.js";
import Invoice from "../models/Invoice.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/stats", async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get counts
    const [
      totalClients,
      activeContracts,
      pendingInvoices,
      overdueInvoices,
      totalRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      Client.countDocuments({ userId, isActive: true }),
      Contract.countDocuments({
        userId,
        status: { $in: ["sent", "signed"] },
        isActive: true,
      }),
      Invoice.countDocuments({
        userId,
        status: { $in: ["sent", "overdue"] },
        isActive: true,
      }),
      Invoice.countDocuments({
        userId,
        status: "overdue",
        isActive: true,
      }),
      // Total revenue from paid invoices
      Invoice.aggregate([
        {
          $match: {
            userId,
            status: "paid",
            isActive: true,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      // Monthly revenue (current month)
      Invoice.aggregate([
        {
          $match: {
            userId,
            status: "paid",
            isActive: true,
            paidAt: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1,
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1,
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalClients,
        activeContracts,
        pendingInvoices,
        overdueInvoices,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/revenue
// @desc    Get revenue chart data
// @access  Private
router.get("/revenue", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const period = req.query.period || "6months";

    let startDate;
    const endDate = new Date();

    if (period === "6months") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === "1year") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
    }

    const revenueData = await Invoice.aggregate([
      {
        $match: {
          userId,
          status: "paid",
          isActive: true,
          paidAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" },
          },
          revenue: { $sum: "$total" },
          invoices: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: "%b",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
              },
            },
          },
          revenue: 1,
          invoices: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/activity
// @desc    Get recent activity
// @access  Private
router.get("/activity", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent contracts
    const recentContracts = await Contract.find({
      userId,
      isActive: true,
    })
      .populate("clientId", "name company")
      .sort({ updatedAt: -1 })
      .limit(5);

    // Get recent invoices
    const recentInvoices = await Invoice.find({
      userId,
      isActive: true,
    })
      .populate("clientId", "name company")
      .sort({ updatedAt: -1 })
      .limit(5);

    // Get recent clients
    const recentClients = await Client.find({
      userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    // Combine and format activity
    const activities = [];

    // Add contract activities
    recentContracts.forEach((contract) => {
      if (contract.signedAt) {
        activities.push({
          id: contract._id,
          type: "contract_signed",
          title: "Contract signed",
          description: `${contract.clientId?.name} - ${contract.title}`,
          timestamp: contract.signedAt,
          relatedId: contract._id,
        });
      } else if (contract.sentAt) {
        activities.push({
          id: contract._id,
          type: "contract_sent",
          title: "Contract sent",
          description: `${contract.clientId?.name} - ${contract.title}`,
          timestamp: contract.sentAt,
          relatedId: contract._id,
        });
      }
    });

    // Add invoice activities
    recentInvoices.forEach((invoice) => {
      if (invoice.paidAt) {
        activities.push({
          id: invoice._id,
          type: "invoice_paid",
          title: "Invoice paid",
          description: `${invoice.clientId?.name} - $${invoice.total}`,
          timestamp: invoice.paidAt,
          relatedId: invoice._id,
        });
      } else if (invoice.status === "sent") {
        activities.push({
          id: invoice._id,
          type: "invoice_sent",
          title: "Invoice sent",
          description: `${invoice.clientId?.name} - ${invoice.invoiceNumber}`,
          timestamp: invoice.updatedAt,
          relatedId: invoice._id,
        });
      }
    });

    // Add client activities
    recentClients.forEach((client) => {
      activities.push({
        id: client._id,
        type: "client_added",
        title: "New client added",
        description: `${client.name} - ${client.company}`,
        timestamp: client.createdAt,
        relatedId: client._id,
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: limitedActivities,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/upcoming-deadlines
// @desc    Get upcoming deadlines
// @access  Private
router.get("/upcoming-deadlines", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // Next 30 days

    // Get contracts expiring soon
    const expiringContracts = await Contract.find({
      userId,
      status: "sent",
      expiresAt: {
        $gte: currentDate,
        $lte: futureDate,
      },
      isActive: true,
    })
      .populate("clientId", "name company")
      .sort({ expiresAt: 1 });

    // Get invoices due soon
    const dueInvoices = await Invoice.find({
      userId,
      status: { $in: ["sent", "overdue"] },
      dueDate: {
        $gte: currentDate,
        $lte: futureDate,
      },
      isActive: true,
    })
      .populate("clientId", "name company")
      .sort({ dueDate: 1 });

    // Format deadlines
    const deadlines = [];

    expiringContracts.forEach((contract) => {
      const daysUntil = Math.ceil(
        (contract.expiresAt - currentDate) / (1000 * 60 * 60 * 24),
      );
      deadlines.push({
        id: contract._id,
        type: "contract",
        title: "Contract expires",
        client: contract.clientId?.name,
        date: contract.expiresAt,
        daysUntil,
        urgent: daysUntil <= 3,
      });
    });

    dueInvoices.forEach((invoice) => {
      const daysUntil = Math.ceil(
        (invoice.dueDate - currentDate) / (1000 * 60 * 60 * 24),
      );
      deadlines.push({
        id: invoice._id,
        type: "invoice",
        title: "Invoice due",
        client: invoice.clientId?.name,
        date: invoice.dueDate,
        daysUntil,
        urgent: daysUntil <= 0 || invoice.status === "overdue",
      });
    });

    // Sort by date
    deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: deadlines,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/client-stats
// @desc    Get dashboard statistics for clients
// @access  Private (Client role)
router.get("/client-stats", async (req, res, next) => {
  try {
    const userId = req.user._id;

    // For clients, we need to get stats about their projects, freelancers, and spending
    const [
      activeProjects,
      completedProjects,
      totalSpent,
      monthlySpent,
      activeFreelancers,
      pendingPayments,
    ] = await Promise.all([
      Contract.countDocuments({
        clientId: userId, // For clients, they are the client in contracts
        status: { $in: ["sent", "signed"] },
        isActive: true,
      }),
      Contract.countDocuments({
        clientId: userId,
        status: "completed",
        isActive: true,
      }),
      // Total amount from signed contracts
      Contract.aggregate([
        {
          $match: {
            clientId: userId,
            status: { $in: ["signed", "completed"] },
            isActive: true,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      // Monthly spending (current month from signed contracts)
      Contract.aggregate([
        {
          $match: {
            clientId: userId,
            status: { $in: ["signed", "completed"] },
            isActive: true,
            signedAt: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1,
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1,
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      // Count unique freelancers from contracts
      Contract.distinct("userId", {
        clientId: userId,
        status: { $in: ["sent", "signed", "completed"] },
        isActive: true,
      }),
      // Pending invoices from freelancers
      Invoice.countDocuments({
        clientId: userId,
        status: { $in: ["sent", "overdue"] },
        isActive: true,
      }),
    ]);

    res.json({
      success: true,
      data: {
        activeProjects,
        completedProjects,
        totalSpent: totalSpent[0]?.total || 0,
        monthlySpent: monthlySpent[0]?.total || 0,
        activeFreelancers: activeFreelancers.length,
        pendingPayments,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/admin-stats
// @desc    Get dashboard statistics for admins
// @access  Private (Admin role)
router.get("/admin-stats", async (req, res, next) => {
  try {
    // Admin sees platform-wide statistics
    const [
      totalUsers,
      totalFreelancers,
      totalClients,
      activeProjects,
      totalRevenue,
      monthlyRevenue,
      pendingApprovals,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "freelancer", isActive: true }),
      User.countDocuments({ role: "client", isActive: true }),
      Contract.countDocuments({
        status: { $in: ["sent", "signed"] },
        isActive: true,
      }),
      // Platform total revenue (could be commission-based)
      Invoice.aggregate([
        {
          $match: {
            status: "paid",
            isActive: true,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      // Monthly platform revenue
      Invoice.aggregate([
        {
          $match: {
            status: "paid",
            isActive: true,
            paidAt: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1,
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1,
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      // Mock pending approvals (you can extend this based on your approval system)
      Contract.countDocuments({
        status: "draft",
        isActive: true,
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFreelancers,
        totalClients,
        activeProjects,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingApprovals,
        systemHealth: 99.8, // Mock system health - you can integrate with monitoring tools
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/client-projects
// @desc    Get projects for client dashboard
// @access  Private (Client role)
router.get("/client-projects", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;

    // Get active projects for this client
    const projects = await Contract.find({
      clientId: userId,
      status: { $in: ["sent", "signed"] },
      isActive: true,
    })
      .populate("userId", "name email")
      .sort({ updatedAt: -1 })
      .limit(limit);

    // Format the response to match frontend expectations
    const formattedProjects = projects.map((contract) => ({
      id: contract._id,
      title: contract.title,
      freelancer: contract.userId?.name || "Unknown",
      progress: Math.floor(Math.random() * 100), // TODO: Add actual progress tracking
      deadline: contract.expiresAt,
      budget: contract.amount,
      status: contract.status === "signed" ? "In Progress" : "Pending",
    }));

    res.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/client-freelancers
// @desc    Get top freelancers for client dashboard
// @access  Private (Client role)
router.get("/client-freelancers", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;

    // Get freelancers this client has worked with
    const contracts = await Contract.find({
      clientId: userId,
      status: { $in: ["signed", "completed"] },
      isActive: true,
    })
      .populate("userId", "name email")
      .sort({ signedAt: -1 });

    // Group by freelancer and calculate stats
    const freelancerStats = {};
    contracts.forEach((contract) => {
      const freelancerId = contract.userId?._id?.toString();
      if (freelancerId) {
        if (!freelancerStats[freelancerId]) {
          freelancerStats[freelancerId] = {
            id: freelancerId,
            name: contract.userId.name,
            email: contract.userId.email,
            projects: 0,
            totalEarned: 0,
            rating: 4.8, // Mock rating - you can add actual rating system
            specialty: "Full Stack Developer", // Mock specialty
            avatar: "/placeholder.svg",
          };
        }
        freelancerStats[freelancerId].projects++;
        freelancerStats[freelancerId].totalEarned += contract.amount;
      }
    });

    // Convert to array and limit
    const topFreelancers = Object.values(freelancerStats)
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limit);

    res.json({
      success: true,
      data: topFreelancers,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
