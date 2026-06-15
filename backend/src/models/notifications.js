import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Who sent the notification (Organizer)
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
    },
    organizerEmail: {
      type: String,
      required: true,
    },
    
    // Which event this notification is for
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    
    // Who receives this (Audience member)
    audienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    audienceEmail: {
      type: String,
      required: true,
    },
    audienceName: {
      type: String,
    },
    
    // Notification content
    type: {
      type: String,
      enum: ["announcement", "reminder", "update", "cancellation"],
      default: "announcement",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    
    // Status tracking
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    
    // For broadcast vs individual
    isBroadcast: {
      type: Boolean,
      default: true,
    },
    
    // Email sent status
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
notificationSchema.index({ audienceEmail: 1, createdAt: -1 });
notificationSchema.index({ eventId: 1, createdAt: -1 });
notificationSchema.index({ organizerId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, audienceEmail: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;