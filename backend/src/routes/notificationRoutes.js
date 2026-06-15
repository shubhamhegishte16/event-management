import express from "express";
import protect from "../middleware/authMiddleware.js";
import protectOrganizer from "../middleware/organizerAuthMiddleware.js";
import {
  sendNotificationToEventAttendees,
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  getEventNotificationsForOrganizer,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

// Audience routes (protected by user auth)
router.get("/my-notifications", protect, getMyNotifications);
router.get("/my-unread-count", protect, getUnreadCount);
router.put("/mark-read/:id", protect, markNotificationAsRead);
router.put("/mark-all-read", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

// Organizer routes (protected by organizer auth)
router.post(
  "/send-to-event/:eventId",
  protectOrganizer,
  sendNotificationToEventAttendees
);
router.get(
  "/organizer/event/:eventId",
  protectOrganizer,
  getEventNotificationsForOrganizer
);

export default router;