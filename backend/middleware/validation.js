import { body, param, query, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

// Authentication validations
export const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Client validations
export const validateClient = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Client name must be between 1 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("company")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Company name must be between 1 and 100 characters"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
  handleValidationErrors,
];

// Contract validations
export const validateContract = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Contract title must be between 1 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Contract content must be between 1 and 10000 characters"),
  body("clientId").isMongoId().withMessage("Invalid client ID"),
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
  body("currency")
    .isIn(["USD", "EUR", "GBP", "CAD", "AUD"])
    .withMessage("Invalid currency"),
  body("expiresAt")
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error("Expiration date must be in the future");
      }
      return true;
    }),
  handleValidationErrors,
];

// Invoice validations
export const validateInvoice = [
  body("clientId").isMongoId().withMessage("Invalid client ID"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.description")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Item description must be between 1 and 200 characters"),
  body("items.*.quantity")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity must be greater than 0"),
  body("items.*.rate")
    .isFloat({ min: 0 })
    .withMessage("Rate must be a positive number"),
  body("taxRate")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Tax rate must be between 0 and 100"),
  body("currency")
    .isIn(["USD", "EUR", "GBP", "CAD", "AUD"])
    .withMessage("Invalid currency"),
  body("dueDate").isISO8601().toDate().withMessage("Invalid due date"),
  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
  handleValidationErrors,
];

// ID parameter validation
export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  handleValidationErrors,
];

// Query parameter validations
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search").optional().trim().escape(),
  query("status").optional().trim().escape(),
  handleValidationErrors,
];
