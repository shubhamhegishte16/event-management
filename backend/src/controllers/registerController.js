import Registration from "../models/Registeration.js";
import Event from "../models/Event.js";

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const ticketsBooked = Number(req.body.ticketsBooked || req.body.quantity || 1);

    const attendeeName = req.user.name;
    const attendeeEmail = req.user.email;

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

export const getMyRegistrations = async (req, res) => {
  console.log(req.user);

  try {
    const registrations = await Registration.find({
      attendeeEmail: req.user.email,
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

export const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.eventId,
      $or: [
        { organizerId: req.user.id },
        { "organizer.id": req.user.id },
        { createdBy: req.user.id }
      ]
    });

    if (!event) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

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
    ).populate("event");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    const organizerId = registration.event?.organizerId || registration.event?.organizer?.id || registration.event?.createdBy;
    if (
      !organizerId ||
      organizerId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (registration.checkInStatus) {
      return res.status(400).json({
        success: false,
        message: "Attendee already checked in",
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

export const cancelMyRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(
      req.params.id
    ).populate("event");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    if (
      registration.attendeeEmail !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const event = registration.event;

    event.availableTickets +=
      registration.ticketsBooked;

    await event.save();

    await registration.deleteOne();

    if (registration.checkInStatus) {
      return res.status(400).json({
        success: false,
        message: "Checked-in registrations cannot be cancelled",
      });
    }

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
      .populate({
        path: "event",
        select: "title date venue createdBy organizerId organizer",
      });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    const isAttendee =
      registration.attendeeEmail === req.user.email;

    const organizerId = registration.event?.organizerId || registration.event?.organizer?.id || registration.event?.createdBy;
    const isOrganizer = organizerId && organizerId.toString() === req.user.id;

    if (!isAttendee && !isOrganizer) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
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

export const getOrganizerRegistrations = async (req, res) => {
  try {
    // 1. Find all events created/organized by this organizer
    const events = await Event.find({
      $or: [
        { organizerId: req.user.id },
        { "organizer.id": req.user.id },
        { createdBy: req.user.id }
      ]
    });
    
    const eventIds = events.map(e => e._id);
    
    // 2. Find all registrations for these events
    const registrations = await Registration.find({
      event: { $in: eventIds }
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