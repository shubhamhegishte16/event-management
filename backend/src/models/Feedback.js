import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    // Event reference
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    
    // Organizer reference
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
    },
    
    // Audience (who gave feedback)
    audienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audienceName: {
      type: String,
      required: true,
    },
    audienceEmail: {
      type: String,
      required: true,
    },
    
    // Feedback content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    
    // Status
    isPublished: {
      type: Boolean,
      default: true,
    },
    organizerResponded: {
      type: Boolean,
      default: false,
    },
    organizerResponse: {
      type: String,
      maxlength: 500,
    },
    respondedAt: {
      type: Date,
    },
    
    // Helpful votes
    helpfulCount: {
      type: Number,
      default: 0,
    },
    
    // Whether feedback is from verified attendee
    isVerifiedAttendee: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
feedbackSchema.index({ eventId: 1, createdAt: -1 });
feedbackSchema.index({ organizerId: 1, createdAt: -1 });
feedbackSchema.index({ audienceId: 1, eventId: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;