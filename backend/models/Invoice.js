import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than 0"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate must be positive"],
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: true },
);

const paymentReminderSchema = new mongoose.Schema(
  {
    dateSent: {
      type: Date,
      required: true,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["first", "second", "final"],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
  },
  { _id: true },
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal must be positive"],
    },
    taxRate: {
      type: Number,
      required: true,
      min: [0, "Tax rate must be positive"],
      max: [100, "Tax rate cannot exceed 100%"],
      default: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      min: [0, "Tax amount must be positive"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total must be positive"],
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "CAD", "AUD"],
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (date) {
          return date >= this.issueDate;
        },
        message: "Due date must be after issue date",
      },
    },
    paidAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    reminders: [paymentReminderSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Indexes for better query performance
invoiceSchema.index({ userId: 1, status: 1 });
invoiceSchema.index({ clientId: 1 });
invoiceSchema.index({ userId: 1, createdAt: -1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

// Virtual for checking if invoice is overdue
invoiceSchema.virtual("isOverdue").get(function () {
  return this.dueDate < new Date() && this.status !== "paid";
});

// Pre-save middleware to calculate amounts and update status
invoiceSchema.pre("save", function (next) {
  // Calculate item amounts
  this.items.forEach((item) => {
    item.amount = item.quantity * item.rate;
  });

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);

  // Calculate tax amount
  this.taxAmount = (this.subtotal * this.taxRate) / 100;

  // Calculate total
  this.total = this.subtotal + this.taxAmount;

  // Update status if overdue
  if (this.dueDate < new Date() && this.status === "sent") {
    this.status = "overdue";
  }

  next();
});

// Static method to generate invoice number
invoiceSchema.statics.generateInvoiceNumber = async function () {
  const count = await this.countDocuments();
  const number = (count + 1).toString().padStart(4, "0");
  return `INV-${number}`;
};

export default mongoose.model("Invoice", invoiceSchema);
