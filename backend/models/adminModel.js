const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // So password won't be sent in response
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Optional: Prevent multiple admins (if you want only one)
adminSchema.pre("save", async function (next) {
  if (this.role === "admin" && this.isNew) {
    const existingAdmin = await this.constructor.findOne({ role: "admin" });
    if (existingAdmin) {
      const error = new Error("Admin already exists.");
      error.status = 403;
      return next(error);
    }
  }
  next();
});

module.exports  = mongoose.model("Admin", adminSchema);
