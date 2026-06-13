import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["reminder", "announcement"],
      default: "announcement",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const notification = mongoose.model("Notification", notificationSchema);

export default Event;