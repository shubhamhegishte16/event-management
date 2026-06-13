import express from "express";
import {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  checkInAttendee,
  cancelMyRegistration,
  getRegistrationById,
} from "../controllers/registerController.js";


const router = express.Router();

router.post("/register", registerForEvent);

router.get("/", getMyRegistrations);

router.get("/event/:eventId", getEventRegistrations);

router.put("/checkin/:id", checkInAttendee);

router.delete("/:id", cancelMyRegistration);

router.get("/:id", getRegistrationById);

export default router;