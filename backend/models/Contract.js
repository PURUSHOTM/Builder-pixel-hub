import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Contract title is required"],
      trim: true,
      maxlength: [200, "Contract title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Contract content is required"],
      maxlength: [10000, "Contract content cannot exceed 10000 characters"],
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
    amount: {
      type: Number,
      required: [true, "Contract amount is required"],
      min: [0, "Amount must be positive"],
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "CAD", "AUD"],
    },
    status: {
      type: String,
      enum: ["draft", "sent", "signed", "expired", "cancelled"],
      default: "draft",
    },
    signatureId: {
      type: String,
      default: null, // For e-signature service integration
    },
    sentAt: {
      type: Date,
      default: null,
    },
    signedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: [true, "Contract expiration date is required"],
      validate: {
        validator: function (date) {
          return date > new Date();
        },
        message: "Expiration date must be in the future",
      },
    },
    terms: {
      type: String,
      maxlength: [2000, "Terms cannot exceed 2000 characters"],
    },
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
contractSchema.index({ userId: 1, status: 1 });
contractSchema.index({ clientId: 1 });
contractSchema.index({ userId: 1, createdAt: -1 });
contractSchema.index({ expiresAt: 1 });

// Virtual for checking if contract is expired
contractSchema.virtual("isExpired").get(function () {
  return this.expiresAt < new Date() && this.status !== "signed";
});

// Pre-save middleware to update status if expired
contractSchema.pre("save", function (next) {
  if (this.expiresAt < new Date() && this.status === "sent") {
    this.status = "expired";
  }
  next();
});

export default mongoose.model("Contract", contractSchema);
