import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  checkInAttendee,
  cancelMyRegistration,
  getRegistrationById,
  getOrganizerRegistrations,
} from "../controllers/registerController.js";

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.post("/register", registerForEvent);
router.get("/organizer", getOrganizerRegistrations);
router.get("/", getMyRegistrations);
router.get("/event/:eventId", getEventRegistrations);
router.put("/checkin/:id", checkInAttendee);
router.delete("/:id", cancelMyRegistration);
router.get("/:id", getRegistrationById);

export default router;