import express from "express";
import {
  registerForEvent,
  getRegistrations,
  getEventRegistrations,
  checkInAttendee,
  deleteRegistration,
  getRegistrationById
} from "../controllers/registerController.js";

const router = express.Router();

router.post("/register", registerForEvent);

router.get("/", getRegistrations);

router.get("/event/:eventId", getEventRegistrations);

router.put("/checkin/:id", checkInAttendee);

router.delete("/:id", deleteRegistration);

router.get("/:id", getRegistrationById);

export default router;