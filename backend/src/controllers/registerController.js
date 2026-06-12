import Registration from "../models/Registeration.js";
import Event from "../models/Event.js";

export const registerForEvent = async (req, res) => {
  try {
    const {
      eventId,
      attendeeName,
      attendeeEmail,
      ticketsBooked,
    } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.availableTickets < ticketsBooked) {
      return res.status(400).json({
        success: false,
        message: "Not enough tickets available",
      });
    }

    const existingRegistration = await Registration.findOne({
      event: eventId,
      attendeeEmail,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this event",
      });
    }

    if (!ticketsBooked || ticketsBooked < 1) {
      return res.status(400).json({
        success: false,
        message: "Tickets booked must be at least 1",
      });
    }

    if (event.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Event is not open for registration",
      });
    }

    const registration = await Registration.create({
      event: eventId,
      attendeeName,
      attendeeEmail,
      ticketsBooked,
    });

    event.availableTickets -= ticketsBooked;

    await event.save();

    res.status(201).json({
      success: true,
      registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event");

    res.status(200).json({
      success: true,
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
    }).populate("event");

    res.status(200).json({
      success: true,
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkInAttendee = async (req, res) => {
  try {
    const registration = await Registration.findById(
      req.params.id
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    registration.checkInStatus = true;

    await registration.save();

    res.status(200).json({
      success: true,
      registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    const event = await Event.findById(registration.event);

    if (event) {
      event.availableTickets += registration.ticketsBooked;
      await event.save();
    }

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: "Registration cancelled",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate("event");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};