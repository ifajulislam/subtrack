import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },

    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      minLength: 2,
      maxLength: 100,
    },

    currency: {
      type: String,
      enum: ["USD", "BDT"],
      default: "USD",
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },

    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },

    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start Date must be in the past",
      },
    },

    renewalDate: {
      type: Date,
      validate: {
        // Explicit function since this keyword doesn't work on arrow function
        validator: function (value) {
          value > this.startDate;
        },
        message: "Renewal Date must be after start date",
      },
    },

    user: {
      // Referencing the user model
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
