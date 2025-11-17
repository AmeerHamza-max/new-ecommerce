const mongoose = require("mongoose");

// ----------------------------
// User Schema
// ----------------------------
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ----------------------------
// Pre-save debug hook
// ----------------------------
UserSchema.pre('save', function (next) {
  console.log(`[UserModel] Saving user: ${this.userName}, email: ${this.email}, role: ${this.role}`);
  next();
});

// ----------------------------
// Pre-update debug hook
// ----------------------------
UserSchema.pre('findOneAndUpdate', function (next) {
  console.log(`[UserModel] Updating user with filter:`, this.getQuery(), "Update Data:", this.getUpdate());
  next();
});

// ----------------------------
// Indexes for optimization
// ----------------------------
UserSchema.index({ email: 1 });
UserSchema.index({ userName: 1 });

// ----------------------------
// Export model
// ----------------------------
const User = mongoose.model("User", UserSchema);
module.exports = User;
