import mongoose from "mongoose";

const debatorSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false
    },
    sessions: [
      {
        coachId: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
        sessionDate: Date,
        time: String,
        status: {
          type: String,
          enum: ["Pending", "Completed", "Cancelled", "Cancellation Requested"],
          default: "Pending",
        },
      },
    ],
    notifications: [
      {
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Debator = mongoose.model("User", debatorSchema);
export default Debator;