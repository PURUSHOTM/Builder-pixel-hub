import express from "express";
import Contract from "../models/Contract.js";
import Client from "../models/Client.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validateContract,
  validateId,
  validatePagination,
} from "../middleware/validation.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// @route   GET /api/contracts
// @desc    Get all contracts for authenticated user
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
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Get contracts with client information
    const contracts = await Contract.find(query)
      .populate("clientId", "name company email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Contract.countDocuments(query);

    res.json({
      success: true,
      data: contracts,
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

// @route   GET /api/contracts/:id
// @desc    Get contract by ID
// @access  Private
router.get("/:id", validateId, async (req, res, next) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("clientId", "name company email phone address");

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: "Contract not found",
      });
    }

    res.json({
      success: true,
      data: contract,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/contracts
// @desc    Create new contract
// @access  Private
router.post("/", validateContract, async (req, res, next) => {
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

    const contractData = {
      ...req.body,
      userId: req.user._id,
    };

    const contract = new Contract(contractData);
    await contract.save();

    // Populate client information
    await contract.populate("clientId", "name company email");

    res.status(201).json({
      success: true,
      data: contract,
      message: "Contract created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/contracts/:id
// @desc    Update contract
// @access  Private
router.put("/:id", validateId, validateContract, async (req, res, next) => {
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

    const contract = await Contract.findOneAndUpdate(
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

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: "Contract not found",
      });
    }

    res.json({
      success: true,
      data: contract,
      message: "Contract updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/contracts/:id
// @desc    Delete contract (soft delete)
// @access  Private
router.delete("/:id", validateId, async (req, res, next) => {
  try {
    const contract = await Contract.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      },
      { isActive: false },
      { new: true },
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: "Contract not found",
      });
    }

    res.json({
      success: true,
      message: "Contract deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/contracts/:id/send-signature
// @desc    Send contract for signature
// @access  Private
router.post("/:id/send-signature", validateId, async (req, res, next) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("clientId", "name email");

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: "Contract not found",
      });
    }

    if (contract.status !== "draft") {
      return res.status(400).json({
        success: false,
        error: "Contract has already been sent or signed",
      });
    }

    // Update contract status and sent date
    contract.status = "sent";
    contract.sentAt = new Date();
    // In production, you would integrate with HelloSign/DocuSign here
    contract.signatureId = `demo-signature-${Date.now()}`;

    await contract.save();

    res.json({
      success: true,
      data: contract,
      message: "Contract sent for signature successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/contracts/:id/sign
// @desc    Mark contract as signed (demo endpoint)
// @access  Private
router.post("/:id/sign", validateId, async (req, res, next) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: "Contract not found",
      });
    }

    if (contract.status !== "sent") {
      return res.status(400).json({
        success: false,
        error: "Contract must be sent before it can be signed",
      });
    }

    // Update contract status and signed date
    contract.status = "signed";
    contract.signedAt = new Date();

    await contract.save();
    await contract.populate("clientId", "name company email");

    res.json({
      success: true,
      data: contract,
      message: "Contract signed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/contracts/:id/export-pdf
// @desc    Export contract as PDF
// @access  Private
router.get("/:id/export-pdf", validateId, async (req, res, next) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("clientId", "name company email phone address");

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: "Contract not found",
      });
    }

    // In production, you would generate and return a PDF here
    res.json({
      success: true,
      data: {
        downloadUrl: `/api/files/contracts/${contract._id}.pdf`,
        contract,
      },
      message: "PDF export ready",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
