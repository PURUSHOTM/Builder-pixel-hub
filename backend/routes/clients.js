import express from "express";
import Client from "../models/Client.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validateClient,
  validateId,
  validatePagination,
} from "../middleware/validation.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// @route   GET /api/clients
// @desc    Get all clients for authenticated user
// @access  Private
router.get("/", validatePagination, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build query
    const query = { userId: req.user._id, isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get clients with pagination
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Client.countDocuments(query);

    res.json({
      success: true,
      data: clients,
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

// @route   GET /api/clients/:id
// @desc    Get client by ID
// @access  Private
router.get("/:id", validateId, async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/clients
// @desc    Create new client
// @access  Private
router.post("/", validateClient, async (req, res, next) => {
  try {
    const clientData = {
      ...req.body,
      userId: req.user._id,
    };

    const client = new Client(clientData);
    await client.save();

    res.status(201).json({
      success: true,
      data: client,
      message: "Client created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
router.put("/:id", validateId, validateClient, async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
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
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: client,
      message: "Client updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client (soft delete)
// @access  Private
router.delete("/:id", validateId, async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      },
      { isActive: false },
      { new: true },
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/clients/:id/contracts
// @desc    Get all contracts for a client
// @access  Private
router.get("/:id/contracts", validateId, async (req, res, next) => {
  try {
    const Contract = (await import("../models/Contract.js")).default;

    const contracts = await Contract.find({
      clientId: req.params.id,
      userId: req.user._id,
      isActive: true,
    })
      .populate("clientId", "name company email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contracts,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/clients/:id/invoices
// @desc    Get all invoices for a client
// @access  Private
router.get("/:id/invoices", validateId, async (req, res, next) => {
  try {
    const Invoice = (await import("../models/Invoice.js")).default;

    const invoices = await Invoice.find({
      clientId: req.params.id,
      userId: req.user._id,
      isActive: true,
    })
      .populate("clientId", "name company email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
