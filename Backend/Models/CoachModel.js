import mongoose from 'mongoose'

const CoachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
   
    role: {
        type: String,
        default: "Coach",
    },
    address: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["approved", "pending"],
        default: "approved",
    },
 
 
sessions: [
  {
    debatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    debatorName: String,
    sessionDate: Date,
    time: String,
    status: { 
      type: String, 
      enum: ["Pending", "Completed", "Cancelled", "Cancellation Requested"], 
      default: "Pending" 
    },
  },
],

    earnings: {
        type: Number,
        default: 0
    },
    notifications: [
        {
          message: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
          isRead: { type: Boolean, default: false },
        },
      ],
}, { timestamps: true });

const Coach = mongoose.model('Coach', CoachSchema);
export default Coach;