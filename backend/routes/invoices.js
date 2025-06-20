import express from "express";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validateInvoice,
  validateId,
  validatePagination,
} from "../middleware/validation.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// @route   GET /api/invoices
// @desc    Get all invoices for authenticated user
// @access  Private
router.get("/", validatePagination, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "";

    // Build query
    const query = { userId: req.user._id, isActive: true };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    // Get invoices with client information
    const invoices = await Invoice.find(query)
      .populate("clientId", "name company email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/invoices/:id
// @desc    Get invoice by ID
// @access  Private
router.get("/:id", validateId, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("clientId", "name company email phone address");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found",
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private
router.post("/", validateInvoice, async (req, res, next) => {
  try {
    const { clientId } = req.body;

    // Verify client exists and belongs to user
    const client = await Client.findOne({
      _id: clientId,
      userId: req.user._id,
      isActive: true,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    // Generate invoice number
    const invoiceNumber = await Invoice.generateInvoiceNumber();

    const invoiceData = {
      ...req.body,
      invoiceNumber,
      userId: req.user._id,
    };

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    // Populate client information
    await invoice.populate("clientId", "name company email");

    res.status(201).json({
      success: true,
      data: invoice,
      message: "Invoice created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/invoices/:id
// @desc    Update invoice
// @access  Private
router.put("/:id", validateId, validateInvoice, async (req, res, next) => {
  try {
    const { clientId } = req.body;

    // Verify client exists and belongs to user
    if (clientId) {
      const client = await Client.findOne({
        _id: clientId,
        userId: req.user._id,
        isActive: true,
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Client not found",
        });
      }
    }

    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("clientId", "name company email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found",
      });
    }

    res.json({
      success: true,
      data: invoice,
      message: "Invoice updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice (soft delete)
// @access  Private
router.delete("/:id", validateId, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      },
      { isActive: false },
      { new: true },
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found",
      });
    }

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/invoices/:id/send
// @desc    Send invoice to client
// @access  Private
router.post("/:id/send", validateId, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("clientId", "name email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found",
      });
    }

    if (invoice.status !== "draft") {
      return res.status(400).json({
        success: false,
        error: "Invoice has already been sent",
      });
    }

    // Update invoice status
    invoice.status = "sent";
    await invoice.save();

    res.json({
      success: true,
      data: invoice,
      message: "Invoice sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/invoices/:id/remind
// @desc    Send payment reminder
// @access  Private
router.post("/:id/remind", validateId, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("clientId", "name email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found",
      });
    }

    if (invoice.status === "paid") {
      return res.status(400).json({
        success: false,
        error: "Invoice has already been paid",
      });
    }

    if (invoice.status === "draft") {
      return res.status(400).json({
        success: false,
        error: "Invoice must be sent before sending reminders",
      });
    }

    // Determine reminder type based on existing reminders
    const reminderCount = invoice.reminders.length;
    let reminderType = "first";

    if (reminderCount === 1) reminderType = "second";
    else if (reminderCount >= 2) reminderType = "final";

    // Add reminder to invoice
    invoice.reminders.push({
      type: reminderType,
      status: "sent",
    });

    await invoice.save();

    res.json({
      success: true,
      data: invoice,
      message: `${reminderType} reminder sent successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/invoices/:id/mark-paid
// @desc    Mark invoice as paid
// @access  Private
router.post("/:id/mark-paid", validateId, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found",
      });
    }

    if (invoice.status === "paid") {
      return res.status(400).json({
        success: false,
        error: "Invoice is already marked as paid",
      });
    }

    // Update invoice status and paid date
    invoice.status = "paid";
    invoice.paidAt = new Date();

    await invoice.save();
    await invoice.populate("clientId", "name company email");

    res.json({
      success: true,
      data: invoice,
      message: "Invoice marked as paid successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/invoices/:id/export-pdf
// @desc    Export invoice as PDF
// @access  Private
router.get("/:id/export-pdf", validateId, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("clientId", "name company email phone address");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found",
      });
    }

    // In production, you would generate and return a PDF here
    res.json({
      success: true,
      data: {
        downloadUrl: `/api/files/invoices/${invoice._id}.pdf`,
        invoice,
      },
      message: "PDF export ready",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
